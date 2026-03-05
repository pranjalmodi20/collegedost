import express from 'express';
import {
    getExams,
    getExamBySlug,
    createExam,
    updateExam,
    deleteExam,
    getExamGuide,
    getExamById
} from '../controllers/exam.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getExams)
    .post(protect, authorize('admin'), createExam);

router.route('/id/:id')
    .get(getExamById);

router.route('/:id')
    .put(protect, authorize('admin'), updateExam)
    .delete(protect, authorize('admin'), deleteExam);

router.route('/:slug/guide')
    .get(getExamGuide);

router.route('/:slug')
    .get(getExamBySlug);

export default router;
