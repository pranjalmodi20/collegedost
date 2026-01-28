const mongoose = require('mongoose');
const Exam = require('./src/models/Exam.model');
require('dotenv').config();

const findCA = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const exams = await Exam.find({ examName: /CA/i });
        console.log('--- SEARCH RESULT FOR "CA" ---');
        console.log(exams);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

findCA();
