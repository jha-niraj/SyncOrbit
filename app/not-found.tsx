"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowRight, Rocket, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import SmoothScroll from "@/components/smoothscroll";
import Image from "next/image";

const LostInSpaceSVG = () => {
    const orbitVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const floatVariants = {
        animate: {
            y: [-10, 10, -10],
            rotate: [-5, 5, -5],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto h-[300px] md:h-[400px] flex items-center justify-center">
            <motion.svg
                viewBox="0 0 400 400"
                className="absolute inset-0 w-full h-full text-neutral-200 dark:text-neutral-800"
                variants={orbitVariants}
                animate="animate"
            >
                <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" opacity="0.5" />
                <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" opacity="0.3" />
            </motion.svg>
            <motion.div variants={floatVariants} animate="animate" className="relative z-10 flex flex-col items-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6 opacity-80 grayscale">
                    <Image src="/syncorbit.png" alt="SyncOrbit Logo" fill className="object-contain" />
                </div>
                <div className="flex items-center gap-4 text-orange-500/70 dark:text-orange-400/70">
                    <Compass className="w-8 h-8" />
                    <span className="text-sm font-mono tracking-widest uppercase">Coordinates Lost</span>
                    <Rocket className="w-8 h-8 rotate-45" />
                </div>
            </motion.div>
            {
                [...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-orange-500/30 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))
            }
        </div>
    );
};

export default function NotFound() {
    return (
        <SmoothScroll>
            <div className="min-h-screen bg-white dark:bg-neutral-950 selection:bg-orange-500/30 selection:text-orange-900 dark:selection:text-white font-sans flex flex-col">
                <Navbar />

                <main className="flex-1 flex items-center justify-center px-6 py-24">
                    <div className="max-w-3xl w-full text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-12"
                        >
                            <LostInSpaceSVG />
                            <div className="space-y-6 relative z-20">
                                <div>
                                    <motion.h1
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                        className="text-6xl md:text-8xl font-bold text-neutral-900 dark:text-white tracking-tighter"
                                    >
                                        404
                                    </motion.h1>
                                    <motion.h2
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-2xl md:text-3xl font-bold mt-4 text-neutral-900 dark:text-white"
                                    >
                                        Off Trajectory
                                    </motion.h2>
                                </div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="max-w-lg mx-auto text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed"
                                >
                                    The page you're looking for has drifted out of orbit. Let's get you synchronized and back on track.
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="pt-8"
                                >
                                    <Button
                                        asChild
                                        size="lg"
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base rounded-full px-8 h-12 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 group"
                                    >
                                        <Link href="/" className="flex items-center gap-2">
                                            <Home className="h-5 w-5" />
                                            <span>Return to Base</span>
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </main>

                <Footer />
            </div>
        </SmoothScroll>
    );
}