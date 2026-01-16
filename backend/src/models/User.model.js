const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true // Allow unique but ignore nulls if user signs up via mobile only initially
  },
  mobile: {
    type: String,
    required: [true, 'Please add a mobile number'],
    unique: true
  },
  currentClass: {
    type: String // 'Class 12th', 'Class 11th', etc.
  },
  interest: {
    type: String // 'B.E/B.Tech', etc.
  },
  city: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    select: false
  },
  isVerified: {
    type: Boolean,
    default: true // Auto-verify with password/email
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
const bcrypt = require('bcryptjs');

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
