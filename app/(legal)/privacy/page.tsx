"use client"

import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="prose dark:prose-invert max-w-none">
                    <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                        <p className="mb-4">
                            At ShunyaTech, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                        </p>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                        <h3 className="text-xl font-medium mb-2">2.1 Personal Information</h3>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Name and contact information</li>
                            <li>Email address</li>
                            <li>Professional background and experience</li>
                            <li>Profile information</li>
                        </ul>
                        <h3 className="text-xl font-medium mb-2">2.2 Automatically Collected Information</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Device and browser information</li>
                            <li>IP address and location data</li>
                            <li>Usage data and analytics</li>
                            <li>Cookies and similar technologies</li>
                        </ul>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                        <p className="mb-4">We use the collected information for:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Providing and improving our services</li>
                            <li>Personalizing your experience</li>
                            <li>Communication and support</li>
                            <li>Analytics and platform enhancement</li>
                            <li>Legal compliance and security</li>
                        </ul>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
                        <p className="mb-4">
                            We may share your information with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Service providers and partners</li>
                            <li>Legal authorities when required</li>
                            <li>Other users (based on your privacy settings)</li>
                        </ul>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                        <p className="mb-4">
                            We implement appropriate security measures to protect your information, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Encryption of sensitive data</li>
                            <li>Regular security assessments</li>
                            <li>Access controls and authentication</li>
                            <li>Secure data storage and transmission</li>
                        </ul>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                        <p className="mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access your personal information</li>
                            <li>Request data correction or deletion</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Data portability</li>
                        </ul>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Cookies Policy</h2>
                        <p className="mb-4">
                            We use cookies and similar technologies to enhance your experience. You can control cookie settings through your browser preferences.
                        </p>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">8. Children&apos;s Privacy</h2>
                        <p className="mb-4">
                            Our services are not intended for users under 18 years of age. We do not knowingly collect information from children.
                        </p>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">9. Changes to Privacy Policy</h2>
                        <p className="mb-4">
                            We may update this policy periodically. We will notify you of any material changes through our platform or via email.
                        </p>
                    </section>
                    <div className="mt-8 pt-4 border-t">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            For privacy-related inquiries, please contact us at{" "}
                            <Link href="mailto:privacy@shunyatech.com" className="text-primary hover:underline">
                                privacy@shunyatech.com
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="text-primary hover:underline"
                    >
                        Return to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
} 