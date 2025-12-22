"use client"

import { motion } from "framer-motion"
import {
    TrendingUp, Users, DollarSign, ArrowUpRight, Plus,
    Terminal, Zap, Activity
} from "lucide-react"
import { 
    Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ReportsDashboard() {
    const reportTypes = [
        {
            title: "Financial_Sync",
            description: "Deep audit of revenue streams, allocation efficiency, and fiscal velocity.",
            icon: <DollarSign className="h-6 w-6" />,
            stats: "$12,450_REV",
            trend: "UPWARD_FLOW"
        },
        {
            title: "Operational_Pulse",
            description: "Real-time metrics on project completion timelines and resource synchronization.",
            icon: <TrendingUp className="h-6 w-6" />,
            stats: "85%_YIELD",
            trend: "OPTIMIZED"
        },
        {
            title: "Human_Capital",
            description: "Security and productivity metrics for decentralized synchronized teams.",
            icon: <Users className="h-6 w-6" />,
            stats: "12_UNITS",
            trend: "ACTIVE"
        }
    ]

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">System_Module // Analytics_Engine</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Analytics_Terminal</h1>
                    <p className="text-neutral-500 text-sm max-w-md font-medium">Execute deep-dive analytics, synthesize performance data, and monitor corporate vital signs.</p>
                </div>
                <div className="flex gap-3">
                    <Button className="h-12 px-6 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-transform">
                        <Plus className="mr-2 h-4 w-4" />
                        SYNTHESIZE_REPORT
                    </Button>
                </div>
            </div>

            {/* Report Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reportTypes.map((report, i) => (
                    <motion.div
                        key={report.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="group border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-2xl group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-500">
                                        {report.icon}
                                    </div>
                                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest rounded-full border-neutral-200 dark:border-neutral-800">
                                        {report.trend}
                                    </Badge>
                                </div>
                                <CardTitle className="text-2xl font-black tracking-tighter uppercase italic">{report.title}</CardTitle>
                                <CardDescription className="text-xs font-medium text-neutral-500 leading-relaxed">
                                    {report.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">Key_Metric</span>
                                        <span className="text-sm font-black">{report.stats}</span>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                                        <ArrowUpRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Recent Reports Terminal */}
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-3xl overflow-hidden shadow-sm">
                <CardHeader className="border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-neutral-400" />
                        <CardTitle className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-[0.2em]">Recent_Output_Stream</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="relative">
                            <Activity className="h-12 w-12 text-neutral-100 dark:text-neutral-900" />
                            <Zap className="h-6 w-6 text-neutral-200 dark:text-neutral-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-black tracking-tighter uppercase italic text-lg opacity-20">No_Recent_Synthetics</p>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">System waiting for report generation request...</p>
                        </div>
                        <Button variant="outline" className="h-10 px-8 rounded-xl border-neutral-200 dark:border-neutral-800 font-bold text-[10px] uppercase tracking-widest mt-4">
                            RUN_FULL_DIAGNOSTIC
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
