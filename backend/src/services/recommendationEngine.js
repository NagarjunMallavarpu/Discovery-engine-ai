const prisma = require('../config/db');
const { generateRecommendationExplanation } = require('../ai/geminiService');
const IntentDetector = require('./intentDetector');

/**
 * Multi-Factor Hybrid Recommendation Engine
 * Computes personalized scores for products based on user activity signals & product metadata,
 * with Cold Start fallback guarantees and dedicated feed generators.
 */
class RecommendationEngine {
  /**
   * 1. RECOMMENDED FOR YOU (Personalized Feed with Cold-Start Guarantee)
   * Generates personalized recommendations for a given userId (or anonymous user).
   * @param {string|null} userId
   * @param {number} limit
   */
  static async getPersonalizedRecommendations(userId, limit = 10) {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true
      }
    });

    if (!products || products.length === 0) return [];

    let userCategoryFreq = {};
    let userBrandFreq = {};
    let userTagsSet = new Set();
    let userSearchTerms = [];
    let wishlistProductIds = new Set();
    let cartProductIds = new Set();
    let viewedProductIds = new Set();

    let hasHistory = false;

    if (userId) {
      // Wishlist items
      const wishlists = await prisma.wishlist.findMany({
        where: { userId },
        include: { product: { include: { category: true } } }
      });
      wishlists.forEach(w => {
        hasHistory = true;
        wishlistProductIds.add(w.productId);
        if (w.product) {
          userCategoryFreq[w.product.categoryId] = (userCategoryFreq[w.product.categoryId] || 0) + 4;
          userBrandFreq[w.product.brand] = (userBrandFreq[w.product.brand] || 0) + 3;
          this.extractTags(w.product.tags).forEach(t => userTagsSet.add(t));
        }
      });

      // Cart items
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } }
      });
      if (cart && cart.items && cart.items.length > 0) {
        hasHistory = true;
        cart.items.forEach(ci => {
          cartProductIds.add(ci.productId);
          if (ci.product) {
            userCategoryFreq[ci.product.categoryId] = (userCategoryFreq[ci.product.categoryId] || 0) + 5;
            userBrandFreq[ci.product.brand] = (userBrandFreq[ci.product.brand] || 0) + 4;
            this.extractTags(ci.product.tags).forEach(t => userTagsSet.add(t));
          }
        });
      }

      // View History (last 30 views)
      const views = await prisma.viewHistory.findMany({
        where: { userId },
        take: 30,
        orderBy: { createdAt: 'desc' },
        include: { product: true }
      });
      if (views && views.length > 0) {
        hasHistory = true;
        views.forEach(v => {
          viewedProductIds.add(v.productId);
          if (v.product) {
            userCategoryFreq[v.product.categoryId] = (userCategoryFreq[v.product.categoryId] || 0) + 2;
            userBrandFreq[v.product.brand] = (userBrandFreq[v.product.brand] || 0) + 2;
            this.extractTags(v.product.tags).forEach(t => userTagsSet.add(t));
          }
        });
      }

      // Search History (last 10 searches)
      const searches = await prisma.searchHistory.findMany({
        where: { userId },
        take: 10,
        orderBy: { createdAt: 'desc' }
      });
      if (searches && searches.length > 0) {
        hasHistory = true;
        searches.forEach(s => {
          if (s.query) userSearchTerms.push(s.query.toLowerCase());
        });
      }
    }

    // COLD START FALLBACK: If user has no history or is unauthenticated, rank by global popularity & trending signals
    const scoredProducts = await Promise.all(
      products.map(async product => {
        let affinityScore = 0;

        if (hasHistory) {
          const pTags = this.extractTags(product.tags);
          const catFreq = userCategoryFreq[product.categoryId] || 0;
          affinityScore += catFreq * 10;

          const brandFreq = userBrandFreq[product.brand] || 0;
          affinityScore += brandFreq * 8;

          let tagMatches = 0;
          pTags.forEach(t => {
            if (userTagsSet.has(t)) tagMatches++;
          });
          affinityScore += tagMatches * 12;

          userSearchTerms.forEach(term => {
            if (product.title.toLowerCase().includes(term) || product.description.toLowerCase().includes(term)) {
              affinityScore += 15;
            }
          });
        }

        // Global quality signals (always applied for cold-start guarantee)
        const ratingScore = (product.rating / 5.0) * 25; // max 25
        const reviewBonus = Math.min(product.reviewCount, 100) * 0.15; // max 15
        const trendingBonus = product.isTrending ? 20 : 0;
        const featuredBonus = product.isFeatured ? 15 : 0;

        const rawScore = affinityScore + ratingScore + reviewBonus + trendingBonus + featuredBonus;
        const matchPercentage = Math.min(Math.max(Math.round(60 + (rawScore / 3.2)), 65), 98);

        // Derived sub-scores for AI Confidence Meter display
        const similarityScore = Math.min(Math.max(Math.round(50 + (affinityScore / 2.5)), 55), 97);
        const categoryMatchScore = Object.keys(userCategoryFreq).length > 0
          ? Math.min(Math.round((userCategoryFreq[product.categoryId] || 0) / Math.max(...Object.values(userCategoryFreq), 1) * 100), 100)
          : Math.round(product.rating * 18);

        const userSignals = {
          searches: userSearchTerms.slice(0, 2),
          views: Object.keys(userCategoryFreq).length ? [product.category?.name || 'Viewed Category'] : [],
          wishlist: Array.from(wishlistProductIds),
          cart: Array.from(cartProductIds)
        };

        const reason = hasHistory
          ? await generateRecommendationExplanation(userSignals, product)
          : `Popular & Trending choice in ${product.category?.name || 'Catalog'} with ${product.rating}★ rating.`;

        return {
          ...product,
          matchScore: matchPercentage,
          similarityScore,
          categoryMatchScore,
          recommendationReason: reason
        };
      })
    );

    scoredProducts.sort((a, b) => b.matchScore - a.matchScore);
    return scoredProducts.slice(0, limit);
  }

  /**
   * 2. BASED ON YOUR CURRENT SEARCH
   * Recommends products matching the user's recent or current search query context.
   */
  static async getSearchBasedRecommendations(query, userId = null, limit = 8) {
    let activeQuery = query;

    if (!activeQuery && userId) {
      const lastSearch = await prisma.searchHistory.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      if (lastSearch) activeQuery = lastSearch.query;
    }

    if (!activeQuery) {
      return this.getTrendingProducts(limit);
    }

    const q = activeQuery.toLowerCase().trim();
    const products = await prisma.product.findMany({
      include: { category: true, images: true }
    });

    const scored = products.map(p => {
      let score = 0;
      const titleLower = p.title.toLowerCase();
      const descLower = p.description.toLowerCase();
      const brandLower = p.brand.toLowerCase();
      const tagsLower = (p.tags || '').toLowerCase();

      if (titleLower.includes(q)) score += 50;
      if (brandLower.includes(q)) score += 30;
      if (tagsLower.includes(q)) score += 25;
      if (descLower.includes(q)) score += 15;

      // Quality bonuses
      score += p.rating * 5;
      if (p.isTrending) score += 10;

      return {
        ...p,
        matchScore: Math.min(Math.max(Math.round(55 + score / 2), 60), 98),
        recommendationReason: `Direct match for search query "${activeQuery}"`
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.slice(0, limit);
  }

  /**
   * 3. SIMILAR PRODUCTS
   * Returns similar products for a specific target product based on category, brand, price delta, and tag overlap.
   */
  static async getSimilarProducts(productId, limit = 6) {
    const target = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, images: true }
    });

    if (!target) return [];

    const catalog = await prisma.product.findMany({
      where: { id: { not: productId } },
      include: { category: true, images: true }
    });

    const targetTags = this.extractTags(target.tags);

    const scored = catalog.map(p => {
      let simScore = 0;

      if (p.categoryId === target.categoryId) simScore += 40;
      if (p.brand.toLowerCase() === target.brand.toLowerCase()) simScore += 25;

      const priceDiffRatio = Math.abs(p.price - target.price) / target.price;
      if (priceDiffRatio < 0.15) simScore += 20;
      else if (priceDiffRatio < 0.3) simScore += 10;

      const pTags = this.extractTags(p.tags);
      let sharedTags = 0;
      pTags.forEach(t => {
        if (targetTags.includes(t)) sharedTags++;
      });
      simScore += sharedTags * 10;

      const similarityPercentage = Math.min(Math.max(Math.round(50 + simScore), 55), 97);

      return {
        ...p,
        similarityScore: similarityPercentage,
        similarityReason: `Similar to ${target.title} in ${target.category?.name || 'Category'} (${target.brand})`
      };
    });

    scored.sort((a, b) => b.similarityScore - a.similarityScore);
    return scored.slice(0, limit);
  }

  /**
   * 4. TRENDING NOW
   * Returns top trending products based on flags, rating, and review counts.
   */
  static async getTrendingProducts(limit = 8) {
    const products = await prisma.product.findMany({
      take: limit * 2,
      include: { category: true, images: true },
      orderBy: [
        { isTrending: 'desc' },
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ]
    });

    return products.slice(0, limit);
  }

  /**
   * 5. RECENTLY VIEWED
   * Returns recently viewed products for a logged-in user.
   */
  static async getRecentlyViewedProducts(userId, limit = 8) {
    if (!userId) return [];

    const views = await prisma.viewHistory.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          include: { category: true, images: true }
        }
      }
    });

    const uniqueProducts = [];
    const seenIds = new Set();

    views.forEach(v => {
      if (v.product && !seenIds.has(v.productId)) {
        seenIds.add(v.productId);
        uniqueProducts.push({
          ...v.product,
          viewedAt: v.createdAt
        });
      }
    });

    return uniqueProducts.slice(0, limit);
  }

  /**
   * 6. POPULAR IN THIS CATEGORY
   * Returns highest-rated and top review count products for a specified category.
   */
  static async getCategoryPopularProducts(categorySlug, limit = 8) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });

    if (!category) return [];

    const products = await prisma.product.findMany({
      where: { categoryId: category.id },
      include: { category: true, images: true },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' }
      ],
      take: limit
    });

    return products;
  }

  /**
   * Helper to parse comma-separated or JSON array tag strings safely.
   */
  static extractTags(tagsField) {
    if (!tagsField) return [];
    if (typeof tagsField === 'string') {
      try {
        if (tagsField.startsWith('[')) {
          return JSON.parse(tagsField).map(t => t.toLowerCase().trim());
        }
      } catch (e) {
        // Fall back to comma splitting
      }
      return tagsField.split(',').map(t => t.toLowerCase().trim()).filter(Boolean);
    }
    return [];
  }
}

module.exports = RecommendationEngine;
