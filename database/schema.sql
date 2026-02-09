-- MAIZY STORE Database Schema
-- Created: 2026-02-09

CREATE DATABASE IF NOT EXISTS maizy_store;
USE maizy_store;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('customer', 'admin') DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_token_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_verification_token (verification_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    category ENUM('streaming', 'vpn', 'editing', 'writing', 'v2ray', 'other') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration VARCHAR(50) NOT NULL COMMENT 'e.g., 1 Month, 3 Months, Lifetime',
    stock INT DEFAULT 0,
    features JSON COMMENT 'Product features list',
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_slug (slug),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    account_credentials TEXT COMMENT 'Delivered account details (encrypted)',
    delivered_at TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Product Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Default Admin User (password: admin123)
INSERT INTO users (username, email, password, full_name, role) VALUES 
('admin', 'admin@maizystore.com', '$2a$10$Y3byeiRenhJcTq7Wv1lnkozwOnIO/nJok6dB.qpMQQ9P/v', 'Administrator', 'admin');

-- Insert Sample Products
INSERT INTO products (name, slug, description, category, price, duration, stock, features, image_url) VALUES
('Netflix Premium 4K', 'netflix-premium-4k', 'Ultra HD streaming, 4 screens, download supported. 1 Month warranty.', 'streaming', 800.00, '1 Month', 50, '["4K Ultra HD", "Multiple Devices", "Download Content", "No Ads"]', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop'),
('CapCut Pro', 'capcut-pro', 'Professional video editing with premium effects and features', 'editing', 400.00, '1 Month', 350, '["Premium Effects", "No Watermark", "HD Export", "Cloud Storage"]', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop'),
('NordVPN Premium', 'nordvpn-premium', 'Fast and secure VPN with global servers', 'vpn', 500.00, '1 Month', 500, '["5000+ Servers", "No Logs", "Kill Switch", "6 Devices"]', 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?q=80&w=1000&auto=format&fit=crop'),
('Surfshark VPN', 'surfshark-vpn', 'Unlimited devices VPN with premium features', 'vpn', 500.00, '1 Month', 500, '["Unlimited Devices", "CleanWeb", "MultiHop", "No Borders"]', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop'),
('Quillbot Premium', 'quillbot-premium', 'AI-powered writing and paraphrasing tool', 'writing', 700.00, '1 Year', 80, '["Unlimited Paraphrasing", "Plagiarism Checker", "Grammar Check", "Summarizer"]', 'https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=1000&auto=format&fit=crop'),
('YouTube Premium', 'youtube-premium', 'Ad-free YouTube with background play and downloads', 'streaming', 270.00, '1 Month', 90, '["Ad-Free Videos", "Background Play", "YouTube Music", "Download Videos"]', 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000&auto=format&fit=crop'),
('V2Ray 100GB', 'v2ray-100gb', 'High-speed V2Ray connection with 100GB data limit', 'v2ray', 200.00, '1 Month', 100, '["100GB Data", "High Speed", "Secure", "V2Ray Protocol"]', 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?q=80&w=1000&auto=format&fit=crop'),
('V2Ray 200GB', 'v2ray-200gb', 'High-speed V2Ray connection with 200GB data limit', 'v2ray', 300.00, '1 Month', 100, '["200GB Data", "High Speed", "Secure", "V2Ray Protocol"]', 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1000&auto=format&fit=crop'),
('V2Ray Unlimited', 'v2ray-unlimited', 'Unlimited data V2Ray connection', 'v2ray', 500.00, '1 Month', 100, '["Unlimited Data", "High Speed", "Secure", "V2Ray Protocol"]', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop');
