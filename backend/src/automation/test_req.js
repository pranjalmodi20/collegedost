try {
  console.log('Loading mongoose...'); require('mongoose');
  console.log('Loading dotenv...'); require('dotenv');
  console.log('Loading Exam model...'); require('../models/Exam.model');
  console.log('Loading rss-parser...'); require('rss-parser');
  console.log('Loading axios...'); require('axios');
  console.log('Loading cheerio...'); require('cheerio');
  console.log('Loading slugify...'); require('slugify');
  console.log('All modules loaded successfully.');
} catch (e) {
  console.error('Error loading module:', e);
}
