const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);
router.post('/', orderController.createOrder);
router.post('/checkout', orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);


module.exports = router;
