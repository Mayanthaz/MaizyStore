const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validators');

// Generate unique order number
function generateOrderNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `ORD-${timestamp}-${random}`.toUpperCase();
}

// Create order from cart
router.post('/create', authenticate, async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Get cart items
        const [cartItems] = await connection.query(
            `SELECT c.*, p.name, p.price, p.stock 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ? AND p.is_active = TRUE`,
            [req.user.id]
        );

        if (cartItems.length === 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Validate stock for all items
        for (const item of cartItems) {
            if (item.stock < item.quantity) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.name}`
                });
            }
        }

        // Calculate total
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order
        const orderNumber = generateOrderNumber();
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, order_number, total_amount, payment_method, notes) 
             VALUES (?, ?, ?, ?, ?)`,
            [req.user.id, orderNumber, totalAmount, req.body.payment_method || 'pending', req.body.notes || null]
        );

        const orderId = orderResult.insertId;

        // Create order items and update product stock
        for (const item of cartItems) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, product_name, price, quantity) 
                 VALUES (?, ?, ?, ?, ?)`,
                [orderId, item.product_id, item.name, item.price, item.quantity]
            );

            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Clear cart
        await connection.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: {
                id: orderId,
                order_number: orderNumber,
                total_amount: parseFloat(totalAmount.toFixed(2)),
                items: cartItems.length
            }
        });
    } catch (error) {
        await connection.rollback();
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating order'
        });
    } finally {
        connection.release();
    }
});

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT o.*, 
             (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
             FROM orders o 
             WHERE o.user_id = ? 
             ORDER BY o.created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get order details
router.get('/:order_number', authenticate, async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT * FROM orders WHERE order_number = ? AND user_id = ?`,
            [req.params.order_number, req.user.id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const [items] = await pool.query(
            `SELECT * FROM order_items WHERE order_id = ?`,
            [orders[0].id]
        );

        res.json({
            success: true,
            order: orders[0],
            items
        });
    } catch (error) {
        console.error('Get order details error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get all orders (admin only)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
    try {
        const { status, limit = 100, offset = 0 } = req.query;

        let query = `SELECT o.*, u.username, u.email,
                     (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
                     FROM orders o 
                     JOIN users u ON o.user_id = u.id`;
        const params = [];

        if (status) {
            query += ' WHERE o.status = ?';
            params.push(status);
        }

        query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [orders] = await pool.query(query, params);

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Update order status (admin only)
router.put('/admin/:id/status', authenticate, isAdmin, async (req, res) => {
    try {
        const { status, payment_status } = req.body;

        if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const updates = ['status = ?'];
        const params = [status];

        if (payment_status && ['unpaid', 'paid', 'refunded'].includes(payment_status)) {
            updates.push('payment_status = ?');
            params.push(payment_status);
        }

        params.push(req.params.id);

        const [result] = await pool.query(
            `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
            params
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order updated successfully'
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
