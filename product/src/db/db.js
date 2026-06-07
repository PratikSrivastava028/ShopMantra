const mongoose = require('mongoose');
const { seedDefaults } = require('../models/category.model');

async function connectDB() {
    try {
        mongoose.connection.on('error', (err) => {
            console.error("Mongoose connection error:", err);
        });

        mongoose.connection.on('disconnected', () => {
            console.error("Mongoose connection disconnected. Exiting for restart...");
            process.exit(1);
        });

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
        await seedDefaults(); // Ensure default categories exist
    } catch (err) {
        console.log('MongoDB connection error:', err);
        process.exit(1);
    }
}

module.exports = connectDB;