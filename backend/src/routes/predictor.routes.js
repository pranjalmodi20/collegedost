const express = require('express');
const router = express.Router();
const { predictColleges, seedColleges } = require('../controllers/predictor.controller');

router.post('/jee-main', predictColleges);
router.post('/jee-main-rank', require('../controllers/predictor.controller').predictRank);
router.get('/colleges', require('../controllers/predictor.controller').getColleges);
router.post('/seed', seedColleges);

module.exports = router;
