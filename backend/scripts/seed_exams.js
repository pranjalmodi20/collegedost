const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// robust path resolution
const envPath = path.resolve(__dirname, '../.env');
const modelPath = path.resolve(__dirname, '../src/models/Exam.model');

console.log('Loading env from:', envPath);
dotenv.config({ path: envPath });

const Exam = require(modelPath);

const seedExams = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing from .env');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const exams = [
            {
                examName: 'JEE Main',
                conductingAuthority: 'NTA',
                examLevel: 'National',
                description: 'Joint Entrance Examination – Main (JEE-Main) is conducted by NTA for admission to Undergraduate Engineering Programs (B.E/B.Tech).',
                importantDates: [
                    { title: 'Session 1 Registration Starts', date: new Date('2025-11-01') },
                    { title: 'Session 1 Exam Date', date: new Date('2026-01-24'), isTentative: true },
                    { title: 'Session 2 Exam Date', date: new Date('2026-04-01'), isTentative: true }
                ],
                eligibility: '<strong>Age Limit:</strong> No age limit. <br/> <strong>Qualifying Exam:</strong> Class 12th pass with Physics, Chemistry, and Maths.',
                syllabus: '<ul><li>Physics: Mechanics, Optics, Thermodynamics</li><li>Chemistry: Organic, Inorganic, Physical</li><li>Maths: Calculus, Algebra, Coordinate Geometry</li></ul>',
                examPattern: 'Computer Based Test. 90 Questions (30 per subject). 300 Marks.',
                applicationProcess: {
                    fee: 'INR 1000 for General Male',
                    steps: ['Register online', 'Fill application', 'Upload documents', 'Pay fee'],
                    websiteUrl: 'https://jeemain.nta.ac.in'
                }
            },
            {
                examName: 'NEET UG',
                conductingAuthority: 'NTA',
                examLevel: 'National',
                description: 'The National Eligibility cum Entrance Test (Undergraduate) or NEET (UG) is for students who wish to pursue undergraduate medical (MBBS), dental (BDS) and AYUSH (BAMS, BUMS, BHMS, etc.) courses.',
                importantDates: [
                     { title: 'Exam Date', date: new Date('2026-05-05'), isTentative: true }
                ],
                 eligibility: 'Class 12th with PCB.',
                 syllabus: 'Physics, Chemistry, Biology (Botany & Zoology).',
                 examPattern: 'Pen and Paper. 720 Marks.'
            }
        ];

        // Safe delete
        try {
            await Exam.collection.drop(); 
        } catch(e) {
            // ignore if collection doesn't exist
        }
        
        await Exam.insertMany(exams);

        console.log('Exams Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedExams();
