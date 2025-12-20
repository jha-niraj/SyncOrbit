"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft, Lock
} from "lucide-react";
import SmoothScroll from "@/components/smoothscroll";

export default function PrivacyPolicy() {
    return (
        <SmoothScroll>
            <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                </div>
                <div className="relative z-10 pt-32 pb-24 px-6">
                    <div className="container max-w-4xl mx-auto">
                        <Link href="/" className="inline-flex items-center text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-8 group">
                            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Return_Home
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 mb-6">
                                    <Lock className="w-3 h-3 text-neutral-900 dark:text-white" />
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                                        Legal_Doc_01
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white tracking-tighter mb-6">
                                    Privacy Protocol
                                </h1>
                                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl font-light">
                                    Data governance, collection methodologies, and security infrastructure specifications.
                                </p>
                            </div>
                            <div className="space-y-12">
                                <section>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
                                        <span className="font-mono text-sm text-neutral-400">01.</span> Introduction
                                    </h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                                        At SyncOrbit, data integrity is paramount. This Privacy Protocol outlines our architectural approach to collecting, encrypting, and managing user data. By initializing a workspace, you consent to the protocols defined herein.
                                    </p>
                                </section>
                                <section>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
                                        <span className="font-mono text-sm text-neutral-400">02.</span> Data Collection
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                                            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-3">Identity_Data</h3>
                                            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <li className="flex gap-2"><span className="text-neutral-300">•</span> Account Credentials</li>
                                                <li className="flex gap-2"><span className="text-neutral-300">•</span> Contact Vectors (Email/Phone)</li>
                                                <li className="flex gap-2"><span className="text-neutral-300">•</span> Professional Metadata</li>
                                            </ul>
                                        </div>
                                        <div className="p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                                            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-3">Telemetry_Data</h3>
                                            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <li className="flex gap-2"><span className="text-neutral-300">•</span> IP & Device Fingerprints</li>
                                                <li className="flex gap-2"><span className="text-neutral-300">•</span> Feature Usage Logs</li>
                                                <li className="flex gap-2"><span className="text-neutral-300">•</span> Error Stack Traces</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
                                        <span className="font-mono text-sm text-neutral-400">03.</span> Usage Logic
                                    </h2>
                                    <ul className="space-y-3 pl-2">
                                        {
                                            ['Service Optimization', 'Transaction Processing', 'Security Audits', 'Feature Personalization'].map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                                    <span className="font-mono text-xs text-neutral-300 pt-1">{`>`}</span>
                                                    {item}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </section>
                                <section>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
                                        <span className="font-mono text-sm text-neutral-400">04.</span> Security Architecture
                                    </h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                                        We deploy AES-256 encryption for data at rest and TLS 1.3 for data in transit. Access control follows the Principle of Least Privilege (PoLP). Regular penetration testing is conducted to ensure infrastructure resilience.
                                    </p>
                                </section>
                                <div className="pt-8 mt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                                            Last_Updated: {new Date().toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Link href="mailto:privacy@syncorbit.com" className="text-sm font-bold text-neutral-900 dark:text-white hover:underline decoration-neutral-400 underline-offset-4">
                                        privacy@syncorbit.com
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </SmoothScroll>
    );
}