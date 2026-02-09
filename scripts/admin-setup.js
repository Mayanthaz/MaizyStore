const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function main() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to database.');

        // ---------------------------------------------------------
        // 1. Grant Admin Access
        // ---------------------------------------------------------
        const email = 'bimsaramaya1@gmail.com';
        console.log(`Checking user: ${email}...`);

        const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length > 0) {
            await connection.execute('UPDATE users SET role = "admin" WHERE email = ?', [email]);
            console.log(`✅ Updated existing user ${email} to ADMIN role.`);
        } else {
            console.log(`User ${email} not found. Creating new admin account...`);
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await connection.execute(
                'INSERT INTO users (username, email, password, full_name, role, is_verified) VALUES (?, ?, ?, ?, "admin", TRUE)',
                ['bimsara', email, hashedPassword, 'Bimsara Admin']
            );
            console.log(`✅ Created new admin user: ${email}`);
            console.log(`🔑 Temporary Password: admin123`);
        }

        // ---------------------------------------------------------
        // 2. Remove Duplicate Products
        // ---------------------------------------------------------
        console.log('Scanning for duplicate products...');

        const [products] = await connection.execute('SELECT id, name FROM products ORDER BY id ASC');
        const groups = {};

        products.forEach(p => {
            if (!groups[p.name]) groups[p.name] = [];
            groups[p.name].push(p.id);
        });

        let deletedCount = 0;

        for (const name in groups) {
            const ids = groups[name];
            if (ids.length > 1) {
                const keepId = ids[0];
                const removeIds = ids.slice(1);
                console.log(`🔸 Found ${ids.length} copies of "${name}". Keeping ID ${keepId}, removing IDs: ${removeIds.join(', ')}`);

                for (const removeId of removeIds) {
                    // Update dependencies before delete to handle Foreign Key Constraints

                    // 1. Update Order Items (Important history)
                    await connection.execute('UPDATE order_items SET product_id = ? WHERE product_id = ?', [keepId, removeId]);

                    // 2. Update Cart Items (Handle duplicates)
                    try {
                        await connection.execute('UPDATE cart SET product_id = ? WHERE product_id = ?', [keepId, removeId]);
                    } catch (err) {
                        // If user already has the "keep" product in cart, update fails due to UNIQUE constraint.
                        // In that case, just remove the "duplicate" product from cart.
                        await connection.execute('DELETE FROM cart WHERE product_id = ?', [removeId]);
                    }

                    // 3. Update Reviews
                    try {
                        await connection.execute('UPDATE reviews SET product_id = ? WHERE product_id = ?', [keepId, removeId]);
                    } catch (err) {
                        await connection.execute('DELETE FROM reviews WHERE product_id = ?', [removeId]);
                    }

                    // 4. Finally Delete the Product
                    await connection.execute('DELETE FROM products WHERE id = ?', [removeId]);
                    deletedCount++;
                }
            }
        }

        if (deletedCount > 0) {
            console.log(`✅ Successfully removed ${deletedCount} duplicate products.`);
        } else {
            console.log('✅ No duplicates found.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

main();
