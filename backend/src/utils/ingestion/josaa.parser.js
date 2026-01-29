const fs = require('fs');
const pdf = require('pdf-parse');
const College = require('../../models/College.model');
const Fee = require('../../models/Fee.model');
const { findBestMatch } = require('./ingestion.utils');

const parseJosaaFeePdf = async (filePath, year, logEntry) => {
  const dataBuffer = fs.readFileSync(filePath);
  
  try {
    const data = await pdf(dataBuffer);
    const lines = data.text.split('\n').map(l => l.trim()).filter(l => l.length > 5);
    
    // Fee PDFs usually list Institute Name and then Total Fee.
    // Logic: Look for lines containing "Indian Institute of Technology" or "National Institute of Technology"
    // And a currency amount (e.g. "1,25,000" or "62500")
    
    // Heuristic:
    // If a line matches a College Name -> Set currentContextCollege
    // If a line has a Number -> Check if it looks like a fee ( > 10000 )
    
    const candidates = await College.find({}, 'name aliases ingestionMetadata').lean();
    let currentCollege = null;
    let stats = { feesAdded: 0 };
    
    for (const line of lines) {
       // Check for Institute Name Change
       if (line.includes("Indian Institute") || line.includes("National Institute")) {
          const match = findBestMatch(line, candidates, 0.85);
          if (match) {
            currentCollege = match.college;
            continue;
          }
       }
       
       if (currentCollege) {
          // Look for Fee Amount
          // Regex for currency: 1,00,000 or 100000
          const moneyMatch = line.match(/(\d{1,3}(,\d{3})*)/);
          if (moneyMatch) {
             const amountStr = moneyMatch[0].replace(/,/g, '');
             const amount = parseInt(amountStr, 10);
             
             if (amount > 10000) { // Safety threshold to avoid parsing Page Numbers or Years
                // Detect Category? "SC/ST: 0", "Gen: 100000"
                let category = "General";
                if (line.toLowerCase().includes("sc/st") || line.toLowerCase().includes("exempt")) category = "SC/ST";
                
                await Fee.create({
                  college: currentCollege._id,
                  year,
                  amount,
                  category,
                  courseName: "B.Tech", // Default for JoSAA usually
                  sourceDocument: "JoSAA_AUTO"
                });
                stats.feesAdded++;
             }
          }
       }
    }
    
    logEntry.stats.created = stats.feesAdded;
    logEntry.status = 'COMPLETED';
    await logEntry.save();
    
    return stats;

  } catch (error) {
    throw error;
  }
};

module.exports = { parseJosaaFeePdf };
