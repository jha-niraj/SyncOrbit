"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    DollarSign, TrendingUp, TrendingDown, Clock,
    Filter, Search, ArrowUpRight, Plus, Terminal,
    Wallet, Briefcase, Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AddExpenseSheet } from "@/components/tools/AddExpenseSheet"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface FinancialsDashboardProps {
    expenses: any[]
    categories: any[]
}

export function FinancialsDashboard({ expenses, categories }: FinancialsDashboardProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("ALL")

    const filteredExpenses = expenses.filter(exp => {
        const matchesSearch = exp.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "ALL" || exp.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0)

    const stats = [
        {
            label: "TOTAL_DEBIT",
            value: `$${totalExpenses.toLocaleString()}`,
            icon: <Wallet className="h-4 w-4" />,
            trend: "+12% FROM_LAST_MONTH"
        },
        {
            label: "OPS_COSTS",
            value: `$${expenses.filter(e => e.category !== 'SALARY').reduce((acc, exp) => acc + exp.amount, 0).toLocaleString()}`,
            icon: <Activity className="h-4 w-4" />,
            trend: "-5% EFFICIENCY_GAIN"
        },
        {
            label: "SALARY_ALLOC",
            value: `$${expenses.filter(e => e.category === 'SALARY').reduce((acc, exp) => acc + exp.amount, 0).toLocaleString()}`,
            icon: <Briefcase className="h-4 w-4" />,
            trend: "STABLE_BASELINE"
        },
        {
            label: "SYNC_STATUS",
            value: "SYNCHRONIZED",
            icon: <Clock className="h-4 w-4 text-emerald-500" />,
            trend: "REALTIME_DATA_FLOW"
        }
    ]

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">System_Module // Fiscal_Control</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Fiscal_Terminal</h1>
                    <p className="text-neutral-500 text-sm max-w-md font-medium">Coordinate financial outflows, manage departmental budgets, and audit corporate expenditures.</p>
                </div>
                <div className="flex gap-3">
                    <AddExpenseSheet />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-3xl overflow-hidden relative group">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-widest uppercase">{stat.label}</span>
                                    <div className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                                        {stat.icon}
                                    </div>
                                </div>
                                <CardTitle className="text-3xl font-black tracking-tighter">{stat.value}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-1.5 text-[8px] font-mono font-bold text-neutral-500 uppercase tracking-widest">
                                    <Activity className="h-3 w-3" />
                                    {stat.trend}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Expenses List */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex items-center gap-2">
                        <Button
                            variant={selectedCategory === "ALL" ? "default" : "outline"}
                            className={cn(
                                "h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                selectedCategory === "ALL"
                                    ? "bg-black dark:bg-white text-white dark:text-black"
                                    : "border-neutral-200 dark:border-neutral-800"
                            )}
                            onClick={() => setSelectedCategory("ALL")}
                        >
                            All_Sectors
                        </Button>
                        {categories.map(cat => (
                            <Button
                                key={cat.name}
                                variant={selectedCategory === cat.name ? "default" : "outline"}
                                className={cn(
                                    "h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                    selectedCategory === cat.name
                                        ? "bg-black dark:bg-white text-white dark:text-black"
                                        : "border-neutral-200 dark:border-neutral-800"
                                )}
                                onClick={() => setSelectedCategory(cat.name)}
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" />
                        <Input
                            placeholder="AUDIT_TX..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 pl-9 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 rounded-full text-[10px] font-mono uppercase tracking-tight"
                        />
                    </div>
                </div>

                <div className="border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden bg-white dark:bg-neutral-950 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                                    <th className="p-4 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Transaction_ID</th>
                                    <th className="p-4 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Description</th>
                                    <th className="p-4 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Category</th>
                                    <th className="p-4 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Date_Sych</th>
                                    <th className="p-4 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Amount</th>
                                    <th className="p-4 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Auth_By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900 text-xs">
                                {filteredExpenses.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors">
                                        <td className="p-4 font-mono font-bold text-neutral-500">
                                            #{exp.id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="p-4 font-black uppercase italic tracking-tighter">
                                            {exp.description}
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline" className="rounded-full px-3 py-0 text-[8px] font-black uppercase tracking-widest border-neutral-200 dark:border-neutral-800">
                                                {exp.category}
                                            </Badge>
                                        </td>
                                        <td className="p-4 font-medium text-neutral-500">
                                            {format(new Date(exp.date), 'yyyy.MM.dd')}
                                        </td>
                                        <td className="p-4 font-black text-sm">
                                            ${exp.amount.toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[8px] font-black">
                                                    {exp.creator.name[0]}
                                                </div>
                                                <span className="font-bold text-[10px] uppercase tracking-tight">{exp.creator.name}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredExpenses.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-20">
                                                <Terminal className="h-10 w-10" />
                                                <p className="font-mono text-[10px] uppercase tracking-widest">Null_Record_Stream</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
