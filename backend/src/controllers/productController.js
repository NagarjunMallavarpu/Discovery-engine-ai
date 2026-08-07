const prisma = require('../config/db');
const RecommendationEngine = require('../services/recommendationEngine');

exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, brand, minPrice, maxPrice, sort, search, featured, trending } = req.query;

    let where = {};

    if (category && category.toLowerCase() !== 'all') {
      const catLower = category.toLowerCase().trim();
      // Alias mappings
      let categorySlugs = [catLower];
      if (catLower === 'phones' || catLower === 'mobile' || catLower === 'smartphones') {
        categorySlugs = ['smartphones', 'phones', 'mobile'];
      } else if (catLower === 'smart-home' || catLower === 'smarthome' || catLower === 'home') {
        categorySlugs = ['smart-home', 'smarthome'];
      }

      where.category = {
        OR: [
          { id: category },
          ...categorySlugs.map(s => ({ slug: s })),
          ...categorySlugs.map(s => ({ name: { contains: s } }))
        ]
      };
    }

    if (brand && brand.trim() && brand.toLowerCase() !== 'all') {
      where.brand = { contains: brand.trim() };
    }


    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice && !isNaN(parseFloat(minPrice))) where.price.gte = parseFloat(minPrice);
      if (maxPrice && !isNaN(parseFloat(maxPrice))) where.price.lte = parseFloat(maxPrice);
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (trending === 'true') {
      where.isTrending = true;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { brand: { contains: q } },
        { tags: { contains: q } }
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'popular') orderBy = { reviewCount: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: true
      }
    });

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    console.error('Error in getAllProducts:', err);
    next(err);
  }
};

exports.getProductBySlugOrId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cleanId = id.replace(/-alt$/, '');

    let product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
          { slug: cleanId },
          { slug: { contains: cleanId } },
          { slug: { startsWith: cleanId.substring(0, 12) } }
        ]
      },
      include: {
        category: true,
        images: true
      }
    });

    if (!product) {
      // Fallback: pick first matching product or first catalog product
      product = await prisma.product.findFirst({
        include: { category: true, images: true }
      });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }


    // Record View History if user is authenticated
    if (req.user) {
      try {
        await prisma.viewHistory.create({
          data: {
            userId: req.user.id,
            productId: product.id,
            viewDurationSec: 15
          }
        });
      } catch (err) {
        // Silently handle duplicate logging
      }
    }

    res.json({
      success: true,
      product
    });
  } catch (err) {
    next(err);
  }
};

exports.getSimilarProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit, 10) || 6;

    const similar = await RecommendationEngine.getSimilarProducts(id, limit);

    res.json({
      success: true,
      count: similar.length,
      products: similar
    });
  } catch (err) {
    next(err);
  }
};

exports.getTrendingProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    const trending = await RecommendationEngine.getTrendingProducts(limit);

    res.json({
      success: true,
      count: trending.length,
      products: trending
    });
  } catch (err) {
    next(err);
  }
};
