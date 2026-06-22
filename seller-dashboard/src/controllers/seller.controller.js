const productModel = require('../models/product.model');
const orderModel = require('../models/order.model');
const userModel = require('../models/user.model');
const { publishToQueue } = require('../broker/broker');

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function startOfDay(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(0, 0, 0, 0);
    return d;
}

function generateAiInsights(data) {
    const insights = [];
    const { topProducts, inventory, monthlyRevenue, categoryStats } = data;

    // Revenue insight
    if (monthlyRevenue.length >= 2) {
        const last = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;
        const prev = monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0;
        if (last > 0 && prev > 0) {
            const pct = Math.round(((last - prev) / prev) * 100);
            if (pct > 0) {
                insights.push({ type: 'positive', message: `Monthly revenue grew by ${pct}% compared to last month. Keep the momentum!` });
            } else if (pct < 0) {
                insights.push({ type: 'warning', message: `Monthly revenue dropped by ${Math.abs(pct)}% compared to last month. Consider running a promotion.` });
            }
        }
    }

    // Top selling product
    if (topProducts.length > 0) {
        const top = topProducts[0];
        insights.push({ type: 'positive', message: `"${top.title}" is your best seller with ${top.sold} units sold — consider increasing its stock.` });
    }

    // Low stock warning
    const lowStock = inventory.filter(i => i.stock > 0 && i.stock <= 5);
    lowStock.slice(0, 2).forEach(item => {
        insights.push({ type: 'warning', message: `"${item.title}" stock is critically low (${item.stock} units). Restock soon to avoid lost sales.` });
    });

    // Out of stock
    const outOfStock = inventory.filter(i => i.stock === 0);
    if (outOfStock.length > 0) {
        insights.push({ type: 'danger', message: `${outOfStock.length} product(s) are out of stock and hidden from customers. Restock to resume sales.` });
    }

    // Best category
    if (categoryStats.length > 0) {
        const best = categoryStats[0];
        insights.push({ type: 'info', message: `"${best.name}" is your top-performing category with ₹${best.revenue.toFixed(0)} in revenue and ${best.orders} orders.` });
    }

    return insights.slice(0, 5);
}

// ─── CONTROLLERS ─────────────────────────────────────────────────────────────

