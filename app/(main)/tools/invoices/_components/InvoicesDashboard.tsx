"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Plus, Search, Filter, FileText, CheckCircle2, Clock, AlertCircle,
    ArrowUpRight, Download, CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { ToolsInvoice } from "@/types"

interface InvoicesDashboardProps {
    invoices: ToolsInvoice[]
}

export function InvoicesDashboard({ invoices }: InvoicesDashboardProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const stats = [
        {
            label: "Total Volume",
            value: `$${invoices.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}`,
            icon: <CreditCard className="h-4 w-4" />,
            description: "Cumulative billing"
        },
        {
            label: "Paid Station",
            value: invoices.filter(inv => inv.status === "PAID").length,
            icon: <CheckCircle2 className="h-4 w-4" />,
            description: "Completed transactions"
        },
        {
            label: "Pending Ops",
            value: invoices.filter(inv => inv.status === "SENT").length,
            icon: <Clock className="h-4 w-4" />,
            description: "Awaiting client action"
        },
        {
            label: "Overdue Alerts",
            value: invoices.filter(inv => inv.status === "OVERDUE").length,
            icon: <AlertCircle className="h-4 w-4 text-red-500" />,
            description: "Past due threshold"
        }
    ]

    const filteredInvoices = invoices.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.client.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] tracking-widest text-neutral-500">System_Module // Finance</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter">Invoice Terminal</h1>
                    <p className="text-neutral-500 text-md max-w-md font-medium">Manage corporate billing, track client payments, and execute financial operations.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-neutral-200 dark:border-neutral-800 font-bold tracking-widest text-xs">
                        Export Report
                    </Button>
                    <Button asChild className="h-12 px-6 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold tracking-widest text-xs shadow-xl hover:scale-105 transition-transform">
                        <Link href="/tools/invoices/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Initialize Invoice
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {
                    stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    {stat.icon}
                                </div>
                                <CardHeader className="pb-2">
                                    <span className="text-[10px] font-bold text-neutral-400 tracking-widest">{stat.label}</span>
                                    <CardTitle className="text-3xl font-black tracking-tighter">{stat.value}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[10px] text-neutral-500 font-medium tracking-tight">{stat.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                }
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            placeholder="SEARCH_BY_ID_OR_CLIENT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 pl-10 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-xl text-md"
                        />
                    </div>
                    <Button variant="outline" className="h-11 rounded-xl border-neutral-200 dark:border-neutral-800 gap-2 font-bold text-xs">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                </div>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-950 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                                    <th className="p-4 text-md font-bold text-neutral-400 tracking-widest">Identify</th>
                                    <th className="p-4 text-md font-bold text-neutral-400 tracking-widest">Client_Entity</th>
                                    <th className="p-4 text-md font-bold text-neutral-400 tracking-widest">Amount</th>
                                    <th className="p-4 text-md font-bold text-neutral-400 tracking-widest">Due_Date</th>
                                    <th className="p-4 text-md font-bold text-neutral-400 tracking-widest">Status</th>
                                    <th className="p-4 text-md font-bold text-neutral-400 tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                                {
                                    filteredInvoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors group">
                                            <td className="p-4">
                                                <span className="text-md font-bold">#{inv.invoiceNumber}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-md">
                                                        {inv.client.name?.[0] || 'C'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-md font-bold tracking-tight">{inv.client.name || 'Unknown'}</span>
                                                        <span className="text-[10px] text-neutral-400">{inv.client.email || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-md font-bold">
                                                ${inv.amount.toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <span className="text-md text-neutral-500 font-medium">
                                                    {format(new Date(inv.dueDate), 'MMM dd, yyyy')}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={cn(
                                                    "rounded-full px-3 py-0.5 text-md font-black tracking-widest border-none",
                                                    inv.status === "PAID" && "bg-emerald-500/10 text-emerald-500",
                                                    inv.status === "SENT" && "bg-blue-500/10 text-blue-500",
                                                    inv.status === "DRAFT" && "bg-neutral-500/10 text-neutral-500",
                                                    inv.status === "OVERDUE" && "bg-red-500/10 text-red-500"
                                                )}>
                                                    {inv.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                                                        <Link href={`/tools/invoices/${inv.id}`}>
                                                            <ArrowUpRight className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    filteredInvoices.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center">
                                                <div className="flex flex-col items-center gap-2 opacity-20">
                                                    <FileText className="h-12 w-12" />
                                                    <p className="text-md tracking-widest">No_Records_Found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}