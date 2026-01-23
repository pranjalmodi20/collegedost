const mongoose = require('mongoose');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const College = require('../src/models/College.model');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });
puppeteer.use(StealthPlugin());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/career360_clone';
const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)){
    fs.mkdirSync(DATA_DIR);
}
const LOCAL_DATA_PATH = path.join(DATA_DIR, 'master_colleges_dump.json');

// --- CONFIGURATION ---

// 1. Government Colleges (CollegePravesh)
const CP_COLLEGE_TYPES = [
    { url: 'https://www.collegepravesh.com/engineering-colleges/nit/', type: 'NIT' },
    { url: 'https://www.collegepravesh.com/engineering-colleges/iit/', type: 'IIT' },
    { url: 'https://www.collegepravesh.com/engineering-colleges/iiit/', type: 'IIIT' },
    { url: 'https://www.collegepravesh.com/engineering-colleges/gfti/', type: 'GFTI' },
    { url: 'https://www.collegepravesh.com/engineering-colleges/pec/', type: 'PEC' },
    { url: 'https://www.collegepravesh.com/engineering-colleges/bit/', type: 'BIT' },
    { url: 'https://www.collegepravesh.com/engineering-colleges/university/', type: 'University' },
    // Lists used by CollegePravesh logic
];

// 2. Private Colleges (Careers360) mass scrape
const C360_PRIVATE_LIST_URL_TEMPLATE = 'https://engineering.careers360.com/colleges/list-of-engineering-colleges-in-india?ownership=2&stream=1&sort_by=1&page=';
const C360_TARGET_PAGES = 10; // Top 300 private colleges

let isDbConnected = false;

// --- DATABASE ---
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected...');
        isDbConnected = true;
    } catch (err) {
        console.log('MongoDB Connection Failed (Offline Mode).');
        isDbConnected = false;
    }
};

// --- SCRAPING FUNCTIONS ---

