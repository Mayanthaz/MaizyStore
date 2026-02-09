const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Body limit is also good for security
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static('public'));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'MAIZY STORE API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
async function startServer() {
    try {
        // Test database connection
        const dbConnected = await testConnection();

        if (!dbConnected) {
            console.warn('⚠️  Database connection failed, but server will continue...');
            console.warn('Please check your database configuration in .env file');
        }

        app.listen(PORT, () => {
            console.log('╔════════════════════════════════════════════╗');
            console.log('║         MAIZY STORE - API SERVER          ║');
            console.log('╚════════════════════════════════════════════╝');
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 API endpoint: http://localhost:${PORT}/api`);
            console.log(`💻 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log('════════════════════════════════════════════');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
