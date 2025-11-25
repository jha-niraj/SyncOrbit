"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, ArrowLeft } from "lucide-react";
import SmoothScroll from "@/components/smoothscroll";

export default function TermsPage() {
    return (
        <SmoothScroll>
            <div className="min-h-screen bg-white dark:bg-neutral-950 selection:bg-orange-500/30 selection:text-orange-900 dark:selection:text-white font-sans">
                <div className="pt-32 pb-24 px-6">
                    <div className="container max-w-4xl mx-auto">
                        <Link href="/" className="inline-flex items-center text-sm text-neutral-500 hover:text-orange-600 dark:hover:text-orange-500 transition-colors mb-8 group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mb-6">
                                    <Scale className="w-4 h-4 text-orange-500" />
                                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">
                                        Legal
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight mb-4 leading-tight">
                                    Terms of Service
                                </h1>
                                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                                    Please read these terms carefully before using our services.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 p-10 md:p-16 space-y-12 shadow-sm">
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        By accessing and using SyncOrbit's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
                                    </p>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">2. Service Description</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                                        SyncOrbit provides a project management and team collaboration platform, including but not limited to:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 marker:text-orange-500">
                                        <li>Task and project management tools</li>
                                        <li>Team collaboration features</li>
                                        <li>Workflow automation services</li>
                                        <li>Analytics and reporting dashboards</li>
                                    </ul>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">3. User Obligations</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                                        As a user of our services, you agree to:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 marker:text-orange-500">
                                        <li>Provide accurate, current, and complete information during registration</li>
                                        <li>Maintain the security and confidentiality of your account credentials</li>
                                        <li>Use the services in compliance with all applicable laws and regulations</li>
                                        <li>Not engage in any activity that interferes with or disrupts the services</li>
                                    </ul>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">4. Intellectual Property</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        The services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by SyncOrbit, its licensors, or other providers of such material and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                                    </p>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">5. Privacy Policy</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        Your use of our services is also governed by our Privacy Policy. Please review our{" "}
                                        <Link href="/privacy" className="text-orange-600 dark:text-orange-500 hover:underline font-medium">
                                            Privacy Policy
                                        </Link>
                                        {" "}for information on how we collect, use, and share your data.
                                    </p>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">6. Limitation of Liability</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        In no event shall SyncOrbit, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the services, including any direct, indirect, special, incidental, consequential, or punitive damages.
                                    </p>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">7. Changes to Terms</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        We reserve the right to withdraw or amend our services, and any service or material we provide, in our sole discretion without notice. We will not be liable if for any reason all or any part of the services is unavailable at any time or for any period. We may update these terms from time to time. Your continued use of the services following the posting of revised terms means that you accept and agree to the changes.
                                    </p>
                                </section>
                                <div className="pt-8 mt-8 border-t border-neutral-100 dark:border-neutral-800">
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Last updated: {new Date().toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                                        For any questions about these terms, please contact us at{" "}
                                        <Link href="mailto:legal@syncorbit.com" className="text-orange-600 dark:text-orange-500 hover:underline font-medium">
                                            legal@syncorbit.com
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </SmoothScroll>
    );
}