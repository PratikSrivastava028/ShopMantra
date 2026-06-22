const mongoose = require('mongoose');
const mongoURI = mongoose.connect(process.env.MONGO_URI);

async function check() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to Product DB');
        const db = mongoose.connection.db;
        const products = await db.collection('products').find({}).toArray();
        console.log('Total products in DB:', products.length);
        console.log('All product IDs:', products.map(p => p._id.toString()));
        const target = await db.collection('products').findOne({ _id: new mongoose.Types.ObjectId('6a1efa68afb9ba7748d67147') });
        console.log('Target product by ObjectId:', target);
        const targetStr = await db.collection('products').findOne({ _id: '6a1efa68afb9ba7748d67147' });
        console.log('Target product by String:', targetStr);
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

check();
