"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Scale, ArrowLeft, FileCheck
} from "lucide-react";
import SmoothScroll from "@/components/smoothscroll";

export default function TermsPage() {
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
                                    <Scale className="w-3 h-3 text-neutral-900 dark:text-white" />
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                                        Legal_Doc_02
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white tracking-tighter mb-6">
                                    Terms of Service
                                </h1>
                                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl font-light">
                                    Operational constraints, user obligations, and liability limitations for the SyncOrbit platform.
                                </p>
                            </div>
                            <div className="space-y-12">
                                <section>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
                                        <span className="font-mono text-sm text-neutral-400">01.</span> Acceptance
                                    </h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                                        By initializing an account or accessing the API, you execute a binding agreement with SyncOrbit. Unauthorized use of the infrastructure is strictly prohibited and monitored.
                                    </p>
                                </section>
                                <section>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
                                        <span className="font-mono text-sm text-neutral-400">02.</span> Service Scope
                                    </h2>
                                    <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg">
                                        <p className="text-xs font-mono text-neutral-500 uppercase mb-4 tracking-widest">Included Modules</p>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {
                                                ['Task Management Engine', 'Collaboration Layer', 'Workflow Automations', 'Reporting & Analytics'].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                                        <FileCheck className="w-4 h-4 text-neutral-400" />
                                                        {item}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
                                        <span className="font-mono text-sm text-neutral-400">03.</span> User Obligations
                                    </h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed text-sm">
                                        Users must maintain the confidentiality of credentials. Any activity stemming from a compromised node (account) is the responsibility of the registered entity.
                                    </p>
                                </section>
                                <section>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
                                        <span className="font-mono text-sm text-neutral-400">04.</span> Intellectual Property
                                    </h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                                        The codebase, design system (Engineering V2), and underlying architecture remain the exclusive property of SyncOrbit. Users retain ownership of data processed through the system.
                                    </p>
                                </section>
                                <section>
                                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-3">
                                        <span className="font-mono text-sm text-neutral-400">05.</span> Liability
                                    </h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                                        SyncOrbit operates on an "as is" basis. While we maintain 99.9% uptime targets, we assume no liability for consequential damages resulting from service interruptions or data latency.
                                    </p>
                                </section>
                                <div className="pt-8 mt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                                            Last_Updated: {new Date().toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Link href="mailto:legal@syncorbit.com" className="text-sm font-bold text-neutral-900 dark:text-white hover:underline decoration-neutral-400 underline-offset-4">
                                        legal@syncorbit.com
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