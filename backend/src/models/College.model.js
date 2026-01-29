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
    ingestionMetadata: {
      aicteId: { type: String, index: true },
      nirfId: { type: String, index: true }, // Institute ID from NIRF
      aisheCode: { type: String, index: true },
      matchConfidence: Number, // 0-100
      lastEnrichedAt: Date
    },
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
      category: String,
      score: Number,
      metricData: Map // Store extra JSON like "TLR": 80, "RPC": 60
    }],
    nirfRank: { type: Number, index: true }, // Legacy support for sorting

    fees: {
      tuition: Number,
      currency: { type: String, default: 'INR' },
      note: String
    },

    placements: {
      averagePackage: String,
      placementPercentage: Number
    },

    // --- RICH CONTENT ---
    logo: String,
    bannerImage: String,
    overview: String, // HTML or Markdown content
    highlights: [String],

    // --- INFRASTRUCTURE ---
    infrastructure: {
      description: String,
      facilities: [{
        name: String, // e.g. "Library", "Hostel"
        icon: String, // FontAwesome icon class
        description: String
      }],
      images: [String]
    },

    // --- ADMISSION ---
    admissionProcess: {
      description: String,
      eligibility: String,
      documentsRequired: [String],
      importantDates: [{
        label: String, // "Application Start"
        date: String   // "15th Jan 2026"
      }]
    },

    // --- MEDIA ---
    gallery: [String], // Array of image URLs
    videos: [String],  // YouTube embed URLs

    // --- DETAILED PLACEMENTS ---
    placementStats: {
      year: Number,
      highestPackage: String,
      averagePackage: String,
      medianPackage: String,
      batchSize: Number,
      companiesVisited: Number,
      topRecruiters: [String],
      placementRate: Number,
      sectorWiseSplit: [{
        sector: String,
        percentage: Number
      }]
    },

    // --- FAQS ---
    faqs: [{
      question: String,
      answer: String
    }],

    // --- EXISTING FIELDS ---
    coursesOffered: [{
      courseName: String,
      duration: String,
      fee: Number,
      eligibility: String,
      seats: Number,
      examAccepted: String,
      // AICTE / Ingestion additions
      level: String, // "UG", "PG", "Diploma"
      aicteId: String, // "1-12345678"
      intake: Number,
      durationYear: Number,
      isNbaAccredited: Boolean,
      shift: { type: String, default: "Day" }
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
collegeSchema.pre('save', async function () {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + (Math.floor(Math.random() * 1000));
  }
});

// Fuzzy Matching / Deduplication Strategy
collegeSchema.statics.findByFuzzyName = async function (name, city = "", state = "") {
  // 1. Exact Match on Name
  let college = await this.findOne({ name: name });
  if (college) return college;

  // 2. Exact Match on Aliases
  college = await this.findOne({ aliases: name });
  if (college) return college;

  // 3. Normalized Match (remove "Institute of", "College", spaces, etc)
  // This is a simplified "canonical" logic. 
  // Ideally, use a normalized text search or an aggregation pipeline for more complex logic.
  // For now, we rely on the specific Ingestion Services to handle the heavy lifting (string-similarity).
  // This helper is for quick lookups.
  
  return null;
};

// Composite Index for Uniqueness in Region - Removed unique: true to allow similar named colleges in different cities/districts
collegeSchema.index({ name: 1, "location.country": 1, "location.state": 1 });

module.exports = mongoose.model("College", collegeSchema);
