"use client"

import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
            <motion.div 
                className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="prose dark:prose-invert max-w-none">
                    <h1 className="text-3xl font-bold mb-8 text-center">Terms of Service</h1>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                        <p className="mb-4">
                            Welcome to ShunyaTech. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before proceeding.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>"Platform" refers to ShunyaTech's website and services</li>
                            <li>"User" refers to any individual or entity using our platform</li>
                            <li>"Content" refers to any information, data, or materials posted on our platform</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                        <p className="mb-4">
                            Users must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account and password.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Platform Rules</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Users must be at least 18 years old</li>
                            <li>Users must not engage in any fraudulent or deceptive practices</li>
                            <li>Users must not violate any applicable laws or regulations</li>
                            <li>Users must respect intellectual property rights</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Content Guidelines</h2>
                        <p className="mb-4">
                            Users are responsible for any content they post on the platform. Content must not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Violate any laws or regulations</li>
                            <li>Infringe on intellectual property rights</li>
                            <li>Contain harmful or malicious code</li>
                            <li>Include inappropriate or offensive material</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
                        <p className="mb-4">
                            All content and materials available on ShunyaTech, unless otherwise specified, are the property of ShunyaTech and are protected by applicable intellectual property laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
                        <p className="mb-4">
                            We reserve the right to terminate or suspend access to our platform for any reason, including violation of these terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
                        <p className="mb-4">
                            We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <div className="mt-8 pt-4 border-t">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            For any questions about these terms, please contact us at{" "}
                            <a href="mailto:legal@shunyatech.com" className="text-primary hover:underline">
                                legal@shunyatech.com
                            </a>
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