"use client"

import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Users, Building2, Briefcase, TrendingUp, Clock, Plus, ChevronRight,
    BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"
import { OwnerDashboardData, ActivityItem } from "@/types/dashboard"
import { Project } from "@/types/project"

interface OwnerDashboardProps {
    data: OwnerDashboardData | null
}

export default function OwnerDashboard({ data }: OwnerDashboardProps) {
    if (!data) return null;

    const { stats, projects, recentActivity } = data;

    const quickStats = [
        { label: "Active Projects", value: stats.activeProjects, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Total Teams", value: stats.totalTeams, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Company Size", value: stats.totalMembers, icon: Building2, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Success Rate", value: "98%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    ]

    return (
        <div className="space-y-8 p-6 lg:p-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Command Center</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">Global oversight of your company operations and performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="hidden sm:flex gap-2">
                        <BarChart3 className="w-4 h-4" /> Reports
                    </Button>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2 shadow-lg shadow-orange-500/20">
                        <Plus className="w-4 h-4" /> New Project
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {
                    quickStats.map((stat, i) => (
                        <Card key={i} className="border-none shadow-sm dark:bg-neutral-900/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                                    </div>
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">+12%</span>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</h3>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <Card className="xl:col-span-2 border-none shadow-sm dark:bg-neutral-900/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between px-6 py-5">
                        <div>
                            <CardTitle className="text-lg">Recent Projects</CardTitle>
                            <CardDescription>High-priority active projects in your pipeline.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600 hover:bg-orange-500/10">
                            View All <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 p-0">
                        <div className="space-y-4">
                            {
                                projects.slice(0, 5).map((project: Project, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border border-transparent hover:border-neutral-100 dark:hover:border-neutral-800">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-500">
                                                {project.title.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-neutral-900 dark:text-white">{project.title}</h4>
                                                <p className="text-xs text-neutral-500 mt-0.5">{project.assignedTeams?.length || 0} teams assigned • Due in 12 days</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="hidden md:block w-32">
                                                <div className="flex justify-between text-[10px] mb-1 font-bold dark:text-white">
                                                    <span>65%</span>
                                                    <span className="text-neutral-400">Progress</span>
                                                </div>
                                                <Progress value={65} className="h-1.5" />
                                            </div>
                                            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                                Stable
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm dark:bg-neutral-900/50 backdrop-blur-sm h-full">
                    <CardHeader className="px-6 py-5">
                        <CardTitle className="text-lg">Live Operations</CardTitle>
                        <CardDescription>Real-time updates across departments.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="space-y-6">
                            {
                                recentActivity && recentActivity.length > 0 ? recentActivity.map((activity: ActivityItem, i: number) => (
                                    <div key={i} className="flex gap-4 relative">
                                        {
                                            i !== recentActivity.length - 1 && (
                                                <div className="absolute top-8 left-4 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />
                                            )
                                        }
                                        <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 z-10 border-4 border-white dark:border-neutral-950">
                                            <Clock className="w-3.5 h-3.5 text-neutral-500" />
                                        </div>
                                        <div className="pt-0.5">
                                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                                <span className="font-bold">{activity.user?.name || "System"}</span> {activity.description}
                                            </p>
                                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
                                                {new Date(activity.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                                        <Clock className="w-10 h-10 mb-2" />
                                        <p className="text-sm">No recent activity found.</p>
                                    </div>
                                )
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}