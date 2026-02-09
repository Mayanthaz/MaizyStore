import { Github, Twitter, Instagram, Mail } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            <span className="text-gradient">MAIZY</span>
                            <span className="text-gradient-secondary">STORE</span>
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Premium digital accounts at unbeatable prices. Secure, instant delivery, and 24/7 support.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Products</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-purple-400 transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Refund Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-primary hover:text-white transition-all hover-scale">
                                <Github size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-secondary hover:text-white transition-all hover-scale">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-accent hover:text-white transition-all hover-scale">
                                <Instagram size={20} />
                            </a>
                        </div>
                        <div className="mt-4 flex items-center text-gray-400 text-sm">
                            <Mail size={16} className="mr-2" />
                            support@maizystore.com
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-12 pt-8 text-center text-gray-500 text-sm">
                    <p>© 2026 MAIZY STORE. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
