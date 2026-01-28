const mongoose = require('mongoose');
const slugify = require('slugify');

const testPrepSchema = new mongoose.Schema({
    stream: {
        type: String,
        required: true,
        enum: ['Engineering', 'Medical', 'MBA', 'Law', 'Other'],
        index: true
    },
    exam: {
        type: String,
        required: true,
        index: true // e.g., "JEE Main", "NEET"
    },
    type: {
        type: String,
        required: true,
        enum: ['Preparation', 'Mock-Test', 'Previous-Paper', 'Resource'],
        index: true
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },

    // Content Fields
    overview: String, // HTML Content for "Preparation"
    syllabus: [{
        subject: String,
        topics: [String]
    }],
    examPattern: {
        mode: String,
        duration: String,
        totalMarks: Number,
        sections: [String]
    },

    // For Mock Tests / Papers
    downloadUrl: String, // PDF Link
    isPaid: { type: Boolean, default: false },

    // For Resources
    author: String, // For strategies
    publishDate: Date,

    metaDescription: String
}, { timestamps: true });

// Composite Index for quicker filtering
testPrepSchema.index({ stream: 1, exam: 1, type: 1 });

testPrepSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = slugify(this.title + '-' + this.type, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('TestPrep', testPrepSchema);
