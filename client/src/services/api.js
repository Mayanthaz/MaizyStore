import axios from 'axios'

const API_URL = '/api'

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
    resendVerification: (email) => api.post('/auth/resend-verification', { email }),
    getProfile: () => api.get('/auth/profile')
}

// Products APIs
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getBySlug: (slug) => api.get(`/products/${slug}`)
}

// Cart APIs
export const cartAPI = {
    get: () => api.get('/cart'),
    add: (productId, quantity = 1) => api.post('/cart/add', { product_id: productId, quantity }),
    update: (id, quantity) => api.put(`/cart/update/${id}`, { quantity }),
    remove: (id) => api.delete(`/cart/remove/${id}`),
    clear: () => api.delete('/cart/clear')
}

// Orders APIs
export const ordersAPI = {
    create: (data) => api.post('/orders/create', data),
    getMyOrders: () => api.get('/orders/my-orders'),
    getByNumber: (orderNumber) => api.get(`/orders/${orderNumber}`),
    getAllAdmin: (params) => api.get('/orders/admin/all', { params }),
    updateStatus: (id, status) => api.put(`/orders/admin/${id}/status`, { status })
}

// Admin APIs
export const adminAPI = {
    createProduct: (data) => api.post('/products', data),
    updateProduct: (id, data) => api.put(`/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/products/${id}`)
}

export default api
