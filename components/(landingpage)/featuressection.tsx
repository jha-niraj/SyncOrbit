
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

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={cn(
                "feature-card glass-card opacity-0 p-4 sm:p-6",
                "lg:hover:bg-gradient-to-br lg:hover:from-white lg:hover:to-pulse-50",
                "transition-all duration-300"
            )}
            style={{ animationDelay: `${0.1 * index}s` }}
        >
            <div className="rounded-full bg-pulse-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-pulse-500 mb-4 sm:mb-5">
                {icon}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{title}</h3>
            <p className="text-gray-600 text-sm sm:text-base">{description}</p>
        </div>
    );
};

const Features = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const elements = entry.target.querySelectorAll(".fade-in-element");
                        elements.forEach((el, index) => {
                            setTimeout(() => {
                                el.classList.add("animate-fade-in");
                            }, index * 100);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section className="py-12 sm:py-16 md:py-20 pb-0 relative bg-gray-50" id="features" ref={sectionRef}>
            <div className="section-container">
                <div className="text-center mb-10 sm:mb-16">
                    <div className="pulse-chip mx-auto mb-3 sm:mb-4 opacity-0 fade-in-element">
                        <span>Core Features</span>
                    </div>
                    <h2 className="section-title mb-3 sm:mb-4 opacity-0 fade-in-element">
                        From planning to delivery — <br className="hidden sm:block" />built for modern teams
                    </h2>
                    <p className="section-subtitle mx-auto opacity-0 fade-in-element">
                        Features designed for speed and clarity, with team management and gamified rewards.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    <FeatureCard
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>}
                        title="Unified Projects & Tasks"
                        description="Organize work with hierarchy, tags and templates. Create team structures with heads and members."
                        index={0}
                    />
                    <FeatureCard
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>}
                        title="Live Collaboration"
                        description="Comments, threaded chat, and real-time presence. Teams stay synchronized automatically."
                        index={1}
                    />
                    <FeatureCard
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M12 2v20m8-10H4"></path><circle cx="12" cy="12" r="9"></circle></svg>}
                        title="Smart Automation"
                        description="Automate repetitive handoffs and status updates. Reduce manual coordination work."
                        index={2}
                    />
                    <FeatureCard
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M9 12l2 2 4-4"></path><path d="M21 12c.552 0 1-.449 1-1V9c0-.552-.448-1-1-1h-1V6a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2H2c-.552 0-1 .448-1 1v2c0 .551.448 1 1 1h1v2a4 4 0 0 0 4 4h9a4 4 0 0 0 4-4v-2h1z"></path></svg>}
                        title="Kanban & Timeline"
                        description="Boards + timelines that stay in sync automatically. Visual project management made simple."
                        index={3}
                    />
                    <FeatureCard
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>}
                        title="Gamified Rewards"
                        description="Point system for task completion. Redeem points for Amazon coupons and company rewards."
                        index={4}
                    />
                    <FeatureCard
                        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" x2="12" y1="22.08" y2="12"></line></svg>}
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