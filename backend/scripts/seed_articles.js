const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../src/config/db');
const Article = require('../src/models/Article.model');

dotenv.config({ path: './.env' }); // Adjusted path if running from root

const articles = [
    {
        title: "Top 10 Engineering Colleges in India 2026",
        slug: "top-10-engineering-colleges-in-india-2026",
        category: "College News",
        summary: "Discover the top-ranked engineering institutes in India for the academic year 2026 based on placement, facilities, and research.",
        content: `
            <h2>Introduction</h2>
            <p>Choosing the right engineering college is a critical decision for every aspirant. In 2026, the competition is tougher than ever. Here is our curated list of the top 10 engineering colleges in India.</p>
            <h3>1. IIT Madras</h3>
            <p>Retaining its top spot in NIRF rankings, IIT Madras continues to lead in research and innovation.</p>
        `,
        image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        tags: ["IIT", "Engineering", "Rankings"]
    },
    {
        title: "JEE Main 2026: Exam Dates, Pattern, and Eligibility",
        slug: "jee-main-2026-exam-dates-pattern-and-eligibility",
        category: "Exam News",
        summary: "Everything you need to know about JEE Main 2026. Check the latest updates from NTA regarding exam scheduling.",
        content: `
            <p>The National Testing Agency (NTA) has announced the tentative dates for JEE Main 2026.</p>
        `,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        tags: ["JEE Main", "NTA", "Exam Dates"]
    },
    {
        title: "Medical Admission 2026: NEET Cutoff Analysis",
        slug: "medical-admission-2026-neet-cutoff-analysis",
        category: "Admission Alert",
        summary: "An in-depth analysis of NEET 2025 cutoffs and what to expect for 2026 admissions.",
        content: `
            <p>With the increasing number of aspirants, the NEET cutoff has seen a significant rise.</p>
        `,
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        tags: ["NEET", "Medical", "Cutoff"]
    }
];

const seedArticles = async () => {
    try {
        await connectDB();
        await Article.deleteMany();
        // Use create in loop to ensure validation and hooks if any (though we provided slugs)
        for (const article of articles) {
            await Article.create(article);
        }
        console.log('News & Articles Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedArticles();
