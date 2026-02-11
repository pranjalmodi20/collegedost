import { Request, Response } from 'express';
import Exam from '../models/Exam';

// @desc    Get all exams
// @route   GET /api/exams
// @access  Public
export const getExams = async (req: Request, res: Response): Promise<void> => {
    try {
        const { level } = req.query;
        const query: any = {};

        if (level) {
            query.examLevel = level;
        }

        const exams = await Exam.find(query).sort({ examName: 1 });

        res.status(200).json({
            success: true,
            count: exams.length,
            data: exams
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get exam by slug
// @route   GET /api/exams/:slug
// @access  Public
export const getExamBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const exam = await Exam.findOne({ examSlug: req.params.slug });

        if (!exam) {
            res.status(404).json({ success: false, message: 'Exam not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create exam
// @route   POST /api/exams
// @access  Private/Admin
export const createExam = async (req: Request, res: Response): Promise<void> => {
    try {
        const exam = await Exam.create(req.body);

        res.status(201).json({
            success: true,
            data: exam
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Admin
export const updateExam = async (req: Request, res: Response): Promise<void> => {
    try {
        let exam = await Exam.findById(req.params.id);

        if (!exam) {
            res.status(404).json({ success: false, message: 'Exam not found' });
            return;
        }

        exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
export const deleteExam = async (req: Request, res: Response): Promise<void> => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            res.status(404).json({ success: false, message: 'Exam not found' });
            return;
        }

        await exam.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
