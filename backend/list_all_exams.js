const mongoose = require('mongoose');
const Exam = require('./src/models/Exam.model');
require('dotenv').config();

const listExams = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const exams = await Exam.find({}).select('examName examSlug category');
        console.log('--- EXAM LIST ---');
        exams.forEach(e => {
            console.log(`Name: ${e.examName} | Slug: ${e.examSlug} | Category: ${e.category}`);
        });
        console.log(`Total: ${exams.length}`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listExams();
