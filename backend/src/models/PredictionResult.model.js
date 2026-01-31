const mongoose = require('mongoose');

const predictionResultSchema = new mongoose.Schema({
    // User who made the prediction (optional for guests)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    
    // Session ID for anonymous users
    sessionId: {
        type: String,
        default: null
    },

    // Input parameters
    input: {
        percentile: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true,
            enum: ['General', 'OBC-NCL', 'SC', 'ST', 'EWS']
        },
        homeState: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ['Male', 'Female'],
            default: 'Male'
        }
    },

    // Calculated rank
    estimatedRank: {
        type: Number,
        required: true
    },

    // IIT Eligibility
    iitEligibility: {
        eligibleForJeeAdvanced: Boolean,
        note: String
    },

    // Summary counts
    summary: {
        goodChances: Number,
        mayGet: Number,
        toughChances: Number
    },

    // Full results grouped by institute type
    results: {
        NITs: {
            good_chances: [{
                college_name: String,
                course: String,
                quota: String,
                ownership: String,
                fees: String,
                last_year_cutoff: Number,
                chance: String
            }],
            may_get: [{
                college_name: String,
                course: String,
                quota: String,
                ownership: String,
                fees: String,
                last_year_cutoff: Number,
                chance: String
            }],
            tough_chances: [{
                college_name: String,
                course: String,
                quota: String,
                ownership: String,
                fees: String,
                last_year_cutoff: Number,
                chance: String
            }]
        },
        IIITs: {
            good_chances: [mongoose.Schema.Types.Mixed],
            may_get: [mongoose.Schema.Types.Mixed],
            tough_chances: [mongoose.Schema.Types.Mixed]
        },
        GFTIs: {
            good_chances: [mongoose.Schema.Types.Mixed],
            may_get: [mongoose.Schema.Types.Mixed],
            tough_chances: [mongoose.Schema.Types.Mixed]
        },
        Private_Deemed: {
            good_chances: [mongoose.Schema.Types.Mixed],
            may_get: [mongoose.Schema.Types.Mixed],
            tough_chances: [mongoose.Schema.Types.Mixed]
        }
    },

    // Predictor metadata
    predictorStatus: {
        enabled: Boolean,
        model: String,
        poweredBy: String
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800 // Auto-delete after 7 days
    }
}, {
    timestamps: true
});

// Index for quick lookups
predictionResultSchema.index({ user: 1, createdAt: -1 });
predictionResultSchema.index({ sessionId: 1, createdAt: -1 });
predictionResultSchema.index({ 'input.percentile': 1, 'input.category': 1 });

module.exports = mongoose.model('PredictionResult', predictionResultSchema);
