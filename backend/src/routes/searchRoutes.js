const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/smart', authenticateToken, searchController.smartSearch);
router.get('/history', authenticateToken, searchController.getSearchHistory);

module.exports = router;