async function getMetrics(req, res) {
    try {
        const seller = req.user;

        const products = await productModel.find({ seller: seller.id });
        const productIds = products.map(p => p._id);

        // All orders containing this seller's products
        const allOrders = await orderModel.find({ 'items.product': { $in: productIds } }).sort({ createdAt: -1 });
        const completedOrders = allOrders.filter(o => ['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(o.status));
        const pendingOrders = allOrders.filter(o => o.status === 'PENDING');

        // KPIs
        let totalRevenue = 0;
        let totalSales = 0;
        const productSalesMap = {}; // productId → { sold, revenue, title, category }

        completedOrders.forEach(order => {
            order.items.forEach(item => {
                const pId = item.product.toString();
                const inSeller = productIds.some(pid => pid.toString() === pId);
                if (!inSeller) return;

                const qty = item.quantity || 1;
                const amt = (item.price?.amount || 0) * qty;
                totalSales += qty;
                totalRevenue += amt;

                if (!productSalesMap[pId]) {
                    const prod = products.find(p => p._id.toString() === pId);
                    productSalesMap[pId] = {
                        id: pId,
                        title: prod?.title || 'Unknown',
                        category: prod?.category || 'Other',
                        sold: 0,
                        revenue: 0,
                    };
                }
                productSalesMap[pId].sold += qty;
                productSalesMap[pId].revenue += amt;
            });
        });

        // Monthly revenue for chart (last 12 months)
        const now = new Date();
        const monthlyRevenue = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
            let rev = 0;
            let ords = 0;
            completedOrders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                if (orderDate.getFullYear() === d.getFullYear() && orderDate.getMonth() === d.getMonth()) {
                    order.items.forEach(item => {
                        const pId = item.product.toString();
                        if (productIds.some(pid => pid.toString() === pId)) {
                            rev += (item.price?.amount || 0) * (item.quantity || 1);
                        }
                    });
                    ords++;
                }
            });
            monthlyRevenue.push({ month: label, revenue: Math.round(rev), orders: ords });
        }

        // Monthly revenue for this month
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyRev = completedOrders
            .filter(o => new Date(o.createdAt) >= thisMonth)
            .reduce((sum, o) => {
                return sum + o.items.reduce((s, item) => {
                    if (productIds.some(pid => pid.toString() === item.product.toString())) {
                        return s + (item.price?.amount || 0) * (item.quantity || 1);
                    }
                    return s;
                }, 0);
            }, 0);

        // Top products
        const topProducts = Object.values(productSalesMap)
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10);

        // Demand wheel (product contribution to total sales)
        const demandWheel = topProducts.slice(0, 7).map(p => ({
            name: p.title.length > 20 ? p.title.slice(0, 20) + '…' : p.title,
            value: p.sold,
            revenue: p.revenue,
        }));

        // Trend data — daily sales for last 30 days per product
        const trendDays = 30;
        const trendStart = startOfDay(trendDays);
        const trendOrders = completedOrders.filter(o => new Date(o.createdAt) >= trendStart);
        
        // Build daily aggregation
        const trendMap = {};
        trendOrders.forEach(order => {
            const dateKey = new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            if (!trendMap[dateKey]) trendMap[dateKey] = { date: dateKey, revenue: 0, orders: 0 };
            order.items.forEach(item => {
                if (productIds.some(pid => pid.toString() === item.product.toString())) {
                    trendMap[dateKey].revenue += (item.price?.amount || 0) * (item.quantity || 1);
                    trendMap[dateKey].orders += item.quantity || 1;
                }
            });
        });
        const trendData = Object.values(trendMap).sort((a, b) => new Date(a.date) - new Date(b.date));

        // Category analytics
        const categoryMap = {};
        Object.values(productSalesMap).forEach(p => {
            if (!categoryMap[p.category]) {
                categoryMap[p.category] = { name: p.category, orders: 0, revenue: 0 };
            }
            categoryMap[p.category].orders += p.sold;
            categoryMap[p.category].revenue += p.revenue;
        });
        const categoryStats = Object.values(categoryMap).sort((a, b) => b.revenue - a.revenue);

        // Inventory
        const inventory = products.map(p => {
            const sales = productSalesMap[p._id.toString()];
            const sold = sales?.sold || 0;
            const status = p.stock === 0 ? 'out_of_stock' : p.stock <= 5 ? 'low_stock' : 'in_stock';
            return {
                id: p._id.toString(),
                title: p.title,
                category: p.category,
                stock: p.stock,
                sold,
                revenue: sales?.revenue || 0,
                status,
                active: p.active !== false,
                price: p.price?.amount || 0,
                currency: p.price?.currency || 'INR',
                description: p.description || '',
                images: p.images || [],
                specs: p.specs || [],
            };
        }).sort((a, b) => a.stock - b.stock);

        // Products summary
        const activeProducts = products.filter(p => p.active !== false && p.stock > 0).length;
        const outOfStockProducts = products.filter(p => p.stock === 0).length;
        const conversionRate = allOrders.length > 0
            ? Math.round((completedOrders.length / Math.max(allOrders.length, 1)) * 100 * 10) / 10
            : 0;

        // Generate AI insights
        const aiInsights = generateAiInsights({ topProducts, inventory, monthlyRevenue, categoryStats });

        return res.json({
            // KPI widgets
            totalProducts: products.length,
            activeProducts,
            outOfStockProducts,
            totalOrders: allOrders.length,
            pendingOrders: pendingOrders.length,
            totalRevenue: Math.round(totalRevenue),
            monthlyRevenue: Math.round(monthlyRev),
            totalSales,
            conversionRate,

            // Charts
            revenueByMonth: monthlyRevenue,
            trendData,
            demandWheel,
            topProducts,
            categoryStats,

            // Inventory table
            inventory,

            // AI Insights
            aiInsights,
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function getOrders(req, res) {
    try {
        const seller = req.user;
        const products = await productModel.find({ seller: seller.id });
        const productIds = products.map(p => p._id);

        const orders = await orderModel.find({ 'items.product': { $in: productIds } }).sort({ createdAt: -1 });

        const filteredOrders = await Promise.all(orders.map(async order => {
            const filteredItems = order.items.filter(item =>
                productIds.some(pid => pid.toString() === item.product.toString())
            );
            
            const customer = await userModel.findById(order.user);
            const customerName = customer 
                ? (customer.fullName?.firstName ? `${customer.fullName.firstName} ${customer.fullName.lastName || ''}` : customer.username)
                : `Customer #${order.user.toString().slice(-4)}`;

            return {
                ...order.toObject(),
                customerName,
                items: filteredItems.map(item => ({
                    ...item.toObject(),
                    productTitle: products.find(p => p._id.toString() === item.product.toString())?.title || 'Unknown'
                }))
            };
        }));

        const finalOrders = filteredOrders.filter(order => order.items.length > 0);
        return res.json(finalOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body; // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
        const seller = req.user;

        const products = await productModel.find({ seller: seller.id });
        const productIds = products.map(p => p._id.toString());

        const order = await orderModel.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const hasSellerProduct = order.items.some(item => 
            productIds.includes(item.product.toString())
        );

        if (!hasSellerProduct) {
            return res.status(403).json({ message: 'Forbidden: You do not own any products in this order' });
        }

        order.status = status;
        await order.save();

        await publishToQueue('ORDER_SERVICE.ORDER_STATUS_UPDATED', { orderId: id, status });

        return res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function getProducts(req, res) {
    try {
        const seller = req.user;
        const products = await productModel.find({ seller: seller.id }).sort({ createdAt: -1 });
        return res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = { getMetrics, getOrders, getProducts, updateOrderStatus };
