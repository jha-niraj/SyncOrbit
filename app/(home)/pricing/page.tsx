"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check, X, Star, Zap, Shield, Users, Building2, Target, ArrowRight,
    HelpCircle, Sparkles, ChevronDown
} from "lucide-react";
import { FeatureDefinition, Plan } from "@/types/pricing";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const pricingData = {
    USD: {
        starter: { monthly: 0, annual: 0 },
        professional: { monthly: 29, annual: 24 },
        enterprise: { monthly: 99, annual: 79 },
        symbol: '$'
    },
    INR: {
        starter: { monthly: 0, annual: 0 },
        professional: { monthly: 1999, annual: 1699 },
        enterprise: { monthly: 6999, annual: 5499 },
        symbol: '₹'
    }
};

const allFeatures: FeatureDefinition[] = [
    { name: "Team Members", key: "users", category: "Core" },
    { name: "Active Projects", key: "projects", category: "Core" },
    { name: "File Storage", key: "storage", category: "Core" },
    { name: "Integrations", key: "integrations", category: "Core" },
    { name: "Analytics Dashboard", key: "analytics", category: "Intelligence" },
    { name: "Advanced Reporting", key: "advancedReporting", category: "Intelligence" },
    { name: "Time Tracking", key: "timeTracking", category: "Productivity" },
    { name: "Custom Fields", key: "customFields", category: "Productivity" },
    { name: "API Access", key: "apiAccess", category: "Developer" },
    { name: "SSO (SAML/OIDC)", key: "sso", category: "Security" },
    { name: "Advanced Security", key: "advancedSecurity", category: "Security" },
    { name: "Custom Branding", key: "customBranding", category: "Admin" },
    { name: "Support Level", key: "support", category: "Support" },
];

const faqs = [
    {
        question: "Can I change plans at any time?",
        answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments so you only pay for what you use."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for Enterprise plans. For Indian customers, we also support UPI and Net Banking via Stripe."
    },
    {
        question: "Is there a free trial?",
        answer: "Absolutely. All paid plans come with a 14-day free trial with full feature access. No credit card is required to start your trial."
    },
    {
        question: "Do you offer discounts for annual billing?",
        answer: "Yes! Choosing annual billing saves you ~20% compared to monthly billing. The discount is automatically applied when you toggle the switch above."
    },
    {
        question: "What happens to my data if I downgrade?",
        answer: "Your data remains safe. If you exceed the limits of your new plan, we'll ask you to archive some projects or remove team members before you can add new ones."
    }
];

export const ToggleSwitch = ({
    options,
    selected,
    onChange,
    layoutId
}: {
    options: { label: string; value: string }[],
    selected: string,
    onChange: (val: any) => void,
    layoutId: string
}) => {
    return (
        <div className="bg-gray-100 dark:bg-neutral-900/50 p-1 rounded-full relative flex items-center border border-gray-200 dark:border-neutral-800">
            {
                options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-200 rounded-full",
                            selected === option.value ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                    >
                        {
                            selected === option.value && (
                                <motion.div
                                    layoutId={layoutId}
                                    className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-full shadow-sm"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )
                        }
                        <span className="relative z-20">{option.label}</span>
                    </button>
                ))
            }
        </div>
    );
};

