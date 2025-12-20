"use client"

import { useRef } from "react"
import {
    motion, useScroll, useTransform, Variants
} from "framer-motion"
import {
    Code2, Globe, Zap, ArrowUpRight, Linkedin, Twitter, Network
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import SmoothScroll from "@/components/smoothscroll"
import { toast } from "sonner"

// --- Data ---

const values = [
    {
        icon: <Zap className="w-5 h-5" />,
        header: "01_VELOCITY",
        title: "Zero Latency",
        description: "We hate waiting. Our culture is built on immediate execution and asynchronous momentum. If it can be shipped today, it doesn't wait for tomorrow's standup.",
    },
    {
        icon: <Network className="w-5 h-5" />,
        header: "02_SYNTHESIS",
        title: "Hive Intelligence",
        description: "Silos are for grain, not code. Product, Engineering, and Design operate as a single, fused organism sharing a unified context buffer.",
    },
    {
        icon: <Code2 className="w-5 h-5" />,
        header: "03_RIGOR",
        title: "First Principles",
        description: "We don't solve problems by proxy. We deconstruct challenges to their mathematical core and rebuild from the ground up using absolute logic.",
    },
    {
        icon: <Globe className="w-5 h-5" />,
        header: "04_SCALE",
        title: "Planetary Scale",
        description: "We engineer for the n+1 user. Our architecture is designed to handle global concurrency from the very first commit.",
    },
]

const milestones = [
    { year: "2019", title: "INIT_KERNEL", description: "SyncOrbit researched. The hypothesis: Project management is broken by context switching." },
    { year: "2021", title: "ALPA_DEPLOY", description: "Internal testing with 50 high-velocity engineering teams. Feedback loop integration." },
    { year: "2023", title: "V1_RELEASE", description: "Public launch. 10,000+ workspaces initialized in first quarter. SOC2 Type II achieved." },
    { year: "2024", title: "ENTERPRISE_LAYER", description: "Launched On-Premise and Private Cloud nodes for Fortune 500 security compliance." },
    { year: "2025", title: "GLOBAL_MESH", description: "Expansion into APAC and EMEA regions. Real-time translation and multi-region sharding." },
]

const teamMembers = [
    {
        name: "Niraj Jha",
        role: "CO-FOUNDER / CEO & CTO",
        bio: "The Architect. Formerly Principal Engineer at Tier-1 Tech. Obsessed with distributed systems and removing latency from human coordination.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
        linkedin: "#",
        colSpan: "md:col-span-2 lg:col-span-2"
    },
    {
        name: "Harsh Pandey",
        role: "CO-FOUNDER / COO",
        bio: "The Operator. Executes the vision. Ensures that our operational velocity matches our engineering output. Master of logistics.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop",
        linkedin: "#",
        colSpan: "md:col-span-1 lg:col-span-1"
    },
    {
        name: "Sarah Chen",
        role: "HEAD OF PRODUCT",
        bio: "Translates abstract user pain into concrete technical specifications. The bridge between the user and the metal.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
        linkedin: "#",
        colSpan: "md:col-span-1 lg:col-span-1"
    },
    {
        name: "David Ross",
        role: "VP OF ENGINEERING",
        bio: "Guardian of the codebase. Enforces strict linting, 100% test coverage, and scalable architecture patterns.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
        linkedin: "#",
        colSpan: "md:col-span-2 lg:col-span-2"
    },
    {
        name: "Elena Rodriguez",
        role: "LEAD DESIGNER",
        bio: "Crafting the interface between human intent and machine execution. Minimalist, functional, beautiful.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
        linkedin: "#",
        colSpan: "md:col-span-1"
    }
]

// --- Animations ---

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
}

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function AboutPage() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

    return (
        <SmoothScroll>
            <main ref={containerRef} className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-950 font-sans">

                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,rgba(120,119,198,0.05),transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_-30%,rgba(255,255,255,0.05),transparent)]"></div>
                </div>
                <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
                    <div className="relative z-10 max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 backdrop-blur-md"
                        >
                            <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white animate-pulse" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400">System_Status: Operational</span>
                        </motion.div>
                        <motion.h1
                            initial="hidden" animate="visible" variants={staggerContainer}
                            className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter mb-8 leading-[0.9]"
                        >
                            <motion.span variants={fadeInUp} className="block text-neutral-300 dark:text-neutral-700">BUILDING</motion.span>
                            <motion.span variants={fadeInUp} className="block text-neutral-900 dark:text-white">THE ENGINE</motion.span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed"
                        >
                            SyncOrbit is not just a tool; it's a protocol for human achievement.
                            We combine rigorous engineering with fluid design to eliminate the friction of work.
                        </motion.p>
                    </div>
                    <motion.div style={{ y }} className="absolute bottom-10 left-0 w-full flex justify-center opacity-50">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Scroll_Down</span>
                            <div className="w-px h-16 bg-gradient-to-b from-neutral-900 to-transparent dark:from-white" />
                        </div>
                    </motion.div>
                </section>
                <section className="py-24 px-6 relative z-10 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
                            <div>
                                <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-4">Core_Kernel</h2>
                                <h3 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tighter">The Operating Code</h3>
                            </div>
                            <p className="text-neutral-500 max-w-md text-right hidden md:block font-mono text-xs">
                                // Immutable principles guiding<br />every commit and decision.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {
                                values.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300"
                                    >
                                        <div className="flex justify-between items-start mb-12">
                                            <div className="p-3 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white">
                                                {item.icon}
                                            </div>
                                            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                                                {item.header}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold mb-3 text-neutral-900 dark:text-white uppercase tracking-tight">{item.title}</h4>
                                        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <section id="team" className="py-32 px-6 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-neutral-900 dark:text-white">The Architects</h2>
                                <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-xl font-light">
                                    Meet the builders. A collective of founders, engineers, and creators obsessed with perfection.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => toast.success("Access Denied: Hiring Protocol Closed")} className="px-6 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all text-xs font-bold uppercase tracking-widest">
                                    Join The Collective
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {
                                teamMembers.map((member, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className={`group relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 ${member.colSpan || ''} min-h-[450px]`}
                                    >
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90" />

                                        <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-end border-b border-white/20 pb-4 mb-4">
                                                    <div>
                                                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                                                            {member.role}
                                                        </span>
                                                        <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                                                    </div>
                                                    <ArrowUpRight className="text-white w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <p className="text-neutral-300 text-sm font-light leading-relaxed mb-6 h-0 group-hover:h-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    {member.bio}
                                                </p>
                                                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                                    <Link href={member.linkedin} className="text-white hover:text-neutral-400 transition-colors"><Linkedin className="w-4 h-4" /></Link>
                                                    <button className="text-white hover:text-neutral-400 transition-colors"><Twitter className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <section className="py-32 px-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50">
                    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tighter">System Logs</h2>
                            <p className="text-neutral-500 font-mono text-xs uppercase mt-2">Execution Timeline</p>
                        </div>
                        <div className="relative">
                            <div className="absolute left-[7px] top-0 bottom-0 w-px bg-neutral-300 dark:bg-neutral-800 border-l border-dashed border-neutral-400 dark:border-neutral-700" />
                            <div className="space-y-12">
                                {
                                    milestones.map((milestone, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            className="relative pl-10"
                                        >
                                            <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white dark:bg-neutral-950 border-2 border-neutral-900 dark:border-white z-10" />
                                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-1">
                                                <span className="font-mono text-sm font-bold text-neutral-900 dark:text-white">{milestone.year}</span>
                                                <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">[{milestone.title}]</span>
                                            </div>
                                            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed max-w-xl">
                                                {milestone.description}
                                            </p>
                                        </motion.div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-32 px-6 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-neutral-900 dark:text-white">
                            Ready to Initialize?
                        </h2>
                        <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-10 font-light">
                            We are looking for partners who demand precision. If you are ready to build the future, let's look at the schematics.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contactus" className="px-8 py-4 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-all text-sm uppercase tracking-widest">
                                Start Protocol
                            </Link>
                            <Link href="/papers" className="px-8 py-4 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all text-sm uppercase tracking-widest">
                                Read WhitePapers
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </SmoothScroll>
    )
}