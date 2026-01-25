const express = require('express');
const router = express.Router();
const { getCourses, getCourseBySlug, createCourse } = require('../controllers/course.controller');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);
router.post('/', protect, createCourse);

module.exports = router;
