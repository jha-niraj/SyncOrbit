"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Code2,
    Briefcase,
    Building2,
    GitCommit,
    Lock,
    Eye,
    MessageSquareQuote,
    Receipt,
    ShieldCheck,
    Split,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Data Models ---
type ModeId = "internal" | "agency" | "hybrid";

interface WorkflowData {
    id: ModeId;
    title: string;
    subtitle: string;
    shortDesc: string;
    fullDesc: string;
    icon: React.ReactNode;
    accent: string;
    accentBg: string;
    accentText: string;
    features: { icon: React.ReactNode; label: string; detail: string }[];
    uiPreview: React.ReactNode; 
}


// --- Abstract UI Visualizations (Slightly taller now) ---

const InternalUI = () => (
    <div className="w-full h-48 relative rounded-xl bg-neutral-900/50 border border-neutral-800 overflow-hidden p-4 flex flex-col gap-3">
        {/* Fake Roadmap */}
        <div className="flex justify-between items-center"><div className="h-2 w-1/3 bg-neutral-800 rounded-full"></div></div>
        <div className="flex gap-2">
            <div className="h-8 flex-1 bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center px-2 text-[10px] text-orange-400 whitespace-nowrap"><GitCommit className="w-3 h-3 mr-1 shrink-0"/> feat-api-v2</div>
            <div className="h-8 flex-1 bg-neutral-800 rounded-lg flex items-center px-2 text-[10px] text-neutral-500 whitespace-nowrap"><Lock className="w-3 h-3 mr-1 shrink-0"/> Private Docs</div>
        </div>
        <div className="mt-auto flex gap-1 pt-2 border-t border-neutral-800/50">
            <div className="h-2 w-8 bg-green-500/50 rounded-full"></div>
            <div className="h-2 w-12 bg-neutral-800 rounded-full"></div>
            <div className="h-2 w-6 bg-neutral-800 rounded-full"></div>
        </div>
        {/* Private Badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-neutral-950 border border-orange-500/50 text-orange-500 text-[10px] font-bold rounded-md uppercase">Internal Only</div>
    </div>
);

const AgencyUI = () => (
    <div className="w-full h-48 relative rounded-xl bg-neutral-900/50 border border-neutral-800 overflow-hidden p-4 flex flex-col gap-2">
        {/* Fake Client Board */}
        <div className="flex justify-between items-center mb-2">
            <div className="h-2 w-1/4 bg-blue-500/50 rounded-full"></div>
            <div className="flex items-center gap-1 text-[10px] text-blue-400"><Eye className="w-3 h-3"/> Client View Active</div>
        </div>
        <div className="flex gap-3 h-full">
            {/* "To Do" Column (Visible to client) */}
            <div className="flex-1 bg-blue-950/30 border border-blue-900/50 rounded-lg p-2 flex flex-col gap-2">
                <div className="h-1 w-10 bg-blue-800 rounded-full mb-1"></div>
                <div className="h-8 bg-blue-500/20 rounded-md border border-blue-500/30 flex items-center px-2"><div className="h-1.5 w-12 bg-blue-400/50 rounded-full"></div></div>
                <div className="h-8 bg-blue-500/20 rounded-md border border-blue-500/30 flex items-center px-2"><div className="h-1.5 w-16 bg-blue-400/50 rounded-full"></div></div>
            </div>
             {/* "Internal Comms" Column (Blurred/Locked) */}
             <div className="flex-1 bg-neutral-950/50 border border-neutral-800 rounded-lg p-2 relative overflow-hidden flex flex-col gap-2">
                <div className="absolute inset-0 backdrop-blur-[3px] bg-neutral-950/80 z-10 flex items-center justify-center flex-col text-neutral-500">
                    <Lock className="w-5 h-5 mb-2 opacity-50"/>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Hidden from Client</span>
                </div>
                <div className="h-1 w-10 bg-neutral-800 rounded-full mb-1"></div>
                <div className="h-8 bg-neutral-800/50 rounded-md"></div>
                <div className="h-8 bg-neutral-800/50 rounded-md"></div>
            </div>
        </div>
    </div>
);

