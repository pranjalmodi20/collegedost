const mongoose = require("mongoose");
const slugify = require('slugify');

const collegeSchema = new mongoose.Schema(
  {
    // --- CORE IDENTITY ---
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    aliases: [String], // e.g. ["IITB", "IIT Bombay"] - Critical for de-duplication
    
    // --- LOCATION (Global Standard) ---
    location: {
      city: String,
      state: String, // State/Province
      zip: String,   // Zip/Pin Code
      country: {
        type: String,
        required: true,
        default: "India",
        index: true
      },
      address: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      mapUrl: String
    },

    // --- META & CLASSIFICATION ---
    type: {
      type: String,
      enum: ["Public", "Private", "Deemed", "Consortium", "Government", "IGO", "Other"],
      default: "Other"
    },
    estYear: Number,
    website: String,
    
    // --- ACADEMIC ---
    approvals: [{ type: String }], // "AICTE", "UGC", "ABET"
    accreditation: {
        body: String, // "NAAC"
        grade: String // "A++"
    },
    streams: [String], // ["Engineering", "Arts"]

    // --- SOURCE TRACKING (Strategy Requirement) ---
    // Tracks where this data came from: "AISHE_2024", "IPEDS_CSV"
    dataSources: [{
        sourceName: String,
        sourceId: String,   // ID in the external system (e.g. OPEID)
        fetchedAt: { type: Date, default: Date.now }
    }],

    // --- METRICS ---
    rankings: [{
        source: String, // "NIRF", "QS", "USNews"
        year: Number,
        rank: Number,
        category: String
    }],
    nirfRank: Number, // Legacy support for sorting

    fees: {
        tuition: Number,
        currency: { type: String, default: 'INR' },
        note: String
    },

    placements: {
        averagePackage: String,
        placementPercentage: Number
    },

    // --- DETAILED DATA (Can be populated later) ---
    coursesOffered: [{
        courseName: String, 
        duration: String,
        fee: Number 
    }],

    // For predictors
    cutoff: [{
        exam: { type: String, default: "JEE Main" },
        year: Number,
        round: Number,
        branch: String,
        category: { type: String, default: "General" },
        cutoffType: { type: String, enum: ["RANK", "PERCENTILE"], default: "RANK" },
        opening: Number,
        closing: Number,
        quota: String
    }]
  },
  { timestamps: true }
);

// Auto-Slugify
collegeSchema.pre('save', function(next) {
    if (!this.slug && this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + (Math.floor(Math.random() * 1000));
        // Append random number to avoid collision on "Saint Mary's College" (exists in every country)
    }
    next();
});

// Composite Index for Uniqueness in Region
collegeSchema.index({ name: 1, "location.country": 1, "location.state": 1 }, { unique: true });

module.exports = mongoose.model("College", collegeSchema);
