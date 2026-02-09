import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Users, DollarSign, Clock, Search, Edit2, Trash2, Plus, X, Upload } from 'lucide-react'
import { ordersAPI, productsAPI, adminAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview')
    const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, pending: 0 })
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    // Add Product Modal State
    const [showAddModal, setShowAddModal] = useState(false)
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: 'streaming',
        stock: 50,
        duration: '1 Month',
        image_url: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [productsData, ordersData] = await Promise.all([
                productsAPI.getAll(),
                ordersAPI.getAllAdmin()
            ])

            setProducts(productsData.data.products)
            setOrders(ordersData.data.orders)

            const totalRevenue = ordersData.data.orders.reduce((acc, order) => acc + parseFloat(order.total_amount), 0)
            const pendingOrders = ordersData.data.orders.filter(order => order.status === 'pending').length

            setStats({
                orders: ordersData.data.orders.length,
                revenue: totalRevenue,
                products: productsData.data.products.length,
                pending: pendingOrders
            })

            setLoading(false)
        } catch (error) {
            toast.error('Failed to load dashboard data')
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await ordersAPI.updateStatus(orderId, newStatus)
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
            toast.success('Order status updated')
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const handleCreateProduct = async (e) => {
        e.preventDefault()
        try {
            await adminAPI.createProduct(newProduct)
            toast.success('Product created successfully! 🎉')
            setShowAddModal(false)
            fetchData() // Refresh list
            setNewProduct({
                name: '', description: '', price: '', category: 'streaming', stock: 50, duration: '1 Month', image_url: ''
            })
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create product')
        }
    }

    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="spinner"></div></div>

    return (
        <div className="min-h-screen container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-lg text-white">
                    <Package size={24} />
                </div>
                Admin Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard icon={DollarSign} title="Total Revenue" value={`${stats.revenue.toFixed(2)} LKR`} color="bg-green-500/20 text-green-500" />
                <StatCard icon={Package} title="Total Orders" value={stats.orders} color="bg-blue-500/20 text-blue-500" />
                <StatCard icon={Users} title="Total Products" value={stats.products} color="bg-purple-500/20 text-purple-500" />
                <StatCard icon={Clock} title="Pending Orders" value={stats.pending} color="bg-yellow-500/20 text-yellow-500" />
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
                {['overview', 'orders', 'products'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-full capitalize font-medium transition-all ${activeTab === tab
                            ? 'bg-gradient-primary text-white'
                            : 'glass text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="glass rounded-2xl p-6 border border-white/5 min-h-[500px]">
                {activeTab === 'overview' && (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome back to MAIZY STORE! 🚀</h2>
                        <p className="text-gray-400">Everything is running smoothly.</p>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-400 border-b border-white/10">
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {orders.map(order => (
                                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono">#{order.order_number}</td>
                                        <td className="p-4">{order.username}</td>
                                        <td className="p-4 font-bold text-green-400">{order.total_amount} LKR</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className="bg-black/30 border border-white/10 rounded px-3 py-1 text-xs text-white focus:border-purple-500 focus:outline-none"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Product List</h3>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-4 py-2 bg-gradient-primary rounded-lg text-white text-sm flex items-center gap-2 hover:opacity-90 transition-all hover-lift"
                            >
                                <Plus size={16} /> Add Product
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map(product => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={product.id}
                                    className="bg-white/5 p-4 rounded-xl border border-white/5 flex gap-4 hover:border-purple-500/30 transition-colors"
                                >
                                    <div className={`w-16 h-16 rounded bg-gradient-to-br ${getGradient(product.category)} shrink-0 flex items-center justify-center`}>
                                        <Package className="text-white/50" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold truncate text-white">{product.name}</h4>
                                        <p className="text-sm text-purple-400 font-bold">{product.price} LKR</p>
                                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"><Edit2 size={16} /></button>
                                        <button className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Product Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass p-8 rounded-2xl w-full max-w-lg border border-white/10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Add New Product</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateProduct} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                                        <input
                                            required
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Category</label>
                                        <select
                                            value={newProduct.category}
                                            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
                                        >
                                            <option value="streaming">Streaming</option>
                                            <option value="vpn">VPN</option>
                                            <option value="editing">Editing</option>
                                            <option value="writing">Writing</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Price (LKR)</label>
                                        <input
                                            type="number" step="0.01" required
                                            value={newProduct.price}
                                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Stock</label>
                                        <input
                                            type="number" required
                                            value={newProduct.stock}
                                            onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                                    <textarea
                                        required
                                        value={newProduct.description}
                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none h-24"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-primary rounded-xl text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 glow"
                                >
                                    <Plus size={20} /> Create Product
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function StatCard({ icon: Icon, title, value, color }) {
    return (
        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4 hover-lift">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-gray-400 text-sm">{title}</h3>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    )
}

function getStatusColor(status) {
    switch (status) {
        case 'completed': return 'bg-green-500/20 text-green-400'
        case 'pending': return 'bg-yellow-500/20 text-yellow-400'
        case 'cancelled': return 'bg-red-500/20 text-red-400'
        default: return 'bg-gray-500/20 text-gray-400'
    }
}

function getGradient(category) {
    switch (category?.toLowerCase()) {
        case 'streaming': return 'from-red-600 to-red-900'
        case 'vpn': return 'from-blue-600 to-blue-900'
        case 'editing': return 'from-purple-600 to-purple-900'
        default: return 'from-gray-600 to-gray-900'
    }
}
