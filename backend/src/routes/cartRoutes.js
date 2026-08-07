const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:itemId', cartController.updateCartItemQuantity);
router.delete('/clear', cartController.clearCart);
router.delete('/:itemId', cartController.removeFromCart);

module.exports = router;
