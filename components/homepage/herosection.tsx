import { motion } from "framer-motion";
import { RainbowButton } from "../ui/rainbow-button";
import CalBtn from "@/app/providers/cal-btn";
import { PeopleService } from "./poepleserve";
import MorphingText from "../ui/morphing-text";

const texts = ["Affordable", "Beautiful", "Scalable", "Reliable", "Shaping"];

export default function HeroSection() {
    return (
        <main className="relative w-full h-screen bg-black flex flex-col items-center justify-center py-12">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col max-w-7xl mx-auto overflow-hidden w-full py-32"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="text-center space-y-4"
                >
                    <motion.h1
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-2xl md:text-4xl font-medium bg-gradient-to-b from-white via-gray-200 to-gray-100 bg-clip-text text-transparent space-x-2"
                    >
                        Your Vision, Our Expertise
                    </motion.h1>
                    <MorphingText texts={texts} />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="text-white/90 md:text-xl/relaxed mx-auto max-w-[700px]"
                    >
                        Harnesses the power of digital presence to transform your business
                        into actionable insights, propelling you to new heights of success
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.9 }}
                        className="flex flex-col md:flex-row items-center justify-center w-full gap-6"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "4px 4px 0px rgba(0,0,0,0.2)" }}
                            transition={{ duration: 0.3 }}
                            className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                        >
                            Budget Estimator
                        </motion.button>
                        <RainbowButton>
                            <CalBtn classNames="" label="Book a call Now" />
                        </RainbowButton>
                    </motion.div>
                </motion.div>
            </motion.div>
            <PeopleService />
        </main>
    );
}
