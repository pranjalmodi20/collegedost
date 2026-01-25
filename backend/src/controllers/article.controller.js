const Article = require('../models/Article.model');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res) => {
    try {
        const { category } = req.query;
        let query = { isPublished: true };
        
        if (category) {
            query.category = category;
        }

        const articles = await Article.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single article
// @route   GET /api/articles/:slug
// @access  Public
exports.getArticleBySlug = async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });

        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private (Admin)
exports.createArticle = async (req, res) => {
    try {
        const article = await Article.create(req.body);
        res.status(201).json({ success: true, data: article });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};
