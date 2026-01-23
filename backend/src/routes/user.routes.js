const express = require('express');
const router = express.Router();
const { updateDetails, updatePassword } = require('../controllers/user.controller');
const { protect } = require('../middleware/authMiddleware');

router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;