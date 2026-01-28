const TestPrep = require('../models/TestPrep.model');

// @desc    Get Test Prep Data (Generic Filter)
// @route   GET /api/test-prep
exports.getTestPrep = async (req, res) => {
    try {
        const { stream, exam, type, slug } = req.query;

        let query = {};
        if (stream) query.stream = stream;
        if (exam) query.exam = exam;
        if (type) query.type = type; // e.g. "Preparation"
        if (slug) query.slug = slug;

        const data = await TestPrep.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Single Test Prep Item
// @route   GET /api/test-prep/:slug
exports.getTestPrepBySlug = async (req, res) => {
    try {
        const item = await TestPrep.findOne({ slug: req.params.slug });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
