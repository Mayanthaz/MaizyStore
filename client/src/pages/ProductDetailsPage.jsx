import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowLeft, Star, Shield, Zap, Check } from 'lucide-react'
import { productsAPI, cartAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ProductDetailsPage() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Try fetching from API
                const response = await productsAPI.getBySlug(slug)
                if (response.data) {
                    setProduct(response.data.product || response.data)
                }
            } catch (error) {
                console.error("Failed to fetch product", error)
                // Fallback handling or error notification
                toast.error("Product not found")
                navigate('/products')
            } finally {
                setLoading(false)
            }
        }

        if (slug) {
            fetchProduct()
        }
    }, [slug, navigate])

    const addToCart = async () => {
        if (!user) {
            toast.error('Please login to add items to cart')
            return
        }

        try {
            await cartAPI.add(product.id, 1)
            toast.success(`${product.name} added to cart! 🛒`)
        } catch (error) {
            console.error("Add to cart failed", error)
            toast.error("Failed to add to cart")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        )
    }

    if (!product) return null

    // Parse features if string
    const features = typeof product.features === 'string'
        ? JSON.parse(product.features)
        : (product.features || [])

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-12 px-4 md:px-8 container mx-auto">
            <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 md:mb-8 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Products
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                >
                    <div className="glass rounded-3xl overflow-hidden p-8 border border-white/10 aspect-square flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                        <img
                            src={product.image_url || '/placeholder.png'}
                            alt={product.name}
                            className="w-full h-full object-contain filter drop-shadow-2xl"
                        />
                    </div>
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-purple-500/20 blur-3xl -z-10 rounded-full" />
                </motion.div>

                {/* Details Section */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30 uppercase tracking-wider">
                                {product.category}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-400">
                                <Star size={16} fill="currentColor" />
                                <span className="font-bold text-sm">4.9</span>
                                <span className="text-gray-500 text-sm">(120+ reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="p-6 glass rounded-2xl border border-white/5 space-y-4">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Price</p>
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold text-white space-grotesk">{product.price}LKR</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Duration</p>
                                <p className="text-lg font-medium text-white">{product.duration || '1 Month'}</p>
                            </div>
                        </div>

                        <button
                            onClick={addToCart}
                            disabled={!product.stock}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-lg ${product.stock > 0
                                ? 'bg-gradient-primary text-white shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02]'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <ShoppingCart size={24} />
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <Shield size={14} /> Secure Payment & Instant Delivery
                        </div>
                    </div>

                    {/* Features List */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Zap className="text-yellow-400" /> Premium Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                        <Check size={14} className="text-green-400" />
                                    </div>
                                    <span className="text-gray-300 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
