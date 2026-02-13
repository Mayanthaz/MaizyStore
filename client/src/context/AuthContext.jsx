import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const { data } = await authAPI.getProfile()
                setUser(data.user)
            } catch (error) {
                console.error('Auth check failed:', error)
                // Try to decode JWT payload as fallback (for hardcoded admin)
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]))
                    if (payload && payload.email && payload.role) {
                        setUser({
                            id: payload.id,
                            username: payload.username,
                            email: payload.email,
                            full_name: payload.full_name || payload.username,
                            role: payload.role
                        })
                    } else {
                        localStorage.removeItem('token')
                    }
                } catch (decodeError) {
                    console.error('Token decode failed:', decodeError)
                    localStorage.removeItem('token')
                }
            }
        }
        setLoading(false)
    }

    const login = async (email, password) => {
        try {
            const { data } = await authAPI.login({ email, password })

            if (data.needsVerification) {
                toast.error(data.message, { duration: 5000 })
                return { success: false, needsVerification: true }
            }

            localStorage.setItem('token', data.token)
            setUser(data.user)
            toast.success('Login successful! 🎉')
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed'
            toast.error(message)
            return { success: false, error: message }
        }
    }

    const register = async (userData) => {
        try {
            const { data } = await authAPI.register(userData)
            toast.success('Registration successful! Please check your email to verify your account. ✉️', {
                duration: 6000
            })
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed'
            toast.error(message)
            return { success: false, error: message }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        toast.success('Logged out successfully')
    }

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        checkAuth
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
