"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, Download, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                        >
                            Payment Successful!
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
                        >
                            Welcome to SyncOrbit! Your account has been successfully activated.
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-6"
                    >
                        <Card className="border-2 border-green-200 dark:border-green-800">
                            <CardHeader>
                                <CardTitle className="text-green-700 dark:text-green-400">
                                    What happens next?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-4 text-left">
                                    <Mail className="w-6 h-6 text-blue-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            Check your email
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            We&apos;ve sent you a confirmation email with your login credentials and getting started guide.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 text-left">
                                    <Download className="w-6 h-6 text-green-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            Access your dashboard
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Your account is ready! Start creating projects and collaborating with your team.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 text-left">
                                    <Star className="w-6 h-6 text-purple-500 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            Onboarding support
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Our team will help you get the most out of SyncOrbit with personalized onboarding.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/dashboard">
                                <Button size="lg" className="w-full sm:w-auto">
                                    Go to Dashboard
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    View All Features
                                </Button>
                            </Link>
                        </div>
                        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Need help? Contact our support team at{" "}
                                <Link href="mailto:support@SyncOrbit.com" className="text-blue-600 hover:underline">
                                    support@SyncOrbit.com
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}