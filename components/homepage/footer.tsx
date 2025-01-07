import { Diamond, Twitter, Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black text-gray-400">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
                    <div className="col-span-2 lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <Diamond className="h-6 w-6" />
                            <span className="text-xl font-semibold text-white">InspirePost</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link href="#" className="hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                    {/* <div className="col-span-1">
                        <h3 className="text-white font-medium mb-3">Product</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                        </ul>
                    </div> */}
                    <div className="col-span-1">
                        <h3 className="text-white font-medium mb-3">Company</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    {/* <div className="col-span-1">
                        <h3 className="text-white font-medium mb-3">Resources</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h3 className="text-white font-medium mb-3">Legal</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
                        </ul>
                    </div> */}
                </div>
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} InspirePost. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm">
                        <Link href="#" className="hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="hover:text-white transition-colors">
                            Cookies Settings
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
