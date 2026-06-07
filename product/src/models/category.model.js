const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null   // null for seed categories
    }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

/**
 * Seed default categories if the collection is empty.
 */
async function seedDefaults() {
    const count = await Category.countDocuments();
    if (count === 0) {
        await Category.insertMany([
            { name: 'Electronics' },
            { name: 'Fashion' },
            { name: 'Wellness' },
            { name: 'Home & Living' },
            { name: 'Sports' },
        ]);
        console.log('[Category] Default categories seeded.');
    }
}

module.exports = { Category, seedDefaults };
