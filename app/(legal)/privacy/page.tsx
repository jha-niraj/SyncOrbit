"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import SmoothScroll from "@/components/smoothscroll";

export default function PrivacyPolicy() {
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
                                    <Shield className="w-4 h-4 text-orange-500" />
                                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">
                                        Legal
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight mb-4 leading-tight">
                                    Privacy Policy
                                </h1>
                                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                                    We are committed to protecting your privacy and ensuring the security of your data.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 p-10 md:p-16 space-y-12 shadow-sm">
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">1. Introduction</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        At SyncOrbit, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services. By using our services, you consent to the data practices described in this policy.
                                    </p>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">2. Information We Collect</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">2.1 Personal Information</h3>
                                            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 marker:text-orange-500">
                                                <li>Name and contact information (email address, phone number)</li>
                                                <li>Account credentials (username, encrypted password)</li>
                                                <li>Professional information (job title, company name)</li>
                                                <li>Billing information (processed securely by our payment providers)</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">2.2 Usage Data & Analytics</h3>
                                            <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 marker:text-orange-500">
                                                <li>Device information (IP address, browser type, operating system)</li>
                                                <li>Usage patterns (pages visited, features used, time spent)</li>
                                                <li>Log data and error reports</li>
                                                <li>Cookies and similar tracking technologies</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">3. How We Use Your Information</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                                        We use the collected information for the following purposes:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 marker:text-orange-500">
                                        <li>To provide, maintain, and improve our services</li>
                                        <li>To process transactions and manage your account</li>
                                        <li>To send you technical notices, updates, security alerts, and support messages</li>
                                        <li>To respond to your comments, questions, and requests</li>
                                        <li>To monitor and analyze trends, usage, and activities in connection with our services</li>
                                        <li>To personalize and improve the services and provide content or features that match user profiles or interests</li>
                                    </ul>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">4. Information Sharing</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        We do not share your personal information with third parties except as described in this policy. We may share your information with:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 marker:text-orange-500">
                                        <li>Service providers who perform services on our behalf (e.g., payment processing, data analytics, email delivery)</li>
                                        <li>Professional advisors, such as lawyers, auditors, and insurers</li>
                                        <li>Legal authorities, if required by law or to protect our rights or the rights of others</li>
                                        <li>In connection with a merger, sale of assets, or other business reorganization</li>
                                    </ul>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">5. Data Security</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        We implement appropriate technical and organizational measures to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access. These measures include encryption, access controls, and regular security assessments.
                                    </p>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">6. Your Rights</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        Depending on your location, you may have certain rights regarding your personal information, including:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400 marker:text-orange-500">
                                        <li>The right to access your personal information</li>
                                        <li>The right to rectify inaccurate or incomplete information</li>
                                        <li>The right to request deletion of your personal information</li>
                                        <li>The right to restrict or object to the processing of your information</li>
                                        <li>The right to data portability</li>
                                    </ul>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">7. Cookies and Tracking Technologies</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        We use cookies and similar tracking technologies to track the activity on our services and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our services.
                                    </p>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">8. Changes to This Privacy Policy</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date below. You are advised to review this Privacy Policy periodically for any changes.
                                    </p>
                                </section>
                                <div className="pt-8 mt-8 border-t border-neutral-100 dark:border-neutral-800">
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Last updated: {new Date().toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                                        For privacy-related inquiries, please contact us at{" "}
                                        <Link href="mailto:privacy@syncorbit.com" className="text-orange-600 dark:text-orange-500 hover:underline font-medium">
                                            privacy@syncorbit.com
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