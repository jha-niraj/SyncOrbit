"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle2, Clock, ListTodo, Target,
    MessageSquare, Calendar, Star,
    ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MemberDashboardData } from "@/types/dashboard"

interface MemberDashboardProps {
    data: MemberDashboardData | null
}

export default function MemberDashboard({ data }: MemberDashboardProps) {
    if (!data) return null;

    const { stats, assignedTasks } = data;

    return (
        <div className="space-y-8 p-6 lg:p-10 animate-in slide-in-from-right-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Workspace</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">Focused view of your tasks and contributions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="gap-2">
                        <Calendar className="w-4 h-4" /> My Schedule
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" /> Log Progress
                    </Button>
                </div>
            </div>

            {/* My Focus Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-110 transition-transform" />
                    <ListTodo className="w-5 h-5 text-blue-500 mb-4" />
                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.myTasks}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-bold uppercase tracking-widest font-mono">Total Tasks</p>
                </div>

                <div className="bg-white dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full group-hover:scale-110 transition-transform" />
                    <Clock className="w-5 h-5 text-amber-500 mb-4" />
                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.myInProgress}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-bold uppercase tracking-widest font-mono">In Progress</p>
                </div>

                <div className="bg-white dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-110 transition-transform" />
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-4" />
                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.myCompleted}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-bold uppercase tracking-widest font-mono">Completed</p>
                </div>

                <div className="bg-white dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden relative group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/5 rounded-full group-hover:scale-110 transition-transform" />
                    <Target className="w-5 h-5 text-purple-500 mb-4" />
                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.myProjects}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-bold uppercase tracking-widest font-mono">Assigned Projects</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Active Tasks Table */}
                <Card className="xl:col-span-3 border-none shadow-sm dark:bg-neutral-900/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">My Priority Queue</CardTitle>
                            <CardDescription>Upcoming and active tasks assigned to you.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="hidden sm:flex text-neutral-500">
                            Full Task Board <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-mono text-neutral-500">Task Details</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-mono text-neutral-500">Project</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest font-mono text-neutral-500 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {assignedTasks && assignedTasks.length > 0 ? assignedTasks.map((task: any, i: number) => (
                                        <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-2 h-2 rounded-full",
                                                        task.priority === 'HIGH' ? "bg-red-500" : "bg-blue-500"
                                                    )} />
                                                    <span className="font-semibold text-neutral-900 dark:text-white text-sm line-clamp-1">{task.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="text-[10px] uppercase tracking-wide border-neutral-200 dark:border-neutral-800">
                                                    {task.project?.title || "No Project"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Badge className={cn(
                                                    "border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                                    task.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-500" :
                                                        task.status === 'IN_PROGRESS' ? "bg-blue-500/10 text-blue-500" : "bg-neutral-500/10 text-neutral-500"
                                                )}>
                                                    {task.status.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-sm text-neutral-500">
                                                You have no assigned tasks yet. Relax! ☕
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Contribution Summary */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm dark:bg-neutral-900/50 backdrop-blur-sm">
                        <CardHeader className="p-6">
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-2">
                            <Button variant="outline" className="w-full justify-start text-xs h-9 gap-2">
                                <MessageSquare className="w-3.5 h-3.5" /> Recent Mentions
                            </Button>
                            <Button variant="outline" className="w-full justify-start text-xs h-9 gap-2">
                                <Star className="w-3.5 h-3.5" /> Saved Items
                            </Button>
                            <Button variant="outline" className="w-full justify-start text-xs h-9 gap-2">
                                <Calendar className="w-3.5 h-3.5" /> Weekly Review
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1 bg-white/10 rounded">
                                    <Target className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest font-mono text-neutral-300">Goal of the Day</span>
                            </div>
                            <p className="text-sm font-medium leading-relaxed mb-6">Complete your current task sprint and sync with the lead.</p>
                            <Button size="sm" className="w-full bg-white text-black hover:bg-white/90">Complete Goal</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
