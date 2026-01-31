/**
 * NEET Predictor Controller
 * Handles NEET college predictions with AI support
 */

const PredictorSettings = require('../models/PredictorSettings.model');
const { predictColleges: predictNEETService, scoreToRank } = require('../services/neetPredictorService');

// AI prediction prompt for NEET
const NEET_PROMPT = `You are an expert Indian medical admission counselor and NEET-UG data analyst.

Your task is to predict MBBS/BDS colleges based on NEET Score and return a PURE JSON response.

=====================
INPUT DETAILS
=====================
Exam: NEET-UG
Counselling: MCC (All India) + State Counsellings
Prediction Year: 2026 (use previous year data)
Candidate Score: {{score}} out of 720
Category: {{category}}
Home State: {{home_state}}
Gender: {{gender}}

=====================
PREDICTION RULES
=====================
1. Convert score to approximate All India Rank
2. Consider both AIQ (15%) and State Quota (85%)
3. Apply category-wise cutoff adjustments

Chance classification:
- Rank clearly better than cutoff → "Good Chances"
- Rank within ±10% of cutoff → "May Get"
- Rank worse but historically possible → "Tough Chances"

=====================
STRICT OUTPUT RULES
=====================
- RETURN ONLY VALID JSON
- NO explanations, NO markdown, NO text outside JSON
- ONLY Indian medical colleges
- Sort by admission chance priority
- Group by institute type

=====================
JSON STRUCTURE
=====================
{
  "input": {
    "score": number,
    "category": string,
    "home_state": string
  },
  "estimated_rank": number,
  "summary": {
    "good_chances": number,
    "may_get": number,
    "tough_chances": number
  },
  "results": {
    "AIIMS": {
      "good_chances": [],
      "may_get": [],
      "tough_chances": []
    },
    "JIPMER": {
      "good_chances": [],
      "may_get": [],
      "tough_chances": []
    },
    "Government_Medical": {
      "good_chances": [],
      "may_get": [],
      "tough_chances": []
    },
    "Private_Medical": {
      "good_chances": [],
      "may_get": [],
      "tough_chances": []
    },
    "Dental": {
      "good_chances": [],
      "may_get": [],
      "tough_chances": []
    }
  }
}

=====================
COLLEGE OBJECT FORMAT
=====================
{
  "college_name": string,
  "course": "MBBS" or "BDS",
  "state": string,
  "ownership": string,
  "fees": string,
  "last_year_cutoff": number,
  "quota": "AIQ" or "State Quota",
  "chance": string
}`;

// AI prediction with OpenAI
const predictWithAI = async (score, category, homeState, gender) => {
    const settings = await PredictorSettings.findOne();
    if (!settings || !settings.hasApiKey()) {
        throw new Error('OpenAI API key not configured');
    }

    const apiKey = settings.getDecryptedApiKey();
    const prompt = NEET_PROMPT
        .replace('{{score}}', score)
        .replace('{{category}}', category)
        .replace('{{home_state}}', homeState)
        .replace('{{gender}}', gender);

    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
        model: settings.aiModel || 'gpt-4o',
        messages: [
            { role: 'system', content: 'You are a NEET counseling expert. Return ONLY valid JSON.' },
            { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4000,
        response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    const prediction = JSON.parse(content);
    prediction.predictor_status = {
        enabled: true,
        model: settings.aiModel || 'gpt-4o',
        powered_by: 'OpenAI'
    };

    return prediction;
};

// @desc    Predict NEET colleges by score
// @route   POST /api/predictor/neet-predict
// @access  Public
exports.predictNEETColleges = async (req, res) => {
    try {
        const { score, category, homeState, gender } = req.body;

        // Validation
        if (!score) {
            return res.status(400).json({ 
                success: false, 
                message: 'NEET Score is required' 
            });
        }

        const scr = parseFloat(score);
        if (scr < 0 || scr > 720) {
            return res.status(400).json({ 
                success: false, 
                message: 'NEET Score must be between 0 and 720' 
            });
        }

        const cat = category || 'General';
        const state = homeState || 'Delhi';
        const gen = gender || 'Male';

        // Check if predictor is enabled
        let settings = await PredictorSettings.findOne();
        if (!settings) {
            settings = await PredictorSettings.create({});
        }

        if (!settings.isEnabled) {
            return res.status(503).json({ 
                success: false, 
                message: 'NEET College Predictor is currently disabled' 
            });
        }

        let prediction;

        // Use AI if enabled and configured
        if (settings.useAI && settings.hasApiKey()) {
            try {
                prediction = await predictWithAI(scr, cat, state, gen);
            } catch (aiError) {
                console.error('AI Prediction failed, falling back to local:', aiError.message);
                // Fallback to local algorithm
                prediction = predictNEETService(scr, cat, state, gen);
                prediction.predictor_status = {
                    enabled: true,
                    model: 'local-algorithm',
                    powered_by: 'CollegeDost',
                    note: 'AI unavailable, using local predictions'
                };
            }
        } else {
            // Use local algorithm
            prediction = predictNEETService(scr, cat, state, gen);
            prediction.predictor_status = {
                enabled: true,
                model: 'local-algorithm',
                powered_by: 'CollegeDost'
            };
        }

        // Add AIIMS eligibility info
        const rank = scoreToRank(scr);
        prediction.aiims_eligibility = {
            eligible: rank <= 10000,
            note: rank <= 10000 
                ? `With AIR ~${rank}, you have good chances for AIIMS counseling.`
                : rank <= 50000
                ? `With AIR ~${rank}, you may qualify for some AIIMS through reserved categories.`
                : `With AIR ~${rank}, focus on State Government Medical Colleges and Private Medical Colleges.`
        };

        // Save prediction to database
        const NEETResult = require('../models/NEETResult.model');
        
        const savedPrediction = await NEETResult.create({
            user: req.user?._id || null,
            sessionId: req.headers['x-session-id'] || null,
            input: {
                score: scr,
                category: cat,
                homeState: state,
                gender: gen
            },
            estimatedRank: prediction.estimated_rank || rank,
            aiimsEligibility: prediction.aiims_eligibility,
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
        console.error('NEET Prediction Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get NEET prediction by ID
// @route   GET /api/predictor/neet-prediction/:id
// @access  Public
exports.getNEETPredictionById = async (req, res) => {
    try {
        const NEETResult = require('../models/NEETResult.model');
        const prediction = await NEETResult.findById(req.params.id);
        
        if (!prediction) {
            return res.status(404).json({ success: false, message: 'Prediction not found' });
        }

        res.status(200).json({
            success: true,
            predictionId: prediction._id,
            input: prediction.input,
            estimated_rank: prediction.estimatedRank,
            aiims_eligibility: prediction.aiimsEligibility,
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
        console.error('Get NEET Prediction Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
