const prisma = require('../config/db');

async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: { include: { category: true, images: true } }
        }
      }
    }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: { include: { category: true, images: true } }
          }
        }
      }
    });
  }

  return cart;
}

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await getOrCreateCart(userId);

    const totalAmount = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    res.json({
      success: true,
      cart: {
        id: cart.id,
        items: cart.items,
        totalAmount,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const cart = await getOrCreateCart(userId);

    const existingItem = cart.items.find(i => i.productId === productId);

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity, 10) }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: parseInt(quantity, 10)
        }
      });
    }

    const updatedCart = await getOrCreateCart(userId);
    const totalAmount = updatedCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        id: updatedCart.id,
        items: updatedCart.items,
        totalAmount,
        itemCount: updatedCart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCartItemQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: parseInt(quantity, 10) }
      });
    }

    const updatedCart = await getOrCreateCart(userId);
    const totalAmount = updatedCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    res.json({
      success: true,
      cart: {
        id: updatedCart.id,
        items: updatedCart.items,
        totalAmount,
        itemCount: updatedCart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    await prisma.cartItem.delete({ where: { id: itemId } });

    const updatedCart = await getOrCreateCart(userId);
    const totalAmount = updatedCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    res.json({
      success: true,
      cart: {
        id: updatedCart.id,
        items: updatedCart.items,
        totalAmount,
        itemCount: updatedCart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await getOrCreateCart(userId);

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (err) {
    next(err);
  }
};
