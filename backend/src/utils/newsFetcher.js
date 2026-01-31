const Parser = require('rss-parser');
const Article = require('../models/Article.model');

const parser = new Parser();

const RSS_FEEDS = [
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms',
        source: 'Times of India'
    },
    {
        url: 'https://www.hindustantimes.com/feeds/rss/education/rssfeed.xml',
        source: 'Hindustan Times'
    }
];

const fetchAndStoreNews = async () => {
    console.log('Starting News Fetch...');
    let newArticlesCount = 0;

    for (const feedConfig of RSS_FEEDS) {
        try {
            console.log(`Fetching from ${feedConfig.source}...`);
            const feed = await parser.parseURL(feedConfig.url);

            for (const item of feed.items) {
                // Duplicate Check by Title
                const exists = await Article.findOne({ title: item.title });
                if (exists) continue;

                // Basic Category Logic
                let category = 'General';
                const lowerTitle = item.title.toLowerCase();
                if (lowerTitle.includes('exam') || lowerTitle.includes('jee') || lowerTitle.includes('neet')) {
                    category = 'Exam News';
                } else if (lowerTitle.includes('admission') || lowerTitle.includes('counselling')) {
                    category = 'Admission Alert';
                } else if (lowerTitle.includes('college') || lowerTitle.includes('university') || lowerTitle.includes('iit') || lowerTitle.includes('iim')) {
                    category = 'College News';
                }

                // Create Article
                // Note: item.contentSnippet might be short. item.content might be missing or HTML.
                // We save as Draft (isPublished: false)
                let summary = item.contentSnippet || item.content || 'No summary available.';
                if (summary.length > 497) {
                    summary = summary.substring(0, 497) + '...';
                }

                await Article.create({
                    title: item.title,
                    summary: summary,
                    content: item.content || item.contentSnippet || 'Read full article at source.',
                    category: category,
                    author: feedConfig.source,
                    isPublished: false, // Draft
                    links: [{ title: 'Source', url: item.link }],
                    createdAt: new Date(item.pubDate) || new Date()
                });

                newArticlesCount++;
            }

        } catch (error) {
            console.error(`Error fetching from ${feedConfig.source}:`, error.message);
        }
    }

    console.log(`News Fetch Complete. Added ${newArticlesCount} new articles.`);
    return newArticlesCount;
};

module.exports = fetchAndStoreNews;
