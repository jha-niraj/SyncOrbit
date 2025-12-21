"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check, ArrowRight, HelpCircle, Sparkles, ChevronDown, Box, Layers, Cpu
} from "lucide-react";
import { FeatureDefinition, Plan } from "@/types/pricing";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { PlanSelectionDialog } from "@/components/pricing/plan-selection-dialog";
import { PaymentVerificationDialog } from "@/components/pricing/payment-verification-dialog";
import { SubscriptionPlanType } from "@/lib/dodopayments";

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

const allFeatures: FeatureDefinition[] = [
    { name: "Team Nodes", key: "users", category: "Core" },
    { name: "Active Projects", key: "projects", category: "Core" },
    { name: "Storage Unit", key: "storage", category: "Core" },
    { name: "API Access", key: "apiAccess", category: "Developer" },
    { name: "SSO Enforcement", key: "sso", category: "Security" },
    { name: "Analytics Module", key: "analytics", category: "Intelligence" },
    { name: "Advanced Reporting", key: "advancedReporting", category: "Intelligence" },
    { name: "Time Tracking", key: "timeTracking", category: "Productivity" },
    { name: "Custom Fields", key: "customFields", category: "Productivity" },
    { name: "Advanced Security", key: "advancedSecurity", category: "Security" },
    { name: "Custom Branding", key: "customBranding", category: "Admin" },
    { name: "Support Level", key: "support", category: "Support" },
];

const faqs = [
    {
        question: "Can I scale resources dynamically?",
        answer: "Yes. Upgrade or downgrade instantly. Prorated billing applies based on your usage cycle."
    },
    {
        question: "Payment protocols supported?",
        answer: "We accept Visa, Mastercard, Amex, and PayPal. INR transactions support UPI and Net Banking via Stripe."
    },
    {
        question: "Is there a sandbox environment?",
        answer: "All paid plans include a 14-day trial with full feature access. No credit card required to initialize."
    },
    {
        question: "Annual billing efficiency?",
        answer: "Committing to an annual cycle reduces cost overhead by ~20%."
    },
    {
        question: "Data retention on downgrade?",
        answer: "Data remains encrypted and stored. You may need to archive projects to fit within new capacity limits."
    }
];

