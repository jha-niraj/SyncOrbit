"use client"

import { ArrowRight, Calendar, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CTAPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="max-w-7xl mx-auto text-center px-4 mb-12 bg-transparent"
        >
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-emerald-200/50 dark:border-emerald-800/50 shadow-xl">
                <Zap className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-6" />
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    Ready to Transform Your Ideas?
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                    Let&apos;s discuss your project and explore how we can bring your vision to life with cutting-edge technology and innovative solutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        href="/contact"
                        className="flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                    >
                        Get Started Today
                        <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                    <Link 
                        href="https://cal.com/niraj-jha/30min"
                        target="_blank"
                        className="flex items-center justify-center border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/30 dark:hover:bg-emerald-950/30 px-6 md:px-8 py-3 md:py-4 rounded-xl text-md font-semibold bg-transparent transition-all duration-300 w-full sm:w-auto"
                    >
                        <Calendar className="mr-2 h-5 w-5" />
                        Free Consultation
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}