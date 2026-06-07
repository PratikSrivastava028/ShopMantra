const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const productRoutes = require('./routes/product.routes');

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Product service is running' });
});

app.use('/api/products', productRoutes);

module.exports = app;