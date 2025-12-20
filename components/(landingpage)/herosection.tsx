"use client";

import React from "react";
import {
    ArrowRight, GitCommit, Terminal, Radio, Command, Cpu, Activity
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-[10px] font-mono uppercase tracking-widest",
        "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400",
        className
    )}>
        {children}
    </div>
);

const RetroGrid = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none [perspective:200px]">
            <div className="absolute inset-0 [transform:rotateX(35deg)]">
                <div className={cn(
                    "animate-grid",
                    "[background-repeat:repeat] [background-size:60px_60px] [height:300%] [width:300%] [margin-left:-50%] [transform-origin:100%_0_0]",
                    "bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)]",
                    "dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
                )} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/0 to-white/0 dark:from-neutral-950 dark:via-neutral-950/0 dark:to-neutral-950/0" />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/0 to-white/0 dark:from-neutral-950 dark:via-neutral-950/0 dark:to-neutral-950/0" />
        </div>
    );
};
const TelemetryTicker = () => {
    return (
        <div className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm overflow-hidden flex items-center h-10">
            <div className="flex items-center gap-8 animate-infinite-scroll whitespace-nowrap px-4">
                {
                    [...Array(4)].map((_, i) => (
                        <React.Fragment key={i}>
                            <span className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                System_Normal
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                                <Cpu className="w-3 h-3" />
                                CPU_Load: 12%
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                                <GitCommit className="w-3 h-3" />
                                Last_Deploy: 32s_ago
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                                <Activity className="w-3 h-3" />
                                Active_Nodes: 8,402
                            </span>
                        </React.Fragment>
                    ))
                }
            </div>
        </div>
    );
};
const CodeDecorator = ({ className }: { className?: string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={cn("absolute hidden lg:block p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-2xl", className)}
    >
        <div className="flex gap-1.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            <div className="w-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>
        <div className="space-y-1.5 font-mono text-[10px] text-neutral-400">
            <p><span className="text-purple-500">const</span> <span className="text-blue-500">velocity</span> = <span className="text-orange-500">&quot;max&quot;</span>;</p>
            <p><span className="text-purple-500">await</span> <span className="text-blue-500">deploy</span>(<span className="text-neutral-500">prod</span>);</p>
            <p className="text-green-500">✓ Build success (42ms)</p>
        </div>
    </motion.div>
);

export const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    // const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section className="relative min-h-[100dvh] flex flex-col bg-white dark:bg-neutral-950 overflow-hidden font-sans">
            <TelemetryTicker />

            <div className="relative flex-1 flex flex-col items-center justify-center pt-10 pb-20">
                <RetroGrid />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-100 dark:bg-neutral-900 rounded-full blur-[120px] opacity-60 pointer-events-none mix-blend-multiply dark:mix-blend-lighten" />

                <CodeDecorator className="top-[20%] right-[10%] rotate-3" />

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="absolute hidden lg:flex top-[30%] left-[10%] items-center gap-3 p-3 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Sync_Orbit_Active</span>
                </motion.div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group cursor-pointer">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                <Radio className="w-3 h-3" />
                            </span>
                            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                v2.4 Release Notes
                            </span>
                            <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-neutral-900 dark:text-white leading-[0.9] mb-8"
                    >
                        Plan. Track. <br />
                        <span className="relative inline-block">
                            Deliver.
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-neutral-300 dark:text-neutral-700" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 H100" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="4 4" />
                                <rect x="0" y="3" width="4" height="4" fill="currentColor" />
                                <rect x="96" y="3" width="4" height="4" fill="currentColor" />
                            </svg>
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-8 text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-10 font-light"
                    >
                        The operating system for high-velocity engineering. <br className="hidden sm:block" />
                        Automate the mundane. Focus on the code.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button className="group relative w-full sm:w-auto overflow-hidden rounded-xl bg-neutral-900 dark:bg-white p-[1px] focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-50">
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#505050_50%,#E2E8F0_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#393939_0%,#FFFFFF_50%,#393939_100%)]" />
                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-neutral-950 dark:bg-white px-8 py-4 text-sm font-bold text-white dark:text-neutral-950 backdrop-blur-3xl transition-all group-hover:bg-neutral-900/90 dark:group-hover:bg-white/90">
                                <Terminal className="mr-2 h-4 w-4" />
                                Initialize Project
                            </span>
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 group">
                            <Command className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                            Documentation
                        </button>
                    </motion.div>
                </div>
                <motion.div
                    style={{ y: y1 }}
                    className="absolute bottom-0 left-0 right-0 h-[300px] z-0 opacity-20 dark:opacity-40 pointer-events-none"
                >
                    <div className="absolute bottom-20 left-[20%] w-px h-24 bg-gradient-to-t from-neutral-400 to-transparent" />
                    <div className="absolute bottom-32 right-[25%] w-px h-16 bg-gradient-to-t from-neutral-400 to-transparent" />
                    <div className="absolute bottom-10 left-[50%] -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
};