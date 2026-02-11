import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://saipavankvrn:J12Y05@cluster0.zbdu2y4.mongodb.net/escape";

const admins = [
    "saipavankvrn",
    "narendra",
    "harika",
    "harsha",
    "aman"
];

const password = "ESCAPE_ROOM_SUCCESS";

const seedAdmins = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const hashedPassword = await bcrypt.hash(password, 10);

        for (const name of admins) {
            const email = `${name}@escape.edu.in`;

            // Check if user exists
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                console.log(`Admin ${email} already exists. Skipping.`);
                continue;
            }

            const newUser = new User({
                username: name,
                email: email,
                password: hashedPassword,
                role: 'admin'
            });

            await newUser.save();
            console.log(`Admin created: ${email}`);
        }

        console.log('Admin seeding completed.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admins:', error);
        process.exit(1);
    }
};

seedAdmins();
