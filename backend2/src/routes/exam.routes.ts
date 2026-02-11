import express from 'express';
import {
    getExams,
    getExamBySlug,
    createExam,
    updateExam,
    deleteExam
} from '../controllers/exam.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getExams)
    .post(protect, authorize('admin'), createExam);

router.route('/:slug')
    .get(getExamBySlug);

router.route('/:id')
    .put(protect, authorize('admin'), updateExam)
    .delete(protect, authorize('admin'), deleteExam);

export default router;
