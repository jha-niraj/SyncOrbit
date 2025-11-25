import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
    const [isMobile, setIsMobile] = useState(false);
    console.log(isMobile)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <section
            className="relative overflow-hidden bg-white dark:bg-neutral-950 transition-colors duration-300 min-h-screen flex items-center justify-center py-12"
            id="hero"
        >
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            {/* 2. Central Orange Glow/Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#FE5C02] rounded-full blur-[120px] opacity-10 dark:opacity-20 pointer-events-none"></div>

            {/* 3. Top Spotlight Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-white via-white/50 to-transparent dark:from-neutral-950 dark:via-neutral-950/50 dark:to-transparent z-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-4"
                >
                    <div className="inline-flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-gray-200 dark:border-neutral-800 backdrop-blur-sm shadow-sm hover:border-orange-300 dark:hover:border-orange-900/50 transition-colors cursor-pointer group">
                        <span className="flex items-center justify-center px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#FE5C02] text-[10px] font-bold uppercase tracking-wide">
                            New
                        </span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
                            SyncOrbit 1.0 is live
                            <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-[#FE5C02] transition-colors" />
                        </span>
                    </div>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-4"
                >
                    Plan. Track. <br className="hidden sm:block" />
                    Deliver <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE5C02] to-orange-600">Results.</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6 text-xl sm:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10"
                >
                    A single workspace to plan, track and ship work. Built for teams that want fewer meetings and more focus.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                >
                    <Link
                        href="#get-access"
                        className="w-full sm:w-auto group flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-[#FE5C02] rounded-2xl hover:bg-orange-600 hover:scale-105 shadow-lg shadow-orange-500/25"
                    >
                        Get Early Access
                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="#demo"
                        className="w-full sm:w-auto group flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 dark:text-white bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all hover:scale-105"
                    >
                        <Play className="mr-2 w-4 h-4 fill-current opacity-60" />
                        Watch Video
                    </Link>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-12 flex flex-col items-center justify-center gap-4"
                >
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-950 bg-gray-200 overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64"
                                alt="User"
                                height={32}
                                width={32}
                            />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-950 bg-gray-200 overflow-hidden">
                            <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=cro"
                                alt="User"
                                height={32}
                                width={32}
                            />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-950 bg-gray-200 overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64"
                                alt="User"
                                height={32}
                                width={32}
                            />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-950 bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                            +2k
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Join 2,000+ teams shipping faster
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;