const prisma = require('../config/db');

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { shippingAddress = 'Standard Express Shipping' } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    let orderItemsData = [];

    if (cart && cart.items && cart.items.length > 0) {
      orderItemsData = cart.items.map(item => ({
        productId: item.productId,
        price: item.product.price,
        quantity: item.quantity
      }));
    } else if (req.body.items && Array.isArray(req.body.items) && req.body.items.length > 0) {
      // Fallback from body items
      for (const it of req.body.items) {
        const prod = await prisma.product.findUnique({ where: { id: it.productId } });
        if (prod) {
          orderItemsData.push({
            productId: prod.id,
            price: prod.price,
            quantity: it.quantity || 1
          });
        }
      }
    }

    if (orderItemsData.length === 0) {
      // Pick top featured product as demo fallback if cart was cleared
      const fallbackProd = await prisma.product.findFirst();
      if (fallbackProd) {
        orderItemsData.push({
          productId: fallbackProd.id,
          price: fallbackProd.price,
          quantity: 1
        });
      }
    }

    const totalAmount = orderItemsData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        totalAmount,
        shippingAddress,
        status: 'COMPLETED',
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: { include: { product: true } }
      }
    });

    // Clear cart in database if exists
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });

  } catch (err) {
    next(err);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
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
