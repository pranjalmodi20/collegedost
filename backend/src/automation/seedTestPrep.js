require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const TestPrep = require('../models/TestPrep.model');

// --- DATA: Engineering Prep ---
const engineeringData = [
    // 1. Exam Preparation - JEE Main
    {
        stream: 'Engineering',
        exam: 'JEE Main',
        type: 'Preparation',
        title: 'JEE Main Preparation 2026',
        overview: `
            <div class="space-y-6 text-gray-700">
                <p class="lead text-lg"><strong>JEE Main 2026 Preparation Guide</strong>: Joint Entrance Examination (JEE) Main is the nation's premier engineering entrance exam. It is the gateway to 31 NITs, 25 IIITs, and 28 Government Funded Technical Institutes (GFTIs).</p>
                
                <h3 class="text-xl font-bold text-gray-900 mt-6">JEE Main 2026 Highlights</h3>
                <table class="w-full text-sm border border-gray-200 mt-3 rounded-lg overflow-hidden">
                    <tr class="bg-gray-50 border-b"><td class="p-3 font-bold">Exam Name</td><td class="p-3">Joint Entrance Examination (Main)</td></tr>
                    <tr class="border-b"><td class="p-3 font-bold">Conducting Body</td><td class="p-3">National Testing Agency (NTA)</td></tr>
                    <tr class="bg-gray-50 border-b"><td class="p-3 font-bold">Exam Frequency</td><td class="p-3">Twice a year (January & April)</td></tr>
                    <tr class="border-b"><td class="p-3 font-bold">Mode of Exam</td><td class="p-3">Online (Computer Based Test)</td></tr>
                    <tr class="bg-gray-50"><td class="p-3 font-bold">Duration</td><td class="p-3">3 Hours</td></tr>
                </table>

                <h3 class="text-xl font-bold text-gray-900 mt-8">Preparation Strategy for JEE Main</h3>
                <ul class="list-disc pl-5 space-y-2 mt-2">
                    <li><strong>Understand the Syllabus:</strong> Stick strictly to the NTA prescribed syllabus which is based on Class 11 and 12 NCERT.</li>
                    <li><strong>NCERT is Bible:</strong> For Chemistry (especially Inorganic), NCERT books are sufficient for 90% of questions.</li>
                    <li><strong>Mock Tests:</strong> Attempt at least 15-20 full-length mock tests before the final exam. Analyze your errors.</li>
                    <li><strong>Time Management:</strong> allocate time: Chemistry (40 mins), Physics (60 mins), Maths (80 mins).</li>
                </ul>

                <h3 class="text-xl font-bold text-gray-900 mt-8">JEE Main Exam Pattern</h3>
                <div class="overflow-x-auto mt-3">
                    <table class="w-full text-sm text-left border border-gray-200">
                        <thead class="bg-brand-blue text-white">
                            <tr>
                                <th class="p-3">Section</th>
                                <th class="p-3">No. of Questions</th>
                                <th class="p-3">Marks</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr><td class="p-3">Physics</td><td class="p-3">20 (MCQ) + 10 (Numeric)</td><td class="p-3">100</td></tr>
                            <tr><td class="p-3">Chemistry</td><td class="p-3">20 (MCQ) + 10 (Numeric)</td><td class="p-3">100</td></tr>
                            <tr><td class="p-3">Mathematics</td><td class="p-3">20 (MCQ) + 10 (Numeric)</td><td class="p-3">100</td></tr>
                            <tr class="bg-gray-50 font-bold"><td class="p-3">Total</td><td class="p-3">90 Questions (Attempt 75)</td><td class="p-3">300 Marks</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        examPattern: {
            mode: 'Computer Based Test (CBT)',
            duration: '3 Hours',
            totalMarks: 300,
            sections: ['Physics', 'Chemistry', 'Mathematics']
        }
    },
    // 2. Exam Preparation - JEE Advanced
    {
        stream: 'Engineering',
        exam: 'JEE Advanced',
        type: 'Preparation',
        title: 'JEE Advanced Preparation 2026',
        overview: `
             <div class="space-y-6 text-gray-700">
                <p class="lead"><strong>JEE Advanced 2026</strong> is the sole admission test for the 23 prestigious Indian Institutes of Technology (IITs). Only the top 2.5 Lakh rank holders of JEE Main are eligible to appear.</p>
                
                <h3 class="text-xl font-bold text-gray-900 mt-6">Exam Analysis & Trends</h3>
                <p>Unlike JEE Main, JEE Advanced tests deep conceptual understanding. Questions are often multi-concept based. The paper pattern changes every year, introducing surprises like "Partial Marking" or "Matrix Match".</p>

                <h3 class="text-xl font-bold text-gray-900 mt-6">Top Preparation Tips</h3>
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Focus on Concepts:</strong> Rote learning will fail here. You must derive formulas and understand mechanisms.</li>
                    <li><strong>Solve Previous Years (PYQs):</strong> Solve last 15 years of JEE Advanced papers. They are the best practice source.</li>
                    <li><strong>Subject Strategy:</strong>
                        <ul class="list-circle pl-5 mt-1 text-sm text-gray-600">
                            <li><em>Physics:</em> Focus on Mechanics, Electrodynamics & Optics.</li>
                            <li><em>Chemistry:</em> Physical Chemistry requires numerical practice; Organic requires mechanism mastery.</li>
                            <li><em>Maths:</em> Calculus and Vectors are high-weightage topics.</li>
                        </ul>
                    </li>
                </ul>
             </div>
        `
    },
    // 3. Exam Preparation - BITSAT
    {
        stream: 'Engineering',
        exam: 'BITSAT',
        type: 'Preparation',
        title: 'BITSAT Preparation 2026',
        overview: `
            <div class="space-y-6 text-gray-700">
                <p><strong>BITSAT (Birla Institute of Technology and Science Admission Test)</strong> is famous for being a speed-based test. Unlike JEE, the difficulty is moderate, but you must solve 130 questions in 3 hours.</p>
                
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                    <p class="font-bold text-yellow-800">Unique Feature: Bonus Questions</p>
                    <p class="text-sm">If you complete all 130 questions, you unlock 12 bonus questions. This is the key to getting a 350+ score.</p>
                </div>

                <h3 class="text-xl font-bold text-gray-900 mt-6">Section-wise Strategy</h3>
                <ul class="list-disc pl-5">
                    <li><strong>English & Logical Reasoning (Bonus Scorer):</strong> This section has 30 questions. It is the easiest way to boost your score by 60-70 marks. Don't ignore it!</li>
                    <li><strong>Speed & Accuracy:</strong> You have less than 90 seconds per question. Skip lengthy calculations.</li>
                </ul>
            </div>
        `
    },
    // 4. Exam Preparation - VITEEE
    {
        stream: 'Engineering',
        exam: 'VITEEE',
        type: 'Preparation',
        title: 'VITEEE Preparation 2026',
        overview: `
            <div class="space-y-6 text-gray-700">
                 <p><strong>VITEEE</strong> is conducted by VIT University for admission to its Vellore, Chennai, AP, and Bhopal campuses.</p>
                 
                 <h3 class="text-xl font-bold text-gray-900 mt-4">Exam Pattern</h3>
                 <p>The exam consists of 125 questions to be answered in 2.5 hours. There is <strong>NO Negative Marking</strong>, so you must attempt 100% of the paper.</p>

                 <h3 class="text-xl font-bold text-gray-900 mt-4">Syllabus Coverage</h3>
                 <p>Strictly follows Class 11 and 12 State Board/CBSE syllabus. Complexity is lower than JEE Main.</p>
            </div>
        `
    },

    // ... (Keep existing Mock Tests/Papers below)
    {
        stream: 'Engineering',
        exam: 'JEE Main',
        type: 'Mock-Test',
        title: 'JEE Main Full Syllabus Mock Test 1',
        downloadUrl: '#',
        metaDescription: 'Complete 3-hour mock test based on latest NTA pattern.'
    },
    // ... [Rest of the existing data in the file is fine, just overwriting the start]

    {
        stream: 'Engineering',
        exam: 'JEE Advanced',
        type: 'Mock-Test',
        title: 'JEE Advanced Paper 1 Mock',
        downloadUrl: '#',
        metaDescription: 'High difficulty level mock test for IIT aspirants.'
    },
    {
        stream: 'Engineering',
        exam: 'BITSAT',
        type: 'Mock-Test',
        title: 'BITSAT English & Logical Reasoning Mock',
        downloadUrl: '#',
        metaDescription: 'Bonus section practice for BITSAT.'
    },
    {
        stream: 'Engineering',
        exam: 'VITEEE',
        type: 'Mock-Test',
        title: 'VITEEE Speed Test',
        downloadUrl: '#',
        metaDescription: '125 Questions in 2.5 hours practice.'
    },

    // 3. Previous Papers
    {
        stream: 'Engineering',
        exam: 'JEE Main',
        type: 'Previous-Paper',
        title: 'JEE Main 2025 January Session Paper 1',
        downloadUrl: '#',
        metaDescription: 'Official memory-based question paper with solutions.'
    },
    {
        stream: 'Engineering',
        exam: 'JEE Advanced',
        type: 'Previous-Paper',
        title: 'JEE Advanced 2024 Paper 1 & 2',
        downloadUrl: '#',
        metaDescription: 'Download authentic previous year paper.'
    },
    {
        stream: 'Engineering',
        exam: 'BITSAT',
        type: 'Previous-Paper',
        title: 'BITSAT 2024 Memory Based Paper',
        downloadUrl: '#',
        metaDescription: 'Collected from students who appeared in Session 1.'
    },

    // 4. Resources
    {
        stream: 'Engineering',
        exam: 'JEE Main',
        type: 'Resource',
        title: 'Engineering Study Material for Physics',
        author: 'Expert Faculty',
        metaDescription: 'Comprehensive notes for Mechanics and Electrodynamics.'
    },
    {
        stream: 'Engineering',
        exam: 'JEE Main',
        type: 'Resource',
        title: 'Toppers Strategy for 99+ Percentile',
        author: 'AIR 15 (2024)',
        metaDescription: 'How I managed time during the preparation phase.'
    },
    {
        stream: 'Engineering',
        exam: 'JEE Main',
        type: 'Resource',
        title: 'Important Topics for JEE Main Maths',
        author: 'Analysis Team',
        metaDescription: 'Weightage analysis of last 5 years.'
    }
];

async function seed() {
    try {
        await mongoose.connect('mongodb+srv://collegedost:collegedost_db@bhumit.4jfsdnd.mongodb.net/collegedost?appName=bhumit');
        console.log('MongoDB Connected');

        // Clear existing engineering test prep data
        await TestPrep.deleteMany({ stream: 'Engineering' });
        console.log('Cleared old Engineering Test Prep data.');

        // Manually slugify
        const slugify = require('slugify'); // Ensure you have slugify installed or use simple function

        const dataWithSlugs = engineeringData.map(item => ({
            ...item,
            slug: slugify(item.title + '-' + item.type, { lower: true, strict: true })
        }));

        // Insert New
        await TestPrep.insertMany(dataWithSlugs);
        console.log(`✅ Seeded ${engineeringData.length} Test Prep items.`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seed();
