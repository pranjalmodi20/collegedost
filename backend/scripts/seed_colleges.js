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
                slug: 'btech-cs',
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
                slug: 'mbbs',
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
                slug: 'mba',
                shortName: 'MBA',
                degreeLevel: 'Postgraduate',
                duration: '2 Years',
                overview: 'MBA develops business acumen and leadership skills...',
                eligibility: 'Bachelor Degree + CAT/XAT/GMAT',
                careerOptions: ['Manager', 'Consultant', 'Entrepreneur'],
                averageStartingSalary: '12-25 LPA'
            }
        ];

        try { await Course.collection.drop(); } catch (e) { }
        await Course.insertMany(courses);
        console.log('Courses Seeded');

        // 2. Seed Colleges
        const colleges = [
            // Engineering
            {
                name: 'Indian Institute of Technology Madras',
                slug: 'iit-madras',
                location: { city: 'Chennai', state: 'Tamil Nadu' },
                type: 'Government',
                nirfRank: 1,
                fees: { tuition: 200000, hostel: 35000 },
                placements: { averagePackage: "22 LPA", highestPackage: "1.9 CPA" },
                approvals: ["UGC", "AICTE"],
                facilities: ["Hostel", "Wifi", "Library", "Sports Complex"],
                website: 'https://www.iitm.ac.in',
                streams: ['Engineering', 'Science']
            },
            {
                name: 'Indian Institute of Technology Delhi',
                slug: 'iit-delhi',
                location: { city: 'New Delhi', state: 'Delhi' },
                type: 'Government',
                nirfRank: 2,
                fees: { tuition: 220000, hostel: 42000 },
                placements: { averagePackage: "20 LPA", highestPackage: "2 CPA" },
                approvals: ["UGC", "AICTE"],
                facilities: ["Hostel", "Gym", "Library"],
                website: 'https://home.iitd.ac.in',
                streams: ['Engineering']
            },
            {
                name: 'Indian Institute of Technology Bombay',
                slug: 'iit-bombay',
                location: { city: 'Mumbai', state: 'Maharashtra' },
                type: 'Government',
                nirfRank: 3,
                fees: { tuition: 230000, hostel: 50000 },
                placements: { averagePackage: "25 LPA", highestPackage: "3.7 CPA" },
                approvals: ["UGC", "AICTE"],
                facilities: ["Hostel", "Swimming Pool", "Library"],
                website: 'https://www.iitb.ac.in',
                streams: ['Engineering']
            },
            {
                name: 'Indian Institute of Technology Kanpur',
                slug: 'iit-kanpur',
                location: { city: 'Kanpur', state: 'Uttar Pradesh' },
                type: 'Government',
                nirfRank: 4,
                fees: { tuition: 215000, hostel: 30000 },
                website: 'https://www.iitk.ac.in',
                streams: ['Engineering']
            },
            // Management
            {
                name: 'Indian Institute of Management Ahmedabad',
                slug: 'iim-ahmedabad',
                location: { city: 'Ahmedabad', state: 'Gujarat' },
                type: 'Government',
                nirfRank: 1,
                fees: { tuition: 2500000, hostel: 150000 },
                placements: { averagePackage: "34 LPA", highestPackage: "1.15 CPA" },
                approvals: ["UGC", "EQUIS"],
                facilities: ["Hostel", "Wifi", "Auditorium"],
                website: 'https://www.iima.ac.in',
                streams: ['Management']
            },
            {
                name: 'Indian Institute of Management Bangalore',
                slug: 'iim-bangalore',
                location: { city: 'Bangalore', state: 'Karnataka' },
                type: 'Government',
                nirfRank: 2,
                fees: { tuition: 2450000, hostel: 200000 },
                website: 'https://www.iimb.ac.in',
                streams: ['Management']
            },
            // Medical
            {
                name: 'All India Institute of Medical Sciences, Delhi',
                slug: 'aiims-delhi',
                location: { city: 'New Delhi', state: 'Delhi' },
                type: 'Government',
                nirfRank: 1,
                fees: { tuition: 1628, hostel: 990 },
                placements: { averagePackage: "12 LPA", highestPackage: "15 LPA" },
                approvals: ["MCI"],
                facilities: ["Hostel", "Hospital"],
                website: 'https://www.aiims.edu',
                streams: ['Medical']
            },
            // Law
            {
                name: 'National Law School of India University',
                slug: 'nlsiu-bengaluru',
                location: { city: 'Bengaluru', state: 'Karnataka' },
                type: 'Government',
                nirfRank: 1,
                fees: { tuition: 280000, hostel: 60000 },
                website: 'https://www.nls.ac.in',
                streams: ['Law']
            },
            // International
            {
                name: 'Massachusetts Institute of Technology (MIT)',
                slug: 'mit-usa',
                location: { city: 'Cambridge', state: 'Massachusetts', country: 'USA' },
                type: 'Private',
                nirfRank: null,
                fees: { tuition: 4500000 },
                website: 'https://web.mit.edu',
                streams: ['Engineering', 'Science']
            }
        ];

        try { await College.collection.drop(); } catch (e) { }
        await College.insertMany(colleges);
        console.log('Colleges Seeded');

        process.exit();
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedData();
