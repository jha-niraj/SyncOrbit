"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
    Users, Target, Heart, Zap, Mail, Phone, MapPin,
    Rocket, Globe, Calendar, TrendingUp, Award, Send,
    Loader2, CheckCircle2, ArrowRight, Sparkles, Lightbulb,
    Linkedin, Twitter, Briefcase, GitBranch, ShieldCheck
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
// You will need to create/update this action to handle the contact form submission
// import { submitContactForm, type ContactFormData } from "@/actions/contact.action";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import SmoothScroll from "@/components/smoothscroll";
import { cn } from "@/lib/utils";

// --- Animation Variants ---
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

const stagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

// --- Data Section (Updated for SyncOrbit) ---
const timelineData = [
    {
        year: "2023",
        title: "The Chaos Problem",
        desc: "We saw teams struggling with fragmented workflows, using five different tools just to manage a single project. Information was scattered, and context was lost."
    },
    {
        year: "2024",
        title: "The SyncOrbit Prototype",
        desc: "Built from personal frustration, our first version focused on one thing: unifying tasks, docs, and communication in a single, synchronized view. Early adopters loved the clarity."
    },
    {
        year: "2025",
        title: "The Platform Vision",
        desc: "We expanded beyond simple task management. We built dedicated modes for product and agency teams, automated workflows, and created a true operating system for modern work."
    }
];

const team = [
    {
        name: "Nilesh Kumar Gupta",
        role: "Founder & CEO",
        image: "/aboutus/nileshkumar.jpeg", // Ensure path is correct
        bio: "A product visionary obsessed with workflow efficiency. Previously led product teams at high-growth startups.",
        social: { linkedin: "#", twitter: "#" }
    },
    {
        name: "Niraj Kumar Jha",
        role: "Co-Founder & CTO",
        image: "/aboutus/nirajjha.jpeg",
        bio: "The engineering brain behind our synchronized architecture. Expert in building scalable, real-time systems.",
        social: { linkedin: "#", twitter: "#" }
    },
    {
        name: "Anoop Grover",
        role: "COO",
        bio: "Operations strategist ensuring our platform delivers value to every team. The bridge between customer needs and product execution.",
        social: { linkedin: "#", twitter: "#" }
    }
];

// Define the interface for contact form data locally for now
interface ContactFormData {
    name: string;
    email: string;
    message: string;
    company?: string;
}

