const fs = require('fs');
const pdf = require('pdf-parse');
const College = require('../../models/College.model');
const NirfRanking = require('../../models/NirfRanking.model');
const { findBestMatch } = require('./ingestion.utils');

const parseNirfPdf = async (filePath, year, category, logEntry) => {
  const dataBuffer = fs.readFileSync(filePath);
  
  try {
    const data = await pdf(dataBuffer);
    // data.text contains all text
    const lines = data.text.split('\n').map(l => l.trim()).filter(l => l.length > 5);
    
    // Very Basic Header Detection
    // Real NIRF PDFs map: Rank | Institute ID | Name | City | State | Score
    
    // We assume the PDF text extraction preserves line order.
    // Regex for typical line: "^(\d+)\s+([A-Za-z0-9\-]+)\s+(.+?)\s+([A-Za-z]+)\s+([A-Za-z]+)\s+(\d+\.?\d*)$"
    // But table columns often get jumbled in raw text.
    // Robust approach: Look for lines that end with a number (Score) and start with a number (Rank).
    
    const candidates = await College.find({}, 'name aliases ingestionMetadata').lean();
    let stats = { processed: 0, matched: 0, inserted: 0 };
    
    for (const line of lines) {
       // Heuristic: "1  IR-E-u-0456  Indian Institute of Technology Madras  Chennai  Tamil Nadu  89.93"
       // Regex to capture: Rank (Start), Name (Middle), Score (End)
       const rankMatch = line.match(/^(\d+)\s+/);
       const scoreMatch = line.match(/\s+(\d{1,3}\.\d{2})$/);
       
       if (rankMatch && scoreMatch) {
         const rank = parseInt(rankMatch[1], 10);
         const score = parseFloat(scoreMatch[1]);
         
         // Extract Name: Anything between ID and City? Hard to know City.
         // Let's assume the longest string of text in the middle is the Name + City + State.
         // We'll try to match the whole middle chunk against our DB.
         // Remove Rank and Score
         let middle = line.replace(/^(\d+)\s+/, '').replace(/\s+(\d{1,3}\.\d{2})$/, '');
         
         // Remove potential Institute ID (e.g. IR-E-U-0456) keys
         middle = middle.replace(/IR-[A-Za-z]-[A-Za-z]-\d+\s+/, '');
         
         // Now 'middle' might be "Indian Institute of Technology Madras Chennai Tamil Nadu"
         // This is noisy. But fuzzy match might still work if the name is distinct.
         
         const match = findBestMatch(middle, candidates, 0.7); // Lower threshold due to noise
         
         if (match) {
             stats.matched++;
             await NirfRanking.findOneAndUpdate(
               { collegeSlug: match.college.slug, category, year },
               {
                 rank,
                 score,
                 instituteName: match.college.name, // Use ours
                 source: 'NIRF_PDF_AUTO'
               },
               { upsert: true, new: true }
             );
             
             // Update College Metadata
             await College.updateOne({ _id: match.college._id }, {
               $set: { "ingestionMetadata.nirfId": "LINKED" }, // We don't have exact ID from check
               $push: { 
                 rankings: {
                   source: "NIRF",
                   year,
                   rank,
                   category,
                   score
                 }
               }
             });
             stats.inserted++;
         } else {
             // Log unknown
         }
         stats.processed++;
       }
    }
    
    logEntry.stats.matched = stats.matched;
    logEntry.status = 'COMPLETED';
    await logEntry.save();
    
    return stats;

  } catch (error) {
    throw error;
  }
};

module.exports = { parseNirfPdf };
