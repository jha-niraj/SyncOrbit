"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Users, Briefcase, CheckSquare, BarChart2, Zap
} from "lucide-react"
import { LeadDashboardData } from "@/types/dashboard"

interface LeadDashboardProps {
    data: LeadDashboardData | null
}

export default function LeadDashboard({ data }: LeadDashboardProps) {
    if (!data) return null;

    const { stats, projects } = data;

    return (
        <div className="space-y-8 p-6 lg:p-10 animate-in slide-in-from-bottom-2 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Team Hub</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage your team velocity and project milestones.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Users className="w-4 h-4" /> My Teams
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-500/20">
                        <Zap className="w-4 h-4" /> Review Tasks
                    </Button>
                </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none bg-blue-600 text-white shadow-xl shadow-blue-600/10">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest font-mono">Team Completion</p>
                                <h3 className="text-4xl font-bold mt-2">{stats.completionRate}%</h3>
                            </div>
                            <div className="p-2 bg-white/10 rounded-lg">
                                <BarChart2 className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col gap-2">
                            <Progress value={stats.completionRate} className="bg-white/20 h-1.5" />
                            <span className="text-[10px] text-blue-100">+4% from last sprint</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm dark:bg-neutral-900/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-neutral-500 dark:text-neutral-400 text-xs font-bold uppercase tracking-widest font-mono">Managed Size</p>
                                <h3 className="text-4xl font-bold mt-2 text-neutral-900 dark:text-white">{stats.teamSize}</h3>
                            </div>
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Users className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-6 font-medium uppercase tracking-widest">Team Membership Count</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm dark:bg-neutral-900/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-neutral-500 dark:text-neutral-400 text-xs font-bold uppercase tracking-widest font-mono">Open Tasks</p>
                                <h3 className="text-4xl font-bold mt-2 text-neutral-900 dark:text-white">{stats.pendingTasks}</h3>
                            </div>
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <CheckSquare className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-6 font-medium uppercase tracking-widest">Urgent markers across teams</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Assignments */}
                <Card className="border-none shadow-sm dark:bg-neutral-900/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Team Projects</CardTitle>
                        <Button variant="ghost" size="sm" className="text-blue-500">
                            Manage Projects
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {projects.map((project: any, i: number) => (
                                <div key={i} className="group p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-blue-500/30 transition-all bg-white dark:bg-neutral-950/30">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                                <Briefcase className="w-4 h-4 text-neutral-500" />
                                            </div>
                                            <h4 className="font-bold text-neutral-900 dark:text-white group-hover:text-blue-500 transition-colors">{project.title}</h4>
                                        </div>
                                        <Badge variant="secondary" className="capitalize text-[10px]">{project.status.toLowerCase().replace('_', ' ')}</Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <CheckSquare className="w-3.5 h-3.5" /> {project.tasks?.length || 0} Tasks
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5" /> {project.members?.length || 0} Members
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Team Capacity / Status */}
                <Card className="border-none shadow-sm dark:bg-neutral-900/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Sprint Monitoring</CardTitle>
                        <CardDescription>Visualizing current team bandwidth.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center opacity-30 text-neutral-500">
                        <div className="text-center font-mono">
                            <BarChart2 className="w-12 h-12 mx-auto mb-4" />
                            <p className="text-sm font-bold tracking-widest uppercase">Capacity Visualizer Pending</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
