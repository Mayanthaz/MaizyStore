const { pool } = require('../config/database');

async function checkProducts() {
    try {
        console.log('🔍 Checking Products in Database...');
        const [products] = await pool.query('SELECT id, name, category, is_active FROM products');
        console.log(`✅ Found ${products.length} products:`);
        products.forEach(p => console.log(`- [${p.id}] ${p.name} (${p.category}) Active: ${p.is_active}`));
        process.exit(0);
    } catch (error) {
        console.error('❌ Database Error:', error);
        process.exit(1);
    }
}

checkProducts();
