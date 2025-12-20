import React from "react";
import {
    Layers, MessageCircle, Zap, Layout, Trophy, Puzzle, ArrowUpRight
} from "lucide-react";

const FeatureCard = ({ icon, title, description, index }: { icon: React.ReactNode, title: string, description: string, index: number }) => {
    return (
        <div className="group relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                    0{index + 1}
                </span>
            </div>
            <h3 className="text-lg font-bold mb-3 text-neutral-900 dark:text-white group-hover:translate-x-1 transition-transform duration-300">
                {title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {description}
            </p>
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
            </div>
        </div>
    );
};

const Features = () => {
    const features = [
        { icon: <Layers className="w-5 h-5" />, title: "Recursive Projects", description: "Infinite nesting for complex hierarchies. Organize with tags, heads, and granular permissions." },
        { icon: <MessageCircle className="w-5 h-5" />, title: "Async Context", description: "Threaded comments attached directly to lines of code or specific tasks. Zero context switching." },
        { icon: <Zap className="w-5 h-5" />, title: "Linear Automation", description: "Trigger actions based on status changes. Github PRs automatically move cards to 'In Review'." },
        { icon: <Layout className="w-5 h-5" />, title: "Adaptive Views", description: "Switch between Kanban, List, and Timeline instantly. Data stays synchronized across all viewports." },
        { icon: <Trophy className="w-5 h-5" />, title: "Velocity Rewards", description: "Gamified contribution graph. Earn points for clearing backlog items and shipping features." },
        { icon: <Puzzle className="w-5 h-5" />, title: "API First", description: "Connect with Slack, Sentry, Figma, and 200+ tools via our robust GraphQL API." }
    ];

    return (
        <section className="py-24 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800" id="features">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">System_Modules</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white tracking-tighter">
                            Engineered for <br />
                            <span className="text-neutral-400">High Performance.</span>
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {
                        features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} index={index} />
                        ))
                    }
                </div>
            </div>
        </section>
    );
};

export default Features;