const express = require('express');
const router = express.Router();
const { predictColleges, seedColleges } = require('../controllers/predictor.controller');

router.post('/jee-main', predictColleges);
router.post('/seed', seedColleges);

module.exports = router;
