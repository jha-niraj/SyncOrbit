import { motion } from "framer-motion";
import { RainbowButton } from "../ui/rainbow-button";
import CalBtn from "@/app/providers/cal-btn";
import MorphingText from "../ui/morphing-text";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, Code, Cpu, Film, Layers } from "lucide-react";

const texts = ["Affordable", "Beautiful", "Scalable", "Reliable", "Shaping"];

// const bgGridPattern = {
//     backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fillRule='evenodd'%3E%3Cg fill='%23000' fillOpacity='0.1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
// }

export default function HeroSection() {
    return (
        <main className="relative w-full h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center py-36">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto h-full px-4 md:px-6 relative">
                <div className="flex w-full h-full flex-col gap-8 lg:flex-row lg:gap-12 items-center">
                    <div className="flex w-full flex-col items-center md:items-start justify-between space-y-4 flex-1">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 w-fit">
                            Premium Digital Agency
                        </div>
                        <div className="space-y-2">
                            <motion.h1
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="text-2xl md:text-4xl text-center md:text-left font-medium bg-gradient-to-b from-black via-gray-900 to-gray-800 bg-clip-text text-transparent space-x-2"
                            >
                                Your Vision, Our Expertise
                            </motion.h1>
                            <MorphingText texts={texts} />
                            <motion.h1
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="text-3xl text-center md:text-left font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                            >
                                Where <span className="text-primary">Services</span> Meet{" "}
                                <span className="text-primary">Innovation</span>
                            </motion.h1>
                            <p className="max-w-[600px] text-center md:text-left text-muted-foreground md:text-xl">
                                ShunyaTech operates on a dual model: delivering premium client services at affordable prices while
                                building innovative products that solve real-world problems.
                            </p>
                        </div>
                        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-2">
                            <RainbowButton className="group">
                                <CalBtn classNames="" label="Book a call Now" />
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </RainbowButton>
                            <Button asChild variant="outline" size="lg" className="group">
                                <Link href="#products">
                                    Discover Our Products
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 h-full relative">
                        <div className="relative h-full z-10 bg-white dark:bg-gray-950 rounded-2xl shadow-xl overflow-hidden border border-muted">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 z-0"></div>
                            <div className="h-full grid grid-cols-2 gap-4 p-2 relative z-10">
                                <div className="h-full flex flex-col gap-2">
                                    <div className="bg-muted rounded-lg p-4 h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <Code className="h-16 w-16 mx-auto mb-2 text-primary" />
                                            <p className="text-md font-medium">Web Development</p>
                                        </div>
                                    </div>
                                    <div className="h-full bg-muted rounded-lg p-4 flex items-center justify-center">
                                        <div className="text-center">
                                            <Cpu className="h-16 w-16 mx-auto mb-2 text-primary" />
                                            <p className="text-md font-medium">EventEye Platform</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="bg-muted rounded-lg p-4 h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <Layers className="h-16 w-16 mx-auto mb-2 text-primary" />
                                            <p className="text-md font-medium">Design Services</p>
                                        </div>
                                    </div>
                                    <div className="bg-muted rounded-lg p-4 h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <Film className="h-16 w-16 mx-auto mb-2 text-primary" />
                                            <p className="text-md font-medium">The Coder&apos;z Platform</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </main>
    );
}
