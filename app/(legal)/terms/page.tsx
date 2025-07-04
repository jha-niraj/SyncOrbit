"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Scale } from "lucide-react";
import SmoothScroll from "@/components/smoothscroll";

export default function TermsPage() {
    return (
        <SmoothScroll>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-12">
                        <Badge variant="outline" className="px-4 py-2 border-teal-200/30 dark:border-teal-800/30 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
                            <Scale className="w-4 h-4 text-teal-500 mr-2" />
                            <span className="text-teal-700 dark:text-teal-300">Legal</span>
                        </Badge>
                        <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            Please read these terms carefully before using our services.
                        </p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl p-8 space-y-8 border border-teal-200/30 dark:border-teal-800/30">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                By accessing and using ShunyaTech&apos;s services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Service Description</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                ShunyaTech provides digital solutions including but not limited to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                                <li>Web development services</li>
                                <li>Mobile application development</li>
                                <li>Cloud solutions and consulting</li>
                                <li>Digital transformation services</li>
                            </ul>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. User Obligations</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Users of our services agree to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                                <li>Provide accurate and complete information</li>
                                <li>Maintain the confidentiality of their account</li>
                                <li>Use services in compliance with applicable laws</li>
                                <li>Not engage in unauthorized access or use</li>
                            </ul>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Intellectual Property</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                All content, features, and functionality of our services are owned by ShunyaTech and are protected by international copyright, trademark, and other intellectual property laws.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Privacy Policy</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Your use of our services is also governed by our Privacy Policy. Please review our{" "}
                                <Link href="/privacy" className="text-teal-600 dark:text-teal-400 hover:underline">
                                    Privacy Policy
                                </Link>
                                {" "}for more information.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Limitation of Liability</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                ShunyaTech shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Changes to Terms</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                We reserve the right to modify these terms at any time. We will notify users of any material changes through our services or via email.
                            </p>
                        </section>
                        <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Last updated: {new Date().toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                For any questions about these terms, please contact us at{" "}
                                <Link href="mailto:legal@shunyatech.com" className="text-teal-600 dark:text-teal-400 hover:underline">
                                    legal@shunyatech.com
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <Link
                            href="/"
                            className="text-teal-600 dark:text-teal-400 hover:underline"
                        >
                            Return to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </SmoothScroll>
    );
} 