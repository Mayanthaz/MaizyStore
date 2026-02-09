const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function verifyUser() {
    // Get email from command line args (node scripts/verify-user.js <email>)
    const email = process.argv[2];

    if (!email) {
        console.error('❌ Please provide an email address.');
        console.log('Usage: node scripts/verify-user.js <email>');
        process.exit(1);
    }

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'maizy_store'
        });

        // First check if user exists
        const [users] = await connection.execute('SELECT id, is_verified FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            console.log(`❌ User '${email}' not found.`);
            console.log('Please register first!');
            await connection.end();
            process.exit(1);
        }

        if (users[0].is_verified) {
            console.log(`✅ User '${email}' is already verified.`);
            await connection.end();
            process.exit(0);
        }

        // Verify user
        const [result] = await connection.execute(
            'UPDATE users SET is_verified = TRUE WHERE email = ?',
            [email]
        );

        console.log(`✅ SUCCESS! User '${email}' has been manually verified.`);
        console.log('You can now login at http://localhost:5173/login');

        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

verifyUser();
