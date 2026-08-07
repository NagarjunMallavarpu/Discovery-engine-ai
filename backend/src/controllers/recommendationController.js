const RecommendationEngine = require('../services/recommendationEngine');
const IntentDetector = require('../services/intentDetector');
const BundleEngine = require('../services/bundleEngine');
const prisma = require('../config/db');
const { generateRecommendationExplanation } = require('../ai/geminiService');

/**
 * 1. GET /api/recommendations/personalized
 */
exports.getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const limit = parseInt(req.query.limit, 10) || 10;

    const recommendations = await RecommendationEngine.getPersonalizedRecommendations(userId, limit);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 2. GET /api/recommendations/intent
 */
exports.getUserIntent = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionQuery = req.query.query || null;

    const intentData = await IntentDetector.detectUserIntent(userId, { query: sessionQuery });

    res.json({
      success: true,
      intent: intentData
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 3. GET /api/recommendations/search-based
 */
exports.getSearchBasedRecommendations = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const query = req.query.query || null;
    const limit = parseInt(req.query.limit, 10) || 8;

    const recommendations = await RecommendationEngine.getSearchBasedRecommendations(query, userId, limit);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 4. GET /api/recommendations/similar/:productId
 */
exports.getSimilarProducts = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 6;

    const recommendations = await RecommendationEngine.getSimilarProducts(productId, limit);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 5. GET /api/recommendations/trending
 */
exports.getTrendingProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;

    const recommendations = await RecommendationEngine.getTrendingProducts(limit);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 6. GET /api/recommendations/recently-viewed
 */
exports.getRecentlyViewedProducts = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const limit = parseInt(req.query.limit, 10) || 8;

    const recommendations = await RecommendationEngine.getRecentlyViewedProducts(userId, limit);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 7. GET /api/recommendations/category-popular/:categorySlug
 */
exports.getCategoryPopularProducts = async (req, res, next) => {
  try {
    const { categorySlug } = req.params;
    const limit = parseInt(req.query.limit, 10) || 8;

    const recommendations = await RecommendationEngine.getCategoryPopularProducts(categorySlug, limit);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 8. GET /api/recommendations/explain/:productId
 */
/**
 * 9. GET /api/recommendations/frequently-bought/:productId
 */
exports.getFrequentlyBoughtTogether = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 3;

    const source = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, images: true }
    });

    if (!source) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const items = await BundleEngine.getFrequentlyBoughtTogether(productId, limit);
    const pricing = BundleEngine.computeBundlePricing(source, items);

    res.json({
      success: true,
      sourceProduct: source,
      items,
      pricing
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 10. GET /api/recommendations/smart-bundle/:productId
 */
exports.getSmartBundle = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 4;

    const source = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, images: true }
    });

    if (!source) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const items = await BundleEngine.getSmartBundle(productId, limit);
    const pricing = BundleEngine.computeBundlePricing(source, items);

    res.json({
      success: true,
      sourceProduct: source,
      items,
      pricing
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 11. GET /api/recommendations/explain/:productId
 */
exports.getExplanationForProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user ? req.user.id : null;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let userSignals = {};
    if (userId) {
      const searches = await prisma.searchHistory.findMany({
        where: { userId },
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { query: true }
      });
      const views = await prisma.viewHistory.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { product: { include: { category: true } } }
      });

      userSignals = {
        searches: searches.map(s => s.query),
        views: Array.from(new Set(views.map(v => v.product?.category?.name).filter(Boolean)))
      };
    }

    const reason = await generateRecommendationExplanation(userSignals, product);

    res.json({
      success: true,
      productId,
      reason
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 12. GET /api/recommendations/ai-insights
 */
exports.getUserAIInsights = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const intentData = await IntentDetector.detectUserIntent(userId);
    const { generateUserAIInsights } = require('../ai/geminiService');

    const aiInsights = await generateUserAIInsights(intentData);

    res.json({
      success: true,
      intent: intentData,
      aiInsights
    });
  } catch (err) {
    next(err);
  }
};

