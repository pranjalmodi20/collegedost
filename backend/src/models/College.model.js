const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        city: String,
        state: String
    },
    nirfRank: Number,
    type: {
        type: String, // e.g., IIT, NIT, IIIT, Private
        enum: ['IIT', 'NIT', 'IIIT', 'GFTI', 'Private', 'Other']
    },
    cutoff: [{
        exam: {
            type: String, // e.g., "JEE Main", "JEE Advanced"
            default: "JEE Main"
        },
        year: {
            type: Number,
            default: 2024
        },
        branch: String, // e.g., "Computer Science", "Electronics"
        category: {
            type: String, // e.g., "General", "OBC", "SC", "ST", "EWS"
            default: "General"
        },
        closingPercentile: Number // The percentile required to get in (e.g., 98.5)
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('College', collegeSchema);
