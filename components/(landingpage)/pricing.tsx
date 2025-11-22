import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";

interface PricingCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonVariant: "primary" | "secondary" | "outline";
    popular?: boolean;
}

const PricingCard = ({
    title,
    price,
    description,
    features,
    buttonText,
    buttonVariant,
    popular,
}: PricingCardProps) => {
    return (
        <div
            className={cn(
                "relative flex flex-col p-8 rounded-3xl transition-all duration-300 h-full",
                // Light Mode
                "bg-white border",
                // Dark Mode
                "dark:bg-neutral-900 dark:border-neutral-800",
                // Popular vs Standard
                popular
                    ? "border-orange-500 shadow-2xl shadow-orange-500/10 scale-105 z-10"
                    : "border-gray-200 dark:border-neutral-800 hover:border-orange-200 dark:hover:border-orange-900/30 shadow-xl hover:shadow-2xl"
            )}
        >
            {popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#FE5C02] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                        Most Popular
                    </span>
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
                <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{price}</span>
                    {price !== "Custom" && <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">/ user / mo</span>}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <div className="mt-0.5 rounded-full bg-orange-100 dark:bg-orange-900/20 p-1 mr-3 flex-shrink-0">
                            <Check className="w-3 h-3 text-[#FE5C02]" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{feature}</span>
                    </li>
                ))}
            </ul>

            <button
                className={cn(
                    "w-full py-4 px-6 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center group",
                    buttonVariant === "primary" && "bg-[#FE5C02] hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25",
                    buttonVariant === "secondary" && "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black",
                    buttonVariant === "outline" && "border border-gray-300 dark:border-neutral-700 hover:border-orange-500 text-gray-700 dark:text-white hover:text-[#FE5C02] bg-transparent"
                )}
            >
                {buttonText}
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
        </div>
    );
};

const Pricing = () => {
    const pricingPlans: PricingCardProps[] = [
        {
            title: "Starter",
            price: "Free",
            description: "Perfect for small teams getting started with organized work.",
            features: [
                "Up to 5 members",
                "5 active projects",
                "Basic Kanban boards",
                "2 weeks activity log",
                "Community support",
            ],
            buttonText: "Get started",
            buttonVariant: "outline",
        },
        {
            title: "Professional",
            price: "$19",
            description: "For growing teams that need automation and reporting.",
            features: [
                "Up to 50 users",
                "Unlimited projects",
                "Timeline & Gantt views",
                "Automated workflows",
                "Priority support",
                "Gamified Rewards System",
                "Guest access",
            ],
            buttonText: "Start free trial",
            buttonVariant: "primary",
            popular: true,
        },
        {
            title: "Enterprise",
            price: "Custom",
            description: "For large organizations requiring control and security.",
            features: [
                "Unlimited users",
                "SSO & Advanced Security",
                "Dedicated Success Manager",
                "Custom Integrations",
                "Audit logs",
                "Data residency options",
                "SLA Guarantees",
            ],
            buttonText: "Contact sales",
            buttonVariant: "secondary",
        },
    ];

    return (
        <section className="py-24 bg-gray-50 dark:bg-neutral-950 transition-colors duration-300" id="pricing">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
                        <span>Pricing</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Simple pricing that scales
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Start free. Upgrade when you need more power. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                    {pricingPlans.map((plan) => (
                        <PricingCard key={plan.title} {...plan} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        All plans include a 14-day free trial. Annual billing saves 20%.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Pricing;