const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

const products = [
    {
        name: 'Netflix Premium 4K',
        slug: 'netflix-premium-4k',
        description: 'Ultra HD streaming, 4 screens, download supported. 1 Month warranty.',
        price: 800,
        category: 'streaming',
        image_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop',
        stock: 50,
        duration: '1 Month',
        features: JSON.stringify(["4K Ultra HD", "4 Screens", "Download Content", "No Ads"])
    },
    {
        name: 'CapCut Pro',
        slug: 'capcut-pro',
        description: 'Unlock all pro features, effects, and removing watermark.',
        price: 400,
        category: 'editing',
        image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
        stock: 100,
        duration: '1 Month',
        features: JSON.stringify(["Pro Effects", "No Watermark", "Cloud Storage", "Priority Export"])
    },
    {
        name: 'Quillbot Premium',
        slug: 'quillbot-premium',
        description: 'Unlimited paraphrasing, grammar checker, and summarizer tool.',
        price: 700,
        category: 'writing',
        image_url: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=1000&auto=format&fit=crop',
        stock: 30,
        duration: '1 Year',
        features: JSON.stringify(["Unlimited Paraphraser", "Grammar Checker", "Plagiarism Checker", "Summarizer"])
    },
    {
        name: 'Surfshark VPN',
        slug: 'surfshark-vpn',
        description: 'Unlimited devices, CleanWeb, Bypasser. 2 Year Plan account.',
        price: 500,
        category: 'vpn',
        image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
        stock: 45,
        duration: '1 Month',
        features: JSON.stringify(["Unlimited Devices", "CleanWeb", "Bypasser", "High Speed"])
    },
    {
        name: 'NordVPN Premium',
        slug: 'nordvpn-premium',
        description: 'Secure internet access with 5000+ servers worldwide. 1 Year.',
        price: 500,
        category: 'vpn',
        image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?q=80&w=1000&auto=format&fit=crop',
        stock: 60,
        duration: '1 Month',
        features: JSON.stringify(["5000+ Servers", "No Logs", "Threat Protection", "Fast Speed"])
    },
    {
        name: 'YouTube Premium',
        slug: 'youtube-premium',
        description: 'Ad-free videos, background play, and YouTube Music Premium.',
        price: 270,
        category: 'streaming',
        image_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000&auto=format&fit=crop',
        stock: 90,
        duration: '1 Month',
        features: JSON.stringify(["Ad-free", "Background Play", "YouTube Music", "Offline Downloads"])
    },
    {
        name: 'V2Ray 100GB',
        slug: 'v2ray-100gb',
        description: 'High-speed V2Ray connection with 100GB data limit.',
        price: 200,
        category: 'v2ray',
        image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?q=80&w=1000&auto=format&fit=crop',
        stock: 100,
        duration: '1 Month',
        features: JSON.stringify(["100GB Data", "High Speed", "Secure", "V2Ray Protocol"])
    },
    {
        name: 'V2Ray 200GB',
        slug: 'v2ray-200gb',
        description: 'High-speed V2Ray connection with 200GB data limit.',
        price: 300,
        category: 'v2ray',
        image_url: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1000&auto=format&fit=crop',
        stock: 100,
        duration: '1 Month',
        features: JSON.stringify(["200GB Data", "High Speed", "Secure", "V2Ray Protocol"])
    },
    {
        name: 'V2Ray Unlimited',
        slug: 'v2ray-unlimited',
        description: 'Unlimited data V2Ray connection for heavy users.',
        price: 500,
        category: 'v2ray',
        image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
        stock: 100,
        duration: '1 Month',
        features: JSON.stringify(["Unlimited Data", "High Speed", "Secure", "V2Ray Protocol"])
    }
];

async function seedProducts() {
    console.log('🌱 Seeding Products...');

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'maizy_store'
        });

        // We use INSERT IGNORE to skip if slug exists, or we could use ON DUPLICATE KEY UPDATE
        // Let's use ON DUPLICATE UPDATE to ensure prices/details are correct
        for (const product of products) {
            await connection.execute(
                `INSERT INTO products (name, slug, description, price, category, image_url, stock, duration, features) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE 
                 description = VALUES(description),
                 price = VALUES(price),
                 category = VALUES(category),
                 image_url = VALUES(image_url),
                 stock = VALUES(stock),
                 duration = VALUES(duration),
                 features = VALUES(features)`,
                [product.name, product.slug, product.description, product.price, product.category, product.image_url, product.stock, product.duration, product.features]
            );
            console.log(`✅ Processed: ${product.name}`);
        }

        console.log('✨ Product seeding complete!');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
}

seedProducts();
