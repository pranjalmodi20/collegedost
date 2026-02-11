import express from 'express';
import {
    getCourses,
    getCourseBySlug,
    createCourse,
    updateCourse,
    deleteCourse
} from '../controllers/course.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(getCourses)
    .post(protect, authorize('admin'), createCourse);

router.route('/:slug')
    .get(getCourseBySlug);

router.route('/:id')
    .put(protect, authorize('admin'), updateCourse)
    .delete(protect, authorize('admin'), deleteCourse);

export default router;
