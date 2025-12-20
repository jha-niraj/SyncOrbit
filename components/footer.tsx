import {
    Twitter, Linkedin, Instagram, Github, Mail, MapPin, ArrowUpRight, Boxes
} from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 border-t border-neutral-200 dark:border-neutral-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
                <div className="p-8 md:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center">
                            <Boxes className="w-4 h-4 text-white dark:text-black" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">SyncOrbit</span>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-6 font-light">
                        The operating system for high-velocity engineering teams. Plan, track, and ship without the noise.
                    </p>
                    <div className="flex gap-4">
                        {
                            [
                                { icon: Twitter, link: "https://x.com/syncorbit" },
                                { icon: Linkedin, link: "https://linkedin.com/company/syncorbit" },
                                { icon: Github, link: "https://github.com/syncorbit" },
                                { icon: Instagram, link: "https://instagram.com/syncorbit" }
                            ].map((data, i) => (
                                <Link key={i} href={data.link} target='_blank' className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                                    <data.icon className="w-5 h-5" />
                                </Link>
                            ))
                        }
                    </div>
                </div>
                <div className="p-8 md:col-span-1 flex flex-col justify-between">
                    <div>
                        <h3 className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-6">/ Platform</h3>
                        <ul className="space-y-4">
                            {
                                ['Features', 'Changelog', 'Pricing', 'Docs'].map((item) => (
                                    <li key={item}>
                                        <Link href={`/${item.toLowerCase()}`} className="group flex items-center justify-between text-sm font-medium hover:text-neutral-500 transition-colors">
                                            {item}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className="p-8 md:col-span-1 flex flex-col justify-between">
                    <div>
                        <h3 className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-6">/ Use Cases</h3>
                        <ul className="space-y-4">
                            {
                                ['Issue Tracking', 'Sprint Planning', 'Product Roadmaps', 'Engineering Ops'].map((item) => (
                                    <li key={item}>
                                        <span className="text-sm font-light text-neutral-600 dark:text-neutral-300 cursor-default">
                                            {item}
                                        </span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className="p-8 md:col-span-1 bg-neutral-50 dark:bg-neutral-900/50">
                    <h3 className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-6">/ Contact Support</h3>
                    <div className="space-y-6">
                        <div className="group cursor-pointer">
                            <p className="text-xs text-neutral-500 mb-1">Help Desk</p>
                            <div className="flex items-center gap-2 text-sm font-medium hover:underline">
                                <Mail className="w-4 h-4" />
                                help@syncorbit.com
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500 mb-1">HQ</p>
                            <div className="flex items-start gap-2 text-sm font-medium">
                                <MapPin className="w-4 h-4 mt-1" />
                                <span>10 Green State, Unit 4<br />Woodbridge, NJ 07095<br />United States</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
                <div className="flex gap-6 font-mono">
                    <span>© {currentYear} SYNCORBIT</span>
                    <span className="hidden md:inline">|</span>
                    <Link href="https://shunyatech.net" target="_blank" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                        BUILT BY SHUNYATECH
                    </Link>
                </div>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Privacy Protocol</Link>
                    <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    )
}