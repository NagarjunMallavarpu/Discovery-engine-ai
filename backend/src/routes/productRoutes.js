const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', productController.getAllProducts);
router.get('/trending', productController.getTrendingProducts);
router.get('/:id', authenticateToken, productController.getProductBySlugOrId);
router.get('/:id/similar', productController.getSimilarProducts);

module.exports = router;
