const mongoose = require('mongoose');
const mongoURI = mongoose.connect(process.env.MONGO_URI);

async function check() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to Cart DB');
        const db = mongoose.connection.db;
        const carts = await db.collection('carts').find({}).toArray();
        console.log('Total carts in DB:', carts.length);
        console.log('Carts details:', JSON.stringify(carts, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

check();