export default function AboutUsPage() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "", email: "", message: "", company: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Handler (Mock implementation - replace with actual server action)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Message sent! We'll be in touch shortly.");
            setFormData({ name: "", email: "", message: "", company: "" });
            setIsSubmitting(false);
        }, 1500);

        // Actual implementation would be something like:
        /*
        try {
            const result = await submitContactForm(formData);
            if (result.success) {
                toast.success("Message sent! We'll be in touch.");
                setFormData({ name: "", email: "", message: "", company: "" });
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
        */
    };

    return (
        <SmoothScroll>
            <div className="min-h-screen bg-white dark:bg-neutral-950 selection:bg-orange-500/30 selection:text-orange-900 dark:selection:text-white font-sans">

                {/* --- 1. Hero Section --- */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    {/* Background Gradients (Orange/Blue) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-orange-500/10 dark:bg-orange-500/20 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={stagger}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mb-8">
                                <Sparkles className="w-4 h-4 text-orange-500" />
                                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">
                                    Our Mission
                                </span>
                            </motion.div>

                            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8 leading-tight">
                                We synchronize <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                                    Teams & Trajectories.
                                </span>
                            </motion.h1>

                            <motion.p variants={fadeIn} className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-10 max-w-2xl mx-auto">
                                We are building the central nervous system for modern work.
                                Where strategy, execution, and collaboration happen in one unified orbit.
                            </motion.p>

                            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button asChild size="lg" className="rounded-full h-12 px-8 text-base bg-orange-500 hover:bg-orange-600 text-white">
                                    <Link href="#story">Read Our Story</Link>
                                </Button>
                                <Button asChild variant="ghost" size="lg" className="rounded-full h-12 px-8 text-base hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white">
                                    <Link href="/features">Explore Features <ArrowRight className="w-4 h-4 ml-2" /></Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* --- 2. Stats Section (Clean) --- */}
                <section className="py-12 border-y border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "Active Teams", value: "2,500+", icon: Users },
                                { label: "Projects Managed", value: "50k+", icon: Target },
                                { label: "Tasks Completed", value: "1M+", icon: CheckCircle2 },
                                { label: "Uptime", value: "99.99%", icon: Zap },
                            ].map((stat, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i}
                                    className="flex flex-col items-center justify-center text-center group"
                                >
                                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <stat.icon className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                                    </div>
                                    <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">{stat.value}</div>
                                    <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 3. The Story (Timeline Style) --- */}
                <section id="story" className="py-24 bg-white dark:bg-neutral-950 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                className="sticky top-32"
                            >
                                <h2 className="text-4xl font-bold mb-6 text-neutral-900 dark:text-white">How it started.</h2>
                                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                                    SyncOrbit wasn&apos;t born in a VC boardroom. It was built out of the genuine frustration of managing projects across disjointed tools.
                                    We knew there had to be a better way to keep everyone on the same page.
                                </p>
                                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    What started as a simple tool to sync tasks has evolved into a comprehensive platform
                                    powering product development, agency work, and everything in between for thousands of teams.
                                </p>

                                <div className="mt-8 p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                                    <Lightbulb className="w-6 h-6 text-orange-500 mb-4" />
                                    <p className="italic text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                                        &quot;We believe that when you remove the friction of coordination, teams don't just work faster—they do their best work. That's our North Star.&quot;
                                    </p>
                                </div>
                            </motion.div>

                            <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-3 lg:ml-0 space-y-12 pl-8 lg:pl-12 py-4">
                                {timelineData.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.2 }}
                                        className="relative"
                                    >
                                        {/* Timeline Dot */}
                                        <span className="absolute -left-[43px] lg:-left-[59px] top-1.5 h-6 w-6 rounded-full border-4 border-white dark:border-neutral-950 bg-orange-500 shadow-sm" />
                                        <span className="text-sm font-bold text-orange-600 dark:text-orange-500 tracking-wider mb-2 block">
                                            {item.year}
                                        </span>
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                                            {item.title}
                                        </h3>
                                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 4. Core Values (Bento Grid) --- */}
                <section className="py-24 bg-neutral-50 dark:bg-neutral-900/50 border-y border-neutral-200 dark:border-neutral-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">Our DNA</h2>
                            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                                The principles that guide every feature we build.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1: Large */}
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="md:col-span-2 p-8 bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity pointer-events-none">
                                    <Target className="w-48 h-48" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mb-6">
                                        <Target className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-white">Clarity over Chaos</h3>
                                    <p className="text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
                                        We believe a single source of truth is non-negotiable. Our platform is designed to eliminate ambiguity and keep everyone aligned on the goal.
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="p-8 bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm"
                            >
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6">
                                    <Zap className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Built for Speed</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    We obsess over performance. Every interaction should feel instantaneous.
                                </p>
                            </motion.div>
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="p-8 bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm"
                            >
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-6">
                                    <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">Work Your Way</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    We don't enforce a methodology. We build flexible tools that adapt to your team's unique workflow.
                                </p>
                            </motion.div>
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="md:col-span-2 p-8 bg-neutral-900 dark:bg-black text-white rounded-[2rem] shadow-sm relative overflow-hidden group"
                            >
                                {/* Abstract Background Pattern */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>

                                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                    <div>
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                            <Rocket className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3">Constant Evolution</h3>
                                        <p className="text-neutral-300 max-w-md leading-relaxed">
                                            The way teams work is always changing. So are we. We ship improvements weekly, listening closely to user feedback.
                                        </p>
                                    </div>
                                    <Button variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 hover:text-white shrink-0">
                                        View Changelog
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* --- 5. Team Section --- */}
                <section className="py-24 bg-white dark:bg-neutral-950 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="mb-16 text-center"
                        >
                            <h2 className="text-4xl font-bold mb-4 text-neutral-900 dark:text-white">Meet the Builders</h2>
                            <p className="text-neutral-600 dark:text-neutral-400 text-lg">The minds behind the mission.</p>
                        </motion.div>
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {
                                team.map((member, i) => (
                                    <motion.div
                                        variants={fadeIn}
                                        key={i}
                                        className="group relative text-center sm:text-left"
                                    >
                                        <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-6 relative">
                                            <Image
                                                src={member.image || "/placeholder-user.jpg"} // Fallback image
                                                alt={member.name}
                                                width={500}
                                                height={600}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                <Link href={member.social.linkedin} className="p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-sm transition-colors">
                                                    <Linkedin className="w-5 h-5" />
                                                </Link>
                                                <Link href={member.social.twitter} className="p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-sm transition-colors">
                                                    <Twitter className="w-5 h-5" />
                                                </Link>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">{member.name}</h3>
                                        <p className="text-orange-600 dark:text-orange-500 font-medium text-sm mb-3">{member.role}</p>
                                        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{member.bio}</p>
                                    </motion.div>
                                ))
                            }
                        </motion.div>
                    </div>
                </section>

                {/* --- 6. Contact Section --- */}
                <section id="contact" className="py-24 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                            <div className="grid lg:grid-cols-2">
                                <div className="p-10 lg:p-16 bg-neutral-900 dark:bg-black text-white flex flex-col justify-between relative overflow-hidden">
                                    {/* Background decorative glow */}
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                                    <div className="relative z-10">
                                        <h2 className="text-3xl font-bold mb-6">Let&apos;s synchronize.</h2>
                                        <p className="text-neutral-400 text-lg mb-12 leading-relaxed">
                                            Have a question about our platform, pricing, or partnership opportunities? We're here to help.
                                        </p>

                                        <div className="space-y-8">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-white/10 rounded-xl">
                                                    <Mail className="w-6 h-6 text-orange-400" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold mb-1">Email Us</p>
                                                    <p className="text-neutral-400 hover:text-orange-400 transition-colors">
                                                        <a href="mailto:hello@syncorbit.com">hello@syncorbit.com</a>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-white/10 rounded-xl">
                                                    <MapPin className="w-6 h-6 text-orange-400" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold mb-1">HQ</p>
                                                    <p className="text-neutral-400">San Francisco, CA</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-16 relative z-10 flex gap-4">
                                        <Link href="#" className="text-neutral-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link>
                                        <Link href="#" className="text-neutral-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
                                    </div>
                                </div>
                                <div className="p-10 lg:p-16 bg-white dark:bg-neutral-900">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-neutral-700 dark:text-neutral-300 font-medium">Name</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Jane Doe"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                    className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 h-12 rounded-xl focus-visible:ring-orange-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-300 font-medium">Work Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="jane@company.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                    className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 h-12 rounded-xl focus-visible:ring-orange-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="company" className="text-neutral-700 dark:text-neutral-300 font-medium">Company (Optional)</Label>
                                            <Input
                                                id="company"
                                                placeholder="Acme Inc."
                                                value={formData.company}
                                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 h-12 rounded-xl focus-visible:ring-orange-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-neutral-700 dark:text-neutral-300 font-medium">How can we help?</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us about your team's needs..."
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                required
                                                className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 rounded-xl resize-none focus-visible:ring-orange-500"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Send Message"}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </SmoothScroll>
    );
}