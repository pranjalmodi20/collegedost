const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Example: IIT Bombay on Shiksha
    const url = 'https://www.shiksha.com/college/iit-bombay-indian-institute-of-technology-mumbai-54212/courses-fees';
    
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    // Screenshot to see what we got (for debugging if needed, but we'll specificly log info)
    // await page.screenshot({ path: 'shiksha_debug.png' });

    const debugInfo = await page.evaluate(() => {
        const textNodes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walker.nextNode()) {
            if (node.textContent.includes("Tuition Fee")) {
                 textNodes.push({
                     text: node.textContent.trim(),
                     parentTag: node.parentElement.tagName,
                     parentClasses: node.parentElement.className
                 });
            }
        }
        return textNodes;
    });
    
    console.log('Debug Info:', JSON.stringify(debugInfo, null, 2));

    // Also get all classes on body to see if it's a mobile view or something
    const bodyClass = await page.evaluate(() => document.body.className);
    console.log('Body Classes:', bodyClass);

    
    await browser.close();
})();
