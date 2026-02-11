import { Request, Response } from 'express';
import CourseEntity from '../models/Course';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const { level } = req.query;
        const query: any = {};

        if (level && level !== 'All') {
            query.degreeLevel = level;
        }

        const courses = await CourseEntity.find(query).sort({ courseName: 1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get course by slug
// @route   GET /api/courses/:slug
// @access  Public
export const getCourseBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await CourseEntity.findOne({ slug: req.params.slug });

        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await CourseEntity.create(req.body);

        res.status(201).json({
            success: true,
            data: course
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        let course = await CourseEntity.findById(req.params.id);

        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }

        course = await CourseEntity.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
        const course = await CourseEntity.findById(req.params.id);

        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }

        await course.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
