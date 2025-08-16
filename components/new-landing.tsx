"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ShineBorder from "@/components/ui/shine-border";
import ShinyButton from "@/components/ui/shiny-button";
import Link from "next/link";
import {
    ArrowRight, Calendar, Monitor, Users, Zap, Shield, Globe, Smartphone,
    Database, Rocket, TrendingUp, Award, Clock, CheckCircle, Star,
    MessageSquare, Bell, BarChart3, Settings, Play, Eye, Target,
    Layers, Code, Palette, Lightbulb, Gauge, Heart, Lock, Check,
    ArrowUp, Github, Twitter, Linkedin, Mail, Phone, MapPin,
    ChevronRight, Activity, Briefcase, FileText, Download
} from "lucide-react";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const floatingVariants = {
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export default function NewLanding() {
    const platformFeatures = [
        {
            icon: Monitor,
            title: "Real-time Project Tracking",
            description: "Monitor project progress with live updates, visual timelines, and milestone tracking for complete transparency.",
            gradient: "from-blue-500 to-cyan-500",
            delay: 0.1
        },
        {
            icon: Users,
            title: "Team Collaboration Hub",
            description: "Seamless communication tools, file sharing, and collaborative workspaces designed for modern teams.",
            gradient: "from-purple-500 to-pink-500",
            delay: 0.2
        },
        {
            icon: BarChart3,
            title: "Advanced Analytics",
            description: "Comprehensive insights with custom dashboards, performance metrics, and detailed reporting capabilities.",
            gradient: "from-green-500 to-emerald-500",
            delay: 0.3
        },
        {
            icon: MessageSquare,
            title: "Smart Communication",
            description: "Integrated messaging, notifications, and discussion threads to keep everyone connected and informed.",
            gradient: "from-orange-500 to-red-500",
            delay: 0.4
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            description: "Bank-level encryption, role-based access control, and compliance with industry security standards.",
            gradient: "from-indigo-500 to-blue-500",
            delay: 0.5
        },
        {
            icon: Rocket,
            title: "Rapid Deployment",
            description: "Quick setup with automated workflows, templates, and integrations that get you started instantly.",
            gradient: "from-teal-500 to-green-500",
            delay: 0.6
        }
    ];

    const platformStats = [
        { number: "99.9%", label: "Uptime Guarantee", icon: Activity },
        { number: "500+", label: "Active Projects", icon: Briefcase },
        { number: "50K+", label: "Tasks Completed", icon: CheckCircle },
        { number: "24/7", label: "Expert Support", icon: Clock }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Project Manager",
            company: "Tech Innovations Inc.",
            content: "This platform has revolutionized how we manage projects. The real-time tracking and collaboration features have increased our team productivity by 40%.",
            avatar: "SJ",
            rating: 5
        },
        {
            name: "Michael Chen",
            role: "CTO",
            company: "StartupXYZ",
            content: "The analytics and reporting capabilities are outstanding. We can now make data-driven decisions and keep stakeholders informed with beautiful dashboards.",
            avatar: "MC",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            role: "Team Lead",
            company: "Creative Agency Pro",
            content: "Finally, a project management tool that our entire team loves using. The interface is intuitive and the features are exactly what we needed.",
            avatar: "ER",
            rating: 5
        }
    ];

    const pricingPlans = [
        {
            name: "Starter",
            price: "$29",
            period: "/month",
            description: "Perfect for small teams getting started",
            features: [
                "Up to 10 projects",
                "5 team members",
                "Basic analytics",
                "Email support",
                "File storage (5GB)"
            ],
            popular: false,
            gradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20"
        },
        {
            name: "Professional",
            price: "$79",
            period: "/month",
            description: "For growing teams that need more power",
            features: [
                "Unlimited projects",
                "25 team members",
                "Advanced analytics",
                "Priority support",
                "File storage (100GB)",
                "Custom workflows",
                "API access"
            ],
            popular: true,
            gradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20"
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "pricing",
            description: "For large organizations with specific needs",
            features: [
                "Everything in Professional",
                "Unlimited team members",
                "White-label solution",
                "Dedicated support",
                "Custom integrations",
                "Advanced security",
                "Training & onboarding"
            ],
            popular: false,
            gradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
        }
    ];

    const integrations = [
        { name: "Slack", icon: MessageSquare },
        { name: "GitHub", icon: Github },
        { name: "Google Drive", icon: Database },
        { name: "Zoom", icon: Monitor },
        { name: "Figma", icon: Palette },
        { name: "Notion", icon: FileText },
        { name: "Zapier", icon: Zap },
        { name: "Stripe", icon: Briefcase }
    ];

    return (
        <div className="w-full bg-white dark:bg-neutral-950 overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-blue-950/10 dark:to-indigo-950/10">
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -50, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            x: [0, -80, 0],
                            y: [0, 100, 0],
                            scale: [1, 0.9, 1],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="text-center"
                    >
                        <motion.div variants={itemVariants}>
                            <ShineBorder
                                className="mb-8"
                                color={["#3B82F6", "#8B5CF6", "#06B6D4"]}
                                borderRadius={50}
                                borderWidth={2}
                                duration={10}
                            >
                                <Badge className="px-6 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                                    <Zap className="w-4 h-4 mr-2" />
                                    The Future of Project Management
                                </Badge>
                            </ShineBorder>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tighter"
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                                Project
                            </span>
                            <br />
                            <span className="text-slate-900 dark:text-white">
                                Central
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed"
                        >
                            Transform how your team collaborates, tracks progress, and delivers exceptional results. 
                            Our platform combines powerful features with intuitive design to make project management effortless.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                        >
                            <Link href="/signin">
                                <ShinyButton className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                    Start Free Trial
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </ShinyButton>
                            </Link>
                            <Link href="#demo">
                                <Button
                                    variant="outline"
                                    className="px-8 py-4 text-lg font-semibold border-2 border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-400 rounded-xl transition-all duration-300"
                                >
                                    <Eye className="mr-2 h-5 w-5" />
                                    Watch Demo
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap justify-center gap-8 text-sm text-slate-500 dark:text-slate-400"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>14-day free trial</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Cancel anytime</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Platform Stats */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {platformStats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center group"
                            >
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                                    <stat.icon className="w-10 h-10 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                    <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.number}</div>
                                    <div className="text-slate-600 dark:text-slate-300 font-medium">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-neutral-950">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-950 dark:to-purple-950 dark:text-blue-300">
                            <Target className="w-4 h-4 mr-2" />
                            Platform Features
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                            Everything you need to
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                manage projects
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                            Our comprehensive platform provides all the tools your team needs to plan, execute, and deliver successful projects.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {platformFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: feature.delay }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <Card className="h-full p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl`}>
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <CardHeader className="p-0 mb-4">
                                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <CardDescription className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <Heart className="w-4 h-4 mr-2" />
                            Customer Love
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                            Trusted by teams worldwide
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            See why thousands of teams choose our platform for their project management needs.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                                    <div className="flex items-center gap-1 mb-6">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <CardContent className="p-0">
                                        <p className="text-slate-700 dark:text-slate-300 mb-6 text-base leading-relaxed">
                                            "{testimonial.content}"
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role} at {testimonial.company}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-white dark:bg-neutral-950">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-950 dark:to-emerald-950 dark:text-green-300">
                            <Gauge className="w-4 h-4 mr-2" />
                            Simple Pricing
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                            Choose your
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                                perfect plan
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                            Start free and scale as you grow. All plans include our core features with different limits and capabilities.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className={`group relative ${plan.popular ? 'scale-105' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}
                                <Card className={`h-full p-8 bg-gradient-to-br ${plan.gradient} border-2 ${plan.popular ? 'border-purple-200 dark:border-purple-700 shadow-2xl' : 'border-slate-200 dark:border-slate-700 shadow-lg'} hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1`}>
                                    <CardHeader className="p-0 mb-8">
                                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</CardTitle>
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                                            <span className="text-slate-600 dark:text-slate-400">{plan.period}</span>
                                        </div>
                                        <CardDescription className="text-slate-600 dark:text-slate-300">{plan.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <ul className="space-y-4 mb-8">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-3">
                                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button className={`w-full py-3 text-lg font-semibold rounded-xl transition-all duration-300 ${plan.popular 
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-400'
                                        }`}>
                                            {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Integrations Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 dark:from-orange-950 dark:to-red-950 dark:text-orange-300">
                            <Layers className="w-4 h-4 mr-2" />
                            Integrations
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                            Connect with your favorite tools
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Seamlessly integrate with the tools your team already loves and uses every day.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {integrations.map((integration, index) => (
                            <motion.div
                                key={integration.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 text-center">
                                    <integration.icon className="w-12 h-12 text-slate-600 dark:text-slate-300 mx-auto mb-4 group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all" />
                                    <div className="font-semibold text-slate-900 dark:text-white">{integration.name}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <motion.div
                            variants={floatingVariants}
                            animate="animate"
                            className="inline-block mb-8"
                        >
                            <Rocket className="w-16 h-16 mx-auto mb-6" />
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            Ready to transform your
                            <br />
                            project management?
                        </h2>
                        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
                            Join thousands of teams who have revolutionized their workflow with our platform. 
                            Start your free trial today and see the difference.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                            <Link href="/signin">
                                <Button className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-slate-50 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
                                    Start Your Free Trial
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="https://cal.com/niraj-jha/30min" target="_blank">
                                <Button variant="outline" className="px-8 py-4 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 rounded-xl transition-all duration-300">
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Schedule Demo
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8 text-sm opacity-75">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                <span>14-day free trial</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                <span>No setup fees</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                ProjectCentral
                            </h3>
                            <p className="text-slate-300 mb-6">
                                The ultimate project management platform for modern teams who want to work smarter, not harder.
                            </p>
                            <div className="flex gap-4">
                                <Link href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                                    <Github className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6">Product</h4>
                            <ul className="space-y-3 text-slate-300">
                                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6">Company</h4>
                            <ul className="space-y-3 text-slate-300">
                                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6">Support</h4>
                            <ul className="space-y-3 text-slate-300">
                                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-slate-400 mb-4 md:mb-0">
                            © 2024 ProjectCentral. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-slate-400">
                            <Link href="mailto:support@projectcentral.com" className="hover:text-white transition-colors flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                support@projectcentral.com
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
