"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WordRotate } from "@/components/ui/wordrotate";
import Link from "next/link";
import {
    ArrowRight, Monitor, Users, Zap, Shield, Globe, Smartphone,
    Rocket, TrendingUp, Award, Star, BarChart3, Play, Check,
    Sparkles, Building2, Calendar, Clock, Target, Settings,
    MessageSquare, Eye, Code, Heart, Lock, ChevronRight, Activity,
    Edit3, Kanban, MessagesSquare, ThumbsUp, Video
} from "lucide-react";
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import SmoothScroll from "@/components/smoothscroll";
import { BeamsBackground } from "@/components/ui/beamsbackground";

export default function LandingPage() {
    const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

    const pricingData = {
        USD: {
            professional: 19,
            enterprise: 'Custom',
            symbol: '$'
        },
        INR: {
            professional: 1599,
            enterprise: 'Custom',
            symbol: '₹'
        }
    };

    return (
        <SmoothScroll>
            <div className="min-h-screen bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
                <Navbar />
                <section className="relative overflow-hidden">
                    <BeamsBackground
                        intensity="medium"
                        className="absolute inset-0 bg-white dark:bg-neutral-900"
                    />

                    <div className="absolute inset-0 bg-white/40 dark:bg-neutral-900/60 z-10"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-20 pt-12 pb-32">
                        <div className="flex items-center justify-center min-h-screen">
                            <motion.div
                                className="text-center max-w-4xl mx-auto"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 shadow-lg"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>New: Advanced AI Project Analytics</span>
                                    <ArrowRight className="w-4 h-4" />
                                </motion.div>
                                <motion.h1
                                    className="text-5xl lg:text-7xl font-bold leading-tight"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                >
                                    <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent drop-shadow-sm">
                                        Transform Your
                                    </span>
                                    <br />
                                    <WordRotate
                                        words={["Projects", "Teams", "Workflow", "Business", "Vision"]}
                                        className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm"
                                    />
                                </motion.h1>
                                <motion.p
                                    className="text-xl lg:text-2xl text-gray-700 dark:text-gray-200 mb-10 max-w-2xl leading-relaxed drop-shadow-sm"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                >
                                    The ultimate project management platform that brings{" "}
                                    <WordRotate
                                        words={["clarity", "efficiency", "innovation", "success", "growth"]}
                                        className="text-xl lg:text-2xl font-semibold text-blue-600 dark:text-blue-400"
                                    />
                                    {" "}to every team and project.
                                </motion.p>
                                <motion.div
                                    className="flex flex-col sm:flex-row gap-4 justify-center"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                >
                                    <Button
                                        size="lg"
                                        className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                                        asChild
                                    >
                                        <Link href="/signup">
                                            Start Free Trial
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="group border-2 border-gray-400 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-xl text-gray-900 dark:text-gray-100"
                                        asChild
                                    >
                                        <Link href="#demo">
                                            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                                            Watch Demo
                                        </Link>
                                    </Button>
                                </motion.div>
                                <motion.div
                                    className="mt-8 pt-8 border-t border-gray-300/50 dark:border-gray-600/50"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                >
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 drop-shadow-sm">Trusted by forward-thinking teams at</p>
                                    <div className="flex flex-wrap justify-center items-center gap-8">
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                                            <Building2 className="w-5 h-5" />
                                            <span className="font-semibold text-sm">Microsoft</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                                            <Rocket className="w-5 h-5" />
                                            <span className="font-semibold text-sm">SpaceX</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                                            <Globe className="w-5 h-5" />
                                            <span className="font-semibold text-sm">Netflix</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                                            <Zap className="w-5 h-5" />
                                            <span className="font-semibold text-sm">Tesla</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>
                <section className="py-20 bg-white dark:bg-neutral-900">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-800 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent">
                                Powering Teams Worldwide
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Join thousands of teams who&apos;ve transformed their project management with ProjectCentral
                            </p>
                        </motion.div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {
                                [
                                    { icon: Users, number: "10,000+", label: "Active Teams", color: "blue" },
                                    { icon: Rocket, number: "50,000+", label: "Projects Completed", color: "green" },
                                    { icon: Globe, number: "120+", label: "Countries", color: "purple" },
                                    { icon: Award, number: "99.9%", label: "Uptime", color: "orange" },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.8 }}
                                        viewport={{ once: true }}
                                        className="text-center group"
                                    >
                                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-r from-blue-100 to-purple-200 dark:from-blue-900/50 dark:to-purple-800/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                            <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                            {stat.number}
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-300 font-medium">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <section id="features" className="py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Features
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-800 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent">
                                Everything You Need to Succeed
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                From planning to execution, ProjectCentral provides all the tools your team needs to deliver exceptional results.
                            </p>
                        </motion.div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {
                                [
                                    {
                                        icon: Monitor,
                                        title: "Real-time Collaboration",
                                        description: "Work together seamlessly with live updates, comments, and instant notifications.",
                                        gradient: "from-blue-500 to-cyan-500"
                                    },
                                    {
                                        icon: BarChart3,
                                        title: "Advanced Analytics",
                                        description: "Get deep insights into project performance with AI-powered analytics and reporting.",
                                        gradient: "from-green-500 to-emerald-500"
                                    },
                                    {
                                        icon: Shield,
                                        title: "Enterprise Security",
                                        description: "Bank-level security with end-to-end encryption and compliance certifications.",
                                        gradient: "from-purple-500 to-indigo-500"
                                    },
                                    {
                                        icon: Zap,
                                        title: "Automation Engine",
                                        description: "Automate repetitive tasks and workflows to focus on what matters most.",
                                        gradient: "from-orange-500 to-red-500"
                                    },
                                    {
                                        icon: Globe,
                                        title: "Global Access",
                                        description: "Access your projects from anywhere with our cloud-native platform.",
                                        gradient: "from-pink-500 to-rose-500"
                                    },
                                    {
                                        icon: Smartphone,
                                        title: "Mobile Ready",
                                        description: "Native mobile apps for iOS and Android to manage projects on the go.",
                                        gradient: "from-cyan-500 to-blue-500"
                                    }
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.8 }}
                                        viewport={{ once: true }}
                                    >
                                        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 hover:scale-105">
                                            <CardHeader className="pb-4">
                                                <div className={`inline-flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 transition-transform`}>
                                                    <feature.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {feature.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {feature.description}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <Badge className="mb-4 px-4 py-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                How It Works
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-indigo-800 dark:from-gray-100 dark:to-indigo-300 bg-clip-text text-transparent">
                                Get Started in Minutes
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                ProjectCentral makes project management effortless with our intuitive three-step process.
                            </p>
                        </motion.div>
                        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                            {
                                [
                                    {
                                        step: "01",
                                        title: "Set Up Your Workspace",
                                        description: "Create your team workspace in seconds. Invite members, set permissions, and customize your project environment.",
                                        icon: Settings,
                                        color: "blue"
                                    },
                                    {
                                        step: "02",
                                        title: "Plan Your Projects",
                                        description: "Break down complex projects into manageable tasks. Set deadlines, assign responsibilities, and track progress.",
                                        icon: Target,
                                        color: "purple"
                                    },
                                    {
                                        step: "03",
                                        title: "Collaborate & Deliver",
                                        description: "Work together seamlessly with real-time updates, automated workflows, and powerful analytics.",
                                        icon: Rocket,
                                        color: "green"
                                    }
                                ].map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2, duration: 0.8 }}
                                        viewport={{ once: true }}
                                        className="relative text-center"
                                    >
                                        <div className="relative mb-8">
                                            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${step.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                                                step.color === 'purple' ? 'from-purple-500 to-pink-500' :
                                                    'from-green-500 to-emerald-500'
                                                } text-white mb-4 shadow-lg`}>
                                                <step.icon className="w-10 h-10" />
                                            </div>
                                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border-2 border-gray-200 dark:border-gray-600">
                                                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{step.step}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {step.description}
                                        </p>
                                        {
                                            index < 2 && (
                                                <div className="hidden md:block absolute top-10 left-full w-full">
                                                    <ChevronRight className="w-6 h-6 text-gray-400 mx-auto" />
                                                </div>
                                            )
                                        }
                                    </motion.div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <Badge className="mb-4 px-4 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                                Phase 1 Features
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-emerald-800 dark:from-gray-100 dark:to-emerald-300 bg-clip-text text-transparent">
                                Coming Soon: Next-Level Collaboration
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                Experience the future of project management with our upcoming Phase 1 features, designed for seamless collaboration between teams and clients.
                            </p>
                        </motion.div>
                        <div className="grid lg:grid-cols-2 gap-16">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-3xl p-8 border border-blue-200/50 dark:border-blue-800/50">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                                            <Code className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                For Product Managers & Developers
                                            </h3>
                                            <p className="text-blue-600 dark:text-blue-400 font-medium">
                                                Advanced project management tools
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        {
                                            [
                                                {
                                                    icon: Activity,
                                                    title: "Real-time Project Changes View",
                                                    description: "Track every project update instantly with live notifications and change logs",
                                                    gradient: "from-blue-500 to-cyan-500"
                                                },
                                                {
                                                    icon: MessagesSquare,
                                                    title: "Advanced Chat Functionalities",
                                                    description: "Collaborate seamlessly with threaded conversations, file sharing, and @mentions",
                                                    gradient: "from-indigo-500 to-purple-500"
                                                },
                                                {
                                                    icon: Edit3,
                                                    title: "Smart Edit & Task Management",
                                                    description: "Edit, delete, and mark projects/tasks as complete with intelligent workflow automation",
                                                    gradient: "from-purple-500 to-pink-500"
                                                },
                                                {
                                                    icon: Kanban,
                                                    title: "Kanban-Style Todo Lists",
                                                    description: "Visualize your workflow with drag-and-drop boards and customizable columns",
                                                    gradient: "from-pink-500 to-rose-500"
                                                }
                                            ].map((feature, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                                    viewport={{ once: true }}
                                                    className="flex items-start gap-4 p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-white/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 group"
                                                >
                                                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                                                        <feature.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                                                            {feature.title}
                                                        </h4>
                                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                            {feature.description}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        }
                                    </div>
                                    <motion.div
                                        className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-xl shadow-lg"
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Rocket className="w-6 h-6" />
                                    </motion.div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-3xl p-8 border border-emerald-200/50 dark:border-emerald-800/50">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                                            <Users className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                For Clients
                                            </h3>
                                            <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                                                Transparent project visibility
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        {
                                            [
                                                {
                                                    icon: Eye,
                                                    title: "Real-time Project Status View",
                                                    description: "Monitor project progress with live updates, milestones, and detailed status reports",
                                                    gradient: "from-emerald-500 to-teal-500"
                                                },
                                                {
                                                    icon: ThumbsUp,
                                                    title: "Interactive Feedback System",
                                                    description: "Provide feedback, suggestions, and approvals directly within the project interface",
                                                    gradient: "from-teal-500 to-cyan-500"
                                                },
                                                {
                                                    icon: Video,
                                                    title: "Live Developer-Client Chat",
                                                    description: "Direct communication channel with developers for instant clarifications and updates",
                                                    gradient: "from-cyan-500 to-blue-500"
                                                }
                                            ].map((feature, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                                    viewport={{ once: true }}
                                                    className="flex items-start gap-4 p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-white/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 group"
                                                >
                                                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                                                        <feature.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                                                            {feature.title}
                                                        </h4>
                                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                            {feature.description}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        }
                                    </div>
                                    <motion.div
                                        className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-xl shadow-lg"
                                        animate={{ y: [-5, 5, -5] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Heart className="w-6 h-6" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mt-16"
                        >
                            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/20 dark:to-emerald-950/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/50">
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <Badge className="bg-gradient-to-r from-blue-100 to-emerald-100 text-blue-800 dark:from-blue-900 dark:to-emerald-900 dark:text-blue-200 border-0">
                                        Coming Q2 2025
                                    </Badge>
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    Be the First to Experience These Features
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                    Join our early access program and get exclusive access to these powerful features before they&apos;re available to the public.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        size="lg"
                                        className="group bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                        asChild
                                    >
                                        <Link href="/signup">
                                            Join Early Access
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
                <section id="solutions" className="py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <Badge className="mb-4 px-4 py-2 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                Integrations
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-orange-800 dark:from-gray-100 dark:to-orange-300 bg-clip-text text-transparent">
                                Connect Your Favorite Tools
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                ProjectCentral integrates seamlessly with the tools your team already loves and uses.
                            </p>
                        </motion.div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                            {
                                [
                                    { name: "Slack", icon: "💬", color: "bg-purple-100 dark:bg-purple-900" },
                                    { name: "GitHub", icon: "🐙", color: "bg-gray-100 dark:bg-gray-800" },
                                    { name: "Figma", icon: "🎨", color: "bg-pink-100 dark:bg-pink-900" },
                                    { name: "Jira", icon: "📋", color: "bg-blue-100 dark:bg-blue-900" },
                                    { name: "Notion", icon: "📝", color: "bg-gray-100 dark:bg-gray-800" },
                                    { name: "Zoom", icon: "📹", color: "bg-blue-100 dark:bg-blue-900" },
                                    { name: "Drive", icon: "📁", color: "bg-green-100 dark:bg-green-900" },
                                    { name: "Trello", icon: "📊", color: "bg-blue-100 dark:bg-blue-900" },
                                    { name: "Teams", icon: "👥", color: "bg-purple-100 dark:bg-purple-900" },
                                    { name: "Dropbox", icon: "📦", color: "bg-blue-100 dark:bg-blue-900" },
                                    { name: "Asana", icon: "✅", color: "bg-orange-100 dark:bg-orange-900" },
                                    { name: "Gmail", icon: "📧", color: "bg-red-100 dark:bg-red-900" }
                                ].map((integration, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05, duration: 0.5 }}
                                        viewport={{ once: true }}
                                        className="group"
                                    >
                                        <div className={`${integration.color} rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg`}>
                                            <div className="text-3xl mb-3">{integration.icon}</div>
                                            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                {integration.name}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            }
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mt-12"
                        >
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                And 200+ more integrations available
                            </p>
                            <Button variant="outline" size="lg" className="group">
                                View All Integrations
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    </div>
                </section>
                <section className="py-20 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-950/20 dark:to-cyan-950/20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <Badge className="mb-4 px-4 py-2 bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                                    Performance
                                </Badge>
                                <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-cyan-800 dark:from-gray-100 dark:to-cyan-300 bg-clip-text text-transparent">
                                    Measurable Results That Matter
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                    See the impact ProjectCentral has on your team&apos;s productivity and project success rates.
                                </p>
                                <div className="space-y-6">
                                    {
                                        [
                                            { label: "Faster Project Delivery", value: "40%", icon: Clock },
                                            { label: "Increased Team Productivity", value: "65%", icon: TrendingUp },
                                            { label: "Reduced Planning Time", value: "50%", icon: Calendar },
                                            { label: "Improved Project Success Rate", value: "85%", icon: Target }
                                        ].map((stat, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                                viewport={{ once: true }}
                                                className="flex items-center gap-4"
                                            >
                                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                                                    <stat.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                                                            {stat.value}
                                                        </span>
                                                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                            {stat.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Dashboard</h3>
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Live Data</Badge>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                <span className="font-medium text-gray-900 dark:text-white">Active Projects</span>
                                            </div>
                                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">127</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                <span className="font-medium text-gray-900 dark:text-white">Completed This Month</span>
                                            </div>
                                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">89</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                <span className="font-medium text-gray-900 dark:text-white">Team Members</span>
                                            </div>
                                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">1,247</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                                <span className="font-medium text-gray-900 dark:text-white">Time Saved (Hours)</span>
                                            </div>
                                            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">2,340</span>
                                        </div>
                                    </div>
                                </div>
                                <motion.div
                                    className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl shadow-lg"
                                    animate={{ y: [-5, 5, -5] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <TrendingUp className="w-6 h-6" />
                                </motion.div>
                                <motion.div
                                    className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl shadow-lg"
                                    animate={{ y: [5, -5, 5] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <BarChart3 className="w-6 h-6" />
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <Badge className="mb-4 px-4 py-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                Security & Compliance
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-red-800 dark:from-gray-100 dark:to-red-300 bg-clip-text text-transparent">
                                Enterprise-Grade Security
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                Your data security is our top priority. ProjectCentral meets the highest industry standards for security and compliance.
                            </p>
                        </motion.div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {
                                [
                                    {
                                        title: "SOC 2 Type II",
                                        description: "Independently verified security controls and practices",
                                        icon: Shield,
                                        badge: "Certified"
                                    },
                                    {
                                        title: "GDPR Compliant",
                                        description: "Full compliance with European data protection regulations",
                                        icon: Eye,
                                        badge: "Compliant"
                                    },
                                    {
                                        title: "256-bit Encryption",
                                        description: "End-to-end encryption for all data in transit and at rest",
                                        icon: Lock,
                                        badge: "Encrypted"
                                    },
                                    {
                                        title: "99.9% Uptime",
                                        description: "Reliable infrastructure with guaranteed service availability",
                                        icon: Activity,
                                        badge: "Guaranteed"
                                    }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.8 }}
                                        viewport={{ once: true }}
                                    >
                                        <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 group hover:scale-105">
                                            <CardContent className="p-6">
                                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                                                    <item.icon className="w-8 h-8 text-white" />
                                                </div>
                                                <Badge className="mb-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                    {item.badge}
                                                </Badge>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            }
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mt-16"
                        >
                            <div className="inline-flex items-center gap-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                <div className="text-sm text-gray-600 dark:text-gray-300">Trusted by:</div>
                                <div className="flex items-center gap-6">
                                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">ISO 27001</div>
                                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">HIPAA</div>
                                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">PCI DSS</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
                <section id="pricing" className="py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <Badge className="mb-4 px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Pricing
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-green-800 dark:from-gray-100 dark:to-green-300 bg-clip-text text-transparent">
                                Choose Your Plan
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                                Start free and scale as you grow. All plans include our core features with no hidden fees.
                            </p>
                            <div className="inline-flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-8">
                                <button
                                    onClick={() => setCurrency('USD')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currency === 'USD'
                                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    USD ($)
                                </button>
                                <button
                                    onClick={() => setCurrency('INR')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currency === 'INR'
                                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    INR (₹)
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <Link href="/pricing" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    View detailed pricing →
                                </Link>
                            </p>
                        </motion.div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {
                                [
                                    {
                                        name: "Starter",
                                        price: "Free",
                                        description: "Perfect for small teams getting started",
                                        features: ["Up to 5 team members", "10 projects", "Basic analytics", "Community support"],
                                        cta: "Get Started",
                                        popular: false
                                    },
                                    {
                                        name: "Professional",
                                        price: `${pricingData[currency].symbol}${pricingData[currency].professional}`,
                                        description: "For growing teams that need more power",
                                        features: ["Up to 50 team members", "Unlimited projects", "Advanced analytics", "Priority support", "Automation"],
                                        cta: "Start Free Trial",
                                        popular: true
                                    },
                                    {
                                        name: "Enterprise",
                                        price: "Custom",
                                        description: "For large organizations with custom needs",
                                        features: ["Unlimited team members", "Custom integrations", "Dedicated support", "SLA guarantee", "Advanced security"],
                                        cta: "Contact Sales",
                                        popular: false
                                    }
                                ].map((plan, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.8 }}
                                        viewport={{ once: true }}
                                        className={`relative ${plan.popular ? 'scale-105' : ''}`}
                                    >
                                        {
                                            plan.popular && (
                                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1">
                                                        Most Popular
                                                    </Badge>
                                                </div>
                                            )
                                        }
                                        <Card className={`border-2 ${plan.popular ? 'border-blue-500 shadow-xl' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300`}>
                                            <CardHeader className="text-center pb-8">
                                                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                    {plan.name}
                                                </CardTitle>
                                                <div className="mb-4">
                                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                                        {plan.price}
                                                    </span>
                                                    {
                                                        plan.price !== "Free" && plan.price !== "Custom" && (
                                                            <span className="text-gray-600 dark:text-gray-400">/month</span>
                                                        )
                                                    }
                                                </div>
                                                <CardDescription className="text-gray-600 dark:text-gray-300">
                                                    {plan.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <ul className="space-y-3">
                                                    {
                                                        plan.features.map((feature, featureIndex) => (
                                                            <li key={featureIndex} className="flex items-center gap-3">
                                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                                <Button
                                                    className={`w-full mt-6 ${plan.popular
                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                                                        : 'text-black dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-800'
                                                        }`}
                                                    size="lg"
                                                    asChild
                                                >
                                                    <Link href={
                                                        plan.name === 'Professional' ? `/checkout?plan=${plan.name.toLowerCase()}&currency=${currency}` :
                                                            plan.name === 'Enterprise' ? '/contact' :
                                                                '/signup'
                                                    }>
                                                        {plan.cta}
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <Badge className="mb-4 px-4 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                FAQ
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-yellow-800 dark:from-gray-100 dark:to-yellow-300 bg-clip-text text-transparent">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                Get answers to the most common questions about ProjectCentral.
                            </p>
                        </motion.div>
                        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {
                                [
                                    {
                                        question: "How quickly can we get started?",
                                        answer: "You can be up and running in under 5 minutes. Simply sign up, invite your team, and start creating projects immediately."
                                    },
                                    {
                                        question: "Is there a free trial available?",
                                        answer: "Yes! We offer a 14-day free trial with full access to all Professional features. No credit card required."
                                    },
                                    {
                                        question: "Can we migrate from other project management tools?",
                                        answer: "Absolutely. We provide seamless migration tools and dedicated support to help you transfer your data from popular platforms like Asana, Trello, and Monday.com."
                                    },
                                    {
                                        question: "What kind of support do you offer?",
                                        answer: "We provide 24/7 customer support via chat, email, and phone. Professional and Enterprise plans include priority support and dedicated account managers."
                                    },
                                    {
                                        question: "Is ProjectCentral suitable for remote teams?",
                                        answer: "Yes! ProjectCentral is designed for distributed teams with real-time collaboration, video conferencing integration, and mobile apps for on-the-go access."
                                    },
                                    {
                                        question: "How secure is our data?",
                                        answer: "We use enterprise-grade security with 256-bit encryption, SOC 2 compliance, and regular security audits. Your data is hosted on secure cloud infrastructure with 99.9% uptime guarantee."
                                    }
                                ].map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.6 }}
                                        viewport={{ once: true }}
                                    >
                                        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                                    {faq.question}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            }
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mt-12"
                        >
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Still have questions? We&apos;re here to help.
                            </p>
                            <Button variant="outline" size="lg" className="group">
                                <MessageSquare className="mr-2 w-5 h-5" />
                                Contact Support
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    </div>
                </section>
                <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <Badge className="mb-4 px-4 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                Testimonials
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-purple-800 dark:from-gray-100 dark:to-purple-300 bg-clip-text text-transparent">
                                Loved by Teams Everywhere
                            </h2>
                        </motion.div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {
                                [
                                    {
                                        name: "Sarah Chen",
                                        role: "Product Manager",
                                        company: "TechCorp",
                                        content: "ProjectCentral transformed how our team collaborates. We've seen a 40% increase in project delivery speed.",
                                        avatar: "SC"
                                    },
                                    {
                                        name: "Marcus Johnson",
                                        role: "Engineering Lead",
                                        company: "StartupXYZ",
                                        content: "The automation features alone have saved us countless hours. Best project management tool we've ever used.",
                                        avatar: "MJ"
                                    },
                                    {
                                        name: "Emma Rodriguez",
                                        role: "CEO",
                                        company: "InnovateLab",
                                        content: "Finally, a platform that grows with your team. The analytics insights have been game-changing for our business.",
                                        avatar: "ER"
                                    }
                                ].map((testimonial, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.8 }}
                                        viewport={{ once: true }}
                                    >
                                        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex mb-4">
                                                    {
                                                        [...Array(5)].map((_, i) => (
                                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                                        ))
                                                    }
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                                                    &ldquo;{testimonial.content}&rdquo;
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {testimonial.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-white">
                                                            {testimonial.name}
                                                        </div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            {testimonial.role} at {testimonial.company}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <section className="py-20 bg-gradient-to-br from-black via-emerald-900 to-black text-white">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                                Ready to Transform Your Projects?
                            </h2>
                            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
                                Join thousands of teams who&apos;ve already revolutionized their project management with ProjectCentral.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl"
                                    asChild
                                >
                                    <Link href="/signup">
                                        Start Your Free Trial
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-2 border-white text-black dark:text-white px-8 py-4 text-lg font-semibold rounded-xl"
                                    asChild
                                >
                                    <Link href="/contact">
                                        Contact Sales
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
                <Footer />
            </div>
        </SmoothScroll>
    );
}