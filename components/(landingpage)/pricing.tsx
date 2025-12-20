"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, Check, Sparkles, Box, Diamond, Hexagon
} from "lucide-react";
import { cn } from "@/lib/utils";

// Reusing your data structure
const pricingData = {
    USD: { starter: { monthly: 0, annual: 0 }, professional: { monthly: 29, annual: 24 }, enterprise: { monthly: 99, annual: 79 } },
    INR: { starter: { monthly: 0, annual: 0 }, professional: { monthly: 1999, annual: 1699 }, enterprise: { monthly: 6999, annual: 5499 } }
};

const Pricing = () => {
    const [currency, setCurrency] = useState<"USD" | "INR">("INR");
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

    const plans = [
        {
            id: "starter",
            icon: <Box className="w-5 h-5" />,
            title: "Bootstrap",
            tag: "INDIE_DEV",
            description: "Essential telemetry for solo operators.",
            price: { USD: pricingData.USD.starter[billingCycle], INR: pricingData.INR.starter[billingCycle] },
            features: ["5 active nodes (members)", "10 projects", "5GB encrypted storage", "Basic logs"],
            buttonText: "Initialize Free",
            variant: "outline"
        },
        {
            id: "professional",
            icon: <Hexagon className="w-5 h-5" />,
            title: "Scale_Up",
            tag: "HIGH_VELOCITY",
            description: "Advanced architecture for growing teams.",
            price: { USD: pricingData.USD.professional[billingCycle], INR: pricingData.INR.professional[billingCycle] },
            features: ["50 active nodes", "Unlimited projects", "100GB storage", "Gantt/Timeline views", "Priority signal"],
            buttonText: "Start Trial",
            variant: "primary",
            popular: true
        },
        {
            id: "enterprise",
            icon: <Diamond className="w-5 h-5" />,
            title: "Orbit_Core",
            tag: "ENTERPRISE",
            description: "Maximum control for large organizations.",
            price: { USD: pricingData.USD.enterprise[billingCycle], INR: pricingData.INR.enterprise[billingCycle] },
            features: ["Unlimited nodes", "SSO Enforcement", "1TB+ storage", "Dedicated Instance", "SLA Guarantee"],
            buttonText: "Contact Sales",
            variant: "secondary"
        },
    ];

    return (
        <section className="py-24 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800" id="pricing">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col items-center text-center mb-16">
                    <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 border border-neutral-200 dark:border-neutral-800 rounded bg-neutral-50 dark:bg-neutral-900">
                        <Sparkles className="w-3 h-3 text-orange-500" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Resource_Allocation</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-6 tracking-tighter">
                        Scalable <span className="text-neutral-400">Infrastructure</span>
                    </h2>
                    <div className="flex items-center gap-4 p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                        <div className="flex items-center">
                            {
                                ['monthly', 'annual'].map((cycle) => (
                                    <button
                                        key={cycle}
                                        onClick={() => setBillingCycle(cycle as 'monthly' | 'annual')}
                                        className={cn(
                                            "px-4 py-2 text-xs font-mono uppercase tracking-wide rounded-md transition-all",
                                            billingCycle === cycle
                                                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm border border-neutral-200 dark:border-neutral-700"
                                                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
                                        )}
                                    >
                                        {cycle}
                                    </button>
                                ))
                            }
                        </div>
                        <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700"></div>
                        <div className="flex items-center">
                            {
                                ['USD', 'INR'].map((curr) => (
                                    <button
                                        key={curr}
                                        onClick={() => setCurrency(curr as 'USD' | 'INR')}
                                        className={cn(
                                            "px-3 py-2 text-xs font-bold transition-colors",
                                            currency === curr ? "text-orange-600 dark:text-orange-500" : "text-neutral-400"
                                        )}
                                    >
                                        {curr}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {
                        plans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    "relative flex flex-col p-6 sm:p-8 rounded-xl border transition-all duration-300",
                                    plan.popular
                                        ? "bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white ring-4 ring-neutral-200 dark:ring-neutral-800"
                                        : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                                )}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={cn("p-2 rounded border", plan.popular ? "border-white/20 bg-white/10" : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900")}>
                                        {plan.icon}
                                    </div>
                                    <span className={cn("text-[10px] font-mono uppercase tracking-widest border px-2 py-1 rounded",
                                        plan.popular ? "border-white/30 text-white/80" : "border-neutral-200 dark:border-neutral-800 text-neutral-500")}>
                                        {plan.tag}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 tracking-tight">{plan.title}</h3>
                                <p className={cn("text-sm mb-8 min-h-[40px]", plan.popular ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-500")}>
                                    {plan.description}
                                </p>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-sm font-mono opacity-60">{currency === "USD" ? "$" : "₹"}</span>
                                    <span className="text-5xl font-bold tracking-tighter">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={`${currency}-${billingCycle}`}
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            >
                                                {plan.price[currency]}
                                            </motion.span>
                                        </AnimatePresence>
                                    </span>
                                    <span className="text-xs font-mono opacity-60">/user/mo</span>
                                </div>
                                <div className="space-y-4 mb-8 flex-1">
                                    {
                                        plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-sm">
                                                <Check className={cn("w-4 h-4 mt-0.5 shrink-0", plan.popular ? "text-orange-400 dark:text-orange-600" : "text-neutral-900 dark:text-white")} />
                                                <span className={cn(plan.popular ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-600 dark:text-neutral-400")}>{feature}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                                <button className={cn(
                                    "w-full py-3 px-4 rounded font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 group",
                                    plan.popular
                                        ? "bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                        : "bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
                                )}>
                                    {plan.buttonText}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ))
                    }
                </div>
            </div>
        </section>
    );
};

export default Pricing;