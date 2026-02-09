// ============================================
// MAIZY STORE - JavaScript Application
// Modern E-Commerce Frontend
// ============================================

// Configuration
const API_URL = window.location.origin + '/api';
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let cart = [];
let products = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadProducts();

    if (authToken) {
        loadUserProfile();
        loadCart();
    }
});

// Initialize application
function initializeApp() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Auth button
    document.getElementById('auth-btn').addEventListener('click', () => {
        if (authToken) {
            logout();
        } else {
            openModal('auth-modal');
        }
    });

    // Cart button
    document.getElementById('cart-btn').addEventListener('click', () => {
        if (!authToken) {
            showNotification('Please login to view cart', 'error');
            openModal('auth-modal');
            return;
        }
        loadCart();
        openModal('cart-modal');
    });

    // Mobile menu toggle
    document.getElementById('mobile-toggle').addEventListener('click', () => {
        document.getElementById('nav-menu').classList.toggle('active');
    });

    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchAuthTab(tabName);
        });
    });

    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Register form
    document.getElementById('register-form').addEventListener('submit', handleRegister);

    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.dataset.category);
        });
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            scrollToSection(target);
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            document.getElementById('nav-menu').classList.remove('active');
        });
    });
}

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    if (authToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageEl = document.getElementById('login-message');

    try {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('authToken', authToken);

        messageEl.textContent = 'Login successful!';
        messageEl.className = 'form-message success';

        setTimeout(() => {
            closeModal('auth-modal');
            updateAuthUI();
            loadCart();
            location.reload();
        }, 1000);
    } catch (error) {
        messageEl.textContent = error.message;
        messageEl.className = 'form-message error';
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const full_name = document.getElementById('register-fullname').value;
    const phone = document.getElementById('register-phone').value;
    const messageEl = document.getElementById('register-message');

    try {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, full_name, phone })
        });

        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('authToken', authToken);

        messageEl.textContent = 'Registration successful!';
        messageEl.className = 'form-message success';

        setTimeout(() => {
            closeModal('auth-modal');
            updateAuthUI();
            loadCart();
            location.reload();
        }, 1000);
    } catch (error) {
        messageEl.textContent = error.message;
        messageEl.className = 'form-message error';
    }
}

