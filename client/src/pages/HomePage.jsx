import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Star, CheckCircle } from 'lucide-react'

export default function HomePage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-24 md:pt-36">
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-glow" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
                </div>

                <div className="container mx-auto text-center max-w-4xl">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="space-y-6"
                    >
                        <motion.div variants={itemVariants} className="inline-block px-4 py-2 rounded-full glass border-purple-500/30 text-purple-300 text-sm font-medium mb-4">
                            ✨ Premium Digital Store
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
                            Premium Accounts <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient">
                                Unbeatable Prices
                            </span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
                            Get instant access to Netflix, Spotify, VPNs, and more.
                            Secure delivery, warranty included, and 24/7 support.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <Link
                                to="/products"
                                className="px-8 py-4 bg-gradient-primary rounded-xl text-white font-bold text-lg hover-lift hover-glow flex items-center gap-2"
                            >
                                Browse Products <ArrowRight size={20} />
                            </Link>
                            <Link
                                to="/register"
                                className="px-8 py-4 glass rounded-xl text-white font-bold text-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                            >
                                Create Account
                            </Link>
                        </motion.div>

                        {/* Stats */}
                        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-8 pt-16 border-t border-white/5 mt-16">
                            <div>
                                <h3 className="text-3xl font-bold text-white">10K+</h3>
                                <p className="text-gray-500">Customers</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white">99.9%</h3>
                                <p className="text-gray-500">Success Rate</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white">24/7</h3>
                                <p className="text-gray-500">Support</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-black/20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl glass border border-white/5 bg-gradient-to-br from-purple-900/10 to-transparent"
                        >
                            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-6">
                                <Zap className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Instant Delivery</h3>
                            <p className="text-gray-400">
                                Receive your account credentials immediately via email after successful payment.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl glass border border-white/5 bg-gradient-to-br from-pink-900/10 to-transparent"
                        >
                            <div className="w-12 h-12 rounded-lg bg-gradient-secondary flex items-center justify-center mb-6">
                                <Shield className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Secure & Safe</h3>
                            <p className="text-gray-400">
                                We use encrypted payment gateways and never store your sensitive payment information.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl glass border border-white/5 bg-gradient-to-br from-blue-900/10 to-transparent"
                        >
                            <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center mb-6">
                                <Star className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Premium Quality</h3>
                            <p className="text-gray-400">
                                All accounts are verified and come with a replacement warranty for your peace of mind.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-500 mb-8 uppercase tracking-widest text-sm">Trusted Services</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Text placeholders for logos since we don't have SVGs handy */}
                        <h3 className="text-2xl font-bold text-white">Netflix</h3>
                        <h3 className="text-2xl font-bold text-white">Spotify</h3>
                        <h3 className="text-2xl font-bold text-white">Adobe</h3>
                        <h3 className="text-2xl font-bold text-white">NordVPN</h3>
                        <h3 className="text-2xl font-bold text-white">Canva</h3>
                    </div>
                </div>
            </section>
        </div>
    )
}
