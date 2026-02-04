const College = require('../models/College.model');

// @desc    Predict colleges based on JEE Main Rank
// @route   POST /api/predictor/jee-main
// @access  Public
const fs = require('fs');
const path = require('path');

// @desc    Predict colleges based on JEE Main Rank
// @route   POST /api/predictor/jee-main
// @access  Public
exports.predictColleges = async (req, res) => {
    try {
        const { rank, category, homeState, gender, isPwd } = req.body;

        if (!rank || !category) {
            return res.status(400).json({ success: false, message: 'Please provide rank and category' });
        }

        const userRank = parseInt(rank);
        const userCatLower = category.toLowerCase().trim();
        const userGender = gender ? gender.toLowerCase().trim() : 'male'; // 'male' or 'female'
        const userHomeState = homeState ? homeState.toLowerCase().trim() : '';

        // Fetch all colleges suitable for prediction
        let allColleges = [];
        try {
            allColleges = await College.find({}).lean();
        } catch (dbErr) {
            console.log("DB Query failed (Offline Mode?), trying local file fallback...");
        }

        // Fallback to local JSON
        if (!allColleges || allColleges.length === 0) {
            const masterFile = path.join(__dirname, '../../data/master_colleges_dump.json');
            if (fs.existsSync(masterFile)) {
                try {
                    allColleges = JSON.parse(fs.readFileSync(masterFile, 'utf-8'));
                } catch (fileErr) {
                    console.error("Failed to read local data file:", fileErr);
                }
            }
        }

        const predictedColleges = [];

        for (const college of allColleges) {
            if (!college.cutoff || !Array.isArray(college.cutoff)) continue;

            const matchedBranches = [];

            // Determine if User is Home State for this college
            // Normalize state names slightly (remove spaces/case)
            const collegeState = college.location?.state ? college.location.state.toLowerCase().trim() : '';
            const isHomeState = userHomeState && collegeState &&
                (collegeState.includes(userHomeState) || userHomeState.includes(collegeState));

            for (const cut of college.cutoff) {
                // 1. Quota Check (HS vs OS vs AI)
                // Scraped format: "General - Gender-Neutral (HS)" or "(OS)" or "(AI)"
                // If it contains (HS), user MUST be Home State.
                // If it contains (OS), user MUST NOT be Home State (usually).
                // If it contains (AI) or nothing, everyone is eligible.

                const cutCatLower = cut.category ? cut.category.toLowerCase() : '';

                // Parse Quota from string
                const isHSQuota = cutCatLower.includes('(hs)') || cutCatLower.includes('home state');
                const isOSQuota = cutCatLower.includes('(os)') || cutCatLower.includes('other state');
                const isAIQuota = cutCatLower.includes('(ai)') || cutCatLower.includes('all india');

                if (isHSQuota && !isHomeState) continue; // User is not from home state, skip HS seat
                if (isOSQuota && isHomeState) continue;  // User is from home state, can't take OS seat (usually)

                // 2. Gender Check
                // "Female-Only" / "Female Only" -> only for females
                // "Gender-Neutral" -> for everyone
                const isFemaleOnly = cutCatLower.includes('female');
                if (isFemaleOnly && userGender !== 'female') continue;

                // 3. Category Check
                // User: "General", "OBC", "SC", "ST", "EWS"
                // Cutoff: "General", "Open", "OBC-NCL", "SC", "ST", "EWS"
                // We need strict matching. "OBC" matches "OBC" or "BC". 

                let categoryMatch = false;

                if (userCatLower === 'general' || userCatLower === 'open') {
                    // General matches "General" or "Open"
                    if (cutCatLower.includes('general') || cutCatLower.includes('open')) categoryMatch = true;
                } else if (userCatLower.includes('obc')) {
                    // OBC matches "OBC" or "BC" NOT "EWS"
                    if (cutCatLower.includes('obc') || (cutCatLower.includes('bc') && !cutCatLower.includes('bca'))) categoryMatch = true;
                } else if (userCatLower === 'sc') {
                    if (cutCatLower.includes('sc') && !cutCatLower.includes('science')) categoryMatch = true;
                } else if (userCatLower === 'st') {
                    if (cutCatLower.includes('st') && !cutCatLower.includes('state') && !cutCatLower.includes('studies')) categoryMatch = true;
                } else if (userCatLower.includes('ews')) {
                    if (cutCatLower.includes('ews')) categoryMatch = true;
                }

                if (!categoryMatch) continue;

                // 4. PwD Check (Optional refinement)
                // If user IS PwD, they can take PwD seats (usually marked)
                // If user is NOT PwD, they cannot take PwD seats.
                if (!isPwd && cutCatLower.includes('pwd')) continue;


                // 5. Rank Check
                // Closing Rank logic
                if (cut.closing) {
                    // We interpret opening/closing. 
                    // If rank <= closing, strict yes.
                    // If rank <= closing * 1.3, probable.

                    const closing = cut.closing;
                    const opening = cut.opening || 0; // Sometimes opening > closing in data anomalies, but usually opening < closing implies range

                    // Allow a buffer for "Low Chance"
                    if (userRank <= closing * 1.3) {
                        let chance = 'Low';
                        if (userRank <= closing) chance = 'High';
                        else if (userRank <= closing * 1.15) chance = 'Medium';

                        matchedBranches.push({
                            branch: cut.branch,
                            closingRank: closing,
                            openingRank: opening,
                            category: cut.category,
                            year: cut.year,
                            chance: chance,
                            quota: isHSQuota ? 'Home State' : (isOSQuota ? 'Other State' : 'All India')
                        });
                    }
                }
            }

            if (matchedBranches.length > 0) {
                // Clean up matched branches - maybe deduplicate or sort?
                matchedBranches.sort((a, b) => {
                    // Sort by chance (High > Medium > Low) => Text sort? No.
                    const map = { 'High': 1, 'Medium': 2, 'Low': 3 };
                    return map[a.chance] - map[b.chance];
                });

                predictedColleges.push({
                    name: college.name,
                    location: college.location,
                    type: college.type,
                    nirfRank: college.nirfRank || 999,
                    matchedBranches: matchedBranches
                });
            }
        }

        // Final Sort: 
        // 1. Colleges with at least one "High" chance branch come first?
        // 2. Or just NIRF rank?
        // Let's sort by NIRF rank first, as that implies quality.
        predictedColleges.sort((a, b) => (a.nirfRank || 9999) - (b.nirfRank || 9999));

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

exports.seedColleges = async (req, res) => {
    res.status(200).json({ message: "Use the scraper scraper scripts (scrape_master.js or scrape_global.js) to seed data." });
};

// @desc    Get All Colleges (with optional type filter)
// @route   GET /api/predictor/colleges?type=International
// @access  Public
exports.getColleges = async (req, res) => {
    try {
        const { type, limit } = req.query;
        let query = {};
        if (type) query.type = type;

        let colleges = [];
        try {
            colleges = await College.find(query).limit(limit ? parseInt(limit) : 100).sort({ rank: 1, nirfRank: 1 });
        } catch (err) {
            console.log("DB Query failed, trying local files...");
        }

        // Fallback to local files if DB returns nothing
        if (!colleges || colleges.length === 0) {
            // master_colleges_dump.json is now the single source of truth from scrape_master.js
            const masterFile = path.join(__dirname, '../../data/master_colleges_dump.json');

            let loadedColleges = [];

            if (fs.existsSync(masterFile)) {
                try {
                    const d = JSON.parse(fs.readFileSync(masterFile, 'utf-8'));
                    loadedColleges = d;
                } catch (e) {
                    console.log("Error reading master dump:", e.message);
                }
            }

            // Filter in memory
            if (type) {
                loadedColleges = loadedColleges.filter(c => c.type === type);
            }
            // Sort
            loadedColleges.sort((a, b) => (a.rank || 9999) - (b.rank || 9999));

            colleges = loadedColleges.slice(0, limit ? parseInt(limit) : 100);
        }

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

const calculateChance = (userRank, closingRank) => {
    if (userRank <= closingRank) return 'High';
    if (userRank <= closingRank * 1.1) return 'Medium'; // within 10%
    return 'Low'; // within 20%
};

// @desc    Predict Rank/Percentile based on Score or Percentile
// @route   POST /api/predictor/jee-main-rank
// @access  Public
exports.predictRank = async (req, res) => {
    try {
        const { score, percentile, shift } = req.body;

        let predictedPercentile = 0;
        let predictedRank = 0;
        // Approx candidates for 2025
        const TOTAL_CANDIDATES = 1400000;

        // Score vs Percentile Mapping (Approximate avg of all shifts)
        const scoreToPercentileMap = [
            { score: 300, percentile: 100 },
            { score: 280, percentile: 99.95 },
            { score: 250, percentile: 99.5 },
            { score: 230, percentile: 99.0 },
            { score: 210, percentile: 98.5 },
            { score: 190, percentile: 98.0 },
            { score: 170, percentile: 97.0 },
            { score: 150, percentile: 95.5 },
            { score: 130, percentile: 93.0 },
            { score: 110, percentile: 90.0 },
            { score: 90, percentile: 85.0 },
            { score: 70, percentile: 75.0 },
            { score: 60, percentile: 70.0 },
            { score: 50, percentile: 60.0 },
            { score: 40, percentile: 50.0 },
            { score: 20, percentile: 30.0 },
            { score: 0, percentile: 0 }
        ];

        const interpolatePercentile = (inputScore) => {
            // Find range
            for (let i = 0; i < scoreToPercentileMap.length - 1; i++) {
                if (inputScore <= scoreToPercentileMap[i].score && inputScore >= scoreToPercentileMap[i + 1].score) {
                    const upper = scoreToPercentileMap[i];
                    const lower = scoreToPercentileMap[i + 1];
                    const rangeScore = upper.score - lower.score;
                    const rangePerc = upper.percentile - lower.percentile;
                    const diff = inputScore - lower.score;
                    return lower.percentile + (diff / rangeScore) * rangePerc;
                }
            }
            return inputScore > 300 ? 100 : 0;
        };

        console.log(`Predictor Request - Type: Rank, Score: ${score}, Percentile: ${percentile}, Shift: ${shift}`);

        const isProvided = (val) => val !== undefined && val !== null && val !== '';

        if (isProvided(percentile)) {
            // Mode 2: Input is Percentile -> Output Rank
            predictedPercentile = parseFloat(percentile);

            // Validate number
            if (isNaN(predictedPercentile)) {
                return res.status(400).json({ success: false, message: 'Invalid percentile format' });
            }

            if (predictedPercentile > 100) predictedPercentile = 100;
            if (predictedPercentile < 0) predictedPercentile = 0;

            predictedRank = Math.floor(((100 - predictedPercentile) * TOTAL_CANDIDATES) / 100) + 1;
        } else if (isProvided(score)) {
            // Mode 1: Input is Score -> Output Percentile (and Rank)
            const s = parseFloat(score);

            // Validate number
            if (isNaN(s)) {
                return res.status(400).json({ success: false, message: 'Invalid score format' });
            }

            predictedPercentile = interpolatePercentile(s);
            // Limit decimals
            predictedPercentile = Math.round(predictedPercentile * 10000000) / 10000000;

            predictedRank = Math.floor(((100 - predictedPercentile) * TOTAL_CANDIDATES) / 100) + 1;
        } else {
            return res.status(400).json({ success: false, message: 'Please provide score or percentile' });
        }

        res.status(200).json({
            success: true,
            data: {
                rank: predictedRank,
                percentile: predictedPercentile,
                score: score || null,
                totalCandidates: TOTAL_CANDIDATES
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Import the new predictor service
const { predictColleges: predictCollegesService } = require('../services/collegePredictorService');
const { predictWithAI } = require('../services/aiPredictorService');
const PredictorSettings = require('../models/PredictorSettings.model');

// @desc    Predict colleges based on JEE Main Percentile (Enhanced)
// @route   POST /api/predictor/predict-by-percentile
// @access  Public
exports.predictByPercentile = async (req, res) => {
    try {
        const { percentile, category, homeState, gender } = req.body;

        // Validation
        if (!percentile) {
            return res.status(400).json({
                success: false,
                message: 'Percentile is required'
            });
        }

        const pct = parseFloat(percentile);
        if (isNaN(pct) || pct < 0 || pct > 100) {
            return res.status(400).json({
                success: false,
                message: 'Percentile must be between 0 and 100'
            });
        }

        // Default values
        const cat = category || 'General';
        const state = homeState || 'Other';
        const gen = gender || 'Male';

        // Check settings
        const settings = await PredictorSettings.getSettings();

        if (!settings.isEnabled) {
            return res.status(503).json({
                success: false,
                message: 'College predictor is currently disabled. Please try again later.'
            });
        }

        let prediction;

        // Use AI if enabled and configured
        if (settings.useAI && settings.hasApiKey()) {
            try {
                prediction = await predictWithAI(pct, cat, state, gen);
            } catch (aiError) {
                console.error('AI Prediction failed, falling back to local:', aiError.message);
                // Fallback to local algorithm
                prediction = await predictCollegesService(pct, cat, state, gen);
                prediction.predictor_status = {
                    enabled: true,
                    model: 'local-algorithm',
                    powered_by: 'CollegeDost',
                    note: 'AI unavailable, using local predictions'
                };
            }
        } else {
            // Use local algorithm
            prediction = await predictCollegesService(pct, cat, state, gen);
            prediction.predictor_status = {
                enabled: true,
                model: 'local-algorithm',
                powered_by: 'CollegeDost'
            };
        }

        // Add IIT eligibility info
        const rank = Math.round((100 - pct) * 1200000 / 100);
        prediction.iit_eligibility = {
            eligible_for_jee_advanced: rank <= 250000,
            note: rank <= 250000
                ? `With AIR ~${rank}, you qualify to appear for JEE Advanced (top 2.5 lakh). IIT admissions depend on JEE Advanced rank.`
                : `AIR ~${rank} is outside top 2.5 lakh. Focus on NITs, IIITs, and GFTIs through JoSAA.`
        };

        // Save prediction to database
        const PredictionResult = require('../models/PredictionResult.model');

        const savedPrediction = await PredictionResult.create({
            user: req.user?._id || null,
            sessionId: req.headers['x-session-id'] || null,
            input: {
                percentile: pct,
                category: cat,
                homeState: state,
                gender: gen
            },
            estimatedRank: prediction.estimated_rank || rank,
            iitEligibility: {
                eligibleForJeeAdvanced: prediction.iit_eligibility.eligible_for_jee_advanced,
                note: prediction.iit_eligibility.note
            },
            summary: {
                goodChances: prediction.summary?.good_chances || 0,
                mayGet: prediction.summary?.may_get || 0,
                toughChances: prediction.summary?.tough_chances || 0
            },
            results: prediction.results,
            predictorStatus: {
                enabled: prediction.predictor_status?.enabled,
                model: prediction.predictor_status?.model,
                poweredBy: prediction.predictor_status?.powered_by
            }
        });

        res.status(200).json({
            success: true,
            predictionId: savedPrediction._id,
            ...prediction
        });

    } catch (error) {
        console.error('Prediction Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get prediction by ID
// @route   GET /api/predictor/prediction/:id
// @access  Public
exports.getPredictionById = async (req, res) => {
    try {
        const PredictionResult = require('../models/PredictionResult.model');
        const prediction = await PredictionResult.findById(req.params.id);

        if (!prediction) {
            return res.status(404).json({ success: false, message: 'Prediction not found' });
        }

        // Transform back to API response format
        res.status(200).json({
            success: true,
            predictionId: prediction._id,
            input: prediction.input,
            estimated_rank: prediction.estimatedRank,
            iit_eligibility: {
                eligible_for_jee_advanced: prediction.iitEligibility?.eligibleForJeeAdvanced,
                note: prediction.iitEligibility?.note
            },
            summary: {
                good_chances: prediction.summary?.goodChances,
                may_get: prediction.summary?.mayGet,
                tough_chances: prediction.summary?.toughChances
            },
            results: prediction.results,
            predictor_status: {
                enabled: prediction.predictorStatus?.enabled,
                model: prediction.predictorStatus?.model,
                powered_by: prediction.predictorStatus?.poweredBy
            },
            createdAt: prediction.createdAt
        });
    } catch (error) {
        console.error('Get Prediction Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get user's prediction history
// @route   GET /api/predictor/my-predictions
// @access  Private (requires auth)
exports.getMyPredictions = async (req, res) => {
    try {
        const PredictionResult = require('../models/PredictionResult.model');

        const predictions = await PredictionResult.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('input estimatedRank summary createdAt');

        res.status(200).json({
            success: true,
            count: predictions.length,
            predictions
        });
    } catch (error) {
        console.error('Get My Predictions Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
