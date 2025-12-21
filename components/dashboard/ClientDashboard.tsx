"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Briefcase, FileText, MessageSquare,
    CreditCard, ExternalLink, Package,
    ChevronRight, Clock
} from "lucide-react"
import { ClientDashboardData } from "@/types/dashboard"

interface ClientDashboardProps {
    data: ClientDashboardData | null
}

export default function ClientDashboard({ data }: ClientDashboardProps) {
    if (!data) return null;

    const { projects, invoices, stats } = data;

    return (
        <div className="space-y-8 p-6 lg:p-10 animate-in fade-in duration-700">
            {/* Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Project Portal</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">Real-time status of your commissioned work and deliverables.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <MessageSquare className="w-4 h-4" /> Message Support
                    </Button>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2 shadow-lg shadow-orange-500/20">
                        Request New Project
                    </Button>
                </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm dark:bg-neutral-900/50 backdrop-blur-sm relative overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl">
                                <Package className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.activeProjects}</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest font-mono">Active Projects</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm dark:bg-neutral-900/50 backdrop-blur-sm relative overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-2xl">
                                <MessageSquare className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.unreadMessages}</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest font-mono">Project Messages</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm dark:bg-neutral-900/50 backdrop-blur-sm relative overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                <FileText className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{stats.totalFiles}</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest font-mono">Deliverables</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* My Active Projects */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Active Milestone Tracking</h2>
                        <Button variant="link" className="text-orange-500 p-0 h-auto font-bold text-sm">View Archive</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects && projects.length > 0 ? projects.map((project: any, i: number) => (
                            <Card key={i} className="border border-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/30 hover:shadow-lg transition-all group">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                            <Briefcase className="w-5 h-5 text-neutral-400" />
                                        </div>
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] font-bold tracking-widest uppercase">Healthy</Badge>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1">{project.title}</h4>
                                    <p className="text-sm text-neutral-500 line-clamp-1 mb-6">Status: {project.status.toLowerCase().replace('_', ' ')}</p>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-xs font-bold">
                                            <span className="text-neutral-400 uppercase tracking-widest">Progress</span>
                                            <span className="dark:text-white">72%</span>
                                        </div>
                                        <Progress value={72} className="h-1.5" />
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex -space-x-2">
                                                {[1, 2].map((_, idx) => (
                                                    <div key={idx} className="w-6 h-6 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-200" />
                                                ))}
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-2 group-hover:text-orange-500 transition-colors">
                                                Open Portal <ExternalLink className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="col-span-full py-12 text-center bg-neutral-50 dark:bg-neutral-900/20 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                                <Clock className="w-12 h-12 mx-auto mb-2 text-neutral-400 opacity-50" />
                                <h3 className="font-bold text-lg mb-1">No active projects</h3>
                                <p className="text-sm text-neutral-500">Your current projects will appear here once they start.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Billing & Documents */}
                <div className="space-y-8">
                    <Card className="border-none shadow-sm dark:bg-neutral-900/50 backdrop-blur-sm">
                        <CardHeader className="p-6 border-b border-neutral-100 dark:border-neutral-800">
                            <CardTitle className="text-lg">Recent Invoices</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {invoices && invoices.length > 0 ? invoices.map((inv: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                                <CreditCard className="w-4 h-4 text-neutral-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">INV-{inv.id.substring(0, 6)}</p>
                                                <p className="text-[10px] text-neutral-500 font-mono">
                                                    {new Date(inv.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">${inv.amount?.toLocaleString() || '1,250.00'}</p>
                                            <Badge variant="outline" className="text-[9px] h-4 font-mono px-1 py-0">
                                                {inv.status || 'PAID'}
                                            </Badge>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-6 text-center text-sm text-neutral-500 opacity-50">
                                        <p>No billing history yet.</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-neutral-50/50 dark:bg-neutral-900/50">
                                <Button variant="outline" className="w-full text-xs gap-2">
                                    Full Billing Dashboard <ChevronRight className="w-3 h-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 text-white shadow-xl shadow-orange-500/20">
                        <h3 className="font-bold text-lg mb-2">Need a Boost?</h3>
                        <p className="text-sm text-orange-50 font-medium mb-6 opacity-90">Scale your project by adding another team or service to your workspace.</p>
                        <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold">Explore Marketplace</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
