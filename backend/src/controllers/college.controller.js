const College = require('../models/College.model');

// @desc    Get all colleges
// @route   GET /api/colleges
// @access  Public
exports.getColleges = async (req, res) => {
    try {
        const { state, city, type, exam, course, search } = req.query;
        let query = {};
        
        if (state) query['location.state'] = state;
        if (city) query['location.city'] = city;
        if (type) query.type = type;
        
        // Filter by Cutoff Exam (Accepted Exam)
        if (exam) {
            query['cutoff.exam'] = exam;
        }

        // Filter by Courses (using regex on the 'coursesOffered' array)
        if (course) {
             query['coursesOffered.courseName'] = { $regex: course, $options: 'i' };
        }

        if (search) {
             query.$or = [
                 { name: { $regex: search, $options: 'i' } },
                 { type: { $regex: search, $options: 'i' } },
                 { 'location.city': { $regex: search, $options: 'i' } },
                 { 'location.state': { $regex: search, $options: 'i' } },
                 { 'coursesOffered.courseName': { $regex: search, $options: 'i' } }
             ];
        }

        const colleges = await College.find(query).sort({ nirfRank: 1 });

        res.status(200).json({
            success: true,
            count: colleges.length,
            data: colleges
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single college by slug
// @route   GET /api/colleges/:slug
// @access  Public
exports.getCollegeBySlug = async (req, res) => {
    try {
        const college = await College.findOne({ slug: req.params.slug });

        if (!college) {
            return res.status(404).json({ success: false, message: 'College not found' });
        }

        res.status(200).json({
            success: true,
            data: college
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Predict colleges based on rank
// @route   GET /api/colleges/predict
// @access  Public
exports.predictColleges = async (req, res) => {
    try {
        const { exam, rank, category, gender, state } = req.query;

        if (!exam || !rank) {
            return res.status(400).json({ success: false, message: 'Please provide exam and rank' });
        }

        const userRank = parseInt(rank);
        const userCategory = category || 'General';

        // Find colleges where at least one cutoff meets the criteria:
        // 1. Exam matches
        // 2. Category matches (or is general/open if specific not found - strict for now)
        // 3. User Rank <= Closing Rank (meaning user is within the cutoff)
        
        const colleges = await College.find({
            cutoff: {
                $elemMatch: {
                    exam: exam,
                    category: userCategory,
                    closing: { $gte: userRank }
                }
            }
        }).select('name location nirfRank type cutoff website');

        // Filter the specific cutoff entries to only return the relevant ones for display
        const results = colleges.map(college => {
            const relevantCutoffs = college.cutoff.filter(c => 
                c.exam === exam && 
                c.category === userCategory && 
                c.closing >= userRank
            );
            
            return {
                ...college.toObject(),
                matchingCutoffs: relevantCutoffs
            };
        });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new college
// @route   POST /api/colleges
// @access  Private (Admin)
exports.createCollege = async (req, res) => {
    try {
        const college = await College.create(req.body);
        res.status(201).json({ success: true, data: college });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};
