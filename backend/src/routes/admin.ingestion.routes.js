const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ingestionController = require('../controllers/admin.ingestion.controller');

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/aicte');
    // Ensure dir exists
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'AICTE_' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes
// POST /api/admin/ingest/aicte
router.post('/aicte', upload.single('file'), ingestionController.uploadAicteData);

// POST /api/admin/ingest/nirf-trigger
router.post('/nirf-trigger', ingestionController.triggerNirfAuto);

module.exports = router;
