"use client"

import { motion } from "framer-motion";
import Image from "next/image";

interface LoadingScreenProps {
    routeName?: string;
}

const LoadingScreen = ({ routeName }: LoadingScreenProps) => {
    return (
        <div className="fixed inset-0 bg-white dark:bg-neutral-950 flex items-center justify-center z-50">
            <div className="text-center flex flex-col items-center">
                <motion.div
                    className="relative w-24 h-24 mb-8"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <Image
                        src="/mainiconwhite.png"
                        alt="SyncOrbit Logo"
                        fill
                        className="object-contain drop-shadow-xl"
                        priority
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="space-y-3"
                >
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                        Synchronizing{routeName ? ` ${routeName}` : ''}...
                    </h2>
                    <motion.p
                        className="text-sm text-neutral-500 dark:text-neutral-400 max-w-[250px] mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Aligning your workspace. This will just take a moment.
                    </motion.p>

                    {/* Subtle loading bar */}
                    <motion.div
                        className="h-1 w-32 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mx-auto mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default LoadingScreen;