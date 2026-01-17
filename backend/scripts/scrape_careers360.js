const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const College = require('../src/models/College.model');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/career360_clone';
const TARGET_URL = 'https://engineering.careers360.com/colleges/list-of-engineering-colleges-in-india-accepting-jee-main';
const MAX_PAGES = 3; 

// Connect to DB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected for Scraping...');
    } catch (err) {
        console.error('DB Connection Failed:', err.message);
        process.exit(1);
    }
};

// Main Scraper Function
const scrapeColleges = async () => {
    await connectDB();

    console.log('Starting Scraper (MongoDB Mode)...');

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    console.log(`Navigating to ${TARGET_URL}...`);
    let scrapedCount = 0;

    for (let pageNum = 1; pageNum <= MAX_PAGES; pageNum++) {
        const url = `${TARGET_URL}?page=${pageNum}`;
        console.log(`Scraping Page ${pageNum}...`);
        
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
            await page.waitForSelector('.card', { timeout: 10000 }).catch(() => console.log("Timeout waiting for cards"));

            const collegesData = await page.evaluate(() => {
                const items = document.querySelectorAll('.card');
                const results = [];
                items.forEach(item => {
                    const nameEl = item.querySelector('.card-title a');
                    const locationEl = item.querySelector('.location');
                    
                    if (nameEl) {
                        const name = nameEl.innerText.trim();
                        const locationText = locationEl ? locationEl.innerText.trim() : '';
                        const parts = locationText.split(',').map(s => s.trim());
                        const city = parts[0] || '';
                        const state = parts.length > 1 ? parts[parts.length - 1] : '';
                        
                        let type = 'Private';
                        const textContent = item.innerText.toLowerCase();
                        if (textContent.includes('iit')) type = 'IIT';
                        else if (textContent.includes('nit')) type = 'NIT';
                        else if (textContent.includes('iiit')) type = 'IIIT';
                        else if (textContent.includes('government') || textContent.includes('public')) type = 'GFTI';

                        results.push({ name, city, state, type });
                    }
                });
                return results;
            });

            console.log(`Found ${collegesData.length} colleges on page ${pageNum}`);

            for (const data of collegesData) {
                const cutoffs = generateDummyCutoffs(data.type, data.name);
                const collegeDoc = {
                    name: data.name,
                    location: {
                        city: data.city,
                        state: data.state
                    },
                    type: data.type,
                    cutoff: cutoffs
                };

                await College.findOneAndUpdate(
                    { name: data.name },
                    collegeDoc,
                    { upsert: true, new: true }
                );
                scrapedCount++;
            }

        } catch (error) {
            console.error(`Error scraping page ${pageNum}:`, error.message);
        }
    }

    console.log(`Scraping Complete! Updated/inserted ${scrapedCount} colleges in MongoDB.`);
    await browser.close();
    await mongoose.connection.close();
};

// Helper: Generate realistic looking dummy cutoffs
function generateDummyCutoffs(type, name) {
    const branches = ['Computer Science', 'Electronics & Communication', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering'];
    const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];
    
    let basePercentile = 90;
    if (type === 'IIT') basePercentile = 98;
    else if (type === 'NIT') basePercentile = 96;
    else if (type === 'IIIT') basePercentile = 95;
    else if (type === 'GFTI') basePercentile = 92;
    else basePercentile = 85; 

    const randomFactor = (name.length % 10) / 2; 
    basePercentile -= randomFactor;

    const cutoffs = [];
    branches.forEach((branch, bIdx) => {
        categories.forEach((cat, cIdx) => {
            const branchDrop = bIdx * 1.5; 
            const categoryDrop = cIdx * 4; 
            let closing = basePercentile - branchDrop - categoryDrop;
            if (closing > 99.9) closing = 99.9;
            if (closing < 40) closing = 40;

            cutoffs.push({
                exam: 'JEE Main',
                year: 2024,
                branch,
                category: cat,
                closingPercentile: parseFloat(closing.toFixed(2))
            });
        });
    });
    return cutoffs;
}

scrapeColleges();
