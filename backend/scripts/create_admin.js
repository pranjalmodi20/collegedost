const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../src/config/db');
const User = require('../src/models/User.model');

dotenv.config({ path: './.env' });

const createAdmin = async () => {
    try {
        await connectDB();
        
        const adminEmail = 'collegedost@admin.com';
        const user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log('Admin user already exists');
            user.role = 'admin';
            user.password = 'admin@123'; // Reset password just in case (will be hashed by pre-save)
            await user.save();
            console.log('Updated existing user to admin');
        } else {
            const newAdmin = await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: 'admin@123',
                mobile: '0000000000',
                role: 'admin',
                city: 'Delhi',
                currentClass: 'Graduate',
                interest: 'All'
            });
            console.log('Admin user created successfully');
        }
        
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
