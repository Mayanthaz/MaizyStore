import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, ShieldCheck } from 'lucide-react'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams()
    const urlToken = searchParams.get('token')
    const navigate = useNavigate()
    const { checkAuth } = useAuth()

    const [status, setStatus] = useState(urlToken ? 'verifying' : 'input') // input, verifying, success, error
    const [message, setMessage] = useState(urlToken ? 'Verifying your code...' : '')
    const [code, setCode] = useState('')

    useEffect(() => {
        if (urlToken) {
            verifyCode(urlToken)
        }
    }, [urlToken])

    const verifyCode = async (verificationCode) => {
        setStatus('verifying')
        setMessage('Verifying code...')
        try {
            const { data } = await authAPI.verifyEmail(verificationCode)
            setStatus('success')
            setMessage(data.message)

            if (data.token) {
                localStorage.setItem('token', data.token)
                await checkAuth()
                setTimeout(() => navigate('/'), 3000)
            }
        } catch (error) {
            setStatus('error')
            setMessage(error.response?.data?.message || 'Verification failed. Code may be expired.')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (code.length < 6) {
            toast.error('Please enter a valid 6-digit code')
            return
        }
        verifyCode(code)
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 pt-32">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 rounded-2xl border border-white/10 text-center"
                >
                    {/* INPUT FORM */}
                    {status === 'input' && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                                <ShieldCheck className="text-purple-400" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-white">Enter Verification Code</h2>
                            <p className="text-gray-400 mb-6">
                                We sent a 6-digit code to your email. Please enter it below.
                            </p>

                            <form onSubmit={handleSubmit} className="w-full space-y-4">
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                    placeholder="123456"
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] text-white focus:border-purple-500 focus:outline-none placeholder-gray-600 font-mono"
                                    maxLength={6}
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-primary py-3 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                                >
                                    Verify Account
                                </button>
                            </form>
                            <p className="mt-4 text-sm text-gray-500">
                                Didn't receive it? <Link to="/support" className="text-purple-400 hover:text-purple-300">Contact Support</Link>
                            </p>
                        </div>
                    )}

                    {/* LOADING STATE */}
                    {status === 'verifying' && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-6" />
                            <h2 className="text-2xl font-bold mb-2 text-white">Verifying...</h2>
                            <p className="text-gray-400">{message}</p>
                        </div>
                    )}

                    {/* SUCCESS STATE */}
                    {status === 'success' && (
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
                            >
                                <CheckCircle className="text-green-500" size={40} />
                            </motion.div>
                            <h2 className="text-2xl font-bold mb-2 text-white">Verified Successfully! 🎉</h2>
                            <p className="text-gray-300 mb-6">{message}</p>
                            <p className="text-sm text-gray-500">Redirecting to home in 3 seconds...</p>
                            <Link to="/" className="mt-6 px-6 py-2 bg-gradient-primary rounded-lg text-white font-medium">
                                Go Home Now
                            </Link>
                        </div>
                    )}

                    {/* ERROR STATE */}
                    {status === 'error' && (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                                <XCircle className="text-red-500" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-white">Verification Failed</h2>
                            <p className="text-gray-300 mb-6">{message}</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStatus('input')}
                                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
                                >
                                    Try Again
                                </button>
                                <Link to="/login" className="px-6 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
                                    Login
                                </Link>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
