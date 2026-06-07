const mongoose = require("mongoose");



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

        console.log("Connected to the database");

    } catch (err) {

        console.error("Error connecting to the database", err);
        process.exit(1);

    }

}

module.exports = connectDB;