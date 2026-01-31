const mongoose = require('mongoose');

const neetResultSchema = new mongoose.Schema({
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
        score: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true,
            enum: ['General', 'OBC', 'OBC-NCL', 'SC', 'ST', 'EWS']
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

    // AIIMS Eligibility
    aiimsEligibility: {
        eligible: Boolean,
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
        AIIMS: {
            good_chances: [mongoose.Schema.Types.Mixed],
            may_get: [mongoose.Schema.Types.Mixed],
            tough_chances: [mongoose.Schema.Types.Mixed]
        },
        JIPMER: {
            good_chances: [mongoose.Schema.Types.Mixed],
            may_get: [mongoose.Schema.Types.Mixed],
            tough_chances: [mongoose.Schema.Types.Mixed]
        },
        Government_Medical: {
            good_chances: [mongoose.Schema.Types.Mixed],
            may_get: [mongoose.Schema.Types.Mixed],
            tough_chances: [mongoose.Schema.Types.Mixed]
        },
        Private_Medical: {
            good_chances: [mongoose.Schema.Types.Mixed],
            may_get: [mongoose.Schema.Types.Mixed],
            tough_chances: [mongoose.Schema.Types.Mixed]
        },
        Dental: {
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
neetResultSchema.index({ user: 1, createdAt: -1 });
neetResultSchema.index({ sessionId: 1, createdAt: -1 });
neetResultSchema.index({ 'input.score': 1, 'input.category': 1 });

module.exports = mongoose.model('NEETResult', neetResultSchema);
