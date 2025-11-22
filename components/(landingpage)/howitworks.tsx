import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface StepCardProps {
    number: string;
    title: string;
    description: string;
    isActive: boolean;
    onClick: () => void;
}

const StepCard = ({ number, title, description, isActive, onClick }: StepCardProps) => {
    return (
        <div
            className={cn(
                "rounded-2xl p-6 cursor-pointer transition-all duration-300 border",
                isActive
                    ? "bg-white shadow-xl border-orange-100 dark:bg-neutral-800 dark:border-neutral-700 scale-100"
                    : "bg-transparent hover:bg-white/50 dark:hover:bg-neutral-800/30 border-transparent scale-[0.98]"
            )}
            onClick={onClick}
        >
            <div className="flex gap-5">
                <div
                    className={cn(
                        "flex items-center justify-center rounded-full w-12 h-12 flex-shrink-0 text-sm font-bold transition-colors duration-300",
                        isActive
                            ? "bg-[#FE5C02] text-white"
                            : "bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-gray-400"
                    )}
                >
                    {number}
                </div>
                <div>
                    <h3
                        className={cn(
                            "text-xl font-bold mb-2 transition-colors duration-300",
                            isActive ? "text-[#FE5C02] dark:text-[#FE5C02]" : "text-gray-900 dark:text-white"
                        )}
                    >
                        {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

const HowItWorks = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const stepsData = [
        {
            number: "01",
            title: "Create your workspace",
            description:
                "Set up teams, invite members, and import work from popular tools in one click. Choose team types like Technical, Marketing, Social Media.",
            image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
        },
        {
            number: "02",
            title: "Plan & assign",
            description:
                "Break work into tasks, set owners and deadlines, and visualize them on boards or timeline. Set up team heads and reward systems.",
            image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
        },
        {
            number: "03",
            title: "Deliver & report",
            description:
                "Automations keep tasks moving; get post-sprint insights and exportable reports. Team members earn points for completed tasks.",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % stepsData.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [stepsData.length]);

    return (
        <section className="py-24 bg-white dark:bg-neutral-950 relative overflow-hidden transition-colors duration-300" id="how-it-works">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
                        <span>How It Works</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Three simple steps to transform your workflow
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        From setup to delivery — ProjectCentral gets your team productive fast without the complex onboarding.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left: Steps List */}
                    <div className="space-y-4 order-2 lg:order-1">
                        {stepsData.map((step, index) => (
                            <StepCard
                                key={step.number}
                                number={step.number}
                                title={step.title}
                                description={step.description}
                                isActive={activeStep === index}
                                onClick={() => setActiveStep(index)}
                            />
                        ))}
                        <div className="mt-10 pt-6 pl-4">
                            <Link
                                href="#get-access"
                                className="inline-flex items-center justify-center bg-[#FE5C02] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-orange-500/30"
                            >
                                Start a free workspace
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Right: Dynamic Image */}
                    <div className="relative rounded-3xl overflow-hidden h-[400px] sm:h-[500px] shadow-2xl bg-gray-100 dark:bg-neutral-900 order-1 lg:order-2">
                        {stepsData.map((step, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "absolute inset-0 transition-all duration-700 ease-in-out",
                                    activeStep === index ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                                )}
                            >
                                <Image
                                    src={step.image}
                                    alt={step.title}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />

                                {/* Gradient Overlay for Text Readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent opacity-90">
                                    <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                                        <span className="text-[#FE5C02] font-bold text-lg mb-2 block">
                                            Step {step.number}
                                        </span>
                                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;