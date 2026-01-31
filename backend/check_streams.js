const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const College = require('./src/models/College.model');
    const NirfRanking = require('./src/models/NirfRanking.model');
    
    // Get distinct streams
    const streams = await College.distinct('streams');
    console.log('Streams in DB:', streams);
    
    // Check NIRF rankings by category
    const nirfCategories = await NirfRanking.distinct('category');
    console.log('NIRF Categories:', nirfCategories);
    
    // Count medical NIRF rankings
    const medicalNirf = await NirfRanking.countDocuments({ category: 'Medical' });
    console.log('Medical NIRF Rankings count:', medicalNirf);
    
    // Show medical rankings
    const medicalRankings = await NirfRanking.find({ category: 'Medical' }).limit(10).lean();
    console.log('Medical Rankings:', medicalRankings);
    
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
