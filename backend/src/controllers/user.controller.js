const User = require('../models/User.model');

// @desc    Update user details (name, email)
// @route   PUT /api/users/updatedetails
// @access  Private
exports.updateDetails = async (req, res) => {
    try {
        const { name, email, currentPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Update Name
        if (name) user.name = name;

        // Update Email (Requires current password check if user has password)
        // If user is Google user (no password), email usually shouldn't change, or we need another verification method.
        // For now, if Google user tries to change email, we might block it or allow if strictly requested.
        // User request: "if the user want to change the email he must fill the current password"
        if (email && email !== user.email) {
            
            // If user has no password (e.g. Google login only), they can't provide current password.
            // Maybe they should set a password first?
            if (!user.password) {
                 return res.status(400).json({ success: false, message: 'Please set a password for your account first to change email.' });
            }

            if (!currentPassword) {
                return res.status(400).json({ success: false, message: 'Please provide current password to update email' });
            }

            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Incorrect password' });
            }
            user.email = email;
        }

        await user.save();

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                googleId: user.googleId
            }
        });

    } catch (error) {
         console.error(error);
         res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update password
// @route   PUT /api/users/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // If user has no password (Google), they can "set" a password directly?
        // Or if they want to "change", they need verification.
        // If user has password, check current.
        if (user.password) {
             if (!currentPassword) {
                 return res.status(400).json({ success: false, message: 'Please provide current password' });
             }
             const isMatch = await user.matchPassword(currentPassword);
             if (!isMatch) {
                 return res.status(401).json({ success: false, message: 'Incorrect current password' });
             }
        }

        user.password = newPassword;
        await user.save();

        // Generate new token or just success
        // Usually token is valid unless we implement blacklist
        
        res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};