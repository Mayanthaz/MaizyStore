const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

async function updateSchema() {
    console.log('🔄 Updating Database Schema...');

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'maizy_store'
        });

        console.log('Adding v2ray to category ENUM...');
        await connection.execute(`
            ALTER TABLE products 
            MODIFY COLUMN category ENUM('streaming', 'vpn', 'editing', 'writing', 'v2ray', 'other') NOT NULL
        `);
        console.log('✅ Schema updated successfully!');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Schema update failed:', error.message);
        process.exit(1);
    }
}

updateSchema();