async function loadUserProfile() {
    try {
        const data = await apiRequest('/auth/profile');
        currentUser = data.user;
        updateAuthUI();
    } catch (error) {
        console.error('Failed to load profile:', error);
        logout();
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    cart = [];
    localStorage.removeItem('authToken');
    updateAuthUI();
    updateCartCount();
    location.reload();
}

function updateAuthUI() {
    const authBtn = document.getElementById('auth-btn');
    if (currentUser) {
        authBtn.textContent = currentUser.role === 'admin' ? '👑 Admin' : currentUser.username;
        // Do nothing when clicked for logged-in users
        authBtn.onclick = () => { };
    } else {
        authBtn.textContent = 'Login';
        authBtn.onclick = () => openModal('auth-modal');
    }
}

// Product Functions
async function loadProducts() {
    const productsGrid = document.getElementById('products-grid');

    try {
        const data = await apiRequest('/products');
        products = data.products;
        displayProducts(products);
    } catch (error) {
        productsGrid.innerHTML = `
            <div class="loading-spinner">
                <p style="color: var(--error);">Failed to load products. Please try again later.</p>
            </div>
        `;
    }
}

function displayProducts(productsToDisplay) {
    const productsGrid = document.getElementById('products-grid');

    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = `
            <div class="loading-spinner">
                <p>No products found</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = productsToDisplay.map(product => {
        const features = Array.isArray(product.features) ? product.features : [];
        return `
            <div class="product-card" onclick="showProductDetails(${product.id})">
                <div class="product-image">
                    ${product.image_url
                ? `<img src="${product.image_url}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='${getProductIcon(product.category)}'">`
                : getProductIcon(product.category)}
                </div>
                <div class="product-body">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description || ''}</p>
                    <div class="product-features">
                        ${features.slice(0, 2).map(f => `<span class="feature-tag">${f}</span>`).join('')}
                    </div>
                    <div class="product-footer">
                        <div>
                            <div class="product-price">${parseFloat(product.price).toFixed(2)} LKR</div>
                            <div class="product-duration">${product.duration}</div>
                        </div>
                        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getProductIcon(category) {
    const icons = {
        'streaming': '📺',
        'vpn': '🔒',
        'editing': '✂️',
        'writing': '✍️',
        'other': '🎁'
    };
    return icons[category] || icons['other'];
}

function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const features = Array.isArray(product.features) ? product.features : [];
    const modalContent = `
        <div class="product-detail">
            <div class="product-image" style="height: 300px; font-size: 6rem;">
                ${product.image_url
            ? `<img src="${product.image_url}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='${getProductIcon(product.category)}'">`
            : getProductIcon(product.category)}
            </div>
            <div style="padding: var(--spacing-xl);">
                <span class="product-category">${product.category}</span>
                <h2 style="margin: var(--spacing-sm) 0;">${product.name}</h2>
                <p style="color: var(--text-secondary); margin-bottom: var(--spacing-md);">
                    ${product.description || ''}
                </p>
                
                <h3 style="margin-bottom: var(--spacing-sm);">Features:</h3>
                <ul style="list-style: none; margin-bottom: var(--spacing-lg);">
                    ${features.map(f => `<li style="padding: 0.5rem 0; color: var(--text-secondary);">✓ ${f}</li>`).join('')}
                </ul>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                    <div>
                        <div class="product-price" style="font-size: 2rem;">${parseFloat(product.price).toFixed(2)} LKR</div>
                        <div class="product-duration">${product.duration}</div>
                    </div>
                    <div style="color: var(--text-muted);">
                        Stock: ${product.stock} available
                    </div>
                </div>
                
                <button class="btn btn-primary btn-block" onclick="addToCart(${product.id}); closeModal('product-modal');">
                    Add to Cart
                </button>
                ${currentUser && currentUser.role === 'admin' ? `
                <button class="btn btn-secondary btn-block" style="margin-top: var(--spacing-sm);" onclick="openEditProductModal(${product.id})">
                    ✏️ Edit Product
                </button>
                ` : ''}
            </div>
        </div>
    `;

    document.getElementById('product-detail').innerHTML = modalContent;
    openModal('product-modal');
}

