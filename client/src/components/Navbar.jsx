import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
        setShowProfileMenu(false)
    }

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/products', label: 'Products' },
        { path: '/support', label: 'Support' }, // Placeholder for broader nav
    ]

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="relative group">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 group-hover:bg-gradient-to-l transition-all duration-500">
                            MAIZY
                        </span>
                        <span className="text-2xl font-bold text-white ml-1">STORE</span>
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                    </Link>

                    {/* Desktop Menu - Centered & Spread */}
                    <div className="hidden md:flex items-center space-x-12 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative font-medium text-sm tracking-wide transition-colors duration-300 ${location.pathname === link.path ? 'text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {link.label}
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-primary rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-gray-400 hover:text-white transition-colors">
                            <SearchIcon className="w-5 h-5" />
                        </button>

                        {user ? (
                            <div className="flex items-center gap-6">
                                <Link to="/cart" className="relative group p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <ShoppingCart size={20} className="text-gray-300 group-hover:text-purple-400 transition-colors" />
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                </Link>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setShowProfileMenu(!showProfileMenu)
                                        }}
                                        className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showProfileMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-4 w-56 glass border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                                                    <p className="text-sm font-bold text-white truncate">{user.full_name || user.username}</p>
                                                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                                                </div>

                                                <div className="p-2">
                                                    {user.role === 'admin' && (
                                                        <Link
                                                            to="/admin"
                                                            className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:bg-gradient-primary hover:text-white rounded-xl flex items-center gap-3 transition-colors mb-1"
                                                            onClick={() => setShowProfileMenu(false)}
                                                        >
                                                            <LayoutDashboard size={16} /> Admin Panel
                                                        </Link>
                                                    )}

                                                    <Link
                                                        to="/profile"
                                                        className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3 transition-colors"
                                                        onClick={() => setShowProfileMenu(false)}
                                                    >
                                                        <User size={16} /> My Account
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowProfileMenu(false)
                                                            handleLogout()
                                                        }}
                                                        className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl flex items-center gap-3 transition-colors mt-1"
                                                    >
                                                        <LogOut size={16} /> Logout
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
                                >
                                    Log In
                                    <span className="absolute bottom-1 left-1/2 w-0 h-px bg-white group-hover:w-1/2 group-hover:transition-all duration-300" />
                                    <span className="absolute bottom-1 right-1/2 w-0 h-px bg-white group-hover:w-1/2 group-hover:transition-all duration-300" />
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: '100vh', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="fixed inset-0 top-[70px] bg-black/95 backdrop-blur-xl z-40 md:hidden overflow-y-auto"
                    >
                        <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="text-2xl font-bold text-gray-400 hover:text-white hover:pl-4 transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="w-full h-px bg-white/10 my-4" />

                            {user ? (
                                <>
                                    <Link to="/cart" className="flex items-center gap-4 text-xl text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
                                        <ShoppingCart size={24} /> Cart
                                    </Link>
                                    <Link to="/profile" className="flex items-center gap-4 text-xl text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
                                        <User size={24} /> Profile
                                    </Link>
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center gap-4 text-xl text-red-500 hover:text-red-400 text-left">
                                        <LogOut size={24} /> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <Link to="/login" className="py-4 text-center rounded-xl border border-white/10 text-white font-bold hover:bg-white/5" onClick={() => setIsOpen(false)}>
                                        Log In
                                    </Link>
                                    <Link to="/register" className="py-4 text-center rounded-xl bg-gradient-primary text-white font-bold" onClick={() => setIsOpen(false)}>
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

function SearchIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
