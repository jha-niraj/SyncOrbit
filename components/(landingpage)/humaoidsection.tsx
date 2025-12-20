import {
    ArrowRight, BarChart3, CheckCircle2, Zap
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Badge } from "./herosection";

const cards = [
    {
        id: "01",
        category: "PRECISION",
        title: "Signal, No Noise",
        description: "Centralize schematic inputs. Isolate variables. Your team focuses on the compilation, not the coordination overhead.",
        icon: <Zap className="w-4 h-4" />,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
    },
    {
        id: "02",
        category: "VELOCITY",
        title: "Async Architecture",
        description: "Eliminate synchronous blockers. Decision logic is documented, versioned, and executed without calendar dependencies.",
        icon: <CheckCircle2 className="w-4 h-4" />,
        image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2164&auto=format&fit=crop",
    },
    {
        id: "03",
        category: "TELEMETRY",
        title: "Predictable Outcomes",
        description: "Visualize burn-down in real-time. Our metrics engine provides high-fidelity forecasts for delivery timelines.",
        icon: <BarChart3 className="w-4 h-4" />,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop",
    }
];

export const HumanoidSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeCardIndex, setActiveCardIndex] = useState(0);

    // Using simple scroll listener for reliability, can be swapped for useScroll
    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const progress = -rect.top / (rect.height - window.innerHeight);

            if (progress < 0.3) setActiveCardIndex(0);
            else if (progress < 0.6) setActiveCardIndex(1);
            else setActiveCardIndex(2);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={sectionRef} className="relative h-[300vh] bg-white dark:bg-neutral-950">
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-10">
                <div className="max-w-7xl mx-auto px-4 w-full h-full flex flex-col">
                    <div className="mb-8 text-center">
                        <Badge className="mb-4">Core Benefits</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-neutral-900 dark:text-white">
                            Engineered for <span className="text-neutral-400">Scale</span>
                        </h2>
                    </div>
                    <div className="relative flex-1 w-full max-w-5xl mx-auto perspective-1000">
                        {
                            cards.map((card, index) => {
                                const isActive = index === activeCardIndex;
                                const isPast = index < activeCardIndex;

                                // Engineering V2 Physics: Precise snapping
                                // let translateY = isPast ? -40 : isActive ? 0 : 100; // Simplified relative logic
                                // let scale = isActive ? 1 : isPast ? 0.95 : 0.9;
                                // let opacity = isActive ? 1 : isPast ? 0.5 : 0;

                                // // Override for absolute positioning visual
                                // const style = {
                                //     transform: `translateY(${isActive ? 0 : index * 10}px) scale(${scale})`,
                                //     opacity: index <= activeCardIndex ? 1 - (activeCardIndex - index) * 0.3 : 0,
                                //     zIndex: index,
                                //     top: isActive ? 0 : isPast ? -50 : 1000, // Move past cards up, future down
                                // };

                                // Actually, let's stick to the stacking context logic from your snippet but clean it up
                                const cardTransform = isActive
                                    ? 'translateY(0) scale(1)'
                                    : isPast
                                        ? `translateY(-${(activeCardIndex - index) * 40}px) scale(${1 - (activeCardIndex - index) * 0.05})`
                                        : 'translateY(100vh) scale(0.9)';

                                return (
                                    <div
                                        key={card.id}
                                        className="absolute inset-x-0 top-12 md:top-20 bottom-0 md:h-[500px] h-[450px] w-full transition-all duration-700 cubic-bezier(0.2, 0.8, 0.2, 1)"
                                        style={{
                                            transform: cardTransform,
                                            zIndex: index * 10,
                                            opacity: index > activeCardIndex ? 0 : 1 - (activeCardIndex - index) * 0.2
                                        }}
                                    >
                                        <div className="relative h-full w-full bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col md:flex-row shadow-2xl">
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                                            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="inline-flex items-center gap-2 text-neutral-900 dark:text-white font-mono text-xs uppercase tracking-widest font-bold">
                                                        {card.icon}
                                                        {card.category}
                                                    </div>
                                                    <span className="text-neutral-300 dark:text-neutral-700 font-mono text-xs">{card.id}</span>
                                                </div>
                                                <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">
                                                    {card.title}
                                                </h3>
                                                <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
                                                    {card.description}
                                                </p>
                                                <button className="w-fit flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-900 dark:text-white border-b border-transparent hover:border-neutral-900 dark:hover:border-white transition-colors pb-1">
                                                    Technical Specs
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <div className="relative h-48 md:h-auto md:w-[45%] overflow-hidden border-l border-neutral-200 dark:border-neutral-800">
                                                <Image
                                                    src={card.image}
                                                    alt={card.title}
                                                    className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                                    fill
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