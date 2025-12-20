import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface StepItem {
    number: string;
    title: string;
    description: string;
    image: string;
}

const stepsData: StepItem[] = [
    { number: "01", title: "Initialize Workspace", description: "Import existing issues. Define team topology. Set permissions.", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80" },
    { number: "02", title: "Execute Sprints", description: "Assign tickets. Track velocity. Automate status handoffs.", image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80" },
    { number: "03", title: "Analyze Output", description: "Review burndown charts. Calculate ROI. Distribute rewards.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" },
];

const HowItWorks = () => {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % stepsData.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-32 bg-white dark:bg-neutral-950 relative overflow-hidden border-t border-neutral-200 dark:border-neutral-800" id="howitworks">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    <div>
                        <div className="mb-10">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2 block">Workflow Protocol</span>
                            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white tracking-tighter mb-4">
                                Deployment <span className="text-neutral-400">Sequence</span>
                            </h2>
                        </div>
                        <div className="relative">
                            <div className="absolute left-[19px] top-6 bottom-6 w-px bg-neutral-200 dark:bg-neutral-800 border-l border-dashed border-neutral-300 dark:border-neutral-700"></div>

                            <div className="space-y-6">
                                {
                                    stepsData.map((step, index) => {
                                        const isActive = activeStep === index;
                                        return (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "relative flex gap-6 p-4 rounded-xl transition-all duration-300 cursor-pointer group",
                                                    isActive ? "bg-neutral-50 dark:bg-neutral-900" : "hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                                                )}
                                                onClick={() => setActiveStep(index)}
                                            >
                                                <div className={cn(
                                                    "relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono font-bold border-2 transition-all duration-300 flex-shrink-0 bg-white dark:bg-neutral-950",
                                                    isActive
                                                        ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white"
                                                        : "border-neutral-200 dark:border-neutral-800 text-neutral-400"
                                                )}>
                                                    {step.number}
                                                </div>
                                                <div className="flex-1 pt-1">
                                                    <h3 className={cn("text-lg font-bold mb-1 transition-colors", isActive ? "text-neutral-900 dark:text-white" : "text-neutral-500")}>
                                                        {step.title}
                                                    </h3>
                                                    <p className={cn("text-sm leading-relaxed", isActive ? "text-neutral-600 dark:text-neutral-400" : "text-neutral-400 dark:text-neutral-600")}>
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[500px] w-full">
                        <div className="relative h-full w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <div className="absolute inset-0 z-10 pointer-events-none border-[20px] border-neutral-100/50 dark:border-neutral-900/50"></div>
                            <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-mono text-white uppercase tracking-widest drop-shadow-md">Live_Feed</span>
                            </div>
                            {
                                stepsData.map((step, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "absolute inset-0 transition-all duration-700 ease-in-out",
                                            activeStep === index ? "opacity-100 scale-100 grayscale-0" : "opacity-0 scale-105 grayscale"
                                        )}
                                    >
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80"></div>

                                        <div className="absolute bottom-8 left-8 right-8 text-white z-20">
                                            <div className="text-4xl font-mono font-bold opacity-20 mb-2">{step.number}</div>
                                            <div className="text-xl font-bold">{step.title}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;