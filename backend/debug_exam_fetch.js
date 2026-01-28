const axios = require('axios');
const API_URL = 'http://localhost:5001/api/exams/ca-intermediate';

const testFetch = async () => {
    try {
        console.log(`Fetching ${API_URL}...`);
        const res = await axios.get(API_URL);
        console.log('Status:', res.status);
        console.log('Data:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('Error fetching exam:');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        } else {
            console.error(err.message);
        }
    }
};

testFetch();