const scrapeCollegePravesh = async (page) => {
    console.log('\n\n========== STARTED: CollegePravesh Scraper (Government & Listed) ==========');
    let collectedData = [];

    for (const typeInfo of CP_COLLEGE_TYPES) {
        console.log(`\n=== CP Processing ${typeInfo.type} from ${typeInfo.url} ===`);
        
        let currentUrl = typeInfo.url;
        let hasNextPage = true;
        let pageNum = 1;
        let colleges = [];

        // 1. Gather Links with Pagination
        while (hasNextPage) {
            console.log(`--- Page ${pageNum} : ${currentUrl} ---`);
            try {
                await page.goto(currentUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
                
                const pageColleges = await page.evaluate((type) => {
                    const links = [];
                    const allAnchors = Array.from(document.querySelectorAll('a'));
                    allAnchors.forEach(a => {
                        const href = a.href;
                        const text = a.innerText.trim();
                        if (href && href.includes('/engineering-colleges/') && text) {
                            // Basic filtering
                            const isTypeMatch = (type === 'NIT' && href.includes('/nit-')) ||
                                                (type === 'IIT' && href.includes('/iit-')) ||
                                                (type === 'IIIT' && href.includes('/iiit-')) ||
                                                (type === 'GFTI' && (href.includes('/gfti-') || href.includes('/pec-') || href.includes('/bit-') || href.includes('/university-'))) ||
                                                (type === 'Private'); 
                            
                            const isIndexPage = href.endsWith('/engineering-colleges/') || href.includes('/page/') || href.endsWith('/nit/') || href.endsWith('/iit/') || href.endsWith('/iiit/') || href.endsWith('/gfti/');

                            if (!isIndexPage && isTypeMatch) {
                                links.push({ name: text, url: href, type: type });
                            }
                        }
                    });
                    return links;
                }, typeInfo.type);
                
                colleges = [...colleges, ...pageColleges];
                
                const nextUrl = await page.evaluate(() => {
                    const nextBtn = document.querySelector('#cp-next-page a');
                    return nextBtn ? nextBtn.href : null;
                });

                if (nextUrl && nextUrl !== currentUrl) {
                    currentUrl = nextUrl;
                    pageNum++;
                } else {
                    hasNextPage = false;
                }
            } catch (e) {
                console.error(`CP Error fetching page ${pageNum} for ${typeInfo.type}:`, e.message);
                hasNextPage = false;
            }
        }
        
        // Dedup
        colleges = colleges.filter((v,i,a)=>a.findIndex(t=>(t.url===v.url))===i);
        console.log(`CP Found Total ${colleges.length} ${typeInfo.type}s.`);

        // 2. Scrape Each College
        for (const college of colleges) {
            try {
                const slug = college.url.split('engineering-colleges/')[1].replace('/', '');
                let cutoffUrl = `https://www.collegepravesh.com/cutoff/${slug}-cutoff-2024/`;
                // console.log(`CP Scraping ${college.name}`);
                
                let response = await page.goto(cutoffUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => null);
                if (!response || response.status() === 404) {
                     cutoffUrl = `https://www.collegepravesh.com/cutoff/${slug}-cutoff-2023/`;
                     response = await page.goto(cutoffUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => null);
                     if (!response || response.status() === 404) continue;
                }
        
                // Extract Data
                const collegeCutoffs = await page.evaluate(() => {
                    const results = [];
                    const cats = [
                        { code: 'op', name: 'General' }, { code: 'ew', name: 'EWS' },
                        { code: 'bc', name: 'OBC' }, { code: 'sc', name: 'SC' }, { code: 'st', name: 'ST' }
                    ];
                    const pools = [{ code: 'gn', name: 'Gender-Neutral' }, { code: 'fo', name: 'Female-Only' }];

                    cats.forEach(cat => {
                        pools.forEach(pool => {
                            const container = document.getElementById(`${cat.code}-${pool.code}`);
                            if (!container) return;
                            const panes = container.querySelectorAll('.pane');
                            if (panes.length === 0) return;
                            const lastPane = panes[panes.length - 1]; 
                            const table = lastPane.querySelector('table.numeric-table');
                            if (!table) return;

                            const rows = table.querySelectorAll('tbody tr');
                            rows.forEach(row => {
                                const cells = row.querySelectorAll('td');
                                if (cells.length < 3 || row.innerText.includes('Opening')) return;
                                
                                let branchIdx = 0; let closeIdx = 2; let openIdx = 1;
                                if (cells.length >= 4) { branchIdx = 1; openIdx = 2; closeIdx = 3; }

                                const branch = cells[branchIdx]?.innerText.trim();
                                const closeText = cells[closeIdx]?.innerText.replace(/[^0-9]/g, '');
                                const openText = cells[openIdx]?.innerText.replace(/[^0-9]/g, '');

                                if (branch && closeText) {
                                    let quota = 'AI';
                                    if (cells.length >= 4) quota = cells[0].innerText.trim();

                                    results.push({
                                        exam: 'JEE Main/Adv',
                                        year: 2024,
                                        branch: branch,
                                        category: `${cat.name} - ${pool.name} ${quota !== 'AI' ? '('+quota+')' : ''}`, 
                                        closing: parseInt(closeText),
                                        opening: parseInt(openText) || 0
                                    });
                                }
                            });
                        });
                    });
                    return results;
                });

                if (collegeCutoffs.length > 0) {
                    const collegeData = { name: college.name, type: college.type, cutoff: collegeCutoffs, lastUpdated: new Date() };
                    collectedData.push(collegeData);
                    if (isDbConnected) {
                        await College.findOneAndUpdate({ name: college.name }, collegeData, { upsert: true });
                        process.stdout.write('.'); // Progress dot
                    }
                }

            } catch (err) { }
        }
    }
    console.log(`\nCP Scraper Finished. Collected ${collectedData.length} colleges.`);
    return collectedData;
};

const scrapeCareers360 = async (page) => {
    console.log('\n\n========== STARTED: Careers360 Scraper (Mass Private Colleges) ==========');
    let collectedData = [];

    // Explicitly Requested Universites to ENSURE they are scraped
    // (Added to the front of the list)
    const PRIORITY_COLLEGES = [
        { name: 'Amity University Noida', url: 'https://www.careers360.com/university/amity-university-noida' },
        { name: 'SRM Institute of Science and Technology', url: 'https://www.careers360.com/university/srm-institute-of-science-and-technology-chennai' },
        { name: 'Manipal Institute of Technology', url: 'https://www.careers360.com/colleges/manipal-institute-of-technology-manipal' },
        { name: 'Poornima University', url: 'https://www.careers360.com/university/poornima-university-jaipur' },
        { name: 'Jaypee Institute of Information Technology', url: 'https://www.careers360.com/university/jaypee-institute-of-information-technology-noida' }
    ];

    // Process Priority List First
    for (const college of PRIORITY_COLLEGES) {
        await processCareers360College(page, college, collectedData);
    }

    // Process Mass List
    for (let pageNum = 1; pageNum <= C360_TARGET_PAGES; pageNum++) {
        const listUrl = `${C360_PRIVATE_LIST_URL_TEMPLATE}${pageNum}`;
        console.log(`\n--- C360 List Page ${pageNum}/${C360_TARGET_PAGES} ---`);
        
        try {
            await page.goto(listUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
            
            const collegeLinks = await page.evaluate(() => {
                const links = [];
                const anchors = Array.from(document.querySelectorAll('a'));
                anchors.forEach(a => {
                    const href = a.href;
                    if (
                        (href.includes('/colleges/') || href.includes('/university/')) &&
                        !href.includes('/reviews') && !href.includes('/admission') &&
                        !href.includes('/courses') && !href.includes('/facilities') &&
                        !href.includes('engineering.careers360.com')
                    ) {
                       const cleanUrl = href.split('?')[0];
                       const name = a.innerText.trim();
                       if (name && name.length > 5 && links.findIndex(l => l.url === cleanUrl) === -1) {
                           links.push({ name: name, url: cleanUrl });
                       }
                    }
                });
                return links.slice(0, 40);
            });
            
            console.log(`  Found ${collegeLinks.length} college links.`);

            for (const college of collegeLinks) {
                // Skip if already in priority list (dedup)
                if (PRIORITY_COLLEGES.some(pc => pc.url === college.url)) continue;
                await processCareers360College(page, college, collectedData);
            }

        } catch (e) {
            console.error(`Page ${pageNum} failed: ${e.message}`);
        }
    }
    console.log(`\nC360 Scraper Finished. Collected ${collectedData.length} colleges.`);
    return collectedData;
};

// Helper function to process a single college URL
async function processCareers360College(page, college, collectedData) {
    let cutoffUrl = `${college.url}/cut-off`;
    console.log(`  Scraping ${college.name}...`);
    try {
        await page.goto(cutoffUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        
        const cutoffs = await page.evaluate((collegeName) => {
            const results = [];
            const tables = document.querySelectorAll('table');
            tables.forEach(table => {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 3) {
                        const branch = cells[0].innerText.trim();
                        // Heuristic: Check for Rank or Percentile
                        // Often format: Branch | Closing Rank
                        // OR: Branch | Category | Opening | Closing
                        
                        // We iterate all cells to find a number.
                        // Priority: Last column is often Closing.
                        for (let i = cells.length - 1; i >= 1; i--) {
                            const txt = cells[i].innerText.trim();
                            
                            // Regex for Rank (digits usually > 100) OR Percentile (XX.XX)
                            // Allow: 12345, 98.45, 12,345
                            const match = txt.match(/([0-9,.]+)/);
                            
                            if (match) {
                                let valStr = match[1].replace(/,/g, '');
                                let val = parseFloat(valStr);
                                
                                // Validation: 
                                // If < 100, might be percentile.
                                // If > 100, might be rank.
                                // Valid Cutoff?
                                if (!isNaN(val) && val > 0) {
                                    
                                    // Try to determine Exam from table header if possible (not easy here)
                                    // Default to generic
                                    let type = (val <= 100) ? 'Percentile' : 'Rank';
                                    
                                    results.push({
                                        exam: `JEE/Uni (${type})`, 
                                        branch: branch,
                                        category: 'General', 
                                        closing: val,
                                        opening: val, // Assume same if single value
                                        year: 2024
                                    });
                                    break;
                                }
                            }
                        }
                    }
                });
            });
            return results;
        }, college.name);

        if (cutoffs.length > 0) {
            const collegeData = {
                name: college.name,
                type: 'Private',
                cutoff: cutoffs,
                lastUpdated: new Date()
            };
            collectedData.push(collegeData);
            if (isDbConnected) {
                await College.findOneAndUpdate({ name: college.name }, collegeData, { upsert: true });
                process.stdout.write('+'); 
            }
        } else {
             // console.log(`    -> No data for ${college.name}`);
        }

    } catch (err) {
        // console.error(`    -> Error: ${err.message}`);
    }
}

