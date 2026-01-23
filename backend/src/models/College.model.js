const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      city: String,
      state: String,
      country: {
        type: String,
        default: "India"
      }
    },

    nirfRank: Number,
    rank: Number, // For global or other rankings

    type: {
      type: String,
      enum: ["IIT", "NIT", "IIIT", "GFTI", "Private", "International", "Other"]
    },

    cutoff: [
      {
        exam: {
          type: String,
          default: "JEE Main"
        },

        year: {
          type: Number,
          default: 2024
        },

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
        closing: Number
      }
    ]
  },
  { timestamps: true }
);

// Prevent duplicate college names in same state
collegeSchema.index(
  { name: 1, "location.state": 1 },
  { unique: true }
);

module.exports = mongoose.model("College", collegeSchema);
