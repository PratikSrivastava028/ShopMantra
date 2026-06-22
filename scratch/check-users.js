const mongoose = require('mongoose');

const mongoURI = mongoose.connect(process.env.MONGO_URI);
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    fullName: {
        firstName: String,
        lastName: String
    },
    role: String
});

const User = mongoose.model('user', userSchema);

async function checkUsers() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to DB');
        const users = await User.find({});
        console.log('All Users in DB:');
        console.log(JSON.stringify(users, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkUsers();