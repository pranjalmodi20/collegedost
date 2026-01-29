const IngestionService = require('../services/ingestion.service');

exports.uploadAicteData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }
    
    const { year } = req.body;
    if (!year) {
      return res.status(400).json({ message: "Year is required (e.g., 2024)" });
    }

    const filePath = req.file.path;
    
    // Trigger Service
    const log = await IngestionService.triggerAicteIngestion(filePath, year);

    return res.status(200).json({
      message: "AICTE ingestion started",
      jobId: log._id,
      status: "PROCESSING"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.triggerNirfAuto = async (req, res) => {
  try {
    const { year, url, category } = req.body;
    // Admin manually triggering the "Automatic" fetch for a specific URL
    // Valid strategy if Cron fails or for testing.
    
    const log = await IngestionService.triggerNirfIngestion(url, year, category);
    res.status(200).json({ message: "NIRF Fetch triggered", jobId: log._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
