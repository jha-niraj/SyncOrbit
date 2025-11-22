import React, { useEffect, useRef, useState } from "react";

const HumanoidSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const ticking = useRef(false);

    // Card Transition Styles
    const cardStyle = {
        height: '500px', // Fixed height for consistency
        width: '100%',
        transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease-out',
        willChange: 'transform, opacity'
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    if (!sectionRef.current) return;

                    const sectionRect = sectionRef.current.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    // Adjust scroll distance calculation for smoother triggering
                    const startTrigger = viewportHeight * 0.2;
                    const scrollDist = -sectionRect.top + startTrigger;
                    const sectionHeight = sectionRect.height;

                    // Calculate progress (0 to 1)
                    const progress = Math.max(0, Math.min(1, scrollDist / (sectionHeight - viewportHeight)));

                    if (progress >= 0.6) {
                        setActiveCardIndex(2);
                    } else if (progress >= 0.3) {
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
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Visibility Logic
    const isFirstVisible = true; // Always visible initially
    const isSecondVisible = activeCardIndex >= 1;
    const isThirdVisible = activeCardIndex >= 2;

    return (
        <div ref={sectionRef} className="relative h-[300vh] bg-white dark:bg-neutral-950">
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-10">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">

                    {/* Section Header */}
                    <div className="mb-8 md:mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs">02</span>
                            <span>Benefits</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Why teams switch to ProjectCentral
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                            Three things teams tell us they love the most about moving their workflow here.
                        </p>
                    </div>

                    {/* Stacking Cards Container */}
                    <div className="relative flex-1 w-full max-w-4xl mx-auto perspective-1000">

                        {/* CARD 1: Focus */}
                        <div
                            className="absolute inset-x-0 top-0 bg-white dark:bg-neutral-900 shadow-2xl rounded-xl p-8 sm:p-12 border border-gray-100 dark:border-neutral-800 overflow-hidden"
                            style={{
                                ...cardStyle,
                                zIndex: 10,
                                transform: isSecondVisible ? 'scale(0.90) translateY(-40px)' : 'scale(1) translateY(0)',
                                opacity: isSecondVisible ? 0.6 : 1,
                                // Lighter orange gradient background
                                background: 'linear-gradient(135deg, rgba(110, 42, 6, 0.05) 0%, rgba(137, 8, 8, 0) 100%)',
                            }}
                        >
                            <div className="absolute top-8 right-8 px-4 py-1 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-semibold">
                                Focus
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-center">
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    Less noise, more focus
                                </h3>
                                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                                    Centralize tasks, conversations and files so your team focuses on work that matters — not chasing updates across different apps.
                                </p>
                                {/* Abstract Visual decoration */}
                                <div className="mt-8 w-full h-32 bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg border border-orange-500/10"></div>
                            </div>
                        </div>

                        {/* CARD 2: Decisions */}
                        <div
                            className="absolute inset-x-0 top-0 bg-white dark:bg-neutral-900 shadow-2xl rounded-xl p-8 sm:p-12 border border-gray-100 dark:border-neutral-800 overflow-hidden"
                            style={{
                                ...cardStyle,
                                zIndex: 20,
                                transform: isSecondVisible
                                    ? (isThirdVisible ? 'scale(0.95) translateY(-20px)' : 'scale(1) translateY(0)')
                                    : 'translateY(110%)',
                                opacity: isSecondVisible ? (isThirdVisible ? 0.8 : 1) : 0,
                                background: 'linear-gradient(135deg, rgba(254, 92, 2, 0.08) 0%, rgba(255,255,255,0) 100%)',
                            }}
                        >
                            <div className="absolute top-8 right-8 px-4 py-1 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-semibold">
                                Decisions
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-center">
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    Decisions, not meetings
                                </h3>
                                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                                    Clear priorities and real-time status reduce daily standups and decision friction.
                                </p>
                                <div className="mt-8 w-full h-32 bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg border border-orange-500/10"></div>
                            </div>
                        </div>

                        {/* CARD 3: Outcomes */}
                        <div
                            className="absolute inset-x-0 top-0 bg-white dark:bg-neutral-900 shadow-2xl rounded-xl p-8 sm:p-12 border border-gray-100 dark:border-neutral-800 overflow-hidden"
                            style={{
                                ...cardStyle,
                                zIndex: 30,
                                transform: isThirdVisible ? 'scale(1) translateY(0)' : 'translateY(110%)',
                                opacity: isThirdVisible ? 1 : 0,
                                background: 'linear-gradient(135deg, rgba(254, 92, 2, 0.1) 0%, rgba(255,255,255,0) 100%)',
                            }}
                        >
                            <div className="absolute top-8 right-8 px-4 py-1 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-semibold">
                                Outcomes
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-center">
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    Outcomes you can <span className="text-[#FE5C02]">measure</span>
                                </h3>
                                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                                    Built-in metrics and timeline insights make planning data-driven and predictable.
                                </p>
                                <div className="mt-8 w-full h-32 bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg border border-orange-500/10"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default HumanoidSection;