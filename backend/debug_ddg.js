const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Test Query
    const query = 'site:shiksha.com IIT Bombay courses fees';
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    const links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a.result__a'));
        return anchors.map(a => a.href);
    });
    
    console.log('Found Links:', links);
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (links.length === 0) {
        console.log("BODY PREVIEW:", bodyText.substring(0, 500));
    }
    
    await browser.close();
})();
