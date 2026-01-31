const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getSettings,
    updateSettings,
    testConnection,
    testPredict,
    deleteApiKey
} = require('../controllers/adminPredictor.controller');

// All routes require admin authentication
router.use(protect);
router.use(admin);

// GET /api/admin/predictor-settings - Get current settings
router.get('/', getSettings);

// PUT /api/admin/predictor-settings - Update settings
router.put('/', updateSettings);

// POST /api/admin/predictor-settings/test - Test OpenAI connection
router.post('/test', testConnection);

// POST /api/admin/predictor-settings/test-predict - Test predictor with sample input
router.post('/test-predict', testPredict);

// DELETE /api/admin/predictor-settings/api-key - Remove API key
router.delete('/api-key', deleteApiKey);

module.exports = router;
