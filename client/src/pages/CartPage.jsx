import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { cartAPI, ordersAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function CartPage() {
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [checkingOut, setCheckingOut] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchCart()
    }, [])

    const fetchCart = async () => {
        try {
            const { data } = await cartAPI.get()
            setCartItems(data.items || [])
            setLoading(false)
        } catch (error) {
            toast.error('Failed to load cart')
            setLoading(false)
        }
    }

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return
        try {
            await cartAPI.update(id, newQuantity)
            setCartItems(items => items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            ))
        } catch (error) {
            toast.error('Failed to update quantity')
        }
    }

    const removeItem = async (id) => {
        try {
            await cartAPI.remove(id)
            setCartItems(items => items.filter(item => item.id !== id))
            toast.success('Item removed')
        } catch (error) {
            toast.error('Failed to remove item')
        }
    }

    const handleCheckout = async () => {
        if (cartItems.length === 0) return

        setCheckingOut(true)
        try {
            // For now, we simulate checkout. In a real app, this would redirect to payment
            const { data } = await ordersAPI.create({
                payment_method: 'card' // Default for now
            })

            toast.success('Order placed successfully! 🎉')
            setCartItems([])
            navigate('/products') // Or order success page
        } catch (error) {
            toast.error(error.response?.data?.message || 'Checkout failed')
        } finally {
            setCheckingOut(false)
        }
    }

    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="spinner"></div>
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-12 min-h-[80vh]">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <ShoppingBag className="text-purple-400" />
                Your Cart
            </h1>

            {cartItems.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 glass rounded-2xl border border-white/5"
                >
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={40} className="text-gray-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                    <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
                    <Link
                        to="/products"
                        className="px-8 py-3 bg-gradient-primary rounded-xl text-white font-bold hover-lift inline-flex items-center gap-2"
                    >
                        Start Shopping <ArrowRight size={18} />
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {cartItems.map(item => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    key={item.id}
                                    className="glass p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                                >
                                    <div className={`w-full sm:w-20 h-20 rounded-lg bg-gradient-to-br ${getGradient(item.category)} flex items-center justify-center shrink-0`}>
                                        <span className="text-2xl">📦</span>
                                    </div>

                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-white">{item.name}</h3>
                                                <p className="text-sm text-gray-400 capitalize">{item.category}</p>
                                                <p className="text-purple-400 font-bold mt-1">{item.price}LKR</p>
                                            </div>

                                            {/* Mobile delete button shown at top right */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="sm:hidden p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex w-full sm:w-auto items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:text-white text-gray-400 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:text-white text-gray-400 transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        {/* Desktop delete button */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="hidden sm:block p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                </motion.div>

                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Checkout Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass p-6 rounded-2xl border border-white/10 sticky top-24">
                            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{total.toFixed(2)}LKR</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax</span>
                                    <span>0.00LKR</span>
                                </div>
                                <div className="border-t border-white/10 pt-3 flex justify-between text-xl font-bold text-white">
                                    <span>Total</span>
                                    <span>{total.toFixed(2)}LKR</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={checkingOut}
                                className="w-full py-4 bg-gradient-primary rounded-xl text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 glow disabled:opacity-50"
                            >
                                {checkingOut ? (
                                    <div className="spinner w-5 h-5 border-2" />
                                ) : (
                                    <>
                                        Checkout Now <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                Secure checkout powered by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function getGradient(category) {
    switch (category?.toLowerCase()) {
        case 'streaming': return 'from-red-600 to-red-900'
        case 'vpn': return 'from-blue-600 to-blue-900'
        case 'editing': return 'from-purple-600 to-purple-900'
        default: return 'from-gray-600 to-gray-900'
    }
}
