import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exam from '../models/Exam';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/collegedost';

const cuetData = {
    examName: 'CUET UG',
    examSlug: 'cuet',
    conductingAuthority: 'National Testing Agency (NTA)',
    examLevel: 'National' as const,
    description: 'Common University Entrance Test (CUET) is a national-level entrance exam conducted by NTA for admission to various undergraduate programs in Central, State, Deemed, and Private universities across India.',
    syllabus: [
        {
            subject: 'Section IA & IB (Languages)',
            topics: ['Reading Comprehension', 'Literary Aptitude', 'Vocabulary', 'Grammar', 'Synonyms/Antonyms']
        },
        {
            subject: 'Section II (Domain Specific)',
            topics: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Accountancy', 'Business Studies', 'Economics', 'History', 'Geography', 'Political Science', 'Sociology', 'Psychology']
        },
        {
            subject: 'Section III (General Test)',
            topics: ['General Knowledge', 'Current Affairs', 'General Mental Ability', 'Numerical Ability', 'Quantitative Reasoning', 'Logical & Analytical Reasoning']
        }
    ],
    importantDates: [
        {
            event: 'CUET 2026 Registration Starts',
            date: new Date('2026-02-01'),
            note: 'Tentative date'
        },
        {
            event: 'Last Date for Application',
            date: new Date('2026-03-31'),
            note: 'Tentative date'
        },
        {
            event: 'CUET 2026 Exam Window',
            date: new Date('2026-05-11'),
            note: 'Exam window: May 11 to May 31, 2026'
        }
    ],
    news: [
        {
            title: 'CUET UG 2026 Application Process Begins at cuet.samarth.ac.in',
            link: 'https://www.shiksha.com/science/cuet-exam-news',
            pubDate: new Date()
        },
        {
            title: 'Top Central Universities accepting CUET scores for 2026 Admissions',
            link: 'https://www.shiksha.com/science/cuet-exam-colleges',
            pubDate: new Date()
        }
    ]
};

async function seedCUET() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Drop legacy index if exists
        try {
            const collection = mongoose.connection.collection('exams');
            await collection.dropIndex('slug_1');
            console.log('🗑 Dropped legacy slug_1 index');
        } catch (e) {
            console.log('ℹ No legacy slug_1 index found or already dropped');
        }

        // Delete existing CUET entry if any
        await Exam.deleteOne({ examSlug: 'cuet' });
        console.log('🗑 Deleted existing CUET entry');

        const exam = await Exam.create(cuetData);
        console.log(`✅ Seeded CUET data: ${exam.examName}`);

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedCUET();