export default function PricingPage() {
    const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const plans: Plan[] = [
        {
            id: "starter",
            name: "Starter",
            description: "Essential tools for small teams and startups.",
            price: pricingData[currency].starter[billingCycle],
            features: {
                users: "5 members",
                projects: "10 projects",
                storage: "5GB",
                analytics: "Basic",
                support: "Community",
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
            cta: "Get Started Free",
            popular: false,
            link: "/signup"
        },
        {
            id: "professional",
            name: "Professional",
            description: "Advanced features for scaling teams.",
            price: pricingData[currency].professional[billingCycle],
            features: {
                users: "50 members",
                projects: "Unlimited",
                storage: "100GB",
                analytics: "Advanced",
                support: "Priority Email",
                integrations: "Unlimited",
                timeTracking: true,
                advancedReporting: true,
                customFields: true,
                apiAccess: true,
                prioritySupport: true,
                sso: false,
                customBranding: false,
                advancedSecurity: false
            },
            cta: "Start 14-Day Trial",
            popular: true,
            link: "/signup?plan=pro"
        },
        {
            id: "enterprise",
            name: "Enterprise",
            description: "Maximum control and security for large orgs.",
            price: pricingData[currency].enterprise[billingCycle],
            features: {
                users: "Unlimited",
                projects: "Unlimited",
                storage: "1TB+",
                analytics: "Custom",
                support: "Dedicated Agent",
                integrations: "Custom + API",
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

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans selection:bg-orange-500/30">
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="container max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium mb-6 border border-neutral-200 dark:border-neutral-700">
                            <Sparkles className="w-3 h-3 text-orange-500" />
                            <span>Transparent Pricing</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Simple pricing, <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                                powerful results.
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Choose the plan that fits your team's needs. No hidden fees.
                            <br className="hidden sm:block" /> Switch or cancel anytime.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <div className="flex items-center gap-3">
                                <span className={cn("text-sm font-medium transition-colors", billingCycle === 'monthly' ? "text-gray-900 dark:text-white" : "text-gray-500")}>Monthly</span>
                                <button
                                    onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                                    className="w-12 h-6 rounded-full bg-gray-200 dark:bg-neutral-800 relative transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                >
                                    <motion.div
                                        className="w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5"
                                        animate={{ left: billingCycle === 'monthly' ? 2 : 26 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className={cn("text-sm font-medium transition-colors", billingCycle === 'annual' ? "text-gray-900 dark:text-white" : "text-gray-500")}>Annual</span>
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                        Save 20%
                                    </span>
                                </div>
                            </div>
                            <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-neutral-800" />
                            <ToggleSwitch
                                options={[{ label: 'USD', value: 'USD' }, { label: 'INR', value: 'INR' }]}
                                selected={currency}
                                onChange={(val) => setCurrency(val)}
                                layoutId="currency-toggle"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>
            <section className="pb-24">
                <div className="container max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                        {
                            plans.map((plan, index) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.1 }}
                                    className={cn(
                                        "relative flex flex-col p-8 rounded-3xl transition-all duration-300",
                                        plan.popular
                                            ? "bg-white dark:bg-neutral-900 shadow-2xl shadow-orange-500/10 ring-1 ring-orange-500/50 z-10 scale-100 md:scale-105"
                                            : "bg-gray-50 dark:bg-neutral-900/50 border border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700"
                                    )}
                                >
                                    {
                                        plan.popular && (
                                            <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                                <div className="bg-[#FE5C02] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg flex items-center gap-1.5">
                                                    <Star className="w-3 h-3 fill-current" /> Most Popular
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm h-10 leading-snug">{plan.description}</p>
                                    </div>
                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-medium text-gray-400 dark:text-neutral-500">
                                                {pricingData[currency].symbol}
                                            </span>
                                            <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                                                <AnimatePresence mode="wait">
                                                    <motion.span
                                                        key={plan.price}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {plan.price}
                                                    </motion.span>
                                                </AnimatePresence>
                                            </span>
                                            {
                                                plan.price > 0 && (
                                                    <span className="text-gray-500 dark:text-gray-400 text-sm">/mo</span>
                                                )
                                            }
                                        </div>
                                        <div className="text-xs text-gray-400 dark:text-neutral-600 mt-2 font-medium">
                                            {billingCycle === 'annual' && plan.price > 0 ? 'Billed annually' : 'Billed monthly'}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4 mb-8">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                <Users className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                <span>{plan.features.users}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                <Target className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                <span>{plan.features.projects}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                <Building2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                <span>{plan.features.storage}</span>
                                            </div>
                                            {
                                                plan.features.prioritySupport && (
                                                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                        <Zap className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                        <span>Priority Support</span>
                                                    </div>
                                                )
                                            }
                                            {
                                                plan.features.sso && (
                                                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                        <Shield className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                        <span>SSO & Security</span>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <Link
                                        href={plan.link}
                                        className={cn(
                                            "w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center group",
                                            plan.popular
                                                ? "bg-[#FE5C02] hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transform hover:-translate-y-0.5"
                                                : "bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700"
                                        )}
                                    >
                                        {plan.cta}
                                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </motion.div>
                            ))
                        }
                    </div>
                </div>
            </section>
            <section className="py-20 bg-gray-50 dark:bg-neutral-900/30 border-y border-gray-100 dark:border-neutral-800">
                <div className="container max-w-7xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Detailed Comparison</h2>
                        <p className="text-gray-600 dark:text-gray-400">See exactly what you get with each plan.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="min-w-7xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-neutral-900">
                                        <th className="text-left p-6 font-medium text-gray-500 dark:text-gray-400 w-1/4">Features</th>
                                        {
                                            plans.map(plan => (
                                                <th key={plan.id} className="p-6 text-center w-1/4">
                                                    <div className="font-bold text-lg text-gray-900 dark:text-white">{plan.name}</div>
                                                </th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                                    {
                                        allFeatures.map((feature) => (
                                            <tr key={feature.key} className="group hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                        {feature.name}
                                                        <HelpCircle className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-help" />
                                                    </div>
                                                </td>
                                                {
                                                    plans.map((plan) => {
                                                        const val = plan.features[feature.key];
                                                        return (
                                                            <td key={`${plan.id}-${feature.key}`} className="p-4 text-center">
                                                                {
                                                                    typeof val === 'boolean' ? (
                                                                        val ? (
                                                                            <div className="flex justify-center"><div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"><Check className="w-3.5 h-3.5" /></div></div>
                                                                        ) : (
                                                                            <div className="flex justify-center"><div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-400"><X className="w-3.5 h-3.5" /></div></div>
                                                                        )
                                                                    ) : (
                                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{val}</span>
                                                                    )
                                                                }
                                                            </td>
                                                        );
                                                    })
                                                }
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-24">
                <div className="container max-w-3xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {
                            faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={false}
                                    className="border border-gray-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full text-left p-6 flex items-center justify-between focus:outline-none"
                                    >
                                        <span className="font-semibold text-gray-900 dark:text-white pr-8">{faq.question}</span>
                                        <ChevronDown
                                            className={cn("w-5 h-5 text-gray-400 transition-transform duration-300", openFaq === index ? "rotate-180" : "")}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {
                                            openFaq === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                >
                                                    <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-neutral-800 mt-2 pt-4">
                                                        {faq.answer}
                                                    </div>
                                                </motion.div>
                                            )
                                        }
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        }
                    </div>
                </div>
            </section>
            <section className="py-20 px-6">
                <div className="container max-w-6xl mx-auto">
                    <div className="relative rounded-[2.5rem] bg-[#0A0A0A] overflow-hidden px-6 py-16 sm:px-16 sm:py-20 text-center">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
                                Ready to streamline your workflow?
                            </h2>
                            <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10">
                                Join 10,000+ teams who have switched to SyncOrbit. Start your 14-day free trial today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/signup"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    Get Started Free
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-neutral-700 text-white font-bold rounded-full hover:bg-neutral-800 transition-colors"
                                >
                                    Contact Sales
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}