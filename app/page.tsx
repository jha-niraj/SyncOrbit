"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WordRotate } from "@/components/ui/wordrotate";
import Link from "next/link";
import {
    ArrowRight, Monitor, Users, Zap, Shield, Globe, Smartphone,
    Rocket, TrendingUp, Award, Star,
    Bell, BarChart3, Play, Check,
    Sparkles,
    Building2
} from "lucide-react";
import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import SmoothScroll from "@/components/smoothscroll";
import { BeamsBackground } from "@/components/ui/beamsbackground";

export default function LandingPage() {
    return (
        <SmoothScroll>
            <div className="min-h-screen bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
                <Navbar />
                
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    {/* BeamsBackground */}
                    <BeamsBackground 
                        intensity="medium" 
                        className="absolute inset-0 bg-white dark:bg-neutral-900"
                    />
                    
                    {/* Overlay to ensure content is readable */}
                    <div className="absolute inset-0 bg-white/40 dark:bg-neutral-900/60 z-10"></div>

                    <div className="container mx-auto px-6 relative z-20 pt-20 pb-32">
                        <div className="flex flex-col lg:flex-row items-center gap-16 min-h-[80vh]">
                            {/* Left Content */}
                            <motion.div 
                                className="flex-1 text-center lg:text-left"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                {/* Announcement Badge */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 shadow-lg"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>New: Advanced AI Project Analytics</span>
                                    <ArrowRight className="w-4 h-4" />
                                </motion.div>

                                {/* Main Heading */}
                                <motion.h1 
                                    className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
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

                                {/* Subtitle */}
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

                                {/* CTA Buttons */}
                                <motion.div 
                                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
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

                                {/* Trust Indicators */}
                                <motion.div 
                                    className="mt-16 pt-8 border-t border-gray-300/50 dark:border-gray-600/50"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                >
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 drop-shadow-sm">Trusted by forward-thinking teams at</p>
                                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8">
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

                            {/* Right Visual */}
                            <motion.div 
                                className="flex-1 relative"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 1 }}
                            >
                                <div className="relative max-w-lg mx-auto">
                                    {/* Main Dashboard Mockup */}
                                    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                                        {/* Header */}
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                                                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                                                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                                                <div className="ml-auto text-white text-sm font-medium">ProjectCentral</div>
                                            </div>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="p-6 space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Dashboard</h3>
                                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 backdrop-blur-sm">On Track</Badge>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="bg-blue-50/80 dark:bg-blue-950/40 backdrop-blur-sm p-3 rounded-lg text-center border border-blue-200/30 dark:border-blue-800/30">
                                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
                                                </div>
                                                <div className="bg-green-50/80 dark:bg-green-950/40 backdrop-blur-sm p-3 rounded-lg text-center border border-green-200/30 dark:border-green-800/30">
                                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">8</div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                                                </div>
                                                <div className="bg-orange-50/80 dark:bg-orange-950/40 backdrop-blur-sm p-3 rounded-lg text-center border border-orange-200/30 dark:border-orange-800/30">
                                                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 p-2 bg-gray-50/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-lg border border-gray-200/30 dark:border-gray-600/30">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">Website Redesign</span>
                                                    <div className="ml-auto text-xs text-gray-500">75%</div>
                                                </div>
                                                <div className="flex items-center gap-3 p-2 bg-gray-50/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-lg border border-gray-200/30 dark:border-gray-600/30">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">Mobile App</span>
                                                    <div className="ml-auto text-xs text-gray-500">90%</div>
                                                </div>
                                                <div className="flex items-center gap-3 p-2 bg-gray-50/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-lg border border-gray-200/30 dark:border-gray-600/30">
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">API Integration</span>
                                                    <div className="ml-auto text-xs text-gray-500">45%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating Elements */}
                                    <motion.div 
                                        className="absolute -top-4 -right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-3 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                                        animate={{ y: [-5, 5, -5] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Bell className="w-5 h-5 text-blue-500" />
                                    </motion.div>
                                    
                                    <motion.div 
                                        className="absolute -bottom-4 -left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-3 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                                        animate={{ y: [5, -5, 5] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Platform Stats */}
                <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
                    <div className="container mx-auto px-6">
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
                            {[
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
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20">
                    <div className="container mx-auto px-6">
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
                            {[
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
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <div className="container mx-auto px-6">
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
                            {[
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
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                                ))}
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
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section className="py-20">
                    <div className="container mx-auto px-6">
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
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Start free and scale as you grow. All plans include our core features with no hidden fees.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
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
                                    price: "$19",
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
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1">
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}
                                    <Card className={`border-2 ${plan.popular ? 'border-blue-500 shadow-xl' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300`}>
                                        <CardHeader className="text-center pb-8">
                                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                {plan.name}
                                            </CardTitle>
                                            <div className="mb-4">
                                                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                                    {plan.price}
                                                </span>
                                                {plan.price !== "Free" && plan.price !== "Custom" && (
                                                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                                                )}
                                            </div>
                                            <CardDescription className="text-gray-600 dark:text-gray-300">
                                                {plan.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, featureIndex) => (
                                                    <li key={featureIndex} className="flex items-center gap-3">
                                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button 
                                                className={`w-full mt-6 ${plan.popular 
                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white' 
                                                    : 'border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-800'
                                                }`}
                                                size="lg"
                                                asChild
                                            >
                                                <Link href="/signup">
                                                    {plan.cta}
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
                    <div className="container mx-auto px-6 text-center">
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
                                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl"
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