"use client"

import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
    ArrowRight, DollarSign, FileText, LayoutDashboard
} from "lucide-react"
import { format } from "date-fns"
import { User } from "@/types/user"
import { Project } from "@/types/project"

interface ExternalDashboardProps {
    user: User
    stats: {
        totalSpent: number
        activeProjects: number
        pendingInvoices: number
    }
    activeProjects: Project[]
}

export function ExternalDashboard({ user, stats, activeProjects }: ExternalDashboardProps) {
    const greeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good morning"
        if (hour < 18) return "Good afternoon"
        return "Good evening"
    }

    return (
        <div className="p-6 space-y-8">
            {/* Greeting Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {greeting()}, {user.name?.split(" ")[0] || "there"}! 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome to your client portal. Here&apos;s an overview of your projects.
                    </p>
                </div>
                <div className="flex gap-2">
                    {/* Only show switch if user is NOT a client (i.e. internal user viewing external view) */}
                    {user.role !== "CLIENT" && (
                        <Button asChild variant="outline">
                            <Link href="/dashboard">Switch to Internal View</Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">${stats.totalSpent.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime project value</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeProjects}</div>
                        <p className="text-xs text-muted-foreground">Currently in progress</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
                        <p className="text-xs text-muted-foreground">Awaiting payment</p>
                    </CardContent>
                </Card>
            </div>

            {/* Active Projects */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Your Projects</h2>
                    <Button variant="ghost" asChild className="text-sm">
                        <Link href="/projects" className="flex items-center gap-1">
                            View all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4">
                    {activeProjects.map((project) => (
                        <Card key={project.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle>{project.title}</CardTitle>
                                        <CardDescription>
                                            Started {format(new Date(project.startDate), "MMM d, yyyy")}
                                        </CardDescription>
                                    </div>
                                    <Badge>{project.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        {project.description || "No description provided."}
                                    </div>
                                    <Button size="sm" asChild>
                                        <Link href={`/projects/${project.id}`}>View Progress</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {activeProjects.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed">
                            No active projects found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
