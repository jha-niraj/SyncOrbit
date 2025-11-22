import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-fade-in");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const currentCard = cardRef.current;
        if (currentCard) observer.observe(currentCard);

        return () => {
            if (currentCard) observer.unobserve(currentCard);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={cn(
                "opacity-0 p-6 sm:p-8 rounded-2xl transition-all duration-300 group",
                // Light Mode Styles
                "bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:border-orange-200",
                // Dark Mode Styles
                "dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-none dark:hover:bg-neutral-800 dark:hover:border-orange-900/30"
            )}
            style={{ animationDelay: `${0.1 * index}s` }}
        >
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-[#FE5C02] mb-6 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-[#FE5C02] transition-colors">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
            </p>
        </div>
    );
};

const Features = () => {
    return (
        <section className="py-24 bg-gray-50 dark:bg-neutral-950 transition-colors duration-300" id="features">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
                        <span>Core Features</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        From planning to delivery — <br className="hidden sm:block" />
                        built for modern teams
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Features designed for speed and clarity, with team management and gamified rewards built right in.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Icons updated to use standard SVG props for cleaner code */}
                    <FeatureCard
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>}
                        title="Unified Projects & Tasks"
                        description="Organize work with hierarchy, tags and templates. Create team structures with heads and members."
                        index={0}
                    />
                    <FeatureCard
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>}
                        title="Live Collaboration"
                        description="Comments, threaded chat, and real-time presence. Teams stay synchronized automatically."
                        index={1}
                    />
                    <FeatureCard
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2v20m8-10H4"></path><circle cx="12" cy="12" r="9"></circle></svg>}
                        title="Smart Automation"
                        description="Automate repetitive handoffs and status updates. Reduce manual coordination work."
                        index={2}
                    />
                    <FeatureCard
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 12l2 2 4-4"></path><path d="M21 12c.552 0 1-.449 1-1V9c0-.552-.448-1-1-1h-1V6a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2H2c-.552 0-1 .448-1 1v2c0 .551.448 1 1 1h1v2a4 4 0 0 0 4 4h9a4 4 0 0 0 4-4v-2h1z"></path></svg>}
                        title="Kanban & Timeline"
                        description="Boards + timelines that stay in sync automatically. Visual project management made simple."
                        index={3}
                    />
                    <FeatureCard
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>}
                        title="Gamified Rewards"
                        description="Point system for task completion. Redeem points for Amazon coupons and company rewards."
                        index={4}
                    />
                    <FeatureCard
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" x2="12" y1="22.08" y2="12"></line></svg>}
                        title="200+ Integrations"
                        description="Slack, GitHub, Figma, Zoom, Drive and 200+ tools. Works with your existing workflow."
                        index={5}
                    />
                </div>
            </div>
        </section>
    );
};

export default Features;