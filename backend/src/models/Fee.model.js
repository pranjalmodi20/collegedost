const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
    index: true
  },
  year: {
    type: Number,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['JoSAA', 'Institute', 'Other'],
    default: 'JoSAA'
  },
  courseName: {
    type: String, // e.g. "B.Tech" or "Overall"
    default: "Overall"
  },
  branch: {
    type: String, // e.g. "Computer Science"
    default: "All"
  },
  category: {
    type: String, // e.g. "GEN", "SC", "ST", "OBC-NCL", "EWS"
    default: "Common"
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "INR"
  },
  frequency: {
    type: String,
    enum: ['Semester', 'Year', 'OneTime'],
    default: 'Semester'
  },
  components: [{
    name: String, // e.g. "Tuition Fee", "Caution Money"
    amount: Number
  }],
  sourceDocument: {
    type: String // URL or Reference to the source PDF
  }
}, { timestamps: true });

// Index for fast lookup
feeSchema.index({ college: 1, year: 1, courseName: 1 });

module.exports = mongoose.model('Fee', feeSchema);
