const express = require('express');
const router = express.Router();
const { 
    getColleges, 
    getCollegeBySlug, 
    createCollege, 
    predictColleges,
    getTopColleges,
    getCollegesByState,
    getCollegesByCity,
    getBestROI,
    searchColleges,
    seedNirfData,
    syncColleges
} = require('../controllers/college.controller');
const { protect, admin } = require('../middleware/authMiddleware'); // Admin check recommended

// Specific routes MUST come before /:slug
router.post('/sync', protect, syncColleges); // Sync Route
router.get('/predict', predictColleges);
router.get('/search', searchColleges); // Autocomplete Route
router.get('/top/:category', getTopColleges);
router.get('/state/:state', getCollegesByState);
router.get('/city/:city', getCollegesByCity);
router.get('/best-roi', getBestROI);
router.get('/seed-nirf', seedNirfData);

router.get('/', getColleges);
router.get('/:slug', getCollegeBySlug);
router.post('/', protect, createCollege);

module.exports = router;
