const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
// Using puppeteer-extra for better reliability while keeping user logic
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const College = require('../models/College.model');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const BASE_URL = 'https://www.careers360.com/colleges/india-colleges-fctp';
const JSON_OUTPUT_FILE = path.join(__dirname, 'careers360_data.json');

(async () => {
    console.log("Starting Scraper...");
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();

    let allColleges = [];
    let pageNum = 1;
    let hasNextPage = true;
    let consecutiveErrors = 0;
    const MAX_RETRIES = 3;

    while (hasNextPage) {
        try {
            const url = pageNum === 1 
                ? BASE_URL 
                : `${BASE_URL}?page=${pageNum}`;
            
            console.log(`Fetching page ${pageNum}...`);
            
            await page.goto(url, { 
                waitUntil: 'domcontentloaded', // Slightly faster than networkidle2
                timeout: 60000 
            });
            
            // Allow some time for hydration
            await new Promise(r => setTimeout(r, 2000));

            const pageData = await page.evaluate(() => {
                const cards = document.querySelectorAll('div.card_block[data-test-id="college-listing-tuple"]');
                
                const extractCollegeData = (card) => {
                    const nameEl = card.querySelector('h3');
                    const name = nameEl ? nameEl.innerText.trim() : null;
                    
                    const linkEl = card.querySelector('h3 a');
                    const url = linkEl ? linkEl.href : null;
                    
                    const allText = card.innerText;
                    
                    const ownershipMatch = allText.match(/Ownership:\s*([^\n]+)/);
                    const ownership = ownershipMatch ? ownershipMatch[1].trim() : null;
                    
                    // Improved location parsing to handle messy newlines
                    const lines = allText.split('\n').map(l => l.trim()).filter(Boolean);
                    const locationLine = lines.find(l => {
                        return l.includes(',') && (
                            l.match(/,\s*[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/) ||
                            l.includes('Tamil Nadu') || l.includes('Karnataka') || 
                            l.includes('Maharashtra') || l.includes('Delhi') ||
                            l.includes('Rajasthan') || l.includes('Gujarat') ||
                            l.includes('West Bengal') || l.includes('Uttar Pradesh') ||
                            l.includes('Andhra Pradesh') || l.includes('Telangana') ||
                            l.includes('Punjab') || l.includes('Haryana') ||
                            l.includes('Madhya Pradesh') || l.includes('Bihar') ||
                            l.includes('Odisha') || l.includes('Assam') ||
                            l.includes('Jharkhand') || l.includes('Chhattisgarh') ||
                            l.includes('Himachal Pradesh') || l.includes('Uttarakhand') ||
                            l.includes('Goa') || l.includes('Kerala')
                        );
                    });
                    const location = locationLine || null;
                    
                    const ratingMatch = allText.match(/Rating:\s*([^\n]+)/);
                    const rating = ratingMatch ? ratingMatch[1].trim() : null;
                    
                    const courseEls = card.querySelectorAll('a[href*="/course"]');
                    const courses = Array.from(courseEls)
                        .map(el => el.innerText.trim())
                        .filter(text => text && text !== 'Courses' && !text.includes('Brochure'))
                        .filter((value, index, self) => self.indexOf(value) === index);
                    
                    const feeMatch = allText.match(/Fees\s*:\s*([^\n]+)/i);
                    const fees = feeMatch ? feeMatch[1].trim() : null;
                    
                    return { name, url, ownership, location, rating, courses, fees };
                };

                const colleges = Array.from(cards)
                    .map(extractCollegeData)
                    .filter(college => college.name !== null);

                const paginationLinks = Array.from(document.querySelectorAll('a[href*="page="]'));
                const nextLink = paginationLinks.find(a => {
                    const text = a.innerText.trim();
                    return text === 'Next' || text.includes('Next') || text === '>';
                });
                const hasNext = nextLink !== undefined;

                return { colleges, hasNext };
            });

            if (pageData.colleges.length === 0) {
                console.log('No colleges found on this page. Stopping.');
                hasNextPage = false;
                break;
            }

            allColleges.push(...pageData.colleges);
            console.log(`  ✓ Scraped ${pageData.colleges.length} colleges (Total: ${allColleges.length})`);

            hasNextPage = pageData.hasNext;
            consecutiveErrors = 0;

            if (!hasNextPage) {
                console.log('Reached last page.');
                break;
            }

            pageNum++;

            await new Promise(r => setTimeout(r, 1000));

        } catch (error) {
            consecutiveErrors++;
            console.error(`Error on page ${pageNum}:`, error.message);
            
            if (consecutiveErrors >= MAX_RETRIES) {
                console.error(`Too many consecutive errors (${consecutiveErrors}). Stopping.`);
                break;
            }
            
            console.log(`Retrying page ${pageNum}... (Attempt ${consecutiveErrors}/${MAX_RETRIES})`);
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    await browser.close();

    const output = {
        totalColleges: allColleges.length,
        scrapedAt: new Date().toISOString(),
        colleges: allColleges
    };

    fs.writeFileSync(JSON_OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`\nDone! Scraped ${allColleges.length} colleges total.`);
    console.log(`Data saved to ${JSON_OUTPUT_FILE}`);

    // --- DB INGESTION LOGIC ---
    try {
        console.log('\n--- Starting Database Ingestion ---');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        let savedCount = 0;
        for (const col of allColleges) {
            // Basic parsing of location for state/city if possible, else store full string
            let state = null;
            let city = null;
            if (col.location) {
                const parts = col.location.split(',').map(s => s.trim());
                if (parts.length > 1) {
                    state = parts[parts.length - 1]; // Naive assumption: last part is state
                    city = parts[0];
                }
            }

            // Parse Fees
            let feeAmount = 0;
            if (col.fees) {
                const match = col.fees.replace(/,/g, '').match(/(\d+)/);
                if (match) feeAmount = parseInt(match[1]);
            }

            // Parse Streams from courses roughly
            const streams = new Set();
            col.courses.forEach(c => {
                const ln = c.toLowerCase();
                if (ln.includes('tech') || ln.includes('eng')) streams.add('Engineering');
                if (ln.includes('medical') || ln.includes('mbbs')) streams.add('Medical');
                if (ln.includes('manager') || ln.includes('mba')) streams.add('Management');
                if (ln.includes('arts') || ln.includes('ba')) streams.add('Arts');
                if (ln.includes('science') || ln.includes('bsc')) streams.add('Science');
            });

             // Generates slug from name
            const slug = col.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            await College.findOneAndUpdate(
                { 
                    $or: [
                        { name: col.name },
                        { slug: slug }
                    ]
                },
                {
                    $set: {
                        name: col.name,
                        slug: slug,
                        type: col.ownership || 'Private',
                        'location.address': col.location,
                        'location.city': city,
                        'location.state': state,
                        'location.country': 'India',
                        website: col.url,
                        streams: Array.from(streams),
                        coursesOffered: col.courses.map(c => ({
                            courseName: c,
                            fee: feeAmount,
                            duration: "Check Website",
                            eligibility: "Check Website"
                        })),
                        ingestionMetadata: {
                            lastEnrichedAt: new Date()
                        }
                    }
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            savedCount++;
            if (savedCount % 10 === 0) process.stdout.write('.');
        }
        console.log(`\nSuccessfully ingested ${savedCount} colleges into MongoDB.`);

    } catch (ingestErr) {
        console.error("Ingestion Error:", ingestErr);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }

})();