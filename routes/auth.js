const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { validateRegistration, validateLogin } = require('../middleware/validators');
const { generateVerificationToken, sendVerificationEmail, sendWelcomeEmail } = require('../services/emailService');

const isDev = process.env.NODE_ENV === 'development';

// Register new user with email verification
router.post('/register', validateRegistration, async (req, res) => {
    try {
        const { username, email, password, full_name, phone } = req.body;

        // Check if user already exists
        const [existing] = await pool.query(
            'SELECT id, is_verified FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existing.length > 0) {
            if (!existing[0].is_verified) {
                return res.status(400).json({
                    success: false,
                    message: 'Account exists but not verified. Please check your email for verification link.'
                });
            }
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Check for duplicate phone number if provided
        if (phone) {
            const [existingPhone] = await pool.query(
                'SELECT id FROM users WHERE phone = ?',
                [phone]
            );
            if (existingPhone.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number already in use'
                });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Insert new user
        const [result] = await pool.query(
            `INSERT INTO users (username, email, password, full_name, phone, verification_token, verification_token_expires, is_verified) 
             VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)`,
            [username, email, hashedPassword, full_name || null, phone || null, verificationToken, tokenExpires]
        );

        // Send verification email
        const emailResult = await sendVerificationEmail(email, username, verificationToken);

        if (!emailResult.success) {
            console.warn('Email send failed, but user was created');
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
            userId: result.insertId,
            emailSent: emailResult.success
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: isDev ? `Registration error: ${error.message}` : 'Server error during registration'
        });
    }
});

// Verify email with token
router.get('/verify-email/:token', async (req, res) => {
    try {
        const { token } = req.params;

        // Find user with valid token
        const [users] = await pool.query(
            `SELECT id, username, email, is_verified, verification_token_expires 
             FROM users 
             WHERE verification_token = ? AND verification_token_expires > NOW()`,
            [token]
        );

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        const user = users[0];

        if (user.is_verified) {
            return res.status(400).json({
                success: false,
                message: 'Email already verified'
            });
        }

        // Update user as verified
        await pool.query(
            'UPDATE users SET is_verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = ?',
            [user.id]
        );

        // Send welcome email
        await sendWelcomeEmail(user.email, user.username);

        // Generate JWT token for auto-login
        const jwtToken = jwt.sign(
            { id: user.id, email: user.email, username: user.username, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Email verified successfully! You can now login.',
            token: jwtToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: 'customer'
            }
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({
            success: false,
            message: isDev ? `Verification error: ${error.message}` : 'Server error during verification'
        });
    }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Find unverified user
        const [users] = await pool.query(
            'SELECT id, username, email, is_verified FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email'
            });
        }

        const user = users[0];

        if (user.is_verified) {
            return res.status(400).json({
                success: false,
                message: 'Email already verified'
            });
        }

        // Generate new verification token
        const verificationToken = generateVerificationToken();
        const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Update token
        await pool.query(
            'UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE id = ?',
            [verificationToken, tokenExpires, user.id]
        );

        // Send verification email
        const emailResult = await sendVerificationEmail(user.email, user.username, verificationToken);

        if (!emailResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email'
            });
        }

        res.json({
            success: true,
            message: 'Verification email sent! Please check your inbox.'
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: isDev ? `Resend error: ${error.message}` : 'Server error'
        });
    }
});

// Login user (only verified users)
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const [users] = await pool.query(
            'SELECT id, username, email, password, role, full_name, is_verified FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Check if email is verified
        if (!user.is_verified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in. Check your inbox for the verification link.',
                needsVerification: true
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: isDev ? `Login error: ${error.message}` : 'Server error during login'
        });
    }
});

// Get current user profile
router.get('/profile', require('../middleware/auth').authenticate, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, username, email, full_name, phone, role, is_verified, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: isDev ? `Profile error: ${error.message}` : 'Server error'
        });
    }
});

module.exports = router;
