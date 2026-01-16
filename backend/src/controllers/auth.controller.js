const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, mobile, password, currentClass, interest, city } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ mobile });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists with this mobile number' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            mobile,
            password,
            currentClass,
            interest,
            city
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'Registered successfully',
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    mobile: user.mobile,
                    email: user.email
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }

    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
             return res.status(400).json({ success: false, message: 'Email or Mobile already exists' });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        // Validate
        if (!mobile || !password) {
            return res.status(400).json({ success: false, message: 'Please provide mobile and password' });
        }

        // Check for user
        const user = await User.findOne({ mobile }).select('+password');

        if (!user) {
             return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
