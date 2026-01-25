const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// robust path resolution
const envPath = path.resolve(__dirname, '../.env');
const CollegeModelPath = path.resolve(__dirname, '../src/models/College.model');
const CourseModelPath = path.resolve(__dirname, '../src/models/Course.model');

console.log('Loading env from:', envPath);
dotenv.config({ path: envPath });

const College = require(CollegeModelPath);
const Course = require(CourseModelPath);

const seedData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing from .env');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Seed Courses
        const courses = [
            {
                courseName: 'Bachelor of Technology (Computer Science)',
                shortName: 'B.Tech',
                degreeLevel: 'Undergraduate',
                duration: '4 Years',
                overview: 'B.Tech in Computer Science is the most popular engineering course...',
                eligibility: 'Class 12th with PCM (75% for IIT/NITs)',
                careerOptions: ['Software Developer', 'Data Scientist', 'System Architect'],
                averageStartingSalary: '6-10 LPA'
            },
            {
                courseName: 'Bachelor of Medicine, Bachelor of Surgery',
                shortName: 'MBBS',
                degreeLevel: 'Undergraduate',
                duration: '5.5 Years',
                overview: 'MBBS is the primary medical qualification...',
                eligibility: 'Class 12th with PCB + NEET UG Qualified',
                careerOptions: ['Doctor', 'Surgeon', 'Medical Researcher'],
                averageStartingSalary: '8-12 LPA'
            },
            {
                courseName: 'Master of Business Administration',
                shortName: 'MBA',
                degreeLevel: 'Postgraduate',
                duration: '2 Years',
                overview: 'MBA develops business acumen and leadership skills...',
                eligibility: 'Bachelor Degree + CAT/XAT/GMAT',
                careerOptions: ['Manager', 'Consultant', 'Entrepreneur'],
                averageStartingSalary: '12-25 LPA'
            }
        ];

        try { await Course.collection.drop(); } catch(e) {}
        await Course.insertMany(courses);
        console.log('Courses Seeded');

        // 2. Seed Colleges
        const colleges = [
            {
                name: 'Indian Institute of Technology Bombay',
                slug: 'iit-bombay',
                location: { city: 'Mumbai', state: 'Maharashtra' },
                type: 'IIT',
                estYear: 1958,
                nirfRank: 3,
                fees: { tuition: 200000, hostel: 50000 },
                placements: { highestPackage: '3.7 Cr', averagePackage: '25 LPA' },
                website: 'https://www.iitb.ac.in',
                coursesOffered: [
                    { courseName: 'B.Tech Computer Science', duration: '4 Years', fee: 800000 },
                    { courseName: 'B.Tech Electrical', duration: '4 Years', fee: 800000 }
                ],
                cutoff: [{
                    exam: 'JEE Advanced', year: 2024, branch: 'CSE', category: 'General', closing: 67, cutoffType: 'RANK'
                }]
            },
            {
                name: 'Indian Institute of Technology Delhi',
                slug: 'iit-delhi',
                location: { city: 'New Delhi', state: 'Delhi' },
                type: 'IIT',
                estYear: 1961,
                nirfRank: 2,
                fees: { tuition: 200000, hostel: 60000 },
                placements: { highestPackage: '2 Cr', averagePackage: '22 LPA' },
                website: 'https://home.iitd.ac.in',
                coursesOffered: [
                    { courseName: 'B.Tech Computer Science', duration: '4 Years', fee: 800000 }
                ]
            },
            {
                name: 'All India Institute of Medical Sciences',
                slug: 'aiims-delhi',
                location: { city: 'New Delhi', state: 'Delhi' },
                type: 'Government',
                estYear: 1956,
                nirfRank: 1,
                fees: { tuition: 1628, hostel: 4000 },
                placements: { highestPackage: 'NA', averagePackage: '12 LPA (Stipend)' },
                coursesOffered: [
                    { courseName: 'MBBS', duration: '5.5 Years', fee: 6000 }
                ]
            }
        ];

        try { await College.collection.drop(); } catch(e) {}
        await College.insertMany(colleges);
        console.log('Colleges Seeded');

        process.exit();
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedData();
