"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="max-w-3xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-12"
                >
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 2,
                            ease: "easeInOut",
                        }}
                        className="w-full max-w-md mx-auto"
                    >
                        <NotFoundSVG />
                    </motion.div>
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.7 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-bold text-gray-800">
                                <motion.span
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: [0.8, 1.2, 1] }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="inline-block text-black dark:text-white"
                                >
                                    404
                                </motion.span>
                            </h1>
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="text-2xl md:text-3xl font-semibold text-gray-700 mt-2"
                            >
                                Page Not Found
                            </motion.h2>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="text-gray-600 max-w-lg mx-auto text-lg"
                        >
                            Oops! The page you&apos;re looking for seems to have wandered off into
                            the digital wilderness. Let&apos;s get you back on track.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                            className="pt-4"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all duration-300 px-8 py-6 text-lg"
                                >
                                    <Link href="/" className="flex items-center gap-2">
                                        <Home className="h-5 w-5" />
                                        <span>Back to Home</span>
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{
                                                repeat: Infinity,
                                                repeatType: "loop",
                                                duration: 1.5,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <ArrowRight className="h-5 w-5" />
                                        </motion.div>
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function NotFoundSVG() {
    const circleVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: { opacity: 1, scale: 1 },
    };

    const pathVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 2, ease: "easeInOut" },
        },
    };

    return (
        <motion.svg
            viewBox="0 0 800 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
        >
            <motion.circle
                cx="400"
                cy="200"
                r="180"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-200"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
            />

            <motion.circle
                cx="400"
                cy="200"
                r="150"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/30"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
            />
            {
                [1, 2, 3, 4, 5].map((i) => (
                    <motion.circle
                        key={i}
                        cx={400 + Math.cos((i * Math.PI * 2) / 5) * 120}
                        cy={200 + Math.sin((i * Math.PI * 2) / 5) * 120}
                        r="8"
                        fill="currentColor"
                        className="text-primary"
                        variants={circleVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            delay: 0.5 + i * 0.1,
                            duration: 0.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            repeatDelay: i * 0.2,
                        }}
                    />
                ))
            }
            <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                <motion.text
                    x="320"
                    y="230"
                    fontFamily="sans-serif"
                    fontSize="120"
                    fontWeight="bold"
                    fill="currentColor"
                    className="text-gray-800"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.7 }}
                >
                    404
                </motion.text>
            </motion.g>
            <motion.path
                d="M400 100 L400 120 M400 280 L400 300 M300 200 L320 200 M480 200 L500 200"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-400"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.5 }}
            />
            <motion.g
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{ originX: "400px", originY: "200px" }}
            >
                <motion.path
                    d="M400 150 L400 130"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-primary"
                    strokeLinecap="round"
                />
            </motion.g>
        </motion.svg>
    );
}
