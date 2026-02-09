const mysql = require('mysql2/promise');
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
        // 1. Remove Duplicate Products (keep lowest ID)
        // ---------------------------------------------------------
        console.log('\n📦 Scanning for duplicate products...');

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
                    // Update dependencies
                    await connection.execute('UPDATE order_items SET product_id = ? WHERE product_id = ?', [keepId, removeId]);

                    try {
                        await connection.execute('UPDATE cart SET product_id = ? WHERE product_id = ?', [keepId, removeId]);
                    } catch (err) {
                        await connection.execute('DELETE FROM cart WHERE product_id = ?', [removeId]);
                    }

                    try {
                        await connection.execute('UPDATE reviews SET product_id = ? WHERE product_id = ?', [keepId, removeId]);
                    } catch (err) {
                        await connection.execute('DELETE FROM reviews WHERE product_id = ?', [removeId]);
                    }

                    await connection.execute('DELETE FROM products WHERE id = ?', [removeId]);
                    deletedCount++;
                }
            }
        }

        if (deletedCount > 0) {
            console.log(`✅ Removed ${deletedCount} duplicate products.`);
        } else {
            console.log('✅ No duplicates found.');
        }

        // ---------------------------------------------------------
        // 2. Add sort_order column if not exists
        // ---------------------------------------------------------
        console.log('\n🔧 Adding sort_order column...');
        try {
            await connection.execute('ALTER TABLE products ADD COLUMN sort_order INT DEFAULT 100');
            console.log('✅ Added sort_order column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('✅ sort_order column already exists.');
            } else {
                throw err;
            }
        }

        // ---------------------------------------------------------
        // 3. Check if ChatGPT exists, if not add it
        // ---------------------------------------------------------
        console.log('\n🤖 Checking for ChatGPT product...');
        const [chatgptCheck] = await connection.execute('SELECT id FROM products WHERE name LIKE "%ChatGPT%"');

        if (chatgptCheck.length === 0) {
            console.log('Adding ChatGPT Plus product...');
            await connection.execute(
                `INSERT INTO products (name, slug, description, category, price, duration, stock, features, image_url, sort_order) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    'ChatGPT Plus',
                    'chatgpt-plus',
                    'Access to GPT-4, faster responses, and priority access during peak times',
                    'writing',
                    1500.00,
                    '1 Month',
                    50,
                    JSON.stringify(['GPT-4 Access', 'Faster Responses', 'Priority Access', 'Advanced Features']),
                    'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
                    1
                ]
            );
            console.log('✅ Added ChatGPT Plus product.');
        } else {
            console.log('✅ ChatGPT product already exists.');
        }

        // ---------------------------------------------------------
        // 4. Set Trending Products (lower sort_order = higher priority)
        // ---------------------------------------------------------
        console.log('\n⭐ Setting trending products order...');

        const trendingProducts = [
            { pattern: '%Netflix%', order: 1 },
            { pattern: '%CapCut%', order: 2 },
            { pattern: '%Surfshark%', order: 3 },
            { pattern: '%ChatGPT%', order: 4 }
        ];

        for (const item of trendingProducts) {
            const [result] = await connection.execute(
                'UPDATE products SET sort_order = ? WHERE name LIKE ?',
                [item.order, item.pattern]
            );
            if (result.affectedRows > 0) {
                console.log(`✅ Set ${item.pattern.replace(/%/g, '')} as trending (order: ${item.order})`);
            }
        }

        // Set all other products to default order 100
        await connection.execute('UPDATE products SET sort_order = 100 WHERE sort_order IS NULL OR sort_order > 10');

        console.log('\n🎉 All done! Trending products will now appear first.');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

main();