// 3. Global Colleges Scraper (CWUR)
const scrapeGlobalColleges = async (page) => {
    console.log('\n\n========== STARTED: Global College Scraper (CWUR) ==========');
    
    // Try 2025, if fails try 2024
    let targetUrl = 'https://cwur.org/2025.php';
    console.log(`Navigating to ${targetUrl}...`);
    
    let response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (!response || response.status() === 404) {
        console.log('2025 rankings not found, trying 2024...');
        targetUrl = 'https://cwur.org/2024.php';
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    }

    console.log('Page loaded. Extracting data...');

    // Extract Data
    const colleges = await page.evaluate(() => {
        const results = [];
        const rows = document.querySelectorAll('table#cwurTable tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 4) return;

            const rankText = cells[0].innerText.trim();
            const rank = parseInt(rankText);
            const nameCell = cells[1];
            const name = nameCell.innerText.trim();
            const country = cells[2].innerText.trim();
            const scoreText = cells[cells.length - 1].innerText.trim();
            const score = parseFloat(scoreText);

            if (name && !isNaN(rank)) {
                results.push({
                    name: name,
                    rank: rank,
                    country: country,
                    score: score || 0,
                    year: 2025
                });
            }
        });
        return results;
    });

    console.log(`Global: Found ${colleges.length} colleges.`);

    const collectedData = [];

    for (const college of colleges) {
        const collegeData = {
            name: college.name,
            type: 'International',
            location: {
                country: college.country,
                city: '', 
                state: ''
            },
            rank: college.rank,
            nirfRank: null, 
            cutoff: [],
            lastUpdated: new Date()
        };

        collectedData.push(collegeData);
        if (isDbConnected) {
             process.stdout.write('.');
            await College.findOneAndUpdate(
                { name: college.name }, 
                collegeData, 
                { upsert: true }
            );
        }
    }
    
    return collectedData;
};

// --- MAIN EXECUTION ---
const run = async () => {
    await connectDB();
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });

    // 1. Run CP Scraper
    const cpData = await scrapeCollegePravesh(page);

    // 2. Run C360 Scraper
    const c360Data = await scrapeCareers360(page);

    // 3. Run Global Scraper
    const globalData = await scrapeGlobalColleges(page);

    // Merge and Save Local Dump (All in One)
    const allData = [...cpData, ...c360Data, ...globalData];
    try {
        fs.writeFileSync(LOCAL_DATA_PATH, JSON.stringify(allData, null, 2));
        console.log(`\n\nMASTER SUCCESS: Saved TOTAL ${allData.length} colleges (Indian + Global) to ${LOCAL_DATA_PATH}`);
    } catch(err) {
        console.error("Failed to write local file:", err);
    }

    await browser.close();
    if(isDbConnected) await mongoose.connection.close();
};

run();
