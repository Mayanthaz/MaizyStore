import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        phone: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)

        try {
            const result = await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name,
                phone: formData.phone
            })

            if (result.success) {
                navigate('/login')
            }
        } catch (err) {
            console.error('Registration error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        navigate('/')
    }

    const inputStyle = {
        width: '100%',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        paddingLeft: '40px',
        paddingRight: '16px',
        paddingTop: '12px',
        paddingBottom: '12px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        outline: 'none',
        transition: 'all 0.3s ease'
    }

    const passwordInputStyle = {
        ...inputStyle,
        paddingRight: '40px'
    }

    const labelStyle = {
        display: 'block',
        color: '#d1d5db',
        fontSize: '13px',
        fontWeight: '500',
        marginBottom: '6px'
    }

    const handleFocus = (e) => {
        e.target.style.borderColor = 'var(--primary-solid)'
        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)'
    }

    const handleBlur = (e) => {
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
        e.target.style.boxShadow = 'none'
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative Background Elements */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: '45%', height: '45%', background: 'rgba(245, 87, 108, 0.12)', borderRadius: '50%', filter: 'blur(120px)' }} />
                <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '40%', height: '40%', background: 'rgba(102, 126, 234, 0.12)', borderRadius: '50%', filter: 'blur(120px)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '30%', height: '30%', background: 'rgba(79, 172, 254, 0.08)', borderRadius: '50%', filter: 'blur(100px)' }} />
            </div>

            <div style={{ width: '100%', maxWidth: '520px', position: 'relative', zIndex: 10 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass"
                    style={{
                        padding: '36px',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        position: 'relative',
                        overflow: 'hidden',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        background: 'rgba(255, 255, 255, 0.05)'
                    }}
                >
                    {/* Decorative gradients */}
                    <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', background: 'rgba(245, 87, 108, 0.15)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '160px', height: '160px', background: 'rgba(102, 126, 234, 0.15)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

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

                    <div style={{ textAlign: 'center', marginBottom: '28px', position: 'relative', zIndex: 10 }}>
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            style={{
                                display: 'inline-flex',
                                padding: '14px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, rgba(245, 87, 108, 0.2), rgba(102, 126, 234, 0.2))',
                                marginBottom: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            <User style={{ width: '32px', height: '32px', color: 'white' }} />
                        </motion.div>
                        <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '6px', color: 'white' }}>Create Account</h2>
                        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Join Maizy Store for premium deals</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <div>
                                <label style={labelStyle}>Username</label>
                                <div style={{ position: 'relative' }}>
                                    <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} size={16} />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        placeholder="johndoe"
                                        required
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} size={16} />
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        placeholder="John Doe"
                                        required
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} size={16} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="you@example.com"
                                    required
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Phone</label>
                            <div style={{ position: 'relative' }}>
                                <Phone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} size={16} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="+94 7X XXX XXXX"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <div>
                                <label style={labelStyle}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} size={16} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        style={passwordInputStyle}
                                        placeholder="••••••••"
                                        required
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                    {/* Show/Hide Password Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
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
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Confirm Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} size={16} />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        style={passwordInputStyle}
                                        placeholder="••••••••"
                                        required
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                    {/* Show/Hide Confirm Password Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
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
                                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ delay: 0.5 }}
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
                                opacity: isLoading ? 0.5 : 1,
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
                                    Register Now <ArrowRight size={20} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div style={{ marginTop: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '14px', position: 'relative', zIndex: 10 }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'white', fontWeight: '600', textDecoration: 'none', transition: 'color 0.2s' }}>
                            Login here
                        </Link>
                    </div>
                    <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '14px', position: 'relative', zIndex: 10 }}>
                        <Link to="/forgot-password" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>
                            Forgot Password?
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
