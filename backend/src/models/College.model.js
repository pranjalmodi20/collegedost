const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    location: {
      city: String,
      state: String,
      pinCode: String,
      country: {
        type: String,
        default: "India"
      },
      mapUrl: String
    },
    approvals: [{
        type: String // e.g., "AICTE", "UGC", "NBA"
    }],
    
    // Establishing "Institute of National Importance", etc.
    type: {
      type: String,
      enum: ["IIT", "NIT", "IIIT", "GFTI", "Private", "International", "Other", "Government"]
    },

    estYear: Number,
    website: String,
    
    campusSize: String, // e.g. "500 Acres"

    // Detailed Rankings
    rankings: [{
        source: String, // e.g. "NIRF", "The Week"
        year: Number,
        rank: Number,
        category: String // "Engineering", "Overall"
    }],

    // Keeping simple nirfRank for sorting ease
    nirfRank: Number, 
    
    fees: {
        tuition: Number, // Annual
        hostel: Number,
        mess: Number,
        currency: { type: String, default: 'INR' }
    },

    placements: {
        highestPackage: String, // "1.2 Cr"
        averagePackage: String, // "18 LPA"
        placementPercentage: Number,
        topRecruiters: [String]
    },

    coursesOffered: [{
        courseName: String, 
        duration: String,
        fee: Number 
    }],

    cutoff: [
      {
        exam: {
          type: String,
          default: "JEE Main"
        },
        year: {
          type: Number
        },
        round: Number,
        branch: {
          type: String
        },
        category: {
          type: String,
          default: "General"
        },
        cutoffType: {
          type: String,
          enum: ["RANK", "PERCENTILE"],
          default: "RANK"
        },
        opening: Number,
        closing: Number,
        quota: String // HS, OS, AI
      }
    ]
  },
  { timestamps: true }
);

// Slugify logic if needed, or handle in controller
const slugify = require('slugify');
collegeSchema.pre('save', function(next) {
    if (!this.slug && this.name) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});

// Prevent duplicate college names in same state
collegeSchema.index(
  { name: 1, "location.state": 1 },
  { unique: true }
);

module.exports = mongoose.model("College", collegeSchema);
