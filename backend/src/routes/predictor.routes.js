const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    predictColleges, 
    seedColleges, 
    predictByPercentile,
    getPredictionById,
    getMyPredictions
} = require('../controllers/predictor.controller');

router.post('/jee-main', predictColleges);
router.post('/jee-main-rank', require('../controllers/predictor.controller').predictRank);
router.post('/predict-by-percentile', predictByPercentile); // Enhanced predictor with DB storage
router.get('/prediction/:id', getPredictionById); // Get single prediction by ID
router.get('/my-predictions', protect, getMyPredictions); // Get user's prediction history
router.get('/colleges', require('../controllers/predictor.controller').getColleges);
router.post('/seed', seedColleges);

module.exports = router;

