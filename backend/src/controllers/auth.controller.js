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

const { OAuth2Client } = require('google-auth-library');
// Note: If GOOGLE_CLIENT_ID is not set, this will fail verification if not handled carefully.
// Ensure you set GOOGLE_CLIENT_ID in .env
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body; // ID Token from frontend
        
        let payload;
        try {
             const ticket = await client.verifyIdToken({
                 idToken: token,
                 audience: process.env.GOOGLE_CLIENT_ID
             });
             payload = ticket.getPayload();
        } catch (verifyError) {
             console.error("Google verify error:", verifyError);
             return res.status(401).json({ success: false, message: 'Invalid Google Token' });
        }

        const { name, email, sub: googleId } = payload;

        let user = await User.findOne({ 
             $or: [{ googleId }, { email }]
        });

        if (user) {
            // Update googleId if missing
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create user
            // Note: Mobile is optional thanks to schema update
            user = await User.create({
                name,
                email,
                googleId
            });
        }

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                googleId: user.googleId
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
