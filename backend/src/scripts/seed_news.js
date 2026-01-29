const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('../models/Article.model');

// Load env vars
dotenv.config({ path: '../../.env' });

const seedArticles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        const articles = [
            // Engineering (Previously Added)
            {
                title: 'JEE Main Admit Card 2026 Released',
                slug: 'jee-main-admit-card-2026',
                category: 'Exam News',
                summary: 'The National Testing Agency (NTA) has released the admit cards for JEE Main 2026 Session 1.',
                content: '<p>The National Testing Agency (NTA) has officially released the admit cards for the Joint Entrance Examination (JEE) Main 2026 Session 1.</p>',
                image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                tags: ['JEE Main', 'Admit Card']
            },
            {
                title: 'GATE 2026 Admit Card Available for Download',
                slug: 'gate-admit-card-2026',
                category: 'Exam News',
                summary: 'IIT Kanpur has released the GATE 2026 admit cards.',
                content: '<p>The Indian Institute of Technology (IIT) Kanpur has released the admit cards for GATE 2026.</p>',
                image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
                tags: ['GATE', 'Admit Card']
            },
            {
                title: 'JEE Main 2026 Exam Dates Announced',
                slug: 'jee-main-dates-2026',
                category: 'Exam News',
                summary: 'NTA has announced the official exam dates for JEE Main 2026.',
                content: '<p>Session 1 will be held in January and Session 2 in April.</p>',
                image: 'https://images.unsplash.com/photo-1620912189865-1e8a33da4c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80',
                tags: ['JEE Main', 'Dates']
            },
            {
                title: 'Top Engineering Colleges Ranking 2026',
                slug: 'engineering-rankings-2026',
                category: 'College News',
                summary: 'The latest NIRF rankings for 2026 have been released.',
                content: '<p>IIT Madras retains the top spot, followed by IIT Delhi and IIT Bombay.</p>',
                image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1486&q=80',
                tags: ['Ranking', 'Engineering']
            },

            // Management
            {
                title: 'CAT 2025 Result Declared',
                slug: 'cat-result-2025',
                category: 'Exam News',
                summary: 'IIM Calcutta has declared the CAT 2025 results.',
                content: '<p>Candidates can download their scorecards from the official website.</p>',
                image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['CAT', 'MBA', 'Results']
            },
             {
                title: 'Top MBA Colleges Ranking 2025',
                slug: 'mba-rankings-2025',
                category: 'College News',
                summary: 'NIRF has released the 2025 rankings for Management institutes.',
                content: '<p>IIM Ahmedabad tops the list followed by IIM Bangalore.</p>',
                image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['MBA', 'Ranking']
            },
            {
                title: 'CAT 2025 Registration Starts',
                slug: 'cat-registration-2025',
                category: 'Exam News',
                summary: 'Registration for CAT 2025 has started.',
                content: '<p>Apply online at iimcat.ac.in before the deadline.</p>',
                image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['CAT', 'Registration']
            },

            // Medical
            {
                title: 'NEET 2026 Exam Date Announced',
                slug: 'neet-dates-2026',
                category: 'Exam News',
                summary: 'NTA has announced the exam date for NEET UG 2026.',
                content: '<p>The exam is scheduled for May 5, 2026.</p>',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['NEET', 'Medical']
            },
            {
                title: 'NEET Counselling 2025 Updates',
                slug: 'neet-counselling-2025',
                category: 'Admission Alert',
                summary: 'MCC has released the schedule for NEET UG 2025 counselling.',
                content: '<p>Round 1 registration begins next week.</p>',
                image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['NEET', 'Counselling']
            },
            {
                title: 'Top Medical Colleges Ranking 2025',
                slug: 'medical-rankings-2025',
                category: 'College News',
                summary: 'AIIMS Delhi continues to be the top medical college in India.',
                content: '<p>Check the full list of top medical colleges here.</p>',
                image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['Medical', 'Ranking']
            },
            {
                title: 'NEET UG 2026 Application Process',
                slug: 'neet-application-2026',
                category: 'Exam News',
                summary: 'Application forms for NEET UG 2026 will be available soon.',
                content: '<p>Keep your documents ready for registration.</p>',
                image: 'https://images.unsplash.com/photo-1584697964405-322108740c21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['NEET', 'Application']
            },

            // Law
            {
                title: 'CLAT 2026 Notification Out',
                slug: 'clat-notification-2026',
                category: 'Exam News',
                summary: 'The Consortium of NLUs has released the notification for CLAT 2026.',
                content: '<p>The exam will be held in December 2025.</p>',
                image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['CLAT', 'Law']
            },
             {
                title: 'Top Law Colleges Ranking 2025',
                slug: 'law-rankings-2025',
                category: 'College News',
                summary: 'NLSIU Bangalore retains the top spot in NIRF Law Rankings 2025.',
                content: '<p>Review the top law schools in India.</p>',
                image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['Law', 'Ranking']
            },

            // Design
            {
                title: 'Top Design Colleges Ranking 2026',
                slug: 'design-rankings-2026',
                category: 'College News',
                summary: 'NID Ahmedabad is ranked the best design institute in India.',
                content: '<p>Check out the top design colleges.</p>',
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['Design', 'Ranking']
            },
             {
                title: 'NIFT 2026 Application Form Out',
                slug: 'nift-application-2026',
                category: 'Exam News',
                summary: 'NIFT has released the application form for 2026 admissions.',
                content: '<p>Apply online for Bachelor of Design programs.</p>',
                image: 'https://images.unsplash.com/photo-1558655146-d09347e0b7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['NIFT', 'Design']
            },

            // Media
            {
                title: 'IIMC Entrance Exam Date 2025',
                slug: 'iimc-exam-date',
                category: 'Exam News',
                summary: 'NTA will conduct the IIMC entrance exam via CUET PG.',
                content: '<p>Check the dates and syllabus.</p>',
                image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['Media', 'IIMC']
            },
            {
                title: 'Top Journalism Colleges Ranking 2025',
                slug: 'media-rankings-2025',
                category: 'College News',
                summary: 'Best Mass Communication colleges in India listed.',
                content: '<p>IIMC and Jamia Millia Islamia are among the top.</p>',
                image: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['Media', 'Ranking']
            },

            // Finance
            {
                title: 'CA Exam Dates 2025 Announced',
                slug: 'ca-exam-dates-2025',
                category: 'Exam News',
                summary: 'ICAI has announced the exam dates for CA Foundation, Inter, and Final.',
                content: '<p>Exams will be held in May and November 2025.</p>',
                image: 'https://images.unsplash.com/photo-1554224154-260327c00c41?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['CA', 'Finance']
            },
            {
                title: 'CS Executive Time Table June 2025',
                slug: 'cs-time-table',
                category: 'Exam News',
                summary: 'ICSI has released the time table for CS Executive exams.',
                content: '<p>Download the schedule from the ICSI website.</p>',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['CS', 'Finance']
            },

            // Computer
             {
                title: 'NIMCET 2025 Notification Released',
                slug: 'nimcet-notification-2025',
                category: 'Exam News',
                summary: 'NITs have released the notification for NIMCET 2025.',
                content: '<p>Apply for MCA admissions in NITs.</p>',
                image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['NIMCET', 'MCA']
            },
             {
                title: 'Top MCA Colleges Ranking 2025',
                slug: 'mca-rankings-2025',
                category: 'College News',
                summary: 'Check out the top colleges for MCA in India.',
                content: '<p>NIT Trichy and NIT Warangal lead the list.</p>',
                image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['MCA', 'Ranking']
            },

            // Pharmacy
            {
                title: 'GPAT 2025 Admit Card',
                slug: 'gpat-admit-card-2025',
                category: 'Exam News',
                summary: 'NBEMS will release the GPAT 2025 admit cards soon.',
                content: '<p>Download from the official portal.</p>',
                image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['GPAT', 'Pharmacy']
            },

            // Hospitality
            {
                title: 'NCHMCT JEE 2025 Exam Date',
                slug: 'nchmct-jee-date-2025',
                category: 'Exam News',
                summary: 'NTA has announced the date for NCHMCT JEE 2025.',
                content: '<p>The exam will be conducted in April 2025.</p>',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['Hotel Management', 'Exam']
            },

            // Competition
            {
                title: 'UPSC IAS Notification 2025',
                slug: 'upsc-notification-2025',
                category: 'Exam News',
                summary: 'UPSC has released the notification for Civil Services Exam 2025.',
                content: '<p>Apply online at upsc.gov.in.</p>',
                image: 'https://images.unsplash.com/photo-1589330694653-41a45778b056?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['UPSC', 'IAS']
            },
             {
                title: 'SSC CGL 2025 Exam Dates',
                slug: 'ssc-dates-2025',
                category: 'Exam News',
                summary: 'SSC has released the calendar for CGL 2025 exams.',
                content: '<p>Tier 1 exams to be held in July 2025.</p>',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['SSC', 'CGL']
            },

            // School
            {
                title: 'CBSE Class 10 & 12 Date Sheet 2025',
                slug: 'cbse-datesheet-2025',
                category: 'Exam News',
                summary: 'CBSE has released the date sheet for board exams 2025.',
                content: '<p>Exams start from February 15, 2025.</p>',
                image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['CBSE', 'Board Exams']
            },
             {
                title: 'State Boards Results 2025 Dates',
                slug: 'board-results-2025',
                category: 'Exam News',
                summary: 'Check expected result dates of UP Board, Bihar Board, and others.',
                content: '<p>Results expected in April-May 2025.</p>',
                image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['School', 'Results']
            },

            // Study Abroad
            {
                title: 'New UK Student Visa Rules 2025',
                slug: 'uk-visa-rules-2025',
                category: 'Admission Alert',
                summary: 'UK government announces changes to student visa regulations.',
                content: '<p>Check the new post-study work visa rules.</p>',
                image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['UK', 'Visa']
            },

            // Arts
            {
                title: 'IIT JAM 2026 Exam Dates',
                slug: 'iit-jam-dates-2026',
                category: 'Exam News',
                summary: 'IIT Madras to conduct JAM 2026. Check dates here.',
                content: '<p>Exam in February 2026.</p>',
                image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['IIT JAM', 'Science']
            },
            {
                title: 'CUET 2026 Notification Expected Soon',
                slug: 'cuet-notification-2026',
                category: 'Exam News',
                summary: 'NTA to release CUET UG 2026 notification in February.',
                content: '<p>Prepare for the common university entrance test.</p>',
                image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                tags: ['CUET', 'Arts']
            }
        ];

        for (const article of articles) {
            await Article.findOneAndUpdate(
                { slug: article.slug },
                article,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`Seeded: ${article.title}`);
        }

        console.log('Seeding Complete');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedArticles();
