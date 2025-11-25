"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Zap, Star, Sparkles } from "lucide-react";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ToggleSwitch } from "@/app/(home)/pricing/page";

const pricingData = {
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

interface PricingTier {
    id: string;
    title: string;
    description: string;
    features: string[];
    monthlyPrice: {
        USD: string | number;
        INR: string | number;
    };
    buttonText: string;
    popular?: boolean;
    buttonVariant: "primary" | "secondary" | "outline";
}

const Pricing = () => {
    // Default to INR as requested
    const [currency, setCurrency] = useState<"USD" | "INR">("INR");
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

    // Plans data dynamically constructed to match state
    const plans: PricingTier[] = [
        {
            id: "starter",
            title: "Starter",
            description: "Essential tools for small teams and startups.",
            monthlyPrice: {
                USD: pricingData.USD.starter[billingCycle],
                INR: pricingData.INR.starter[billingCycle]
            },
            features: ["5 members", "10 active projects", "5GB storage", "Basic analytics", "Community support"],
            buttonText: "Get started free",
            buttonVariant: "outline",
        },
        {
            id: "professional",
            title: "Professional",
            description: "Advanced features for scaling teams.",
            monthlyPrice: {
                USD: pricingData.USD.professional[billingCycle],
                INR: pricingData.INR.professional[billingCycle]
            },
            features: ["50 members", "Unlimited projects", "100GB storage", "Timeline & Gantt views", "Gamified Rewards", "Priority support"],
            buttonText: "Start 14-day trial",
            buttonVariant: "primary",
            popular: true,
        },
        {
            id: "enterprise",
            title: "Enterprise",
            description: "Maximum control and security for large orgs.",
            monthlyPrice: {
                USD: pricingData.USD.enterprise[billingCycle],
                INR: pricingData.INR.enterprise[billingCycle]
            },
            features: ["Unlimited members", "SSO & Security", "1TB+ storage", "Dedicated Agent", "Custom Integrations", "SLA Guarantees"],
            buttonText: "Contact sales",
            buttonVariant: "secondary",
        },
    ];

    return (
        <section className="py-24 bg-gray-50 dark:bg-neutral-950 transition-colors duration-300" id="pricing">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium mb-6 border border-neutral-200 dark:border-neutral-700">
                        <Sparkles className="w-3 h-3 text-orange-500" />
                        <span>Transparent Pricing</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Simple pricing that scales
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
                        Start free. Upgrade when you need more power. No hidden fees.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-neutral-900 p-2 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm">
                        <div className="flex items-center gap-3 px-2">
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
                            <span className={cn("text-sm font-medium transition-colors", billingCycle === 'annual' ? "text-gray-900 dark:text-white" : "text-gray-500")}>Annual</span>
                        </div>
                        <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-neutral-800" />
                        <ToggleSwitch
                            options={[{ label: 'USD', value: 'USD' }, { label: 'INR', value: 'INR' }]}
                            selected={currency}
                            onChange={(val) => setCurrency(val)}
                            layoutId="landing-pricing-currency"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                    {
                        plans.map((plan, index) => {
                            const isCustom = plan.monthlyPrice.USD === "Custom";

                            return (
                                <motion.div
                                    key={plan.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className={cn(
                                        "relative flex flex-col p-8 rounded-3xl transition-all duration-300 group",
                                        plan.popular
                                            ? "bg-white dark:bg-neutral-900 ring-2 ring-orange-500 shadow-2xl shadow-orange-500/10 scale-100 md:scale-105 z-10"
                                            : "bg-white dark:bg-neutral-900/50 border border-gray-200 dark:border-neutral-800 hover:border-orange-200 dark:hover:border-orange-900/30 hover:shadow-xl"
                                    )}
                                >
                                    {
                                        plan.popular && (
                                            <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                                <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg flex items-center gap-1">
                                                    <Zap className="w-3 h-3 fill-current" /> Most Popular
                                                </span>
                                            </div>
                                        )
                                    }

                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{plan.title}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 h-10">{plan.description}</p>

                                        <div className="flex items-baseline gap-1">
                                            {
                                                !isCustom && (
                                                    <span className="text-2xl font-medium text-gray-500 dark:text-gray-400">
                                                        {currency === "USD" ? "$" : "₹"}
                                                    </span>
                                                )
                                            }
                                            <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                                                <AnimatePresence mode="wait">
                                                    <motion.span
                                                        key={`${currency}-${billingCycle}`}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {plan.monthlyPrice[currency]}
                                                    </motion.span>
                                                </AnimatePresence>
                                            </span>
                                            {
                                                !isCustom && (
                                                    <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm font-medium">/ user / mo</span>
                                                )
                                            }
                                        </div>
                                        <div className="text-xs text-gray-400 dark:text-neutral-600 mt-2 font-medium">
                                            {billingCycle === 'annual' && typeof plan.monthlyPrice[currency] === 'number' && plan.monthlyPrice[currency] > 0
                                                ? 'Billed annually'
                                                : 'Billed monthly'}
                                        </div>
                                    </div>
                                    <div className="space-y-4 mb-8 flex-1">
                                        {
                                            plan.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <div className="mt-1 w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                                                        <Check className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <Link
                                        href="/pricing"
                                        className={cn(
                                            "w-full py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center group",
                                            plan.buttonVariant === "primary" && "bg-[#FE5C02] hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25",
                                            plan.buttonVariant === "secondary" && "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black",
                                            plan.buttonVariant === "outline" && "border-2 border-gray-100 dark:border-neutral-800 hover:border-orange-500 dark:hover:border-orange-500 text-gray-900 dark:text-white bg-transparent"
                                        )}
                                    >
                                        {plan.buttonText}
                                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </motion.div>
                            );
                        })
                    }
                </div>
                <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-neutral-800 max-w-4xl mx-auto">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Enterprise plans offer volume discounts. All plans include a 14-day free trial.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Pricing;