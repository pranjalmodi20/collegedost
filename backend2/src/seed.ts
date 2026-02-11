import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from './models/College';
import Article from './models/Article';
import Exam from './models/Exam';
import Course from './models/Course';
import connectDB from './config/db';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await College.deleteMany({});
        await Article.deleteMany({});
        await Exam.deleteMany({});
        await Course.deleteMany({});

        console.log('Old data cleared...');

        // 1. Seed Colleges
        const colleges = await College.create([
            {
                name: "Indian Institute of Technology Bombay",
                slug: "iit-bombay",
                logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/IIT_Bombay_Logo.svg/1200px-IIT_Bombay_Logo.svg.png",
                backgroundImg: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
                location: { city: "Mumbai", state: "Maharashtra", country: "India" },
                type: "Government",
                nirfRank: 3,
                rating: 4.8,
                coursesOffered: [
                    { name: "B.Tech Computer Science", fee: 200000, duration: "4 Years", type: "Full-time" },
                    { name: "B.Tech Electrical Engineering", fee: 200000, duration: "4 Years", type: "Full-time" }
                ],
                placements: { averagePackage: 2500000, highestPackage: 15000000, placementPercentage: 98 },
                cutoffs: [
                    { exam: "JEE Advanced", branch: "Computer Science", category: "General", closingRank: 67, year: 2024 },
                    { exam: "JEE Advanced", branch: "Electrical Engineering", category: "General", closingRank: 450, year: 2024 }
                ],
                facilities: ["Hostel", "Library", "Swimming Pool", "Gym"],
                description: "IIT Bombay is one of the premier institutes of technology in India."
            },
            {
                name: "Delhi Technological University",
                slug: "dtu-delhi",
                logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/DTU%2C_Delhi_official_logo.png/220px-DTU%2C_Delhi_official_logo.png",
                backgroundImg: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
                location: { city: "Delhi", state: "Delhi", country: "India" },
                type: "Government",
                nirfRank: 35,
                rating: 4.5,
                coursesOffered: [
                    { name: "B.Tech Software Engineering", fee: 160000, duration: "4 Years", type: "Full-time" }
                ],
                placements: { averagePackage: 1500000, highestPackage: 6400000, placementPercentage: 95 },
                cutoffs: [
                    { exam: "JEE Main", branch: "Software Engineering", category: "General", closingRank: 12000, year: 2024 }
                ],
                facilities: ["Hostel", "Sports", "Wifi"],
                description: "DTU is a leading technological university in Delhi."
            }
        ]);

        // 2. Seed Articles
        await Article.create([
            {
                title: "JEE Main 2026 Strategy Guide",
                slug: "jee-main-2026-strategy",
                summary: "Learn how to crack the upcoming JEE Main with top strategy tips from toppers.",
                content: "<p>The JEE Main 2026 is approaching. Focus on Physics, Chemistry, and Mathematics...</p>",
                category: "Exam News",
                author: "Expert Counsel",
                image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            },
            {
                title: "Top 10 Engineering Colleges in 2026",
                slug: "top-10-engineering-colleges-2026",
                summary: "A comprehensive list of best engineering colleges based on NIRF 2026 rankings.",
                content: "<p>Choosing the right college depends on various factors...</p>",
                category: "College News",
                author: "Admin",
                image: "https://images.unsplash.com/photo-1523050335456-c737f14e4b78?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            }
        ]);

        // 3. Seed Exams
        await Exam.create([
            {
                examName: "JEE Main",
                examSlug: "jee-main",
                conductingAuthority: "National Testing Agency (NTA)",
                examLevel: "National",
                description: "Entrance exam for NITs, IIITs and GFTIs.",
                importantDates: [{ event: "Registration Starts", date: new Date('2025-11-01') }],
                news: [{ title: "NTA releases JEE Main schedule", link: "#", pubDate: new Date() }]
            }
        ]);

        // 4. Seed Courses
        await Course.create([
            {
                courseName: "Bachelor of Technology",
                shortName: "B.Tech",
                slug: "b-tech",
                degreeLevel: "Undergraduate",
                duration: "4 Years",
                overview: "Professional degree in engineering.",
                careerOptions: ["Software Developer", "Data Scientist", "Mechanical Engineer"]
            }
        ]);

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
