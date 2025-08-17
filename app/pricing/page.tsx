"use client";

import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
    Check, X, Star, Zap, Shield, Users, Globe, Clock, BarChart3,
    MessageSquare, ChevronDown, ChevronUp, Building2, Target,
    Award, ArrowRight, Lock, Activity, Settings
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import SmoothScroll from "@/components/smoothscroll";

interface PlanFeatures {
    users: string;
    projects: string;
    storage: string;
    analytics: string;
    support: string;
    integrations: string;
    timeTracking: boolean;
    advancedReporting: boolean;
    customFields: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    sso: boolean;
    customBranding: boolean;
    advancedSecurity: boolean;
}

interface Plan {
    name: string;
    description: string;
    price: number;
    features: PlanFeatures;
    cta: string;
    popular: boolean;
    link: string;
}

interface FeatureDefinition {
    name: string;
    key: keyof PlanFeatures;
    icon: React.ComponentType<{ className?: string }>;
}

export default function PricingPage() {
    const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const pricingData = {
        USD: {
            starter: { monthly: 0, annual: 0 },
            professional: { monthly: 19, annual: 15 },
            enterprise: { monthly: 49, annual: 39 },
            symbol: '$'
        },
        INR: {
            starter: { monthly: 0, annual: 0 },
            professional: { monthly: 1599, annual: 1299 },
            enterprise: { monthly: 4099, annual: 3299 },
            symbol: '₹'
        }
    };

    const plans: Plan[] = [
        {
            name: "Starter",
            description: "Perfect for small teams getting started",
            price: pricingData[currency].starter[billingCycle],
            features: {
                users: "Up to 5 team members",
                projects: "10 projects",
                storage: "5GB storage",
                analytics: "Basic analytics",
                support: "Community support",
                integrations: "5 integrations",
                timeTracking: false,
                advancedReporting: false,
                customFields: false,
                apiAccess: false,
                prioritySupport: false,
                sso: false,
                customBranding: false,
                advancedSecurity: false
            },
            cta: "Get Started",
            popular: false,
            link: "/signup"
        },
        {
            name: "Professional",
            description: "For growing teams that need more power",
            price: pricingData[currency].professional[billingCycle],
            features: {
                users: "Up to 50 team members",
                projects: "Unlimited projects",
                storage: "100GB storage",
                analytics: "Advanced analytics",
                support: "Priority support",
                integrations: "Unlimited integrations",
                timeTracking: true,
                advancedReporting: true,
                customFields: true,
                apiAccess: true,
                prioritySupport: true,
                sso: false,
                customBranding: false,
                advancedSecurity: false
            },
            cta: "Start Free Trial",
            popular: true,
            link: `/checkout?plan=professional&currency=${currency}&billing=${billingCycle}`
        },
        {
            name: "Enterprise",
            description: "For large organizations with custom needs",
            price: pricingData[currency].enterprise[billingCycle],
            features: {
                users: "Unlimited team members",
                projects: "Unlimited projects",
                storage: "1TB+ storage",
                analytics: "Custom analytics",
                support: "Dedicated support",
                integrations: "Custom integrations",
                timeTracking: true,
                advancedReporting: true,
                customFields: true,
                apiAccess: true,
                prioritySupport: true,
                sso: true,
                customBranding: true,
                advancedSecurity: true
            },
            cta: "Contact Sales",
            popular: false,
            link: "/contact"
        }
    ];

    const allFeatures: FeatureDefinition[] = [
        { name: "Team Members", key: "users", icon: Users },
        { name: "Projects", key: "projects", icon: Target },
        { name: "Storage", key: "storage", icon: Building2 },
        { name: "Analytics", key: "analytics", icon: BarChart3 },
        { name: "Support", key: "support", icon: MessageSquare },
        { name: "Integrations", key: "integrations", icon: Zap },
        { name: "Time Tracking", key: "timeTracking", icon: Clock },
        { name: "Advanced Reporting", key: "advancedReporting", icon: Activity },
        { name: "Custom Fields", key: "customFields", icon: Settings },
        { name: "API Access", key: "apiAccess", icon: Globe },
        { name: "Priority Support", key: "prioritySupport", icon: Star },
        { name: "SSO Integration", key: "sso", icon: Shield },
        { name: "Custom Branding", key: "customBranding", icon: Award },
        { name: "Advanced Security", key: "advancedSecurity", icon: Lock }
    ];

    const faqs = [
        {
            question: "Can I change plans at any time?",
            answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. Indian customers can also pay via UPI and net banking."
        },
        {
            question: "Is there a free trial?",
            answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial."
        },
        {
            question: "What happens if I exceed my plan limits?",
            answer: "We'll notify you when you're approaching your limits. You can either upgrade your plan or we'll help you optimize your usage."
        },
        {
            question: "Do you offer discounts for annual billing?",
            answer: "Yes! Annual billing saves you 20% compared to monthly billing. The discount is automatically applied when you choose annual billing."
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Absolutely. You can cancel your subscription at any time from your account settings. Your plan will remain active until the end of your billing period."
        }
    ];

    return (
        <SmoothScroll>
            <div className="min-h-screen bg-white dark:bg-neutral-900">
                <Navbar />
                <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Badge className="mb-6 px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Simple, Transparent Pricing
                            </Badge>
                            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                                Choose Your Perfect Plan
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                                Start free and scale as you grow. All plans include our core features with no hidden fees.
                            </p>
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
                                    Monthly
                                </span>
                                <button
                                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                                    className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-200 focus:outline-none"
                                >
                                    <div className={`absolute w-5 h-5 bg-blue-500 rounded-full transition-transform duration-200 top-1 ${billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-1'}`} />
                                </button>
                                <span className={`text-sm ${billingCycle === 'annual' ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
                                    Annual
                                </span>
                                {
                                    billingCycle === 'annual' && (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            Save 20%
                                        </Badge>
                                    )
                                }
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-12">
                                <button
                                    onClick={() => setCurrency('USD')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currency === 'USD'
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    USD ($)
                                </button>
                                <button
                                    onClick={() => setCurrency('INR')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currency === 'INR'
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    INR (₹)
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {
                                plans.map((plan, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.8 }}
                                        className={`relative ${plan.popular ? 'scale-105' : ''}`}
                                    >
                                        {
                                            plan.popular && (
                                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1">
                                                        <Star className="w-4 h-4 mr-1" />
                                                        Most Popular
                                                    </Badge>
                                                </div>
                                            )
                                        }
                                        <Card className={`h-full border-2 ${plan.popular ? 'border-blue-500 shadow-2xl' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg`}>
                                            <CardHeader className="text-center pb-8">
                                                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                    {plan.name}
                                                </CardTitle>
                                                <div className="mb-4">
                                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                                        {plan.price === 0 ? 'Free' : plan.name === 'Enterprise' ? 'Custom' : `${pricingData[currency].symbol}${plan.price}`}
                                                    </span>
                                                    {
                                                        plan.price !== 0 && plan.name !== 'Enterprise' && (
                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                /{billingCycle === 'monthly' ? 'month' : 'year'}
                                                            </span>
                                                        )
                                                    }
                                                </div>
                                                <CardDescription className="text-gray-600 dark:text-gray-300">
                                                    {plan.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <Button
                                                    className={`w-full ${plan.popular
                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                                                        : 'border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-800'
                                                        }`}
                                                    size="lg"
                                                    asChild
                                                >
                                                    <Link href={plan.link}>
                                                        {plan.cta}
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Link>
                                                </Button>
                                                <div className="space-y-3 pt-4">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">What&apos;s included:</h4>
                                                    <ul className="space-y-2">
                                                        <li className="flex items-center gap-3">
                                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700 dark:text-gray-300">{plan.features.users}</span>
                                                        </li>
                                                        <li className="flex items-center gap-3">
                                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700 dark:text-gray-300">{plan.features.projects}</span>
                                                        </li>
                                                        <li className="flex items-center gap-3">
                                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700 dark:text-gray-300">{plan.features.storage}</span>
                                                        </li>
                                                        <li className="flex items-center gap-3">
                                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700 dark:text-gray-300">{plan.features.analytics}</span>
                                                        </li>
                                                        <li className="flex items-center gap-3">
                                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700 dark:text-gray-300">{plan.features.support}</span>
                                                        </li>
                                                    </ul>
                                                </div>
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
                            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                Compare All Features
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                See what&apos;s included in each plan
                            </p>
                        </motion.div>

                        <div className="overflow-x-auto">
                            <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left p-6 font-semibold text-gray-900 dark:text-white">Features</th>
                                        {
                                            plans.map((plan) => (
                                                <th key={plan.name} className="text-center p-6 font-semibold text-gray-900 dark:text-white">
                                                    {plan.name}
                                                </th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allFeatures.map((feature) => (
                                            <tr key={feature.key} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="p-6 flex items-center gap-3">
                                                    <feature.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                    <span className="font-medium text-gray-900 dark:text-white">{feature.name}</span>
                                                </td>
                                                {
                                                    plans.map((plan) => (
                                                        <td key={`${plan.name}-${feature.key}`} className="text-center p-6">
                                                            {
                                                                typeof plan.features[feature.key] === 'boolean' ? (
                                                                    plan.features[feature.key] ? (
                                                                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                                                                    ) : (
                                                                        <X className="w-5 h-5 text-gray-400 mx-auto" />
                                                                    )
                                                                ) : (
                                                                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                                                                        {plan.features[feature.key] as string | number}
                                                                    </span>
                                                                )
                                                            }
                                                        </td>
                                                    ))
                                                }
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
                <section className="py-20">
                    <div className="max-w-4xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                Get answers to common questions about our pricing
                            </p>
                        </motion.div>
                        <div className="space-y-4">
                            {
                                faqs.map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.6 }}
                                        viewport={{ once: true }}
                                    >
                                        <Card className="border border-gray-200 dark:border-gray-700">
                                            <button
                                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                                className="w-full text-left p-6 focus:outline-none"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {faq.question}
                                                    </h3>
                                                    {
                                                        openFaq === index ? (
                                                            <ChevronUp className="w-5 h-5 text-gray-500" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-gray-500" />
                                                        )
                                                    }
                                                </div>
                                            </button>
                                            {
                                                openFaq === index && (
                                                    <div className="px-6 pb-6">
                                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                )
                                            }
                                        </Card>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </div>
                </section>
                <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-white mb-6">
                                Ready to Get Started?
                            </h2>
                            <p className="text-xl text-blue-100 mb-8">
                                Join thousands of teams already using ProjectCentral to manage their projects better.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-gray-100"
                                    asChild
                                >
                                    <Link href="/signup">
                                        Start Free Trial
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-white hover:bg-white hover:text-blue-600"
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