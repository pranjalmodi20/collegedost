const College = require('../models/College.model');

// @desc    Predict colleges based on JEE Main percentile
// @route   POST /api/predictor/jee-main
// @access  Public
exports.predictColleges = async (req, res) => {
    try {
        const { percentile, category, homeState, gender, isPwd } = req.body;

        if (!percentile || !category) {
            return res.status(400).json({ success: false, message: 'Please provide percentile and category' });
        }

        const rawUserPercentile = parseFloat(percentile);
        
        // Fetch specific colleges from DB
        // For optimization, we could filter at query level, but given the complex logic, we fetch all for now
        // or we could at least limit fields
        const allColleges = await College.find({}).lean(); // .lean() for performance

        const predictedColleges = [];

        for (const college of allColleges) {
            // Apply Quota Logic
            let effectiveUserPercentile = rawUserPercentile;

            // Home State Quota
            if (homeState && college.location && college.location.state && 
                college.location.state.toLowerCase() === homeState.toLowerCase()) {
                effectiveUserPercentile += 2.0; 
            }

            // Gender Quota 
            if (gender === 'Female') {
                effectiveUserPercentile += 1.0;
            }

            // PWD Quota
            if (isPwd === 'Yes') {
                effectiveUserPercentile += 15.0; 
            }

            effectiveUserPercentile = Math.min(100, effectiveUserPercentile);

            // Find matching branches
            const matchedBranches = [];

            if (college.cutoff && Array.isArray(college.cutoff)) {
                for (const cut of college.cutoff) {
                    if (cut.category === category || cut.category === 'General') {
                         if (cut.closingPercentile <= effectiveUserPercentile) {
                             matchedBranches.push({
                                 branch: cut.branch,
                                 closingPercentile: cut.closingPercentile,
                                 category: cut.category,
                                 year: cut.year
                             });
                         }
                    }
                }
            }

            if (matchedBranches.length > 0) {
                // Deduplicate branches (keep best/lowest cutoff match?) 
                // Actually displaying multiple options for same branch (different years/categories) is fine, 
                // but usually we just show unique branches.
                const uniqueBranches = [];
                const seen = new Set();
                matchedBranches.forEach(b => {
                    if (!seen.has(b.branch)) {
                        seen.add(b.branch);
                        uniqueBranches.push(b);
                    }
                });

                predictedColleges.push({
                    name: college.name,
                    location: college.location,
                    type: college.type,
                    nirfRank: college.nirfRank || 999,
                    matchedBranches: uniqueBranches,
                    chance: calculateChance(effectiveUserPercentile, matchedBranches)
                });
            }
        }

        // Sort by Chance (Low/Medium/High) or Rank
        // Let's sort by Rank
        predictedColleges.sort((a, b) => a.nirfRank - b.nirfRank);

        res.status(200).json({
            success: true,
            count: predictedColleges.length,
            colleges: predictedColleges
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Seed colleges is deprecated in favor of scraper script
exports.seedColleges = async (req, res) => {
    res.status(200).json({ message: "Use the scraper script to seed data." });
};

// Helper to calculate "High/Medium/Low" chance - simplified
const calculateChance = (userP, branches) => {
    // If userP is > closing + 5, High
    // If userP > closing + 1, Medium
    // Else Low
    // We take the average branch closing
    const avgClosing = branches.reduce((sum, b) => sum + b.closingPercentile, 0) / branches.length;
    const diff = userP - avgClosing;
    if (diff > 5) return 'High';
    if (diff > 1) return 'Medium';
    return 'Low';
};
