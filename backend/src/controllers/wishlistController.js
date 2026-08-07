const prisma = require('../config/db');

exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: true, images: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: wishlist.length,
      wishlist
    });
  } catch (err) {
    next(err);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (existing) {
      return res.json({ success: true, message: 'Already in wishlist', item: existing });
    }

    const item = await prisma.wishlist.create({
      data: { userId, productId },
      include: { product: { include: { category: true, images: true } } }
    });

    res.status(201).json({
      success: true,
      message: 'Added to wishlist',
      item
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await prisma.wishlist.deleteMany({
      where: { userId, productId }
    });

    res.json({
      success: true,
      message: 'Removed from wishlist'
    });
  } catch (err) {
    next(err);
  }
};