// Cart Functions
async function addToCart(productId) {
    if (!authToken) {
        showNotification('Please login to add items to cart', 'error');
        openModal('auth-modal');
        return;
    }

    try {
        await apiRequest('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        });

        showNotification('Product added to cart!', 'success');
        loadCart();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function loadCart() {
    if (!authToken) return;

    try {
        const data = await apiRequest('/cart');
        cart = data.items;
        displayCart();
        updateCartCount();
    } catch (error) {
        console.error('Failed to load cart:', error);
    }
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: var(--spacing-xl); color: var(--text-muted);">Your cart is empty</p>';
        cartTotal.textContent = '0.00 LKR';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${getProductIcon(item.category || 'other')}
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${parseFloat(item.price).toFixed(2)} LKR × ${item.quantity}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="btn btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" onclick="removeFromCart(${item.id})">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    cartTotal.textContent = `${total.toFixed(2)} LKR`;
}

async function updateCartQuantity(cartId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(cartId);
        return;
    }

    try {
        await apiRequest(`/cart/update/${cartId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity: newQuantity })
        });
        loadCart();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function removeFromCart(cartId) {
    try {
        await apiRequest(`/cart/remove/${cartId}`, {
            method: 'DELETE'
        });
        showNotification('Item removed from cart', 'success');
        loadCart();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Checkout Function
async function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    if (!confirm('Proceed with checkout?')) return;

    try {
        const data = await apiRequest('/orders/create', {
            method: 'POST',
            body: JSON.stringify({ payment_method: 'pending' })
        });

        showNotification(`Order ${data.order.order_number} created successfully!`, 'success');
        closeModal('cart-modal');
        cart = [];
        updateCartCount();

        setTimeout(() => {
            alert(`Thank you for your order!\n\nOrder Number: ${data.order.order_number}\nTotal: ${data.order.total_amount} LKR\n\nPlease contact support for payment details.`);
        }, 500);
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// UI Helper Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

function switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.toggle('active', form.id === `${tabName}-form`);
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
        color: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-xl);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slide animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Export functions to global scope
window.scrollToSection = scrollToSection;
window.closeModal = closeModal;
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.showProductDetails = showProductDetails;

// ============================================
// ADMIN: Edit Product Functions
// ============================================

function openEditProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const features = Array.isArray(product.features) ? product.features.join(', ') : '';

    const editModalHTML = `
        <div class="modal active" id="edit-product-modal" onclick="if(event.target === this) closeEditModal()">
            <div class="modal-content" style="max-width: 500px;">
                <button class="modal-close" onclick="closeEditModal()">&times;</button>
                <div class="modal-header">
                    <h2>Edit Product</h2>
                </div>
                <div class="modal-body">
                    <form id="edit-product-form" onsubmit="saveProduct(event, ${product.id})">
                        <div class="form-group">
                            <label style="color: var(--text-secondary); display: block; margin-bottom: 0.5rem;">Product Name</label>
                            <input type="text" class="form-control" id="edit-name" value="${product.name}" required>
                        </div>
                        <div class="form-group">
                            <label style="color: var(--text-secondary); display: block; margin-bottom: 0.5rem;">Description</label>
                            <textarea class="form-control" id="edit-description" rows="3">${product.description || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label style="color: var(--text-secondary); display: block; margin-bottom: 0.5rem;">Price (LKR)</label>
                            <input type="number" class="form-control" id="edit-price" value="${product.price}" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label style="color: var(--text-secondary); display: block; margin-bottom: 0.5rem;">Duration</label>
                            <input type="text" class="form-control" id="edit-duration" value="${product.duration}" required>
                        </div>
                        <div class="form-group">
                            <label style="color: var(--text-secondary); display: block; margin-bottom: 0.5rem;">Stock</label>
                            <input type="number" class="form-control" id="edit-stock" value="${product.stock}" required>
                        </div>
                        <div class="form-group">
                            <label style="color: var(--text-secondary); display: block; margin-bottom: 0.5rem;">Category</label>
                            <select class="form-control" id="edit-category" required>
                                <option value="streaming" ${product.category === 'streaming' ? 'selected' : ''}>Streaming</option>
                                <option value="vpn" ${product.category === 'vpn' ? 'selected' : ''}>VPN</option>
                                <option value="editing" ${product.category === 'editing' ? 'selected' : ''}>Editing</option>
                                <option value="writing" ${product.category === 'writing' ? 'selected' : ''}>Writing</option>
                                <option value="v2ray" ${product.category === 'v2ray' ? 'selected' : ''}>V2Ray</option>
                                <option value="other" ${product.category === 'other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label style="color: var(--text-secondary); display: block; margin-bottom: 0.5rem;">Features (comma separated)</label>
                            <input type="text" class="form-control" id="edit-features" value="${features}">
                        </div>
                        <div class="form-group">
                            <label style="color: var(--text-secondary); display: block; margin-bottom: 0.5rem;">Image URL</label>
                            <input type="text" class="form-control" id="edit-image-url" value="${product.image_url || ''}">
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Remove existing edit modal if any
    const existingModal = document.getElementById('edit-product-modal');
    if (existingModal) existingModal.remove();

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', editModalHTML);
    document.body.style.overflow = 'hidden';
}

function closeEditModal() {
    const modal = document.getElementById('edit-product-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

async function saveProduct(event, productId) {
    event.preventDefault();

    const name = document.getElementById('edit-name').value;
    const description = document.getElementById('edit-description').value;
    const price = parseFloat(document.getElementById('edit-price').value);
    const duration = document.getElementById('edit-duration').value;
    const stock = parseInt(document.getElementById('edit-stock').value);
    const category = document.getElementById('edit-category').value;
    const featuresStr = document.getElementById('edit-features').value;
    const imageUrl = document.getElementById('edit-image-url').value;

    const features = featuresStr.split(',').map(f => f.trim()).filter(f => f);

    try {
        await apiRequest(`/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify({
                name,
                description,
                category,
                price,
                duration,
                stock,
                features,
                image_url: imageUrl || null
            })
        });

        showNotification('Product updated successfully!', 'success');
        closeEditModal();
        closeModal('product-modal');
        loadProducts(); // Reload products to show updates
    } catch (error) {
        showNotification('Failed to update product: ' + error.message, 'error');
    }
}

// Export new admin functions
window.openEditProductModal = openEditProductModal;
window.closeEditModal = closeEditModal;
window.saveProduct = saveProduct;

window.showProductDetails = showProductDetails;
