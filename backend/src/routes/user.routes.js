const express = require('express');
const router = express.Router();
const { 
    updateDetails, 
    updatePassword, 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser 
} = require('../controllers/user.controller');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserById); // Get single user by ID
router.put('/:id', protect, admin, updateUser); // Update user by Admin
router.delete('/:id', protect, admin, deleteUser); // Delete user by Admin

// Self update routes
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;