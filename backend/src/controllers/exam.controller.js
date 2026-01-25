const Exam = require('../models/Exam.model');

// @desc    Get all exams
// @route   GET /api/exams
// @access  Public
exports.getExams = async (req, res) => {
    try {
        const { level, authority } = req.query;
        let query = {};

        if (level) query.examLevel = level;
        if (authority) query.conductingAuthority = { $regex: authority, $options: 'i' };

        const exams = await Exam.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: exams.length,
            data: exams
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single exam by slug
// @route   GET /api/exams/:slug
// @access  Public
exports.getExamBySlug = async (req, res) => {
    try {
        const exam = await Exam.findOne({ examSlug: req.params.slug });

        if (!exam) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }

        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private (Admin)
exports.createExam = async (req, res) => {
    try {
        // Basic user role check can be added here if req.user is available
        // if (req.user.role !== 'admin') ...

        const exam = await Exam.create(req.body);

        res.status(201).json({
            success: true,
            data: exam
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Exam already exists' });
        }
        res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
    }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private (Admin)
exports.deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }

        await exam.deleteOne();

        res.status(200).json({ success: true, message: 'Exam removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
