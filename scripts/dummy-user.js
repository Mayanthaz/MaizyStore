const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

async function createDummyUser() {
    try {
        const username = 'testuser';
        const email = 'testuser@example.com';
        const password = 'Password123';
        const fullName = 'Test User';
        const phone = '+94712345678';
        const hashedPassword = await bcrypt.hash(password, 10);

        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

        if (existing.length > 0) {
            console.log('Test user already exists.');
        } else {
            await pool.query(
                'INSERT INTO users (username, email, password, full_name, phone, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [username, email, hashedPassword, fullName, phone, 'customer', true]
            );
            console.log('✅ Dummy user created successfully!');
            console.log('----------------------------');
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
            console.log('----------------------------');
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating dummy user:', error);
        process.exit(1);
    }
}

createDummyUser();
