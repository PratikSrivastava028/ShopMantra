const mongoose = require('mongoose');




async function connectDB() {
    try {
        mongoose.connection.on('error', (err) => {
            console.error("Mongoose connection error:", err);
        });

        mongoose.connection.on('disconnected', () => {
            console.error("Mongoose connection disconnected. Exiting for restart...");
            process.exit(1);
        });

        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}


module.exports = connectDB;