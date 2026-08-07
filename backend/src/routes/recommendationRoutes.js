const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 1. Current Session Intent Detection Endpoint
router.get('/intent', authenticateToken, recommendationController.getUserIntent);

// 2. Recommendation Feed Endpoints
router.get('/personalized', authenticateToken, recommendationController.getPersonalizedRecommendations);
router.get('/search-based', authenticateToken, recommendationController.getSearchBasedRecommendations);
router.get('/similar/:productId', recommendationController.getSimilarProducts);
router.get('/trending', recommendationController.getTrendingProducts);
router.get('/recently-viewed', authenticateToken, recommendationController.getRecentlyViewedProducts);
router.get('/category-popular/:categorySlug', recommendationController.getCategoryPopularProducts);

// 8. Bundle Endpoints (no auth required – shown to all shoppers)
router.get('/frequently-bought/:productId', recommendationController.getFrequentlyBoughtTogether);
router.get('/smart-bundle/:productId', recommendationController.getSmartBundle);

// 9. Explainability Rationale Endpoint
router.get('/explain/:productId', authenticateToken, recommendationController.getExplanationForProduct);

// 10. AI Insights Summary Endpoint
router.get('/ai-insights', authenticateToken, recommendationController.getUserAIInsights);

module.exports = router;

