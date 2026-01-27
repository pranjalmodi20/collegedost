const College = require('../models/College.model');

// @desc    Get all colleges
// @route   GET /api/colleges
// @access  Public
exports.getColleges = async (req, res) => {
    try {
        const { state, city, type, exam, course, search, branch, minFees, maxFees, sort, country, nirfCategory, page = 1, limit = 20 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // --- EXISTING FILTER LOGIC ---
        let query = {};
        
        // Use anchored Regex (^...$) for dropdowns to use Indexes efficiently
        if (state) query['location.state'] = { $regex: new RegExp(`^${state}`, 'i') }; 
        if (city) query['location.city'] = { $regex: new RegExp(`^${city}`, 'i') };
        
        if (country) {
            query['location.country'] = { $regex: new RegExp(`^${country}`, 'i') }; 
        } else {
            // Default to India to keep sections separate (User Request)
            query['location.country'] = 'India';
        }

        if (type) query.type = { $regex: new RegExp(`^${type}`, 'i') };
        
        // Exam & Branch
        if (exam) query['cutoff.exam'] = exam;
        if (branch) query.streams = { $regex: branch, $options: 'i' }; 
        if (course) query['coursesOffered.courseName'] = { $regex: course, $options: 'i' };

        // Fees Range
        if (minFees || maxFees) {
            query['fees.tuition'] = {};
            if (minFees) query['fees.tuition'].$gte = Number(minFees);
            if (maxFees) query['fees.tuition'].$lte = Number(maxFees);
        }

        // Global Search
        if (search) {
             query.$or = [
                 { name: { $regex: search, $options: 'i' } },
                 { 'location.city': { $regex: search, $options: 'i' } },
                 { 'location.state': { $regex: search, $options: 'i' } }
             ];
        }

        // Sorting Logic
        let sortOption = { nirfRank: 1 };
        if (sort === 'fees_low') sortOption = { 'fees.tuition': 1 };
        if (sort === 'fees_high') sortOption = { 'fees.tuition': -1 };
        if (sort === 'rank') sortOption = { nirfRank: 1 };

        const colleges = await College.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .lean();

        const total = await College.countDocuments(query);

        res.status(200).json({
            success: true,
            count: colleges.length,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum)
            },
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

// @desc    Live Search Suggestions (Autocomplete)
// @route   GET /api/colleges/search?q=...
exports.searchColleges = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
             return res.status(200).json({ success: true, data: [] });
        }

        const colleges = await College.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { 'location.city': { $regex: q, $options: 'i' } }
            ]
        })
        .select('name slug location.city type nirfRank')
        .limit(8);

        res.status(200).json({ success: true, count: colleges.length, data: colleges });
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

// @desc    Get Top Ranked Colleges by Category (using Aggregation)
// @route   GET /api/colleges/top/:category
exports.getTopColleges = async (req, res) => {
    try {
        const { category } = req.params; // e.g. "Engineering"
        
        // Use Aggregation to filter ranking array and sort
        const colleges = await College.aggregate([
            { $match: { 
                "rankings": { 
                    $elemMatch: { source: "NIRF", category: category } 
                } 
            }},
            { $addFields: {
                specificRankObj: {
                    $filter: {
                        input: "$rankings",
                        as: "r",
                        cond: { 
                            $and: [
                                { $eq: ["$$r.source", "NIRF"] },
                                { $eq: ["$$r.category", category] }
                            ]
                        }
                    }
                }
            }},
            { $addFields: { sortRank: { $arrayElemAt: ["$specificRankObj.rank", 0] } } },
            { $sort: { sortRank: 1 } },
            { $limit: 20 }
        ]);

        res.status(200).json({ success: true, count: colleges.length, data: colleges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Colleges by State
// @route   GET /api/colleges/state/:state
exports.getCollegesByState = async (req, res) => {
    try {
        const { state } = req.params;
        const colleges = await College.find({
            "location.state": { $regex: new RegExp(`^${state}$`, "i") } 
        }).limit(50);
        res.status(200).json({ success: true, count: colleges.length, data: colleges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Colleges by City
// @route   GET /api/colleges/city/:city
exports.getCollegesByCity = async (req, res) => {
    try {
        const { city } = req.params;
        const colleges = await College.find({
            "location.city": { $regex: new RegExp(`^${city}$`, "i") }
        }).limit(50);
        res.status(200).json({ success: true, count: colleges.length, data: colleges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Best ROI (Placement %)
// @route   GET /api/colleges/best-roi
exports.getBestROI = async (req, res) => {
    try {
        // Proxy ROI with Placement Percentage for now
        const colleges = await College.find({
            "placements.placementPercentage": { $exists: true, $ne: null }
        })
        .sort({ "placements.placementPercentage": -1 })
        .limit(20);
        res.status(200).json({ success: true, count: colleges.length, data: colleges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


