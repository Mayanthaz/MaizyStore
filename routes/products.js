const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validators');

// Get all products (public)
router.get('/', async (req, res) => {
    try {
        const { category, search, limit = 50, offset = 0 } = req.query;

        let query = 'SELECT * FROM products WHERE is_active = TRUE';
        const params = [];

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [products] = await pool.query(query, params);

        // Parse JSON features
        products.forEach(product => {
            if (product.features && typeof product.features === 'string') {
                try {
                    product.features = JSON.parse(product.features);
                } catch (e) {
                    product.features = [];
                }
            }
        });

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get single product by slug (public)
router.get('/:slug', async (req, res) => {
    try {
        const [products] = await pool.query(
            'SELECT * FROM products WHERE (slug = ? OR id = ?) AND is_active = TRUE',
            [req.params.slug, req.params.slug]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const product = products[0];

        // Parse JSON features
        if (product.features && typeof product.features === 'string') {
            try {
                product.features = JSON.parse(product.features);
            } catch (e) {
                product.features = [];
            }
        }

        // Get reviews
        const [reviews] = await pool.query(
            `SELECT r.*, u.username FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = ? 
             ORDER BY r.created_at DESC LIMIT 10`,
            [product.id]
        );

        res.json({
            success: true,
            product,
            reviews
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Create product (admin only)
router.post('/', authenticate, isAdmin, validateProduct, async (req, res) => {
    try {
        const { name, description, category, price, duration, stock, features, image_url } = req.body;

        // Generate slug
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const [result] = await pool.query(
            `INSERT INTO products (name, slug, description, category, price, duration, stock, features, image_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, slug, description, category, price, duration, stock, JSON.stringify(features || []), image_url || null]
        );

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product_id: result.insertId
        });
    } catch (error) {
        console.error('Create product error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Product with this name already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Update product (admin only)
router.put('/:id', authenticate, isAdmin, validateProduct, async (req, res) => {
    try {
        const { name, description, category, price, duration, stock, features, image_url, is_active } = req.body;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const [result] = await pool.query(
            `UPDATE products SET name = ?, slug = ?, description = ?, category = ?, 
             price = ?, duration = ?, stock = ?, features = ?, image_url = ?, is_active = ? 
             WHERE id = ?`,
            [name, slug, description, category, price, duration, stock,
                JSON.stringify(features || []), image_url || null,
                is_active !== undefined ? is_active : true, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Delete product (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
