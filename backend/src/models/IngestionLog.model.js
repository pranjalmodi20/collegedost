const mongoose = require('mongoose');

const ingestionLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['NIRF_PDF', 'JOSAA_PDF', 'AICTE_CSV', 'OTHER'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  fileName: String, // "NIRF_Eng_2024.pdf"
  fileUrl: String, // Storage URL
  year: Number,
  stats: {
    totalRecords: { type: Number, default: 0 },
    matched: { type: Number, default: 0 },
    created: { type: Number, default: 0 },
    updated: { type: Number, default: 0 },
    failed: { type: Number, default: 0 }
  },
  logs: [String], // "Row 5: College not found"
  startedAt: Date,
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('IngestionLog', ingestionLogSchema);
