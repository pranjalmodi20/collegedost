const College = require('../models/College.model');
const NirfRanking = require('../models/NirfRanking.model');
const { runIngestion } = require('../automation/nirfIngestion');

const FILTER_MAP = {
  btech_applications: {
    filter: { 
      $or: [
        { "coursesOffered.courseName": { $regex: "B\\.Tech", $options: "i" } },
        { streams: "Engineering" }
      ]
    },
    sort: { updatedAt: -1 } // Show recently updated/active colleges
  },
  
  top_engineering: {
    filter: { 
      streams: "Engineering", 
      nirfRank: { $exists: true, $ne: null } 
    },
    sort: { nirfRank: 1 }
  },

  engineering_india: {
    filter: { 
      streams: "Engineering", 
      "location.country": "India" 
    },
    sort: { nirfRank: 1 }
  },

  engineering_tn: {
    filter: {
      streams: "Engineering",
      "location.state": "Tamil Nadu"
    },
    sort: { nirfRank: 1 }
  },

  jee_main: {
    filter: {
      streams: "Engineering",
      $or: [
        { "coursesOffered.examAccepted": { $regex: "JEE Main", $options: "i" } },
        { "cutoff.exam": "JEE Main" }
      ]
    },
    sort: { nirfRank: 1 }
  },

  top_iits: {
    filter: {
      $or: [
        { type: "IIT" }, // Works if your DB has this type
        // Regex fallback for Name matching (System Proof)
        { name: { $regex: "^Indian Institute of Technology", $options: "i" } },
        { aliases: { $in: ["IIT"] } }
      ]
    },
    sort: { nirfRank: 1 }
  },

  top_nits: {
    filter: {
      $or: [
        { type: "NIT" },
        { name: { $regex: "^National Institute of Technology", $options: "i" } },
        { aliases: { $in: ["NIT"] } }
      ]
    },
    sort: { nirfRank: 1 }
  },

  top_iiits: {
    filter: {
      $or: [
        { type: "IIIT" },
        { name: { $regex: "^Indian Institute of Information Technology", $options: "i" } },
        { aliases: { $in: ["IIIT"] } }
      ]
    },
    sort: { nirfRank: 1 }
  }
};

