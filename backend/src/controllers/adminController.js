const prisma = require('../config/db');
const AnalyticsService = require('../services/analyticsService');

/**
 * 1. GET /api/admin/analytics
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const analytics = await AnalyticsService.getDashboardMetrics();

    res.json({
      success: true,
      analytics
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 2. GET /api/admin/analytics/search
 */
exports.getSearchAnalytics = async (req, res, next) => {
  try {
    const searchAnalytics = await AnalyticsService.getSearchAnalytics();

    res.json({
      success: true,
      searchAnalytics
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 3. GET /api/admin/analytics/journey
 */
exports.getJourneyAnalytics = async (req, res, next) => {
  try {
    const journeyAnalytics = await AnalyticsService.getJourneyAnalytics();

    res.json({
      success: true,
      journeyAnalytics
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 4. GET /api/admin/analytics/recommendations
 */
exports.getRecommendationFeedbackAnalytics = async (req, res, next) => {
  try {
    const recommendationAnalytics = await AnalyticsService.getRecommendationFeedbackAnalytics();

    res.json({
      success: true,
      recommendationAnalytics
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 5. POST /api/admin/analytics/track-recommendation
 */
exports.trackRecommendationEvent = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { productId, sessionId, feedType, recommendationType, source } = req.body;

    if (!productId || !feedType) {
      return res.status(400).json({ success: false, message: 'productId and feedType are required' });
    }

    const event = await AnalyticsService.trackRecommendationEvent({
      userId,
      productId,
      sessionId,
      feedType,
      recommendationType,
      source
    });

    res.status(201).json({
      success: true,
      event
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 6. POST /api/admin/analytics/track-journey
 */
exports.trackJourneyStep = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { sessionId, step, metadata } = req.body;

    if (!step) {
      return res.status(400).json({ success: false, message: 'step is required' });
    }

    const event = await AnalyticsService.trackJourneyStep({
      userId,
      sessionId: sessionId || 'anon_session',
      step,
      metadata
    });

    res.status(201).json({
      success: true,
      event
    });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, price, compareAtPrice, brand, categoryId, stock, tags, specifications, imageUrl, isFeatured, isTrending } = req.body;

    if (!title || !price || !brand || !categoryId) {
      return res.status(400).json({ success: false, message: 'Title, price, brand, and categoryId are required' });
    }

    const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-') + '-' + Date.now();

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || title,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        brand,
        categoryId,
        stock: parseInt(stock, 10) || 50,
        tags: tags || '',
        specifications: typeof specifications === 'object' ? JSON.stringify(specifications) : (specifications || '{}'),
        isFeatured: Boolean(isFeatured),
        isTrending: Boolean(isTrending),
        images: imageUrl ? {
          create: [{ url: imageUrl, isPrimary: true }]
        } : undefined
      },
      include: { category: true, images: true }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, compareAtPrice, brand, categoryId, stock, tags, isFeatured, isTrending } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (compareAtPrice !== undefined) updateData.compareAtPrice = compareAtPrice ? parseFloat(compareAtPrice) : null;
    if (brand) updateData.brand = brand;
    if (categoryId) updateData.categoryId = categoryId;
    if (stock !== undefined) updateData.stock = parseInt(stock, 10);
    if (tags !== undefined) updateData.tags = tags;
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (isTrending !== undefined) updateData.isTrending = Boolean(isTrending);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true, images: true }
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      }
    });

    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: existingProduct.id } }),
      prisma.cartItem.deleteMany({ where: { productId: existingProduct.id } }),
      prisma.wishlist.deleteMany({ where: { productId: existingProduct.id } }),
      prisma.viewHistory.deleteMany({ where: { productId: existingProduct.id } }),
      prisma.recommendation.deleteMany({ where: { productId: existingProduct.id } }),
      prisma.product.delete({ where: { id: existingProduct.id } })
    ]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};
