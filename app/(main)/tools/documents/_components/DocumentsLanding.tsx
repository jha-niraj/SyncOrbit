"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    FileText, Plus, Search, Filter,
    BarChart3, CreditCard, Receipt, FileStack,
    ArrowUpRight, Download, MoreVertical, Terminal, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { UploadDocument } from "./UploadDocument"

interface DocumentsLandingProps {
    documents: any[]
}

export function DocumentsLanding({ documents }: DocumentsLandingProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const categories = [
        { id: "ALL", label: "ALL_UNITS", icon: <FileStack className="h-4 w-4" /> },
        { id: "REPORT", label: "SYSTEM_REPORTS", icon: <BarChart3 className="h-4 w-4" /> },
        { id: "INVOICE", label: "BILLING_ARCHIVE", icon: <Receipt className="h-4 w-4" /> },
        { id: "FINANCIAL", label: "FISCAL_DATA", icon: <CreditCard className="h-4 w-4" /> },
        { id: "GENERAL", label: "CORE_ASSETS", icon: <FileText className="h-4 w-4" /> },
    ]

    const renderDocumentGrid = (categoryDocs: any[]) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryDocs.map((doc, i) => (
                <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <Card className="group border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden hover:shadow-2xl transition-all duration-500 rounded-3xl">
                        <CardContent className="p-0">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-2xl text-neutral-500 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-500">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="text-[8px] font-black tracking-widest rounded-full border-neutral-200 dark:border-neutral-800">
                                            {doc.fileType.split('/')[1]?.toUpperCase() || 'DOC'}
                                        </Badge>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-md tracking-tighter truncate">
                                        {doc.title}
                                    </h3>
                                    <p className="text-[10px] font-bold text-neutral-400 tracking-widest truncate">
                                        Ref: {doc.id.slice(-8)}
                                    </p>
                                </div>
                                <p className="text-md text-neutral-500 line-clamp-2 font-medium leading-relaxed">
                                    {doc.description || "No description provided for this synchronized asset."}
                                </p>
                            </div>
                            <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-neutral-400 tracking-widest">Modified_At</span>
                                    <span className="text-md font-bold">{format(new Date(doc.updatedAt), 'yyyy.MM.dd')}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="outline" className="h-9 w-9 rounded-xl border-neutral-200 dark:border-neutral-800" asChild title="DOWNLOAD">
                                        <Link href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button size="icon" className="h-9 w-9 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:scale-110 transition-transform" asChild title="VIEW_DETAILS">
                                        <Link href={`/tools/documents/${(doc.category || 'GENERAL').toLowerCase()}/${doc.id}`}>
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))
            }
            {
                categoryDocs.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
                        <div className="flex flex-col items-center gap-4 opacity-20">
                            <Terminal className="h-12 w-12" />
                            <div className="space-y-1">
                                <p className="font-bold tracking-tighter text-md">Empty_Archive</p>
                                <p className="text-[10px] tracking-widest">Waiting for data synchronization...</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] tracking-widest text-neutral-500">System_Unit // Archive_Management</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter">Document Terminal</h1>
                    <p className="text-neutral-500 text-md max-w-md font-medium">Protocol for secure document storage, indexing, and neural analysis of corporate assets.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-neutral-200 dark:border-neutral-800 font-bold tracking-widest text-xs">
                        Audit_Logs
                    </Button>
                    <UploadDocument />
                </div>
            </div>

            <Separator className="bg-neutral-200 dark:border-neutral-800" />

            <Tabs defaultValue="ALL" className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <TabsList className="bg-neutral-100 dark:bg-neutral-900 p-1 h-auto rounded-2xl flex-wrap">
                        {
                            categories.map(cat => (
                                <TabsTrigger
                                    key={cat.id}
                                    value={cat.id}
                                    className="rounded-xl px-6 py-2.5 text-xs font-bold tracking-widest data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black transition-all"
                                >
                                    <div className="flex items-center gap-2">
                                        {cat.icon}
                                        {cat.label}
                                    </div>
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            placeholder="FILTER_RECORDS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 pl-10 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-xl text-md"
                        />
                    </div>
                </div>

                {
                    categories.map(cat => (
                        <TabsContent key={cat.id} value={cat.id} className="mt-0 outline-none">
                            {
                                renderDocumentGrid(
                                    cat.id === "ALL"
                                        ? filteredDocs
                                        : filteredDocs.filter(d => d.category === cat.id)
                                )
                            }
                        </TabsContent>
                    ))
                }
            </Tabs>
        </div>
    )
}

function Separator({ className }: { className?: string }) {
    return <div className={cn("h-px w-full", className)} />
}