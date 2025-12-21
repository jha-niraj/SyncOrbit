"use client"

import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
    ArrowRight, Briefcase, CheckCircle, Clock, Users
} from "lucide-react"
import { format } from "date-fns"
import { User } from "@/types/user"
import { Project } from "@/types/project"

interface InternalDashboardProps {
    user: User
    stats: {
        totalProjects: number
        activeProjects: number
        completedProjects: number
        totalTeamMembers: number
    }
    recentProjects: Project[]
}

export function InternalDashboard({ user, stats, recentProjects }: InternalDashboardProps) {
    const greeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good morning"
        if (hour < 18) return "Good afternoon"
        return "Good evening"
    }

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {greeting()}, {user.name?.split(" ")[0] || "there"}! 👋
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here&apos;s what&apos;s happening with your projects today.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href="/dashboard/clients">View Client Dashboard</Link>
                    </Button>
                    {/* Create Project button is in sidebar, but maybe add a shortcut here? */}
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProjects}</div>
                        <p className="text-xs text-muted-foreground">All time projects</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeProjects}</div>
                        <p className="text-xs text-muted-foreground">Currently in progress</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedProjects}</div>
                        <p className="text-xs text-muted-foreground">Successfully delivered</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTeamMembers}</div>
                        <p className="text-xs text-muted-foreground">Active contributors</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Projects */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Recent Projects</h2>
                    <Button variant="ghost" asChild className="text-sm">
                        <Link href="/projects" className="flex items-center gap-1">
                            View all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recentProjects.map((project) => (
                        <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant={project.status === "COMPLETED" ? "default" : "secondary"}>
                                        {project.status}
                                    </Badge>
                                    {project.endDate && (
                                        <span className="text-xs text-muted-foreground">
                                            Due {format(new Date(project.endDate), "MMM d")}
                                        </span>
                                    )}
                                </div>
                                <CardTitle className="mt-2 line-clamp-1">{project.title}</CardTitle>
                                <CardDescription className="line-clamp-2 h-10">
                                    {project.description || "No description provided."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex -space-x-2">
                                        {/* Mock avatars for now, ideally fetch project members */}
                                        <Avatar className="h-6 w-6 border-2 border-background">
                                            <AvatarFallback className="text-[10px]">A</AvatarFallback>
                                        </Avatar>
                                        <Avatar className="h-6 w-6 border-2 border-background">
                                            <AvatarFallback className="text-[10px]">B</AvatarFallback>
                                        </Avatar>
                                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] border-2 border-background">
                                            +2
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/projects/${project.id}`}>Details</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {recentProjects.length === 0 && (
                        <div className="col-span-full text-center py-10 text-muted-foreground border rounded-lg border-dashed">
                            No active projects found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
