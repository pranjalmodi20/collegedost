/**
 * ingest_aishe.js
 * 
 * Ingestion script for INDIA (AISHE Data).
 * Supports CSV converted from AISHE Portal Excel.
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const slugify = require('slugify'); // Requires slugify
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Error Logging
function log(msg) {
    const logFile = path.join(__dirname, 'ingest_aishe_debug.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
    console.log(msg);
}

process.on('uncaughtException', (err) => {
    log(`UNCAUGHT EXCEPTION: ${err.message}\n${err.stack}`);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    log(`UNHANDLED REJECTION: ${reason}`);
    process.exit(1);
});

const College = require('../src/models/College.model');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collegedost';
const BATCH_SIZE = 100;

async function connectDB() {
    try {
        log(`Connecting to MongoDB...`);
        await mongoose.connect(MONGO_URI);
        log("✅ MongoDB Connected");
    } catch (err) {
        log(`❌ DB Connection Error: ${err.message}`);
        process.exit(1);
    }
}

function toTitleCase(str) {
    if (!str) return "";
    return str.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ').trim();
}

async function ingestIndiaData(filePath) {
    log(`🚀 Starting India Ingestion from: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let headers = [];
    let batch = [];
    let lineCount = 0;
    let savedCount = 0;

    for await (const line of rl) {
        if (!line.trim()) continue; 

        // CSV Regex Split (Handling content with commas)
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, '').trim());

        // Header Auto-Detection
        if (headers.length === 0) {
            // Remove BOM
            if (values[0] && values[0].charCodeAt(0) === 0xFEFF) values[0] = values[0].substring(1);
            
            const potentialHeaders = values.map(h => h.trim().toUpperCase());
            
            // Check if this row looks like a header (contains key terms)
            if (potentialHeaders.includes('AISHE CODE') || potentialHeaders.includes('AISHECODE') || potentialHeaders.includes('ID') || potentialHeaders.includes('NAME')) {
                headers = potentialHeaders;
                log(`✅ Headers found: ${headers.join(', ')}`);
            } else {
                // log(`Skipping preamble row: ${values[0]}`);
            }
            continue;
        }

        const row = {};
        headers.forEach((h, i) => row[h] = values[i]);

        // AISHE Typical Columns: "COLLEGE NAME", "STATE NAME", "DISTRICT NAME", "MANAGEMENT", "AISHE CODE"
        // Adjust these keys based on the actual CSV headers you see in log
        const name = row['COLLEGE NAME'] || row['NAME'] || row['INSTITUTION NAME'];
        
        if (!name) continue;

        const collegeData = {
            name: toTitleCase(name),
            location: {
                city: toTitleCase(row['DISTRICT NAME'] || row['CITY'] || ''),
                state: toTitleCase(row['STATE NAME'] || row['STATE'] || ''),
                country: 'India',
                address: toTitleCase(row['ADDRESS'] || '')
            },
            type: (row['MANAGEMENT'] && row['MANAGEMENT'].toLowerCase().includes('govt')) ? 'Government' : 'Private',
            dataSources: [{
                sourceName: 'AISHE_RAW',
                sourceId: row['AISHE CODE'] || row['ID'],
                fetchedAt: new Date()
            }],
            fees: { currency: 'INR' }
        };

        // Generate Slug
        const slugBase = slugify(collegeData.name, { lower: true, strict: true });
        collegeData.slug = `${slugBase}-${row['AISHE CODE'] || Math.floor(Math.random()*100000)}`;

        batch.push({
            updateOne: {
                filter: { 
                    name: collegeData.name, 
                    "location.country": "India", 
                    "location.state": collegeData.location.state 
                },
                update: { $set: collegeData },
                upsert: true
            }
        });

        if (batch.length >= BATCH_SIZE) {
            await College.bulkWrite(batch);
            savedCount += batch.length;
            if (savedCount % 1000 === 0) log(`Processed: ${savedCount} Indian colleges...`);
            batch = [];
        }
        lineCount++;
    }

    if (batch.length > 0) {
        await College.bulkWrite(batch);
        savedCount += batch.length;
    }

    log(`\n✨ Ingestion Complete! Total Indian Colleges: ${savedCount}`);
}

async function main() {
    log("Script Initialization...");
    await connectDB();

    // Auto-detect ANY file with 'aishe' in name
    const rawDir = path.join(__dirname, '../data/raw');
    let targetFile = null;
    
    if (fs.existsSync(rawDir)) {
        const files = fs.readdirSync(rawDir).filter(f => f.toLowerCase().includes('aishe') && f.endsWith('.csv'));
        if (files.length > 0) targetFile = path.join(rawDir, files[0]);
    }

    if (!targetFile) {
        // Fallback argument check
        const args = process.argv.slice(2);
        const fileArg = args.find(a => a.startsWith('--file='));
        if (fileArg) targetFile = fileArg.split('=')[1];
    }
    
    if (!targetFile) {
        log("❌ No AISHE CSV file found. Please name your file 'aishe_something.csv' in data/raw.");
        process.exit(1);
    }

    try {
        await ingestIndiaData(targetFile);
    } catch (error) {
        log(`FATAL SCRIPT ERROR: ${error.stack}`);
    }
    log("Exiting...");
    process.exit(0);
}

main();
