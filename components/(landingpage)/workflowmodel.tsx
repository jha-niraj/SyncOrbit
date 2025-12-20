import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "./herosection";
import { useState } from "react";
import {
    Briefcase, Building2, Code2, Eye, GitCommit, Lock, Receipt, ShieldCheck,
    Split, Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

const SchematicCard = ({ children, title }: { children: React.ReactNode, title: string }) => (
    <div className="w-full h-52 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent opacity-50"></div>
        <div className="h-8 border-b border-neutral-800 flex items-center px-3 justify-between bg-neutral-900/50">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">{title}</span>
            <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
                <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
            </div>
        </div>
        <div className="p-4 flex-1 relative">
            {children}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,rgba(0,0,0,0.3)_2px)] bg-[size:100%_4px] pointer-events-none opacity-20"></div>
        </div>
    </div>
);

const InternalUI = () => (
    <SchematicCard title="dev_mode.tsx">
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-green-500 font-mono text-[10px]">
                <Terminal className="w-3 h-3" />
                <span>$ git push origin feat/v2-api</span>
            </div>
            <div className="h-px w-full bg-neutral-800 my-1"></div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <div className="h-2 w-16 bg-neutral-800 rounded"></div>
                    <div className="h-2 w-8 bg-neutral-800 rounded"></div>
                </div>
                <div className="h-2 w-24 bg-neutral-800 rounded"></div>
                <div className="h-2 w-32 bg-neutral-800/50 rounded"></div>
            </div>
            <div className="mt-auto inline-flex items-center px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[9px] text-neutral-500 font-mono">
                <Lock className="w-2 h-2 mr-1" /> PRIVATE_SCOPE
            </div>
        </div>
    </SchematicCard>
);

const AgencyUI = () => (
    <SchematicCard title="client_view.tsx">
        <div className="flex gap-3 h-full">
            <div className="w-1/2 border-r border-neutral-800 pr-3 flex flex-col gap-2">
                <span className="text-[9px] text-blue-500 font-mono mb-1">VISIBLE</span>
                <div className="p-2 rounded border border-neutral-800 bg-neutral-900">
                    <div className="h-1.5 w-12 bg-neutral-700 rounded mb-1"></div>
                    <div className="h-1 w-8 bg-neutral-800 rounded"></div>
                </div>
                <div className="p-2 rounded border border-neutral-800 bg-neutral-900">
                    <div className="h-1.5 w-10 bg-neutral-700 rounded mb-1"></div>
                </div>
            </div>
            <div className="w-1/2 flex flex-col gap-2 relative">
                <div className="absolute inset-0 backdrop-blur-[2px] bg-neutral-950/50 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-neutral-600" />
                </div>
                <span className="text-[9px] text-neutral-600 font-mono mb-1">HIDDEN</span>
                <div className="p-2 rounded border border-neutral-800/30">
                    <div className="h-1.5 w-12 bg-neutral-800 rounded mb-1"></div>
                </div>
            </div>
        </div>
    </SchematicCard>
);

const HybridUI = () => (
    <SchematicCard title="hybrid_core.tsx">
        <div className="flex items-center justify-center h-full gap-4">
            <div className="h-20 w-16 border border-neutral-800 rounded bg-neutral-900/50 flex flex-col items-center justify-center gap-2">
                <Code2 className="w-4 h-4 text-neutral-500" />
                <div className="h-1 w-8 bg-neutral-700 rounded"></div>
            </div>
            <div className="h-full w-px bg-neutral-800 relative">
                <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 rounded-full bg-neutral-600"></div>
            </div>
            <div className="h-20 w-16 border border-neutral-800 rounded bg-neutral-900/50 flex flex-col items-center justify-center gap-2">
                <Briefcase className="w-4 h-4 text-neutral-500" />
                <div className="h-1 w-8 bg-neutral-700 rounded"></div>
            </div>
        </div>
    </SchematicCard>
);

