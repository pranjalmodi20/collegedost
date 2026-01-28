const mongoose = require('mongoose');
const Exam = require('./src/models/Exam.model');
require('dotenv').config();

const checkSlugs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const exams = await Exam.find({ examName: { $regex: 'CA', $options: 'i' } }).select('examName examSlug');
        console.log('Results:', exams);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkSlugs();
