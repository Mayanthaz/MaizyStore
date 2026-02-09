import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ShoppingCart, Star, Zap, Shield, Globe, PenTool } from 'lucide-react'
import { productsAPI, cartAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// Mock Data for UI Visualization
const MOCK_PRODUCTS = [
    { id: 'm1', name: 'Netflix Premium 4K', category: 'streaming', price: 800, description: 'Ultra HD streaming, 4 screens, download supported.', stock: 50, rating: 4.9, image_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop' },
    { id: 'm2', name: 'CapCut Pro', category: 'editing', price: 400, description: 'Unlock all pro features, effects, and removing watermark.', stock: 350, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop' },
    { id: 'm3', name: 'NordVPN Premium', category: 'vpn', price: 500, description: 'Secure internet access with 5000+ servers worldwide.', stock: 25, rating: 4.7, image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?q=80&w=1000&auto=format&fit=crop' },
    { id: 'm4', name: 'Surfshark VPN', category: 'vpn', price: 500, description: 'Unlimited devices, CleanWeb, Bypasser.', stock: 45, rating: 4.7, image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop' },
    { id: 'm5', name: 'Quillbot Premium', category: 'writing', price: 700, description: 'Unlimited premium content, background remover.', stock: 200, rating: 5.0, image_url: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=1000&auto=format&fit=crop' },
    { id: 'm6', name: 'YouTube Premium', category: 'streaming', price: 270, description: 'Ad-free videos, background play, and YouTube Music Premium.', stock: 90, rating: 4.6, image_url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000&auto=format&fit=crop' },
    { id: 'm7', name: 'V2Ray 100GB', category: 'v2ray', price: 200, description: 'High-speed V2Ray connection with 100GB data limit.', stock: 100, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?q=80&w=1000&auto=format&fit=crop' },
    { id: 'm8', name: 'V2Ray 200GB', category: 'v2ray', price: 300, description: 'High-speed V2Ray connection with 200GB data limit.', stock: 100, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1000&auto=format&fit=crop' },
    { id: 'm9', name: 'V2Ray Unlimited', category: 'v2ray', price: 500, description: 'Unlimited data V2Ray connection for heavy users.', stock: 100, rating: 4.9, image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop' }
]

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const { data } = await productsAPI.getAll()
            if (data.products && data.products.length > 0) {
                setProducts(data.products)
            } else {
                // Fallback to mock data if DB is empty/error
                setProducts(MOCK_PRODUCTS)
            }
            setLoading(false)
        } catch (error) {
            console.log('Using mock data due to API error')
            setProducts(MOCK_PRODUCTS)
            setLoading(false)
        }
    }

    const addToCart = async (product) => {
        if (!user) {
            toast.error('Please login to add items to cart')
            return
        }
        toast.success(`${product.name} added to cart! 🛒`)
        // API call logic kept but UI feedback is instant
        cartAPI.add(product.id, 1).catch(() => { })
    }

    const filteredProducts = products.filter(product => {
        const matchesCategory = filter === 'all' || product.category.toLowerCase() === filter.toLowerCase()
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Staggered animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen pt-28 md:pt-36 lg:pt-52 pb-12 px-4 md:px-8 container mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8 md:mb-16 space-y-4">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 pb-2"
                >
                    Premium Digital Store
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-lg max-w-2xl mx-auto"
                >
                    Discover widely popular tools and services at unbeatable prices.
                    Instant delivery to your email.
                </motion.p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 glass p-4 rounded-2xl border border-white/5 sticky top-20 z-30 backdrop-blur-xl">
                <div className="flex flex-wrap gap-2 justify-center">
                    {[
                        { id: 'all', label: 'All Items', icon: Globe },
                        { id: 'streaming', label: 'Streaming', icon: Zap },
                        { id: 'vpn', label: 'VPN & Security', icon: Shield },
                        { id: 'editing', label: 'Creative', icon: PenTool },
                        { id: 'v2ray', label: 'V2Ray', icon: Globe }
                    ].map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${filter === cat.id
                                ? 'bg-gradient-primary text-white shadow-lg shadow-purple-500/30 scale-105'
                                : 'hover:bg-white/10 text-gray-400 hover:text-white'
                                }`}
                        >
                            <cat.icon size={16} />
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search for Netflix, Spotify..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all focus:ring-1 focus:ring-purple-500/50"
                    />
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
                    <p className="text-gray-400">Loading products...</p>
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map(product => (
                            <motion.div
                                layout
                                variants={item}
                                key={product.id}
                                className="group glass rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
                            >
                                {/* Card Image Area */}
                                <div className={`h-56 bg-gradient-to-br ${getGradient(product.category)} relative overflow-hidden p-6 flex flex-col justify-between group-hover:scale-105 transition-transform duration-700`}>
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />

                                    {/* Product Image/Logo */}
                                    {product.image_url ? (
                                        <div className="absolute inset-0 flex items-center justify-center p-8 opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-contain drop-shadow-2xl filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500"
                                            />
                                        </div>
                                    ) : null}

                                    {/* Float Category Badge */}
                                    <div className="self-start px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-xs font-medium text-white z-10">
                                        {product.category?.toUpperCase()}
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                                        <h3 className="text-2xl font-bold text-white mb-1 shadow-black/50 drop-shadow-md">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-1">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                            <span className="text-white/80 text-xs font-medium">({product.rating || '5.0'})</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 relative">
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Price</p>
                                            <div className="flex items-baseline">
                                                <span className="text-2xl font-bold text-white space-grotesk">{product.price}LKR</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => navigate(`/products/${product.slug || product.id}`)}
                                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
                                            >
                                                Learn More
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => addToCart(product)}
                                                disabled={product.stock === 0}
                                                className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
                                            >
                                                <ShoppingCart size={18} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {!loading && filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Search size={40} className="text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white">No products found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter</p>
                </div>
            )}
        </div>
    )
}

function getGradient(category) {
    switch (category?.toLowerCase()) {
        case 'streaming': return 'from-rose-500 via-red-500 to-orange-500' // Vibrant Red/Orange
        case 'vpn': return 'from-cyan-500 via-blue-500 to-indigo-500' // Cool Blue/Cyan
        case 'v2ray': return 'from-blue-600 via-indigo-600 to-violet-600' // Deep Techno
        case 'editing': return 'from-fuchsia-500 via-purple-500 to-indigo-500' // Deep Purple/Pink
        case 'writing': return 'from-emerald-400 via-green-500 to-teal-500' // Fresh Green
        default: return 'from-slate-500 to-slate-800'
    }
}
