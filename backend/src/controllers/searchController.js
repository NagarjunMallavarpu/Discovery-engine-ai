const prisma = require('../config/db');
const { parseSearchIntent } = require('../ai/geminiService');

exports.smartSearch = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, message: 'Query string is required' });
    }

    // 1. Extract semantic intent using Gemini API / heuristic fallback
    const intent = await parseSearchIntent(query);

    // 2. Build Prisma DB query filter
    const whereConditions = [];

    // Category filter
    if (intent.category) {
      whereConditions.push({
        category: {
          name: { contains: intent.category }
        }
      });
    }

    // Price range filter
    if (intent.minPrice || intent.maxPrice) {
      const priceFilter = {};
      if (intent.minPrice) priceFilter.gte = intent.minPrice;
      if (intent.maxPrice) priceFilter.lte = intent.maxPrice;
      whereConditions.push({ price: priceFilter });
    }

    // Brand filter
    if (intent.brand) {
      whereConditions.push({
        brand: { contains: intent.brand }
      });
    }

    // Purpose or keyword search
    if (intent.keywords && intent.keywords.length > 0) {
      const keywordOrs = intent.keywords.map(kw => ({
        OR: [
          { title: { contains: kw } },
          { description: { contains: kw } },
          { tags: { contains: kw } }
        ]
      }));
      whereConditions.push(...keywordOrs);
    }

    // Combine conditions or fallback to title search if empty
    let whereClause = {};
    if (whereConditions.length > 0) {
      whereClause = { AND: whereConditions };
    } else {
      whereClause = {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { brand: { contains: query } }
        ]
      };
    }

    // Fetch matched products
    let products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        images: true
      },
      take: 20
    });

    // If exact AND filter returns no items, relax constraints to OR search
    if (products.length === 0) {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            intent.category ? { category: { name: { contains: intent.category } } } : null,
            intent.brand ? { brand: { contains: intent.brand } } : null
          ].filter(Boolean)
        },
        include: {
          category: true,
          images: true
        },
        take: 12
      });
    }

    // Score match percentage for each product
    const scoredProducts = products.map(p => {
      let score = 70;
      if (intent.category && p.category.name.toLowerCase().includes(intent.category.toLowerCase())) score += 15;
      if (intent.brand && p.brand.toLowerCase().includes(intent.brand.toLowerCase())) score += 10;
      if (intent.maxPrice && p.price <= intent.maxPrice) score += 5;
      return {
        ...p,
        matchScore: Math.min(score, 99)
      };
    });

    scoredProducts.sort((a, b) => b.matchScore - a.matchScore);

    // Save Search History
    try {
      await prisma.searchHistory.create({
        data: {
          userId: req.user ? req.user.id : null,
          query,
          parsedCategory: intent.category,
          parsedMinPrice: intent.minPrice,
          parsedMaxPrice: intent.maxPrice,
          parsedBrand: intent.brand,
          intentTag: intent.purpose || 'general',
          resultsCount: scoredProducts.length
        }
      });
    } catch (e) {
      // Ignore non-fatal log errors
    }

    res.json({
      success: true,
      query,
      intent,
      count: scoredProducts.length,
      products: scoredProducts
    });
  } catch (err) {
    next(err);
  }
};

exports.getSearchHistory = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const searches = await prisma.searchHistory.findMany({
      where: userId ? { userId } : {},
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      searches
    });
  } catch (err) {
    next(err);
  }
};
