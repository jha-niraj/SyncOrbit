import { motion } from "framer-motion";
import { RainbowButton } from "../ui/rainbow-button";
import CalBtn from "@/app/providers/cal-btn";
import MorphingText from "../ui/morphing-text";
// import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
// import Link from "next/link";

const texts = ["Innovative", "Transparent", "Scalable", "Impactful"];

export default function HeroSection() {
    return (
        <main className="relative w-full min-h-screen bg-black text-white flex items-center justify-center py-28">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#333_1px,transparent_1px)] bg-[length:20px_20px] opacity-10 pointer-events-none"></div>
            <div className="max-w-5xl mx-auto px-4 md:px-6 text-center relative z-10">
                <div className="flex flex-col items-center justify-center gap-6">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-gradient-to-r from-green-600 to-orange-500 text-white">
                        Product-Based Agency
                    </div>
                    <motion.h1
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent"
                    >
                        Building <span className="text-green-600">Products</span>, Not Just Promises
                    </motion.h1>
                    <div className="w-full flex justify-center">
                        <MorphingText
                            texts={texts}
                        />
                    </div>
                    <motion.p
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="max-w-2xl text-gray-300 md:text-xl"
                    >
                        At ShunyaTech, we craft our own badass products while delivering client solutions that don&apos;t cost an arm, a leg, and your soul. Transparent pricing, real results—because overcharging is so last decade.
                    </motion.p>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-4 mt-8"
                    >
                        {/* <Button variant="outline" size="lg" className="group text-black border-white hover:bg-white hover:text-black">
                            <Link href="/accelerator" className="flex items-center">
                                Join the Accelerator
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button> */}
                        <RainbowButton className="group">
                            <CalBtn classNames="" label="Book a Call" />
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </RainbowButton>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}