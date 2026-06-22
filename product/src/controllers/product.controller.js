const productModel = require('../models/product.model');
const { Category } = require('../models/category.model');
const { uploadImage } = require('../services/imagekit.service');
const mongoose = require('mongoose');
const { publishToQueue } = require('../broker/borker');

function isValidURL(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}


// ─── CATEGORY ENDPOINTS ──────────────────────────────────────────────────────

async function getCategories(req, res) {
    try {
        const cats = await Category.find().sort({ name: 1 });
        return res.json({ data: cats.map(c => c.name) });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function createCategory(req, res) {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Category name is required' });
        }
        const trimmed = name.trim();
        const existing = await Category.findOne({ name: { $regex: new RegExp(`^${trimmed}$`, 'i') } });
        if (existing) {
            return res.json({ message: 'Category already exists', category: existing });
        }
        const category = await Category.create({ name: trimmed, createdBy: req.user?.id || null });
        return res.status(201).json({ message: 'Category created', category });
    } catch (err) {
        console.error('Create category error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


// ─── PRODUCT ENDPOINTS ───────────────────────────────────────────────────────

async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency = 'INR', category, stock, imageUrl, specs } = req.body;
        const seller = req.user.id;
        const sellerName = req.user.username || req.user.email || '';

        let images = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => uploadImage(file));
            const uploaded = await Promise.all(uploadPromises);
            images = uploaded.map(img => ({ url: img.url, fileId: img.id }));
        } else if (imageUrl && imageUrl.trim()) {
            if (!isValidURL(imageUrl)) {
                return res.status(400).json({ message: 'Invalid product image URL' });
            }
            images = [{ url: imageUrl.trim() }];
        } else {
            return res.status(400).json({ message: 'Product image is required' });
        }

        const price = {
            amount: Number(priceAmount),
            currency: priceCurrency,
        };

        // Auto-create category if it doesn't exist
        const categoryName = (category || 'Electronics').trim();
        const existingCat = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });
        if (!existingCat) {
            await Category.create({ name: categoryName, createdBy: seller });
        }

        let parsedSpecs = [];
        if (specs) {
            try {
                parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs;
            } catch (err) {
                console.error('Failed to parse specs', err);
            }
        }

        const product = await productModel.create({
            title,
            description,
            price,
            seller,
            sellerName,
            images,
            category: categoryName,
            stock: Number(stock) || 0,
            active: true,
            specs: parsedSpecs,
        });

        await publishToQueue('PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED', product);
        await publishToQueue('PRODUCT_NOTIFICATION.PRODUCT_CREATED', {
            email: req.user.email,
            username: req.user.username || req.user.email || "Valued Customer",
            productId: product._id,
            sellerId: seller
        });

        return res.status(201).json({
            message: 'Product created',
            data: product,
        });
    } catch (err) {
        console.error('Create product error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


async function getProducts(req, res) {
    try {
        const { q, minprice, maxprice, category, skip = 0, limit = 50 } = req.query;

        const filter = { active: { $ne: false } }; // Only show active products to customers

        if (q) {
            filter.$text = { $search: q };
        }

        if (category && category !== 'All') {
            filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        if (minprice) {
            filter['price.amount'] = { ...filter['price.amount'], $gte: Number(minprice) };
        }

        if (maxprice) {
            filter['price.amount'] = { ...filter['price.amount'], $lte: Number(maxprice) };
        }

        const products = await productModel.find(filter).sort({ createdAt: -1 }).skip(Number(skip)).limit(Math.min(Number(limit), 100));

        return res.status(200).json({ data: products });
    } catch (err) {
        console.error('Get products error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


async function getProductById(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await productModel.findById(id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ data: product });
}


async function updateProduct(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await productModel.findById(id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own products' });
    }

    const allowedUpdates = ['title', 'description', 'price', 'category', 'stock', 'active', 'imageUrl', 'specs'];
    for (const key of Object.keys(req.body)) {
        if (allowedUpdates.includes(key)) {
            if (key === 'price' && typeof req.body.price === 'object') {
                if (req.body.price.amount !== undefined) product.price.amount = Number(req.body.price.amount);
                if (req.body.price.currency !== undefined) product.price.currency = req.body.price.currency;
            } else if (key === 'imageUrl') {
                if (!req.body.imageUrl || !req.body.imageUrl.trim()) {
                    return res.status(400).json({ message: 'Product image URL is required' });
                }
                if (!isValidURL(req.body.imageUrl)) {
                    return res.status(400).json({ message: 'Invalid product image URL' });
                }
                product.images = [{ url: req.body.imageUrl.trim() }];
            } else if (key === 'specs') {
                let parsedSpecs = [];
                try {
                    parsedSpecs = typeof req.body.specs === 'string' ? JSON.parse(req.body.specs) : req.body.specs;
                } catch (err) {
                    console.error('Failed to parse specs', err);
                }
                product.specs = parsedSpecs;
            } else {
                product[key] = req.body[key];
            }
        }
    }
    await product.save();
    await publishToQueue('PRODUCT_SELLER_DASHBOARD.PRODUCT_UPDATED', product);
    return res.status(200).json({ message: 'Product updated', product });
}


async function updateStock(req, res) {
    const { id } = req.params;
    const { stock } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await productModel.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    product.stock = Number(stock);
    await product.save();
    await publishToQueue('PRODUCT_SELLER_DASHBOARD.PRODUCT_UPDATED', product);
    return res.status(200).json({ message: 'Stock updated', product });
}


async function toggleStatus(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await productModel.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    product.active = !product.active;
    await product.save();
    await publishToQueue('PRODUCT_SELLER_DASHBOARD.PRODUCT_UPDATED', product);
    return res.status(200).json({ message: `Product ${product.active ? 'activated' : 'paused'}`, product });
}


async function deleteProduct(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await productModel.findOne({ _id: id });

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: You can only delete your own products' });
    }

    await productModel.findOneAndDelete({ _id: id });
    await publishToQueue('PRODUCT_SELLER_DASHBOARD.PRODUCT_DELETED', { id });
    return res.status(200).json({ message: 'Product deleted' });
}


async function getProductsBySeller(req, res) {
    const seller = req.user;
    const { skip = 0, limit = 100 } = req.query;
    // Return ALL seller products including paused ones (seller needs to see everything)
    const products = await productModel.find({ seller: seller.id }).sort({ createdAt: -1 }).skip(Number(skip)).limit(Math.min(Number(limit), 100));
    return res.status(200).json({ data: products });
}


module.exports = {
    getCategories,
    createCategory,
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    updateStock,
    toggleStatus,
    deleteProduct,
    getProductsBySeller,
};