// @desc    Get all colleges
// @route   GET /api/colleges
// @access  Public
exports.getColleges = async (req, res) => {
    try {
        const { state, city, type, exam, course, search, branch, minFees, maxFees, sort, country, nirfCategory, page = 1, limit = 20 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // --- 1. SPECIAL CASE: NIRF RANKING MODE ---
        // If nirfCategory is present, we fetch rankings FIRST, then get colleges.
        if (nirfCategory) {
            console.log(`[Detailed Fetch] Fetching NIRF rankings for category: ${nirfCategory}`);
            
            // 1. Get Ranked Slugs
            const rankings = await NirfRanking.find({ category: nirfCategory })
                .sort({ rank: 1 })
                .lean();

            console.log(`[Detailed Fetch] Found ${rankings.length} ranking entries.`);

            if (rankings.length === 0) {
                 return res.status(200).json({ success: true, count: 0, data: [] });
            }

            const rankedSlugs = rankings.map(r => r.collegeSlug);

            // 2. Fetch College Details for these slugs
            // We must filter by Country=India implicitly for NIRF (Indian Ranking)
            const colleges = await College.find({ 
                slug: { $in: rankedSlugs },
                'location.country': 'India' // Ensure only Indian colleges match
            }).lean();

            // 3. Merge Access Data (Rank needs to be attached to the college object for display)
            // And IMPORTANT: Sort them in the order of 'rankings' (NirfRanking collection order)
            
            const collegeMap = {};
            colleges.forEach(c => collegeMap[c.slug] = c);

            const sortedColleges = [];
            for (const r of rankings) {
                const college = collegeMap[r.collegeSlug];
                if (college) {
                    // Inject the specific rank/score for this category
                    college.nirfRank = r.rank;
                    college.nirfScore = r.score;
                    sortedColleges.push(college);
                }
            }
            
            // Pagination (Manual, since we fetched all to sort)
            // For large datasets this might need optimization, but likely < 200 items per category.
            const paginatedColleges = sortedColleges.slice(skip, skip + limitNum);

            return res.status(200).json({
                success: true,
                count: paginatedColleges.length,
                pagination: {
                    total: sortedColleges.length,
                    page: pageNum,
                    pages: Math.ceil(sortedColleges.length / limitNum)
                },
                data: paginatedColleges
            });
        }

        // --- 2. STANDARD FILTER MODE ---
        
        // --- ROBUST FILTER CONSTRUCTION ---
        // We accumulate all conditions in an array and use $and at the end.
        // This avoids conflicts between different filters trying to set query.$or.
        
        let conditions = [];

        // 1. Geography
        if (country) {
            conditions.push({ 'location.country': { $regex: new RegExp(`^${country}`, 'i') } });
        } else {
            conditions.push({ 'location.country': 'India' });
        }
        
        if (state && state !== 'All States') conditions.push({ 'location.state': { $regex: new RegExp(`^${state}`, 'i') } });
        if (city) conditions.push({ 'location.city': { $regex: new RegExp(`^${city}`, 'i') } });

        // 2. Classification
        if (type && type !== 'All') conditions.push({ type: { $regex: new RegExp(`^${type}`, 'i') } });
        
        // Branch/Stream Filter - Robust Check
        if (branch) {
            const branchRegex = new RegExp(branch, 'i');
            const branchConditions = [
                { streams: branchRegex },
                { 'coursesOffered.courseName': branchRegex }
            ];
            
            // Smart Alias: If searching for 'Engineering', also look for 'B.Tech'/'B.E'
            if (/engineering/i.test(branch)) {
                 branchConditions.push({ 'coursesOffered.courseName': { $regex: 'B\\.Tech', $options: 'i' } });
                 branchConditions.push({ 'coursesOffered.courseName': { $regex: 'B\\.E', $options: 'i' } });
            }
            // Smart Alias: If searching for 'Medical', look for 'MBBS'
            if (/medical/i.test(branch)) {
                 branchConditions.push({ 'coursesOffered.courseName': { $regex: 'MBBS', $options: 'i' } });
            }

            conditions.push({ $or: branchConditions });
        }

        if (course) conditions.push({ 'coursesOffered.courseName': { $regex: course, $options: 'i' } });

        // 3. Exam (Crucial Fix: Check BOTH cutoff table AND coursesOffered + Fuzzy)
        if (exam) {
             // Escape special chars just in case, but allow flexible spacing
             // e.g. "JEE Main" should match "JEE-Main" or "JEE Main"
             const safeExam = exam.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\s*[-]?\\s*');
             const examRegex = new RegExp(safeExam, 'i');
             
             conditions.push({
                 $or: [
                     { 'cutoff.exam': examRegex },
                     { 'coursesOffered.examAccepted': examRegex },
                     { 'coursesOffered.eligibility': examRegex } // Sometimes hidden in eligibility text
                 ]
             });
        }

        // 4. Fees
        if (minFees || maxFees) {
            let feeQuery = {};
            if (minFees) feeQuery.$gte = Number(minFees);
            if (maxFees) feeQuery.$lte = Number(maxFees);
            if (Object.keys(feeQuery).length > 0) {
                 conditions.push({ 'fees.tuition': feeQuery });
            }
        }

        // 5. Global Search (Name, City, State)
        if (search) {
             conditions.push({
                 $or: [
                     { name: { $regex: search, $options: 'i' } },
                     { 'location.city': { $regex: search, $options: 'i' } },
                     { 'location.state': { $regex: search, $options: 'i' } }
                 ]
             });
        }

        // Combine all conditions
        let query = {};
        if (conditions.length > 0) {
            query = { $and: conditions };
        }

        // Sorting Logic
        let sortOption = { nirfRank: 1 }; // Default to NIRF Rank if available
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


// @desc    Seed NIRF Data (Manual Trigger)
// @route   GET /api/colleges/seed-nirf
exports.seedNirfData = async (req, res) => {
    try {
        console.log("Starting Manual NIRF Seed...");
        const nirfData = [
            
            // --- Engineering ---
            { rank: 1, name: "Indian Institute of Technology Madras", category: "Engineering" },
            { rank: 2, name: "Indian Institute of Technology Delhi", category: "Engineering" },
            { rank: 3, name: "Indian Institute of Technology Bombay", category: "Engineering" },
            { rank: 4, name: "Indian Institute of Technology Kanpur", category: "Engineering" },
            { rank: 5, name: "Indian Institute of Technology Roorkee", category: "Engineering" },
            { rank: 6, name: "Indian Institute of Technology Kharagpur", category: "Engineering" },
            { rank: 7, name: "Indian Institute of Technology Guwahati", category: "Engineering" },
            { rank: 8, name: "Indian Institute of Technology Hyderabad", category: "Engineering" },
            { rank: 9, name: "National Institute of Technology Tiruchirappalli", category: "Engineering" },
            { rank: 10, name: "Indian Institute of Technology Varanasi", category: "Engineering" }, 
            { rank: 11, name: "Vellore Institute of Technology", category: "Engineering" }, // Private
            { rank: 12, name: "National Institute of Technology Karnataka", category: "Engineering" },
            { rank: 13, name: "Anna University", category: "Engineering" },
            { rank: 14, name: "Indian Institute of Technology Indore", category: "Engineering" },
            { rank: 15, name: "Institute of Chemical Technology", category: "Engineering" },
            { rank: 16, name: "National Institute of Technology Rourkela", category: "Engineering" },
            { rank: 17, name: "Indian Institute of Technology Mandi", category: "Engineering" },
            { rank: 18, name: "Amrita Vishwa Vidyapeetham", category: "Engineering" }, // Private
            { rank: 19, name: "Indian Institute of Technology Gandhinagar", category: "Engineering" },
            { rank: 20, name: "Jamia Millia Islamia", category: "Engineering" },
            { rank: 21, name: "Thapar Institute of Engineering and Technology", category: "Engineering" }, // Private
            { rank: 22, name: "National Institute of Technology Warangal", category: "Engineering" },
            { rank: 23, name: "Indian Institute of Technology Ropar", category: "Engineering" },
            { rank: 24, name: "National Institute of Technology Calicut", category: "Engineering" },
            { rank: 25, name: "BITS Pilani", category: "Engineering" }, // Private (Birla Institute)
            
            // --- Management ---
            { rank: 1, name: "Indian Institute of Management Ahmedabad", category: "Management" },
            { rank: 2, name: "Indian Institute of Management Bangalore", category: "Management" },
            { rank: 3, name: "Indian Institute of Management Kozhikode", category: "Management" },
            { rank: 4, name: "Indian Institute of Technology Delhi", category: "Management" },
            { rank: 5, name: "Indian Institute of Management Calcutta", category: "Management" },
            { rank: 6, name: "Indian Institute of Management Mumbai", category: "Management" },
            { rank: 7, name: "Indian Institute of Management Lucknow", category: "Management" },
            { rank: 8, name: "Indian Institute of Management Indore", category: "Management" },
            { rank: 9, name: "Xavier Labour Relations Institute (XLRI)", category: "Management" },
            { rank: 10, name: "Indian Institute of Technology Bombay", category: "Management" },

             // --- Pharmacy ---
            { rank: 1, name: "Jamia Hamdard", category: "Pharmacy" },
            { rank: 2, name: "National Institute of Pharmaceutical Education and Research Hyderabad", category: "Pharmacy" },
            { rank: 3, name: "Birla Institute of Technology & Science - Pilani", category: "Pharmacy" },
            { rank: 4, name: "JSS College of Pharmacy", category: "Pharmacy" },
            { rank: 5, name: "Institute of Chemical Technology", category: "Pharmacy" },

             // --- Medical ---
            { rank: 1, name: "All India Institute of Medical Sciences, Delhi", category: "Medical" },
            { rank: 2, name: "Post Graduate Institute of Medical Education and Research", category: "Medical" },
            { rank: 3, name: "Christian Medical College", category: "Medical" },
            { rank: 4, name: "National Institute of Mental Health & Neuro Sciences", category: "Medical" },
            { rank: 5, name: "Jawaharlal Institute of Post Graduate Medical Education & Research", category: "Medical" },
            
            // --- Law ---
            { rank: 1, name: "National Law School of India University", category: "Law" },
            { rank: 2, name: "National Law University", category: "Law" },
            { rank: 3, name: "Nalsar University of Law", category: "Law" },
            { rank: 4, name: "The West Bengal National University of Juridical Sciences", category: "Law" },
            { rank: 5, name: "Symbiosis Law School", category: "Law" },

            // --- Overall ---
             { rank: 1, name: "Indian Institute of Technology Madras", category: "Overall" },
             { rank: 2, name: "Indian Institute of Science", category: "Overall" },
             { rank: 3, name: "Indian Institute of Technology Bombay", category: "Overall" },
             { rank: 4, name: "Indian Institute of Technology Delhi", category: "Overall" },
             { rank: 5, name: "Indian Institute of Technology Kanpur", category: "Overall" },

        ];

        let seededCount = 0;
        const dbColleges = await College.find({ 'location.country': 'India' }).select('name slug').lean();
        const stringSimilarity = require('string-similarity');

        for (const item of nirfData) {
            // Find Matching College in DB
            // 1. Exact Match
            let matchedCollege = dbColleges.find(c => c.name.toLowerCase() === item.name.toLowerCase());
            
            // 2. Fuzzy Match if strict failed
            if (!matchedCollege) {
                const names = dbColleges.map(c => c.name);
                const matches = stringSimilarity.findBestMatch(item.name, names);
                if (matches.bestMatch.rating > 0.4) { // Relaxed threshold for 'Institute' variants
                    matchedCollege = dbColleges.find(c => c.name === matches.bestMatch.target);
                }
            }

            if (matchedCollege) {
                // Upsert Ranking
                await NirfRanking.findOneAndUpdate(
                    { collegeSlug: matchedCollege.slug, category: item.category },
                    {
                        collegeSlug: matchedCollege.slug,
                        instituteName: item.name, // Use the proper name from our curated list
                        category: item.category,
                        year: 2024,
                        rank: item.rank,
                        score: 100 - item.rank, // Dummy score
                        lastUpdated: new Date()
                    },
                    { upsert: true, new: true }
                );
                seededCount++;
            }
        }

        res.json({ success: true, message: `Seeded ${seededCount} NIRF rankings`, totalAttempted: nirfData.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Trigger College Sync (NIRF Ingestion)
// @route   POST /api/colleges/sync
// @access  Private/Admin
exports.syncColleges = async (req, res) => {
    try {
        console.log('Manual sync triggered via Admin Panel');
        
        runIngestion().then(() => {
            console.log('Manual Sync Completed Successfully');
        }).catch(err => {
            console.error('Manual Sync Failed:', err);
        });

        res.status(200).json({ 
            success: true, 
            message: 'College synchronization started in the background.' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get College Section (Generic API)
// @route   GET /api/colleges/sections/:key
exports.getCollegeSection = async (req, res) => {
    try {
        const { key } = req.params;
        const { limit = 10 } = req.query; 
        
        const config = FILTER_MAP[key];

        if (!config) {
            return res.status(400).json({ success: false, message: "Invalid section key" });
        }

        const colleges = await College.find(config.filter)
            .sort(config.sort)
            .select("name location nirfRank logo type") 
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: colleges,
            section: key
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
