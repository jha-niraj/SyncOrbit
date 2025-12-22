"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Zap, ArrowLeft, BarChart3, PieChart, Loader2, Sparkles, Check
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    generateFinancialSummary, createReport
} from "@/actions/tools/report.action"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function NewReportPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [selectedType, setSelectedType] = useState<string | null>(null)
    // const [step, setStep] = useState(1)

    const reportTypes = [
        {
            id: "FINANCIAL",
            title: "Financial Summary",
            description: "Aggregate all expenses and categorize fiscal data for deep audit.",
            icon: <PieChart className="h-6 w-6" />
        },
        {
            id: "OPERATIONAL",
            title: "Performance Pulse",
            description: "Analyze timeline adherence and resource synchronization velocity.",
            icon: <Zap className="h-6 w-6" />
        },
        {
            id: "SECURITY",
            title: "Security & Access",
            description: "Audit document access patterns and unit synchronization logs.",
            icon: <Sparkles className="h-6 w-6" />
        }
    ]

    const handleGenerate = async () => {
        if (!title || !selectedType) {
            toast.error("Please provide a title and select a report type")
            return
        }

        setIsLoading(true)
        try {
            let data: Record<string, unknown> = {}
            if (selectedType === "FINANCIAL") {
                const res = await generateFinancialSummary()
                if (res.success) {
                    data = res.summary as Record<string, unknown>
                } else {
                    throw new Error(res.error)
                }
            } else {
                data = { message: "Operational data integration pending sync." }
            }

            const result = await createReport({
                title,
                type: selectedType,
                reportData: data
            })

            if (result.success) {
                toast.success("Report synthesized successfully")
                router.push("/tools/reports")
            } else {
                toast.error(result.error || "Failed to create report")
            }
        } catch (err) {
            const error = err as Error;
            toast.error(error.message || "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="py-12 w-full max-w-[800px] mx-auto px-6 space-y-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href="/tools/reports">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-neutral-400" />
                        <span className="text-[10px] tracking-widest text-neutral-500 uppercase">System_Action // Synthesis_Engine</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter">Synthesize Report</h1>
                </div>
            </div>

            <div className="space-y-8">
                <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl">
                    <CardHeader className="p-8 border-b border-neutral-100 dark:border-neutral-900">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Initialization_Parameters</span>
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tighter">Configuration</CardTitle>
                        <CardDescription className="text-md">Define the scope and title of the analytics output.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-4">
                            <Label className="text-md font-bold tracking-widest text-neutral-400 uppercase">Report_Identification</Label>
                            <Input
                                placeholder="E.G., Q4_FISCAL_RECONCILIATION"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-14 bg-neutral-50 dark:bg-neutral-900 border-none rounded-2xl text-md font-bold"
                            />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-md font-bold tracking-widest text-neutral-400 uppercase">Select_Engine_Type</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {reportTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={cn(
                                            "p-6 rounded-3xl border text-left transition-all relative group",
                                            selectedType === type.id
                                                ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                                                : "border-neutral-100 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-900/50 hover:border-neutral-300 dark:hover:border-neutral-700"
                                        )}
                                    >
                                        <div className={cn(
                                            "mb-4 p-3 rounded-2xl inline-block",
                                            selectedType === type.id ? "bg-white/20" : "bg-neutral-100 dark:bg-neutral-800"
                                        )}>
                                            {type.icon}
                                        </div>
                                        <h3 className="font-black text-md tracking-tight mb-1">{type.title}</h3>
                                        <p className={cn(
                                            "text-[10px] leading-tight font-medium",
                                            selectedType === type.id ? "text-white/70 dark:text-black/70" : "text-neutral-500"
                                        )}>
                                            {type.description}
                                        </p>
                                        {selectedType === type.id && (
                                            <div className="absolute top-4 right-4 bg-emerald-500 text-white rounded-full p-1">
                                                <Check className="h-3 w-3" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading || !title || !selectedType}
                            className="w-full h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    SYNTHESIZING...
                                </div>
                            ) : (
                                "INITIALIZE SYNTHESIS"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
                    <BarChart3 className="h-3 w-3" />
                    Engines online and ready for data synchronization
                </div>
            </div>
        </div>
    )
}
