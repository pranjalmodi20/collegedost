const express = require('express');
const router = express.Router();
const { getTestPrep, getTestPrepBySlug } = require('../controllers/testPrep.controller');

router.get('/', getTestPrep);
router.get('/:slug', getTestPrepBySlug);

module.exports = router;
