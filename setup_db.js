const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    console.log('🔄 Starting Database Setup...');

    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    };

    try {
        // Connect to MySQL server (without selecting DB)
        const connection = await mysql.createConnection(config);
        console.log('✅ Connected to MySQL server');

        // Create database
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'maizy_store'}`);
        console.log(`✅ Database '${process.env.DB_NAME || 'maizy_store'}' created or already exists`);

        // Use the database
        await connection.changeUser({ database: process.env.DB_NAME || 'maizy_store' });

        // Read schema.sql
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split queries by semicolon (simple split, works for basic schema)
        const queries = schema.split(';').filter(query => query.trim().length > 0);

        for (const query of queries) {
            await connection.query(query);
        }

        console.log('✅ Database schema imported successfully!');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    }
}

setupDatabase();
