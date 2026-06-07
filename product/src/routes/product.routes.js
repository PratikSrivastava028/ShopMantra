const express = require('express');
const multer = require('multer');
const productController = require('../controllers/product.controller');
const createAuthMiddleware = require('../middlewares/auth.middleware');
const { createProductValidators } = require('../validators/product.validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ─── CATEGORY ROUTES (public GET, auth POST) ─────────────────────────────────
router.get('/categories', productController.getCategories);
router.post('/categories', createAuthMiddleware(['seller', 'admin']), productController.createCategory);

// ─── SELLER-SCOPED PRODUCT ROUTES ────────────────────────────────────────────
// Must be BEFORE /:id to avoid routing conflicts
router.get('/seller', createAuthMiddleware(['seller']), productController.getProductsBySeller);

// ─── PRODUCT CRUD ─────────────────────────────────────────────────────────────
// POST /api/products — create
router.post(
    '/',
    createAuthMiddleware(['admin', 'seller']),
    upload.array('images', 5),
    createProductValidators,
    productController.createProduct
);

// GET /api/products — list (public, filters: q, category, minprice, maxprice)
router.get('/', productController.getProducts);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

// PATCH /api/products/:id — full update (seller owner only)
router.patch('/:id', createAuthMiddleware(['seller']), productController.updateProduct);

// PATCH /api/products/:id/stock — update stock only
router.patch('/:id/stock', createAuthMiddleware(['seller']), productController.updateStock);

// PATCH /api/products/:id/status — toggle active/paused
router.patch('/:id/status', createAuthMiddleware(['seller']), productController.toggleStatus);

// DELETE /api/products/:id
router.delete('/:id', createAuthMiddleware(['seller']), productController.deleteProduct);

module.exports = router;