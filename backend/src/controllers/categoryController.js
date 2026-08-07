const prisma = require('../config/db');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (err) {
    next(err);
  }
};
