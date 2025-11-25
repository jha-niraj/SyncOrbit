import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface StepItem {
    number: string;
    title: string;
    description: string;
    image: string;
}

const stepsData: StepItem[] = [
    {
        number: "01",
        title: "Create your workspace",
        description: "Set up teams, invite members, and import work from popular tools in one click. Choose team types like Technical, Marketing, Social Media.",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    },
    {
        number: "02",
        title: "Plan & assign",
        description: "Break work into tasks, set owners and deadlines, and visualize them on boards or timeline. Set up team heads and reward systems.",
        image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    },
    {
        number: "03",
        title: "Deliver & report",
        description: "Automations keep tasks moving; get post-sprint insights and exportable reports. Team members earn points for completed tasks.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    },
];

const HowItWorks = () => {
    const [activeStep, setActiveStep] = useState(0);

    // Auto-advance
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % stepsData.length);
        }, 6000); // 6 seconds per slide
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 bg-white dark:bg-neutral-950 relative overflow-hidden" id="how-it-works">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]"></div>
            </div>
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-semibold mb-6 border border-orange-200 dark:border-orange-800">
                        <Sparkles className="w-4 h-4" />
                        <span>Workflow Revolution</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Three steps to <span className="text-orange-500">clarity</span>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        From setup to delivery — SyncOrbit gets your team productive fast without the complex onboarding or steep learning curves.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    <div className="relative">
                        <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-neutral-800"></div>

                        <div className="space-y-8">
                            {
                                stepsData.map((step, index) => {
                                    const isActive = activeStep === index;
                                    return (
                                        <div
                                            key={index}
                                            className={cn(
                                                "relative flex gap-6 p-4 rounded-2xl transition-all duration-300 cursor-pointer group",
                                                isActive ? "bg-white dark:bg-neutral-900 shadow-xl shadow-orange-500/5 border border-orange-100 dark:border-neutral-800" : "hover:bg-gray-50 dark:hover:bg-neutral-900/50 border border-transparent"
                                            )}
                                            onClick={() => setActiveStep(index)}
                                        >
                                            <div className={cn(
                                                "relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-4 transition-colors duration-300 flex-shrink-0",
                                                isActive
                                                    ? "bg-orange-500 border-orange-100 dark:border-orange-900/30 text-white"
                                                    : "bg-white dark:bg-neutral-950 border-gray-100 dark:border-neutral-800 text-gray-400 group-hover:border-orange-200 dark:group-hover:border-neutral-700"
                                            )}>
                                                {step.number}
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <h3 className={cn(
                                                    "text-xl font-bold mb-2 transition-colors duration-300",
                                                    isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-500"
                                                )}>
                                                    {step.title}
                                                </h3>
                                                <p className={cn(
                                                    "text-sm leading-relaxed transition-colors duration-300",
                                                    isActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-600"
                                                )}>
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className="mt-10 ml-20">
                            <Link
                                href="#get-access"
                                className="inline-flex items-center text-orange-600 dark:text-orange-500 font-bold hover:gap-2 transition-all"
                            >
                                Start your free workspace <ArrowRight className="ml-1 w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="relative h-[500px] w-full perspective-1000">
                        <div className="relative h-full w-full rounded-3xl overflow-hidden bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-2xl">
                            <div className="absolute top-4 left-4 z-20 flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>

                            {
                                stepsData.map((step, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "absolute inset-0 transition-all duration-700 ease-in-out",
                                            activeStep === index
                                                ? "opacity-100 translate-y-0 scale-100"
                                                : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                                        )}
                                    >
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent"></div>

                                        <div className="absolute bottom-8 left-8 right-8 text-white">
                                            <div className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">Step {step.number}</div>
                                            <div className="text-2xl font-bold">{step.title}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2rem] opacity-20 blur-xl -z-10 transition-opacity duration-500" style={{ opacity: activeStep === 0 ? 0.2 : 0.1 }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;