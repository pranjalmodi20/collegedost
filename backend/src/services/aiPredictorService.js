/**
 * AI-Powered College Predictor Service
 * Uses OpenAI to generate college predictions based on JEE Main percentile
 */

const PredictorSettings = require('../models/PredictorSettings.model');

// The master prompt for college prediction
const PREDICTOR_PROMPT = `You are an expert Indian engineering admission counselor and JoSAA data analyst.

Your task is to predict engineering colleges based on JEE Main data and return PURE JSON.

=====================
INPUT DATA
=====================
Exam: JEE Main Paper 1
Counselling Authority: JoSAA
Year: 2026 (use 2025 cutoff data)
Percentile: {{percentile}}
Estimated AIR: {{rank}}
Category: {{category}}
Home State: {{home_state}}
Gender: {{gender}}

=====================
PREDICTION RULES
=====================
1. Use JoSAA 2025 closing ranks
2. Apply category multiplier for OBC/SC/ST/EWS
3. Apply Home State quota (50% seats in NITs)

Chance Classification:
- Rank ≤ Cutoff × 0.85 → "Good Chances"
- Rank ≤ Cutoff × 1.10 → "May Get"
- Rank ≤ Cutoff × 1.30 → "Tough Chances"

=====================
IIT ELIGIBILITY RULES
=====================
- IIT admissions require JEE Advanced
- Top 2.5 lakh JEE Main qualifiers can appear for Advanced
- Only mention IIT eligibility, NOT admission chances

=====================
STRICT OUTPUT RULES
=====================
- Return ONLY valid JSON
- NO explanations before or after
- NO markdown formatting
- Include 15-30 colleges per category based on eligibility
- Sort by admission probability

=====================
REQUIRED JSON STRUCTURE
=====================
{
  "input": {
    "percentile": number,
    "category": "string",
    "home_state": "string"
  },
  "estimated_rank": number,
  "iit_eligibility": {
    "eligible_for_jee_advanced": boolean,
    "note": "string explaining eligibility"
  },
  "summary": {
    "good_chances": number,
    "may_get": number,
    "tough_chances": number
  },
  "results": {
    "NITs": {
      "good_chances": [college objects],
      "may_get": [college objects],
      "tough_chances": [college objects]
    },
    "IIITs": {
      "good_chances": [],
      "may_get": [],
      "tough_chances": []
    },
    "GFTIs": {
      "good_chances": [],
      "may_get": [],
      "tough_chances": []
    },
    "Private_Deemed": {
      "good_chances": [],
      "may_get": [],
      "tough_chances": []
    }
  }
}

College object format:
{
  "college_name": "string",
  "course": "string",
  "quota": "HS/OS/AI",
  "ownership": "Government/Private",
  "fees": "string",
  "last_year_cutoff": number,
  "chance": "Good Chances/May Get/Tough Chances"
}

NOW GENERATE THE JSON PREDICTION:`;

/**
 * Convert percentile to approximate AIR
 */
const percentileToRank = (percentile) => {
    const totalCandidates = 1200000;
    return Math.max(1, Math.round((100 - percentile) * totalCandidates / 100));
};

/**
 * Call OpenAI API for prediction
 */
const callOpenAI = async (apiKey, model, prompt) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a JEE counseling expert. Return ONLY valid JSON, no other text.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 4000
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
};

/**
 * Parse and validate JSON response
 */
const parseAIResponse = (responseText) => {
    // Remove any markdown formatting
    let cleaned = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch (err) {
        console.error('Failed to parse AI response:', err);
        throw new Error('Invalid JSON response from AI');
    }
};

/**
 * Main AI prediction function
 */
const predictWithAI = async (percentile, category, homeState, gender) => {
    // Get settings
    const settings = await PredictorSettings.getSettings();
    
    if (!settings.isEnabled) {
        throw new Error('College predictor is currently disabled');
    }

    if (!settings.hasApiKey()) {
        throw new Error('OpenAI API key not configured. Please configure in admin panel.');
    }

    const rank = percentileToRank(percentile);

    // Build the prompt
    const prompt = PREDICTOR_PROMPT
        .replace('{{percentile}}', percentile)
        .replace('{{rank}}', rank)
        .replace('{{category}}', category)
        .replace('{{home_state}}', homeState)
        .replace('{{gender}}', gender);

    // Call OpenAI
    const aiResponse = await callOpenAI(
        settings.openaiApiKey,
        settings.aiModel,
        prompt
    );

    // Parse response
    const prediction = parseAIResponse(aiResponse);

    // Add metadata
    prediction.predictor_status = {
        enabled: true,
        model: settings.aiModel,
        powered_by: 'OpenAI'
    };

    return prediction;
};

/**
 * Test the AI connection
 */
const testAIConnection = async () => {
    const settings = await PredictorSettings.getSettings();
    
    if (!settings.hasApiKey()) {
        return { success: false, message: 'API key not configured' };
    }

    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${settings.openaiApiKey}`
            }
        });

        if (response.ok) {
            return { success: true, message: 'OpenAI connection successful', model: settings.aiModel };
        } else {
            const error = await response.json();
            return { success: false, message: error.error?.message || 'Connection failed' };
        }
    } catch (err) {
        return { success: false, message: err.message };
    }
};

module.exports = {
    predictWithAI,
    testAIConnection,
    percentileToRank
};