const HybridUI = () => (
    <div className="w-full h-48 relative rounded-xl bg-neutral-900/50 border border-neutral-800 overflow-hidden p-4 flex gap-4">
        {/* The Firewall Split */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 via-transparent to-purple-500 z-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-neutral-950 border border-purple-500 rounded-full p-1.5">
            <Split className="w-5 h-5 text-purple-500" />
        </div>

        {/* Left Side (Product IP) */}
        <div className="flex-1 flex flex-col justify-center items-center opacity-60">
            <Code2 className="w-10 h-10 text-neutral-700 mb-3" />
            <div className="h-2 w-16 bg-neutral-800 rounded-full mb-2"></div>
             <div className="h-1.5 w-10 bg-neutral-800 rounded-full"></div>
            <div className="text-[9px] text-neutral-600 mt-3 uppercase tracking-widest font-bold">Internal IP</div>
        </div>

        {/* Right Side (Client Services) */}
        <div className="flex-1 flex flex-col justify-center items-center opacity-60">
            <Briefcase className="w-10 h-10 text-neutral-700 mb-3" />
             <div className="h-2 w-16 bg-neutral-800 rounded-full mb-2"></div>
             <div className="h-1.5 w-10 bg-neutral-800 rounded-full"></div>
             <div className="text-[9px] text-neutral-600 mt-3 uppercase tracking-widest font-bold">Client Deliverables</div>
        </div>
    </div>
);


// --- Main Data configuration ---
const workflowData: WorkflowData[] = [
    {
        id: "internal",
        title: "Product Mode",
        subtitle: "For the Builders",
        shortDesc: "Deep focus for shipping code and internal roadmaps.",
        fullDesc: "Where the messy sausage gets made. A safe space for engineers and product managers to argue over technical debt without scaring the stakeholders. Full Git integration and private specs.",
        icon: <Code2 className="w-6 h-6" />,
        accent: "orange-500",
        accentBg: "bg-orange-500/10",
        accentText: "text-orange-500",
        uiPreview: <InternalUI />,
        features: [
            { icon: <GitCommit className="w-4 h-4"/>, label: "Dev Tooling Integration", detail: "Sync PRs and commits directly to tasks." },
            { icon: <Lock className="w-4 h-4"/>, label: "True Privacy", detail: "Internal comments are completely invisible externally." },
        ]
    },
    {
        id: "agency",
        title: "Agency Mode",
        subtitle: "For Client Services",
        shortDesc: "Performative transparency to keep clients happy (and quiet).",
        fullDesc: "The art of passive client management. Give them a curated window to see real-time progress so they stop slacking you every hour. You control exactly what they see and what stays hidden.",
        icon: <Briefcase className="w-6 h-6" />,
        accent: "blue-500",
        accentBg: "bg-blue-500/10",
        accentText: "text-blue-500",
        uiPreview: <AgencyUI />,
        features: [
            { icon: <Eye className="w-4 h-4"/>, label: "Curated Client Views", detail: "Mark specific columns or tasks as 'Client Visible'." },
            { icon: <MessageSquareQuote className="w-4 h-4"/>, label: "Approval Workflows", detail: "Official sign-off logs separated from internal chatter." },
            { icon: <Receipt className="w-4 h-4"/>, label: "Invoicing & Time", detail: "Track billable hours directly against client tasks." },
        ]
    },
    {
        id: "hybrid",
        title: "Hybrid Core",
        subtitle: "For Enterprise Juggernauts",
        shortDesc: "Run R&D and Client Services under one massive roof.",
        fullDesc: "For when you're shipping the future *and* billing F500s simultaneously. Showoffs. Maintain strict rigid firewalls between your IP development and your service delivery teams.",
        icon: <Building2 className="w-6 h-6" />,
        accent: "purple-500",
        accentBg: "bg-purple-500/10",
        accentText: "text-purple-500",
        uiPreview: <HybridUI />,
        features: [
            { icon: <ShieldCheck className="w-4 h-4"/>, label: "Strict Firewalls", detail: "Zero data leakage between workspace types." },
            { icon: <Split className="w-4 h-4"/>, label: "Unified Admin", detail: "One billing & compliance dashboard for everything." },
        ]
    }
];


const WorkflowSimulation = () => {
    // State to track which pillar is currently active/hovered
    const [activeMode, setActiveMode] = useState<ModeId>("agency"); // Default middle one

    return (
        <section className="py-24 bg-white dark:bg-neutral-950 overflow-hidden" id="workflow-simulation">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-20 relative z-10">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-sm font-medium mb-6 border border-neutral-200 dark:border-neutral-700">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span>Context Switching Solved</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                        Split personality? <br /> We call it <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500">intelligent architecture.</span>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        We know client work and product work are two different beasts. ProjectCentral is built with distinct operating modes so you don't have to hack one tool to do both jobs poorly.
                    </p>
                </div>

                {/* The Simulation Deck Container - HEIGHT INCREASED HERE */}
                <div 
                    className="relative w-full max-w-6xl mx-auto h-[800px] md:h-[700px] bg-gray-100 dark:bg-[#0A0A0A] rounded-[2.5rem] border border-gray-200 dark:border-neutral-800 p-4 sm:p-6 overflow-hidden shadow-2xl"
                    onMouseLeave={() => setActiveMode("agency")} // Reset on mouse leave
                >
                    {/* Background Ambient Glows based on active state */}
                    <div 
                        className={cn(
                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[150px] opacity-20 transition-colors duration-1000",
                            activeMode === 'internal' ? "bg-orange-500" :
                            activeMode === 'agency' ? "bg-blue-500" : "bg-purple-500"
                        )}
                    ></div>

                    <div className="relative z-10 h-full flex flex-col md:flex-row gap-4 items-stretch">
                        {workflowData.map((mode) => {
                            const isActive = activeMode === mode.id;
                            return (
                                <motion.div
                                    key={mode.id}
                                    onMouseEnter={() => setActiveMode(mode.id)}
                                    layout // Framer motion magic for smooth resizing
                                    className={cn(
                                        "relative h-full rounded-3xl border backdrop-blur-md overflow-hidden transition-all duration-500 ease-in-out cursor-pointer group",
                                        // Base styles
                                        "bg-white/80 dark:bg-neutral-900/80 border-gray-200 dark:border-neutral-800",
                                        // Hover/Active styles determine width flex-grow
                                        isActive 
                                            ? `md:flex-[3] border-${mode.accent} dark:border-${mode.accent}/50 shadow-2xl shadow-${mode.accent}/10` 
                                            : "md:flex-[1] hover:bg-white dark:hover:bg-neutral-900 opacity-75 hover:opacity-100"
                                    )}
                                >
                                    <div className="p-6 h-full flex flex-col">
                                        {/* Header Section */}
                                        <div className="flex items-start justify-between mb-6 shrink-0">
                                            <div>
                                                <div className={cn("text-xs font-bold uppercase tracking-wider mb-2", mode.accentText)}>
                                                    {mode.subtitle}
                                                </div>
                                                <h3 className={cn("text-2xl font-bold", isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-neutral-400")}>
                                                    {mode.title}
                                                </h3>
                                            </div>
                                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500 shrink-0", 
                                                isActive ? mode.accentBg : "bg-gray-100 dark:bg-neutral-800",
                                                isActive ? mode.accentText : "text-gray-500 dark:text-neutral-500"
                                            )}>
                                                {mode.icon}
                                            </div>
                                        </div>

                                        {/* Content - Animated Reveal */}
                                        <div className="flex-1 relative overflow-hidden">
                                            <AnimatePresence mode="wait">
                                                {isActive ? (
                                                    // EXPANDED STATE CONTENT
                                                    <motion.div
                                                        key="expanded"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.4, delay: 0.1 }}
                                                        className="h-full flex flex-col"
                                                    >
                                                       <p className="text-lg text-gray-900 dark:text-white mb-8 leading-relaxed font-medium shrink-0">
                                                            "{mode.fullDesc}"
                                                        </p>
                                                        
                                                        {/* The Abstract UI Visualization - Increased margin */}
                                                        <div className="mb-8 shrink-0">
                                                            {mode.uiPreview}
                                                        </div>

                                                        {/* Deeper Feature List - Now takes available space */}
                                                        <ul className="space-y-3 mt-auto overflow-y-auto pr-2 custom-scrollbar">
                                                            {mode.features.map((feat, idx) => (
                                                                <li key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800">
                                                                    <div className={cn("mt-1 shrink-0", mode.accentText)}>
                                                                        {feat.icon}
                                                                    </div>
                                                                    <div>
                                                                        <span className="block text-base font-bold text-gray-900 dark:text-white mb-1">{feat.label}</span>
                                                                        <span className="block text-sm text-gray-500 dark:text-gray-400 leading-snug">{feat.detail}</span>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </motion.div>
                                                ) : (
                                                    // COLLAPSED STATE CONTENT
                                                    <motion.div
                                                        key="collapsed"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute inset-0 flex flex-col justify-end pb-6"
                                                    >
                                                       <p className="text-gray-500 dark:text-neutral-500 leading-relaxed hidden md:block line-clamp-3">
                                                            {mode.shortDesc}
                                                       </p>
                                                       <div className={cn("mt-4 flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity", mode.accentText)}>
                                                            Explore Mode <ChevronRight className="w-4 h-4 ml-1" />
                                                       </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkflowSimulation;