import React, { useEffect, useRef, useState } from "react";
import {
    ArrowRight, CheckCircle2, Zap, BarChart3
} from "lucide-react";
import Image from "next/image";

// Data structure for clean rendering
const cards = [
    {
        id: 1,
        category: "Focus",
        title: "Less noise, more focus",
        description: "Centralize tasks, conversations and files so your team focuses on work that matters — not chasing updates across different apps.",
        icon: <Zap className="w-5 h-5" />,
        // Abstract modern architecture/focus image
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
        color: "from-orange-500/20 to-orange-500/5",
        textColor: "text-orange-600 dark:text-orange-400",
        bgBadge: "bg-orange-100 dark:bg-orange-900/20"
    },
    {
        id: 2,
        category: "Decisions",
        title: "Decisions, not meetings",
        description: "Clear priorities and real-time status reduce daily standups and decision friction. Move projects forward without the calendar clutter.",
        icon: <CheckCircle2 className="w-5 h-5" />,
        // Strategic/Chess/Abstract image
        image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2164&auto=format&fit=crop",
        color: "from-blue-500/20 to-blue-500/5",
        textColor: "text-blue-600 dark:text-blue-400",
        bgBadge: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
        id: 3,
        category: "Outcomes",
        title: "Outcomes you can measure",
        description: "Built-in metrics and timeline insights make planning data-driven and predictable. Stop guessing and start shipping with confidence.",
        icon: <BarChart3 className="w-5 h-5" />,
        // Analytics/Growth/Abstract image
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop",
        color: "from-emerald-500/20 to-emerald-500/5",
        textColor: "text-emerald-600 dark:text-emerald-400",
        bgBadge: "bg-emerald-100 dark:bg-emerald-900/20"
    }
];

const HumanoidSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const ticking = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    if (!sectionRef.current) return;

                    const sectionRect = sectionRef.current.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;

                    // Trigger earlier for smoother entrance
                    const startTrigger = viewportHeight * 0.2;
                    const scrollDist = -sectionRect.top + startTrigger;
                    const sectionHeight = sectionRect.height;

                    // Normalize progress
                    const progress = Math.max(0, Math.min(1, scrollDist / (sectionHeight - viewportHeight)));

                    // Adjusted thresholds for overlap timing
                    if (progress >= 0.65) {
                        setActiveCardIndex(2);
                    } else if (progress >= 0.30) {
                        setActiveCardIndex(1);
                    } else {
                        setActiveCardIndex(0);
                    }
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={sectionRef} className="relative h-[300vh] bg-white dark:bg-neutral-950">
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-4 sm:py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col w-full">
                    <div className="mb-6 md:mb-10 flex flex-col items-center text-center z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-sm font-medium mb-6 border border-neutral-200 dark:border-neutral-700">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            <span>Workflow Benefits</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                            Why teams switch to <span className="text-orange-500">ProjectCentral</span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                            Experience a workflow that adapts to you. No more context switching—just pure productivity.
                        </p>
                    </div>
                    <div className="relative flex-1 w-full max-w-5xl mx-auto perspective-1000">
                        {
                            cards.map((card, index) => {
                                // Logic to determine visibility and position
                                const isActive = index === activeCardIndex;
                                const isPast = index < activeCardIndex;
                                const isFuture = index > activeCardIndex;

                                // Calculate transforms based on index vs active
                                // If it's the active card: Scale 1, Y 0
                                // If it's a past card (behind): Scale down slightly, move up slightly to create "stack" look
                                // If it's a future card: Push way down off screen

                                let transform = 'translateY(120%) scale(0.9)';
                                let opacity = 0;
                                let zIndex = index * 10;

                                if (isActive) {
                                    transform = 'translateY(0) scale(1)';
                                    opacity = 1;
                                } else if (isPast) {
                                    // Create the "Stack" effect behind the active card
                                    const scale = 1 - (activeCardIndex - index) * 0.05; // 0.95, 0.90 etc
                                    const translateY = -(activeCardIndex - index) * 30; // -30px, -60px
                                    transform = `translateY(${translateY}px) scale(${scale})`;
                                    opacity = 1 - (activeCardIndex - index) * 0.2; // Fade out slightly
                                }

                                return (
                                    <div
                                        key={card.id}
                                        className="absolute inset-x-0 top-0 bottom-0 md:h-[550px] h-[500px] w-full transition-all duration-700 cubic-bezier(0.25, 1, 0.3, 1)"
                                        style={{
                                            transform,
                                            opacity,
                                            zIndex,
                                        }}
                                    >
                                        <div className="relative h-full w-full bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-20 pointer-events-none`} />

                                            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10 order-2 md:order-1">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${card.bgBadge} ${card.textColor} text-sm font-semibold`}>
                                                        {card.icon}
                                                        {card.category}
                                                    </div>
                                                    <span className="text-neutral-300 dark:text-neutral-700 font-mono text-xs">0{card.id}</span>
                                                </div>

                                                <h3 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                                    {card.title}
                                                </h3>
                                                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                                    {card.description}
                                                </p>

                                                <button className="w-fit flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white hover:text-orange-500 transition-colors group">
                                                    Learn more
                                                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                            <div className="relative h-48 md:h-auto md:w-[45%] overflow-hidden order-1 md:order-2">
                                                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent z-10 md:hidden" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-neutral-900 to-transparent z-10 hidden md:block" />
                                                <Image
                                                    src={card.image}
                                                    alt={card.title}
                                                    className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-700"
                                                    height={100}
                                                    width={100}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HumanoidSection;