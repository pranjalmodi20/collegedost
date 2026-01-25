const express = require('express');
const router = express.Router();
const { getExams, getExamBySlug, createExam, deleteExam } = require('../controllers/exam.controller');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getExams);
router.get('/:slug', getExamBySlug);

// Protected routes (Add 'admin' check middleware in future)
router.post('/', protect, createExam);
router.delete('/:id', protect, deleteExam);

module.exports = router;
