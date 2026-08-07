const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, authenticateToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

// Event tracking routes (can be called by authenticated users or anonymous visitors)
router.post('/analytics/track-recommendation', authenticateToken, adminController.trackRecommendationEvent);
router.post('/analytics/track-journey', authenticateToken, adminController.trackJourneyStep);

// Admin-only Analytics dashboards & catalog management
router.use(requireAuth);
router.use(requireRole('ADMIN'));

router.get('/analytics', adminController.getAnalytics);
router.get('/analytics/search', adminController.getSearchAnalytics);
router.get('/analytics/journey', adminController.getJourneyAnalytics);
router.get('/analytics/recommendations', adminController.getRecommendationFeedbackAnalytics);

router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.get('/orders', adminController.getAllOrdersAdmin);

module.exports = router;
