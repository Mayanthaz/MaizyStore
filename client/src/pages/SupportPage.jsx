import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Phone, MapPin, Send, CircleHelp, FileText, Globe } from 'lucide-react'

export default function SupportPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
    const [status, setStatus] = useState('idle')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('sending')
        // Simulate API
        await new Promise(r => setTimeout(r, 1500))
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
    }

    return (
        <div className="min-h-screen pt-32 pb-12 px-4 md:px-8 container mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 space-y-4"
            >
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                    How can we help?
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Our dedicated support team is here to assist you 24/7. Whether you have questions about products, payments, or your account.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Form */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-8 rounded-3xl border border-white/5"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <MessageSquare className="text-purple-500" /> Send a Message
                    </h2>

                    {status === 'success' ? (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="text-green-400" />
                            </div>
                            <h3 className="text-green-400 font-bold text-lg mb-2">Message Sent!</h3>
                            <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-4 text-sm text-green-400 hover:text-green-300 font-bold underline"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400 ml-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400 ml-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-gray-400 ml-1">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-gray-400 ml-1">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none resize-none"
                                />
                            </div>
                            <button
                                disabled={status === 'sending'}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {status === 'sending' ? 'Sending...' : <>Send Message <Send size={18} /></>}
                            </button>
                        </form>
                    )}
                </motion.div>

                {/* Info & FAQ */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-8"
                >
                    {/* Contact Cards */}
                    <div className="grid gap-4">
                        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-purple-500/30 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <Mail />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Email Support</h3>
                                <p className="text-gray-400 text-sm">support@maizystore.com</p>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-purple-500/30 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                                <Globe />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Live Chat</h3>
                                <p className="text-gray-400 text-sm">Available Mon-Fri, 9am - 6pm</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Preview */}
                    <div className="glass p-8 rounded-3xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <CircleHelp className="text-pink-500" /> Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {[
                                "How long does delivery take?",
                                "Is there a warranty on accounts?",
                                "What payment methods do you accept?",
                                "Can I get a refund?"
                            ].map((q, i) => (
                                <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group flex justify-between items-center">
                                    <span className="text-gray-300 group-hover:text-white transition-colors">{q}</span>
                                    <ArrowRight size={14} className="text-gray-500 group-hover:text-white transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
