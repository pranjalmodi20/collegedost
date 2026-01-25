const Course = require('../models/Course.model');
const College = require('../models/College.model');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single course and offering colleges
// @route   GET /api/courses/:slug
// @access  Public
exports.getCourseBySlug = async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug });

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Find colleges offering this course
        // Using regex to match course name loosely, or exact match if preferred
        const colleges = await College.find({ 
            'coursesOffered.courseName': { $regex: course.shortName, $options: 'i' } 
        }).select('name location nirfRank slug type');

        res.status(200).json({
            success: true,
            data: course,
            colleges: colleges
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin)
exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
