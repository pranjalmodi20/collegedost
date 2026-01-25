const express = require('express');
const router = express.Router();
const { getColleges, getCollegeBySlug, createCollege, predictColleges } = require('../controllers/college.controller');
const { protect } = require('../middleware/authMiddleware');

router.get('/predict', predictColleges);
router.get('/', getColleges);
router.get('/:slug', getCollegeBySlug);
router.post('/', protect, createCollege);

module.exports = router;
