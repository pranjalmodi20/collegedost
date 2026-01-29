const fs = require('fs');
const path = require('path');
const axios = require('axios');
const IngestionLog = require('../models/IngestionLog.model');
const { processAicteCsv } = require('../utils/ingestion/aicte.parser');
const { parseNirfPdf } = require('../utils/ingestion/nirf.parser');
const { parseJosaaFeePdf } = require('../utils/ingestion/josaa.parser');

const DOWNLOAD_DIR = path.join(__dirname, '../../uploads/temp');

// Ensure temp dir exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

/**
 * Orchestrates the data ingestion process.
 */
class IngestionService {

  async triggerAicteIngestion(filePath, year) {
    const log = await IngestionLog.create({
      type: 'AICTE_CSV',
      fileName: path.basename(filePath),
      year,
      status: 'PROCESSING',
      startedAt: new Date()
    });
    
    // Run async (fire and forget from controller perspective, but tracked in DB)
    processAicteCsv(filePath, year, log)
      .then(() => console.log(`AICTE Ingestion ${year} Completed`))
      .catch(async (err) => {
         console.error(err);
         log.status = 'FAILED';
         log.logs.push(err.message);
         await log.save();
      });
      
    return log;
  }

  async triggerNirfIngestion(url, year, category) {
    // Download PDF
    const fileName = `NIRF_${category}_${year}.pdf`;
    const filePath = path.join(DOWNLOAD_DIR, fileName);
    
    try {
      const log = await IngestionLog.create({
        type: 'NIRF_PDF',
        fileUrl: url,
        fileName,
        year,
        status: 'PROCESSING',
        startedAt: new Date()
      });

      console.log(`Downloading NIRF PDF from ${url}...`);
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer' // Important for PDF
      });
      fs.writeFileSync(filePath, response.data);
      
      parseNirfPdf(filePath, year, category, log)
        .then(() => fs.unlinkSync(filePath)) // Cleanup
        .catch(async (err) => {
           log.status = 'FAILED';
           log.logs.push(err.message);
           await log.save();
        });

      return log;
    } catch (err) {
      console.error("Failed to start NIRF Ingestion:", err);
      throw err;
    }
  }

  async triggerJosaaIngestion(url, year) {
     const fileName = `JOSAA_FEES_${year}.pdf`;
     const filePath = path.join(DOWNLOAD_DIR, fileName);
     
     try {
       const log = await IngestionLog.create({
         type: 'JOSAA_PDF',
         fileUrl: url,
         fileName,
         year,
         status: 'PROCESSING',
         startedAt: new Date()
       });
 
       const response = await axios({
         url,
         method: 'GET',
         responseType: 'arraybuffer'
       });
       fs.writeFileSync(filePath, response.data);
       
       parseJosaaFeePdf(filePath, year, log)
         .then(() => fs.unlinkSync(filePath))
         .catch(async (err) => {
            log.status = 'FAILED';
            log.logs.push(err.message);
            await log.save();
         });
 
       return log;
     } catch (err) {
       throw err;
     }
  }
}

module.exports = new IngestionService();
