const express = require('express');
const router = express.Router();
const { getArticles, getArticleBySlug, createArticle } = require('../controllers/article.controller');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);
router.post('/', protect, createArticle);

module.exports = router;
