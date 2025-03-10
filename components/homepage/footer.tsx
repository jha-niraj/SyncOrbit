import { Diamond, Twitter, Linkedin, Instagram } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="w-full bg-black border-t border-white/10 rounded-tl-2xl rounded-tr-2xl text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="w-full flex justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-2 mb-3">
                            <Diamond className="h-6 w-6" />
                            <span className="text-xl font-semibold text-white">Shunya Tech</span>
                        </div>
                        <div className="flex space-x-8">
                            <Link href="#" className="hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:flex flex-col md:flex-row items-center gap-2 md:gap-16">
                        <Link href="#" className="hover:text-white hover:scale-110 transition-all duration-300">About</Link>
                        <Link href="#" className="hover:text-white hover:scale-110 transition-all duration-300">Blog</Link>
                        <Link href="#" className="hover:text-white hover:scale-110 transition-all duration-300">Careers</Link>
                        <Link href="#" className="hover:text-white hover:scale-110 transition-all duration-300">Contact</Link>
                    </div>
                </div>
                <div className="mt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} Shunya Tech. All rights reserved.
                    </p>
                    <div className="flex items-center justify-center space-x-6 text-sm">
                        <Link href="#" className="hover:text-white text-center transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-white text-center transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="hover:text-white text-center transition-colors">
                            Cookies Settings
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
