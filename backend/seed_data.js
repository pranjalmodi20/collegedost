require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User.model');
const Article = require('./src/models/Article.model');
const College = require('./src/models/College.model');
const path = require('path');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Create Dummy Admin User
        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@collegedost.com' });
        
        let user;
        if (!adminExists) {
            console.log('Creating Admin User...');
            user = await User.create({
                name: 'Admin User',
                email: 'admin@collegedost.com',
                password: 'password123',
                mobile: '9999999999',
                role: 'admin',
                isVerified: true
            });
            console.log('Admin User Created: admin@collegedost.com / password123');
        } else {
            console.log('Admin User already exists.');
            user = adminExists;
        }

        // 2. Create Dummy Articles
        const articleCount = await Article.countDocuments();
        if (articleCount === 0) {
            console.log('Seeding Articles...');
            await Article.create([
                {
                    title: 'Welcome to CollegeDost',
                    category: 'General',
                    summary: 'Welcome to the new CollegeDost platform.',
                    content: 'This is a sample article to demonstrate the platform features. You can browse colleges, exams, and more.',
                    author: 'Admin',
                    tags: ['Welcome', 'Update']
                },
                {
                    title: 'JEE Main 2026 Dates Announced',
                    category: 'Exam News',
                    summary: 'NTA has released the dates for JEE Main 2026.',
                    content: 'The National Testing Agency (NTA) has officially announced the dates for JEE Main 2026. The exam will be held in two sessions...',
                    tags: ['JEE Main', 'NTA', 'Exam Dates']
                },
                {
                    title: 'Top Engineering Colleges in India',
                    category: 'College News',
                    summary: 'A look at the top ranked engineering institutes.',
                    content: 'IIT Madras continues to retain the top spot in the NIRF rankings for engineering categories...',
                    tags: ['NIRF', 'Rankings', 'Engineering']
                }
            ]);
            console.log('Seeded 3 Articles.');
        } else {
            console.log(`Articles already exist (${articleCount}).`);
        }

        // 3. Verify College Data
        const collegeCount = await College.countDocuments();
        console.log(`Current College Count: ${collegeCount}`);

        console.log('Seed Data Complete.');
        process.exit();
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedData();
