const mongoose = require('mongoose');
const College = require('./models/College.model');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); 

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await College.countDocuments();
        console.log(`Total Colleges in DB: ${count}`);
        
        const sample = await College.findOne();
        console.log('Sample College:', sample ? sample.name : 'None');
        
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDb();
