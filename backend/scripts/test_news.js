const connectDB = require('../src/config/db');
const fetchAndStoreNews = require('../src/utils/newsFetcher');
const dotenv = require('dotenv');
const path = require('path');

// Fix Env path
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const run = async () => {
    try {
        await connectDB();
        await fetchAndStoreNews();
        console.log('Done');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

run();
