const fs = require('fs');
const path = require('path');

const dir = './src';
const HARDCODED_URL = 'http://localhost:5001';
const REPLACEMENT_LOGIC = "${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}";

function walk(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Pattern 1: Inside backticks (template literals)
    // matches: `... http://localhost:5001 ...`
    // We replace http://localhost:5001 with ${...}
    // We have to be careful not to double replace significantly.
    
    // Regex for http://localhost:5001 inside backticks? Hard to parse safely with regex.
    // Simpler: Just replace proper substrings.
    
    // Case A: http://localhost:5001 (without quotes around it - rare in JS usually inside string)
    // Case B: 'http://localhost:5001...' (single quotes)
    // Case C: "http://localhost:5001..." (double quotes)
    // Case D: `http://localhost:5001...` (backticks)

    // Strategy:
    // 1. Replace usages inside template literals first (Case D logic)
    // Since we are replacing with ${...}, we need to make sure we are inside backticks.
    
    // Actually, simpler strategy:
    // If we find 'http://localhost:5001/api...', replace with `timestamp_variable` logic? No.
    
    // Let's do this:
    // 1. Find 'http://localhost:5001...' and "http://localhost:5001..." -> Convert to backticks and inject var.
    // 2. Find `http://localhost:5001...` -> Inject var (replace substring).

    // Handle Single Quotes
    content = content.replace(/'http:\/\/localhost:5001([^']*)'/g, (match, suffix) => {
        return "`" + REPLACEMENT_LOGIC + suffix + "`";
    });

    // Handle Double Quotes
    content = content.replace(/"http:\/\/localhost:5001([^"]*)"/g, (match, suffix) => {
        return "`" + REPLACEMENT_LOGIC + suffix + "`";
    });

    // Handle Backticks
    // Note: If we already converted quotes to backticks, this regex might match them again if we aren't careful? 
    // No, REPLACEMENT_LOGIC starts with $, not http.
    // So we just look for literal http://localhost:5001 inside backticks.
    // Since we can't easily know if we are inside backticks with global regex, we assume any remaining http://localhost:5001 is inside backticks OR needs to be wrapped?
    // Wait, typical code: `http://localhost:5001/api/${slug}`
    // If I use replace matches, i can fix it.

    content = content.replace(/http:\/\/localhost:5001/g, (match, offset, string) => {
         // Check if this instance was already replaced (starts with $)
         // But I am iterating.
         // Let's check if it is preceded by ' or " or `
         // Actually, the previous replaces handled ' and ".
         // So now we are likely looking at unquoted (rare) or inside backticks.
         
         const prefix = string.substring(offset - 1, offset);
         // If prefix is `, then we are inside backticks (start).
         // If prefix is anything else, we might be in middle of backticks.
         
         // If we see it inside backticks, we just replace with the logic.
         // BUT we must NOT add backticks around it.
         
         // Let's try to be safe.
         // The previous replaces handled the full string conversion.
         // So if I have `http://localhost:5001/api/foo`, it is still `http://localhost:5001/api/foo`.
         // I want it to be `${...}/api/foo`.
         
         // We'll skip if it matches the REPLACEMENT_LOGIC pattern (which contains the string).
         if (string.substring(offset - 25, offset).includes('VITE_API_BASE_URL')) return match; 
         // If preceeded by ', ", ignore (handled above? or skipped?)
         // If preceeded by `, we replace with REPLACEMENT_LOGIC (no backticks).
         
         return REPLACEMENT_LOGIC;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

walk(dir);