const workflowData = [
    {
        id: "internal",
        title: "Product Mode",
        subtitle: "BUILDERS",
        fullDesc: "Deep focus for shipping code. A safe space for engineers to argue over technical debt.",
        icon: <Code2 className="w-5 h-5" />,
        uiPreview: <InternalUI />,
        features: [
            { icon: <GitCommit className="w-3 h-3" />, label: "Git Integration", detail: "Sync PRs directly." },
            { icon: <Lock className="w-3 h-3" />, label: "Internal Privacy", detail: "Comments invisible to external." },
        ]
    },
    {
        id: "agency",
        title: "Agency Mode",
        subtitle: "CLIENT SVCS",
        fullDesc: "The art of passive client management. Curated windows into your progress.",
        icon: <Briefcase className="w-5 h-5" />,
        uiPreview: <AgencyUI />,
        features: [
            { icon: <Eye className="w-3 h-3" />, label: "Curated Views", detail: "Selectively share progress." },
            { icon: <Receipt className="w-3 h-3" />, label: "Billable Time", detail: "Track hours to invoice." },
        ]
    },
    {
        id: "hybrid",
        title: "Hybrid Core",
        subtitle: "ENTERPRISE",
        fullDesc: "Run R&D and Client Services under one massive roof with strict firewalls.",
        icon: <Building2 className="w-5 h-5" />,
        uiPreview: <HybridUI />,
        features: [
            { icon: <ShieldCheck className="w-3 h-3" />, label: "Strict Firewall", detail: "Zero data leakage." },
            { icon: <Split className="w-3 h-3" />, label: "Unified Admin", detail: "One billing dashboard." },
        ]
    }
];

export const WorkflowSimulation = () => {
    const [activeMode, setActiveMode] = useState("agency");

    return (
        <section className="bg-white dark:bg-neutral-950 py-24 overflow-hidden border-t border-neutral-200 dark:border-neutral-800">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <Badge className="mb-6">Architecture</Badge>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-neutral-900 dark:text-white mb-6">
                        Adaptive <span className="text-neutral-400">Operating Modes</span>
                    </h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light">
                        Switch contexts without switching tools.
                        Intelligent separation of concerns for Product vs. Service workflows.
                    </p>
                </div>
                <div className="relative w-full max-w-6xl mx-auto h-[650px] md:h-[600px] bg-neutral-100 dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-2 overflow-hidden">
                    <div className="absolute inset-0 opacity-50 bg-[linear-gradient(45deg,rgba(0,0,0,0.02)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.02)_50%,rgba(0,0,0,0.02)_75%,transparent_75%,transparent)] bg-[size:20px_20px]"></div>

                    <div className="relative z-10 h-full flex flex-col md:flex-row gap-2 items-stretch">
                        {
                            workflowData.map((mode) => {
                                const isActive = activeMode === mode.id;
                                return (
                                    <motion.div
                                        key={mode.id}
                                        onMouseEnter={() => setActiveMode(mode.id)}
                                        layout
                                        className={cn(
                                            "relative h-full rounded-2xl border transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer overflow-hidden",
                                            isActive
                                                ? "md:flex-[3] bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700 shadow-2xl"
                                                : "md:flex-[1] bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800"
                                        )}
                                    >
                                        <div className="p-6 h-full flex flex-col">
                                            <div className="flex items-start justify-between mb-8 shrink-0">
                                                <div>
                                                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">
                                                        {mode.subtitle}
                                                    </div>
                                                    <h3 className={cn("text-xl font-bold tracking-tight transition-colors", isActive ? "text-neutral-900 dark:text-white" : "text-neutral-500")}>
                                                        {mode.title}
                                                    </h3>
                                                </div>
                                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border transition-all",
                                                    isActive ? "bg-neutral-900 dark:bg-white text-white dark:text-black border-transparent" : "bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-400")}>
                                                    {mode.icon}
                                                </div>
                                            </div>
                                            <AnimatePresence mode="popLayout">
                                                {
                                                    isActive && (
                                                        <motion.div
                                                            initial={{ opacity: 0, filter: "blur(4px)" }}
                                                            animate={{ opacity: 1, filter: "blur(0px)" }}
                                                            exit={{ opacity: 0, filter: "blur(4px)" }}
                                                            transition={{ duration: 0.3 }}
                                                            className="flex-1 flex flex-col"
                                                        >
                                                            <p className="text-base text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                                                                {mode.fullDesc}
                                                            </p>
                                                            <div className="mb-8">
                                                                {mode.uiPreview}
                                                            </div>
                                                            <div className="mt-auto grid grid-cols-2 gap-4">
                                                                {
                                                                    mode.features.map((feat, idx) => (
                                                                        <div key={idx} className="flex flex-col p-3 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                                                                            <div className="text-neutral-900 dark:text-white mb-1">
                                                                                {feat.icon}
                                                                            </div>
                                                                            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{feat.label}</span>
                                                                            <span className="text-[10px] text-neutral-500 leading-tight mt-1">{feat.detail}</span>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </motion.div>
                                                    )
                                                }
                                            </AnimatePresence>
                                            {
                                                !isActive && (
                                                    <div className="absolute bottom-6 left-6 right-6 hidden md:block">
                                                        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800 mb-4"></div>
                                                        <div className="flex justify-between items-center text-[10px] font-mono uppercase text-neutral-400">
                                                            <span>Status</span>
                                                            <span>Standby</span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </motion.div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </section>
    );
};