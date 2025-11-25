import React from "react";
import {
    Layers, MessageCircle, Zap, Layout, Trophy, Puzzle
} from "lucide-react";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
    return (
        <div className="group relative p-8 rounded-3xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:border-orange-200 dark:hover:border-orange-900/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent dark:from-neutral-800 dark:to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 flex items-center justify-center text-orange-600 dark:text-orange-500 mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {icon}
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                    {description}
                </p>
            </div>
        </div>
    );
};

const Features = () => {
    const features = [
        {
            icon: <Layers className="w-6 h-6" />,
            title: "Unified Projects & Tasks",
            description: "Organize work with hierarchy, tags and templates. Create team structures with heads and members."
        },
        {
            icon: <MessageCircle className="w-6 h-6" />,
            title: "Live Collaboration",
            description: "Comments, threaded chat, and real-time presence. Teams stay synchronized automatically."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Smart Automation",
            description: "Automate repetitive handoffs and status updates. Reduce manual coordination work."
        },
        {
            icon: <Layout className="w-6 h-6" />,
            title: "Kanban & Timeline",
            description: "Boards + timelines that stay in sync automatically. Visual project management made simple."
        },
        {
            icon: <Trophy className="w-6 h-6" />,
            title: "Gamified Rewards",
            description: "Point system for task completion. Redeem points for Amazon coupons and company rewards."
        },
        {
            icon: <Puzzle className="w-6 h-6" />,
            title: "200+ Integrations",
            description: "Slack, GitHub, Figma, Zoom, Drive and 200+ tools. Works with your existing workflow."
        }
    ];

    return (
        <section className="py-24 sm:py-32 bg-white dark:bg-neutral-950" id="features">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
                            <span>Core Features</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Built for modern teams. <br />
                            <span className="text-gray-400 dark:text-neutral-600">Designed for speed.</span>
                        </h2>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-sm md:text-right pb-2">
                        Features designed for clarity, with team management and gamified rewards built right in.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {
                        features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                {...feature}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    );
};

export default Features;