const ToggleSwitch = ({
    options,
    selected,
    onChange,
    layoutId
}: {
    options: { label: string; value: string }[],
    selected: string,
    onChange: (val: string) => void,
    layoutId: string
}) => {
    return (
        <div className="bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center">
            {
                options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "relative z-10 px-4 py-2 text-xs font-bold font-mono transition-colors duration-200 rounded-md uppercase tracking-wider",
                            selected === option.value ? "text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                        )}
                    >
                        {
                            selected === option.value && (
                                <motion.div
                                    layoutId={layoutId}
                                    className="absolute inset-0 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm rounded-md"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
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

function Pricing() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [currency, setCurrency] = useState<'USD' | 'INR'>('INR');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Payment dialog states
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanType | null>(null);
    const [showPlanDialog, setShowPlanDialog] = useState(false);
    const [showVerificationDialog, setShowVerificationDialog] = useState(false);

    // Show verification dialog if session_id is present
    useEffect(() => {
        if (sessionId) {
            setShowVerificationDialog(true);
        }
    }, [sessionId]);

    const handlePlanClick = (planId: string, e: React.MouseEvent) => {
        // Map plan IDs to subscription plan types
        const planMap: Record<string, SubscriptionPlanType> = {
            'starter': 'FREE',
            'professional': 'STARTER',
            'enterprise': 'PROFESSIONAL'
        };

        const subscriptionPlan = planMap[planId];

        if (subscriptionPlan && subscriptionPlan !== 'FREE') {
            e.preventDefault();
            setSelectedPlan(subscriptionPlan);
            setShowPlanDialog(true);
        }
    };

    // Get the current price for the selected plan
    const getSelectedPlanPrice = () => {
        if (!selectedPlan) return { price: 0, currency: 'USD' as const, symbol: '$' };

        const planMap: Record<SubscriptionPlanType, 'starter' | 'professional' | 'enterprise'> = {
            'FREE': 'starter',
            'STARTER': 'professional',
            'PROFESSIONAL': 'enterprise',
            'ENTERPRISE': 'enterprise'
        };

        const planKey = planMap[selectedPlan];
        const planData = pricingData[currency][planKey];
        const price = typeof planData === 'object' ? planData[billingCycle] : 0;
        const symbol = pricingData[currency].symbol;

        return { price, currency, symbol };
    };

    const plans: Plan[] = [
        {
            id: "starter",
            name: "Bootstrap",
            description: "Telemetry for solo operators.",
            price: pricingData[currency].starter[billingCycle],
            features: {
                users: "5 nodes",
                projects: "10 active",
                storage: "5GB unit",
                analytics: "Basic",
                support: "Community",
                integrations: "5 modules",
                timeTracking: false,
                advancedReporting: false,
                customFields: false,
                apiAccess: false,
                prioritySupport: false,
                sso: false,
                customBranding: false,
                advancedSecurity: false
            },
            cta: "Initialize Free",
            popular: false,
            link: "/signup"
        },
        {
            id: "professional",
            name: "Scale_Up",
            description: "Advanced architecture for teams.",
            price: pricingData[currency].professional[billingCycle],
            features: {
                users: "50 nodes",
                projects: "Unlimited",
                storage: "100GB unit",
                analytics: "Advanced",
                support: "Priority",
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
            cta: "Start Trial",
            popular: true,
            link: "/signup?plan=pro"
        },
        {
            id: "enterprise",
            name: "Orbit_Core",
            description: "Maximum control infrastructure.",
            price: pricingData[currency].enterprise[billingCycle],
            features: {
                users: "Unlimited",
                projects: "Unlimited",
                storage: "1TB+ unit",
                analytics: "Custom",
                support: "Dedicated",
                integrations: "API Access",
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
        <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,rgba(0,0,0,0.05),transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_-30%,rgba(255,255,255,0.05),transparent)]"></div>

                <div className="container max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 mb-8">
                            <Sparkles className="w-3 h-3 text-neutral-500" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Resource_Allocation</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 dark:text-white mb-6 tracking-tighter">
                            Scalable <span className="text-neutral-400">Infrastructure</span>
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                            Choose your deployment capacity. No hidden latency fees.
                            <br className="hidden sm:block" /> Upgrade or downgrade instantly.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <div className="flex items-center p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                                <button
                                    onClick={() => setBillingCycle('monthly')}
                                    className={cn(
                                        "px-6 py-2 text-xs font-bold font-mono uppercase tracking-wide rounded-md transition-all",
                                        billingCycle === 'monthly' ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500"
                                    )}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBillingCycle('annual')}
                                    className={cn(
                                        "px-6 py-2 text-xs font-bold font-mono uppercase tracking-wide rounded-md transition-all flex items-center gap-2",
                                        billingCycle === 'annual' ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500"
                                    )}
                                >
                                    Annual <span className="text-[9px] bg-neutral-200 dark:bg-neutral-700 px-1.5 py-0.5 rounded text-neutral-900 dark:text-white">-20%</span>
                                </button>
                            </div>

                            <div className="hidden sm:block w-px h-8 bg-neutral-200 dark:bg-neutral-800" />

                            <ToggleSwitch
                                options={[{ label: 'USD', value: 'USD' }, { label: 'INR', value: 'INR' }]}
                                selected={currency}
                                onChange={(val) => setCurrency(val as 'USD' | 'INR')}
                                layoutId="currency-toggle"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>
            <section className="pb-24">
                <div className="container max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
                        {
                            plans.map((plan, index) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.1 }}
                                    className={cn(
                                        "relative flex flex-col p-8 rounded-2xl transition-all duration-300 border",
                                        plan.popular
                                            ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black border-neutral-900 dark:border-white shadow-2xl scale-105 z-10"
                                            : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                                    )}
                                >
                                    {
                                        plan.popular && (
                                            <div className="absolute top-0 right-0 p-4">
                                                <div className="bg-white dark:bg-black text-black dark:text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-neutral-200 dark:border-neutral-800">
                                                    Recommended
                                                </div>
                                            </div>
                                        )
                                    }

                                    <div className="mb-8">
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center mb-4 border",
                                            plan.popular
                                                ? "bg-white/10 border-white/20 text-white dark:bg-black/10 dark:border-black/20 dark:text-black"
                                                : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
                                        )}>
                                            {plan.id === 'starter' && <Box className="w-5 h-5" />}
                                            {plan.id === 'professional' && <Layers className="w-5 h-5" />}
                                            {plan.id === 'enterprise' && <Cpu className="w-5 h-5" />}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">{plan.name}</h3>
                                        <p className={cn("text-sm h-10 leading-snug", plan.popular ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-500")}>
                                            {plan.description}
                                        </p>
                                    </div>
                                    <div className="mb-8 pb-8 border-b border-white/10 dark:border-black/10">
                                        <div className="flex items-baseline gap-1">
                                            <span className={cn("text-2xl font-light", plan.popular ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-400")}>
                                                {pricingData[currency].symbol}
                                            </span>
                                            <span className="text-5xl font-bold tracking-tighter">
                                                <AnimatePresence mode="wait">
                                                    <motion.span
                                                        key={plan.price}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        {plan.price}
                                                    </motion.span>
                                                </AnimatePresence>
                                            </span>
                                        </div>
                                        {
                                            plan.price > 0 && (
                                                <div className={cn("text-xs mt-2 font-mono uppercase tracking-widest", plan.popular ? "text-neutral-400 dark:text-neutral-600" : "text-neutral-400")}>
                                                    {billingCycle === 'annual' ? 'Billed Annually' : 'Billed Monthly'}
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="flex-1 space-y-4 mb-8">
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className={cn(plan.popular ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-600 dark:text-neutral-400")}>Nodes</span>
                                                <span className="font-mono font-bold">{plan.features.users}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={cn(plan.popular ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-600 dark:text-neutral-400")}>Storage</span>
                                                <span className="font-mono font-bold">{plan.features.storage}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={cn(plan.popular ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-600 dark:text-neutral-400")}>API Access</span>
                                                <span className="font-mono font-bold">{plan.features.apiAccess ? "Yes" : "No"}</span>
                                            </div>
                                            {
                                                plan.features.sso && (
                                                    <div className="flex items-center justify-between">
                                                        <span className={cn(plan.popular ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-600 dark:text-neutral-400")}>SSO</span>
                                                        <span className="font-mono font-bold">Enforced</span>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    {
                                        plan.id === 'starter' ? (
                                            <Link href={plan.link} className="w-full">
                                                <button className="w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all bg-transparent border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900">
                                                    {plan.cta}
                                                </button>
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={(e) => handlePlanClick(plan.id, e)}
                                                className={cn(
                                                    "w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all",
                                                    plan.popular
                                                        ? "bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                                        : "bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90"
                                                )}
                                            >
                                                {plan.cta}
                                            </button>
                                        )
                                    }
                                </motion.div>
                            ))
                        }
                    </div>
                </div>
            </section>
            <section className="py-20 bg-neutral-50 dark:bg-neutral-900/30 border-y border-neutral-200 dark:border-neutral-800">
                <div className="container max-w-6xl mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-8 text-center text-neutral-900 dark:text-white">Feature Matrix</h2>
                    <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-100 dark:bg-neutral-900 font-mono text-xs uppercase text-neutral-500">
                                <tr>
                                    <th className="p-4 font-normal">Capability</th>
                                    {plans.map(p => <th key={p.id} className="p-4 text-center font-bold text-neutral-900 dark:text-white">{p.name}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {
                                    allFeatures.map((feature) => (
                                        <tr key={feature.key} className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                            <td className="p-4 font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                                                {feature.name}
                                                <HelpCircle className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </td>
                                            {
                                                plans.map((plan) => {
                                                    const val = plan.features[feature.key];
                                                    return (
                                                        <td key={`${plan.id}-${feature.key}`} className="p-4 text-center">
                                                            {
                                                                typeof val === 'boolean' ? (
                                                                    val ? (
                                                                        <Check className="w-4 h-4 mx-auto text-neutral-900 dark:text-white" />
                                                                    ) : (
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 mx-auto" />
                                                                    )
                                                                ) : (
                                                                    <span className="font-mono text-xs text-neutral-600 dark:text-neutral-400">{val}</span>
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
            </section>
            <section className="py-24">
                <div className="container max-w-3xl mx-auto px-6">
                    <h2 className="text-2xl font-bold mb-12 text-center text-neutral-900 dark:text-white">System FAQ</h2>
                    <div className="space-y-4">
                        {
                            faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={false}
                                    className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full text-left p-6 flex items-center justify-between focus:outline-none hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                                    >
                                        <span className="font-medium text-neutral-900 dark:text-white pr-8">{faq.question}</span>
                                        <ChevronDown
                                            className={cn("w-4 h-4 text-neutral-400 transition-transform duration-300", openFaq === index ? "rotate-180" : "")}
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
                                                    <div className="px-6 pb-6 pt-0 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed border-t border-neutral-100 dark:border-neutral-800 mt-2 pt-4">
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
                    <div className="relative rounded-3xl bg-neutral-900 dark:bg-neutral-100 overflow-hidden px-6 py-20 text-center border border-neutral-800 dark:border-neutral-200">
                        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#888_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-5xl font-bold text-white dark:text-black mb-6 tracking-tighter">
                                Ready to Streamline?
                            </h2>
                            <p className="text-lg text-neutral-400 dark:text-neutral-600 max-w-2xl mx-auto mb-10 font-light">
                                Join 10,000+ teams. Start your 14-day free trial today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/signup"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-black text-black dark:text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-sm uppercase tracking-widest"
                                >
                                    Initialize
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-neutral-700 dark:border-neutral-300 text-white dark:text-black font-bold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-sm uppercase tracking-widest"
                                >
                                    Contact Sales
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {
                selectedPlan && (
                    <PlanSelectionDialog
                        open={showPlanDialog}
                        onOpenChange={setShowPlanDialog}
                        plan={selectedPlan}
                        selectedCurrency={currency}
                        selectedPrice={getSelectedPlanPrice().price}
                        currencySymbol={getSelectedPlanPrice().symbol}
                        billingCycle={billingCycle}
                    />
                )
            }
            {
                sessionId && (
                    <PaymentVerificationDialog
                        open={showVerificationDialog}
                        onOpenChange={setShowVerificationDialog}
                        sessionId={sessionId}
                    />
                )
            }
        </div>
    );
}

export default function PricingPage() {
    return (
        <Suspense>
            <Pricing />
        </Suspense>
    )
}