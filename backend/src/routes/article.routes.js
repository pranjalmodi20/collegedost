const express = require('express');
const router = express.Router();
const { 
    getArticles, 
    getArticleBySlug, 
    createArticle,
    getAdminArticles,
    getArticleById,
    updateArticle,
    deleteArticle
} = require('../controllers/article.controller');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getArticles);
router.get('/admin/all', protect, admin, getAdminArticles);
router.get('/id/:id', protect, admin, getArticleById);
router.post('/', protect, admin, createArticle);
router.put('/:id', protect, admin, updateArticle);
router.delete('/:id', protect, admin, deleteArticle);

// Slug route should be last if it can conflict, but "admin" and "id" prefix prevents conflict
router.get('/:slug', getArticleBySlug);

module.exports = router;
