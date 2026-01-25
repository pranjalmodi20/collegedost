const express = require('express');
const router = express.Router();
const { updateDetails, updatePassword, getAllUsers } = require('../controllers/user.controller');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getAllUsers);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;