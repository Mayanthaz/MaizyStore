import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email.trim() || !password.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        setIsLoading(true)

        try {
            const result = await login(email, password)
            if (result.success) {
                navigate('/')
            }
        } catch (err) {
            console.error('Login error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        navigate('/')
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%)' }}>
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '50%', background: 'rgba(102, 126, 234, 0.15)', borderRadius: '50%', filter: 'blur(120px)' }} />
                <div style={{ position: 'absolute', top: '40%', right: '-10%', width: '40%', height: '40%', background: 'rgba(245, 87, 108, 0.15)', borderRadius: '50%', filter: 'blur(120px)' }} />
                <div style={{ position: 'absolute', bottom: '-20%', left: '20%', width: '30%', height: '30%', background: 'rgba(79, 172, 254, 0.15)', borderRadius: '50%', filter: 'blur(100px)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}
            >
                <div className="glass" style={{
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '40px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>

                    {/* Close Button */}
                    <motion.button
                        type="button"
                        onClick={handleClose}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'rgba(255, 255, 255, 0.5)',
                            transition: 'all 0.3s ease',
                            zIndex: 20
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'
                            e.currentTarget.style.color = '#ef4444'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'
                        }}
                        title="Close"
                    >
                        <X size={18} />
                    </motion.button>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            style={{
                                display: 'inline-flex',
                                padding: '16px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(245, 87, 108, 0.2))',
                                marginBottom: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            <LogIn style={{ width: '36px', height: '36px', color: 'white' }} />
                        </motion.div>
                        <motion.h2
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}
                        >
                            Welcome Back
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            style={{ color: '#9ca3af' }}
                        >
                            Sign in to continue to Maizy Store
                        </motion.p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div style={{ position: 'relative' }}>
                                <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        paddingLeft: '44px',
                                        paddingRight: '16px',
                                        paddingTop: '14px',
                                        paddingBottom: '14px',
                                        color: 'white',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    placeholder="Email address"
                                    required
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--primary-solid)'
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)'
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                                        e.target.style.boxShadow = 'none'
                                    }}
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        paddingLeft: '44px',
                                        paddingRight: '48px',
                                        paddingTop: '14px',
                                        paddingBottom: '14px',
                                        color: 'white',
                                        fontSize: '15px',
                                        fontWeight: '500',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    placeholder="Password"
                                    required
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--primary-solid)'
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)'
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                                        e.target.style.boxShadow = 'none'
                                    }}
                                />
                                {/* Show/Hide Password Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#6b7280',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </motion.div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', padding: '0 4px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '4px',
                                        accentColor: 'var(--primary-solid)'
                                    }}
                                />
                                <span style={{ color: '#9ca3af' }}>Remember me</span>
                            </label>
                            <Link to="/forgot-password" style={{ color: 'var(--primary-solid)', fontWeight: '500', textDecoration: 'none', transition: 'opacity 0.2s' }}>
                                Forgot Password?
                            </Link>
                        </div>

                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ delay: 0.6 }}
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '14px',
                                borderRadius: '12px',
                                border: 'none',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                fontSize: '16px',
                                boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: isLoading ? 0.7 : 1,
                                transition: 'all 0.3s ease',
                                marginTop: '8px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {isLoading ? (
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                    borderTopColor: 'white',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }} />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={20} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        style={{
                            marginTop: '28px',
                            paddingTop: '20px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center'
                        }}
                    >
                        <p style={{ color: '#9ca3af' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none', transition: 'color 0.2s' }}>
                                Create Account
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
