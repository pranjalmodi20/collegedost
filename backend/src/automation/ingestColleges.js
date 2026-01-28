const axios = require('axios');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const pdf = require('pdf-parse');
const mongoose = require('mongoose');
const College = require('../models/College.model');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// URL to a sample list of colleges (CSV preference for reliability)
// In a real scenario, this would be the specific government endpoint.
const COLLEGE_DATA_URL = 'https://raw.githubusercontent.com/shivams27/colleges-india-data/master/colleges.csv'; // Example Open Source List
const TEMP_FILE_PATH = path.join(__dirname, 'temp_colleges_data');

const downloadFile = async (url, outputPath) => {
    console.log(`⬇️ Downloading data from ${url}...`);
    const writer = fs.createWriteStream(outputPath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

const processPDF = async (filePath) => {
    console.log('📄 PDF Detected. Converting to Text/CSV...');
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    
    // Very basic PDF parsing - assumes simple line-based structure
    // Real-world PDF table parsing requires complex libraries like Tabula
    const lines = data.text.split('\n').filter(line => line.trim().length > 5);
    const colleges = lines.map(line => {
        // Simple heuristic: Assume lines starting with a number are records
        return { name: line.trim(), type: 'Unknown' }; 
    });
    return colleges;
};

const processCSV = (filePath) => {
    console.log('📊 CSV Detected. Parsing...');
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
};

const ingestColleges = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }

        console.log('🚀 Starting College Auto-Ingestion...');

        // 1. Download (Attempt)
        let filePath = TEMP_FILE_PATH;
        try {
            await downloadFile(COLLEGE_DATA_URL, TEMP_FILE_PATH);
        } catch (e) {
            console.warn(`⚠️ Could not download from URL (${COLLEGE_DATA_URL}). checking for local file override...`);
            // Check for manual flush file
            if (fs.existsSync(path.join(__dirname, '../../latest_colleges_data.csv'))) {
                filePath = path.join(__dirname, '../../latest_colleges_data.csv');
                console.log('📂 Found local CSV file: latest_colleges_data.csv');
            } else if (fs.existsSync(path.join(__dirname, '../../latest_colleges_data.pdf'))) {
                filePath = path.join(__dirname, '../../latest_colleges_data.pdf');
                console.log('📂 Found local PDF file: latest_colleges_data.pdf');
            } else {
                throw new Error('No data source found. Please upload "latest_colleges_data.csv" to backend folder or fix URL.');
            }
        }

        // 2. Detect Type & Process
        let collegesData = [];
        if (filePath.endsWith('.pdf')) {
            collegesData = await processPDF(filePath);
        } else {
            collegesData = await processCSV(filePath);
        }

        console.log(`✅ Extracted ${collegesData.length} records. Updating Database...`);

        // 3. Upsert to DB
        let updatedCount = 0;
        let newCount = 0;

        for (const row of collegesData) {
            // Map CSV columns to Schema fields
            // Adjust these keys based on the actual CSV headers
            const collegeName = row['College Name'] || row['Name'] || row['institute_name']; 
            const city = row['City'] || row['city'];
            const state = row['State'] || row['state'];
            
            if (!collegeName) continue;

            const existing = await College.findOne({ name: collegeName });
            
            if (existing) {
                // Update basic info if missing
                if (!existing.location.city && city) existing.location.city = city;
                if (!existing.location.state && state) existing.location.state = state;
                await existing.save();
                updatedCount++;
            } else {
                // Create New
                await College.create({
                    name: collegeName,
                    location: {
                        city: city || 'Unknown',
                        state: state || 'Unknown',
                        country: 'India'
                    },
                    type: 'Private', // Default, logic can be improved
                    dataSources: [{ sourceName: 'AutoIngest', fetchedAt: new Date() }]
                });
                newCount++;
            }
        }

        console.log(`🎉 Ingestion Complete: ${newCount} Created, ${updatedCount} Updated.`);
        
        // Cleanup
        if (fs.existsSync(TEMP_FILE_PATH)) fs.unlinkSync(TEMP_FILE_PATH);

    } catch (error) {
        console.error('❌ College Ingestion Failed:', error);
    }
};

module.exports = { ingestColleges };

// Auto-run if called directly
if (require.main === module) {
    ingestColleges().then(() => process.exit(0));
}
