import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Calendar, Shield, LogOut, Package, Clock, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('overview')

    if (!user) {
        return (
            <div className="min-h-screen pt-40 flex items-center justify-center">
                <p className="text-gray-400">Please login to view your profile.</p>
            </div>
        )
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    // Mock order history (would come from API)
    const orders = [
        { id: '#MZy-9281', item: 'Netflix Premium 4K', date: 'Feb 08, 2026', status: 'Completed', price: 4.99 },
        { id: '#MZy-8472', item: 'Spotify Individual', date: 'Jan 24, 2026', status: 'Completed', price: 2.99 },
    ]

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-12 px-4 md:px-8 container mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-12 glass p-8 rounded-3xl border border-white/5">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-purple-500/20">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-white mb-2">{user.full_name || user.username}</h1>
                        <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                            <Mail size={16} /> {user.email}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/20 flex items-center gap-1">
                                <Shield size={12} /> VERIFIED MEMBER
                            </span>
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/20 flex items-center gap-1">
                                <Calendar size={12} /> JOINED 2026
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors font-bold border border-red-500/10"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="space-y-2">
                        {[
                            { id: 'overview', label: 'Overview', icon: User },
                            { id: 'orders', label: 'Order History', icon: Package },
                            { id: 'settings', label: 'Account Settings', icon: Shield },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all ${activeTab === tab.id
                                    ? 'bg-white/10 text-white border border-white/10 shadow-lg'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <tab.icon size={20} className={activeTab === tab.id ? 'text-purple-400' : ''} />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="glass p-8 rounded-3xl border border-white/5 min-h-[400px]">

                            {activeTab === 'overview' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">Personal Information</h2>
                                    <div className="grid gap-6">
                                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Username</p>
                                            <p className="text-white font-medium">{user.username}</p>
                                        </div>
                                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                                            <p className="text-white font-medium">{user.email}</p>
                                        </div>
                                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Role</p>
                                            <p className="text-white font-medium capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'orders' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">Recent Orders</h2>
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <div key={order.id} className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                                        <Package size={20} className="text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold">{order.item}</p>
                                                        <p className="text-xs text-gray-500">{order.date}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-green-400 text-sm font-bold">{order.status}</p>
                                                    <p className="text-white font-mono">{order.price} LKR</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="text-center pt-4">
                                            <button className="text-purple-400 hover:text-purple-300 text-sm font-bold flex items-center justify-center gap-2 mx-auto">
                                                View All Orders <ExternalLink size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'settings' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <Shield size={32} className="text-gray-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Account Security</h3>
                                    <p className="text-gray-400 max-w-xs mx-auto mb-6">
                                        Manage your password and security questions here.
                                    </p>
                                    <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium">
                                        Change Password
                                    </button>
                                </motion.div>
                            )}

                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
