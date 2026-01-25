const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String, // e.g., "B.Tech Computer Science"
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    shortName: {
        type: String // e.g. "B.Tech"
    },
    degreeLevel: {
        type: String,
        enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Doctorate', 'Certificate'],
        required: true
    },
    duration: {
        type: String, // e.g. "4 Years"
    },
    eligibility: {
        type: String // Markdown or HTML
    },
    overview: {
        type: String
    },
    careerOptions: [String],
    averageStartingSalary: String,
    
    // Reverse mapping could be done virtually, but here we can define "Related Specializations"
    specialization: {
        type: String // "Computer Science and Engineering"
    },
    
    icon: {
        type: String // URL or icon class
    }
}, { timestamps: true });

courseSchema.pre('save', function(next) {
    if (!this.slug && this.courseName) {
        this.slug = slugify(this.courseName, { lower: true });
    }
    next();
});

module.exports = mongoose.model('Course', courseSchema);
