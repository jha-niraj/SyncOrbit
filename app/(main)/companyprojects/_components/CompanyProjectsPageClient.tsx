"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
    Building2, Users, DollarSign, EyeOff, Code, Megaphone, ShoppingCart, Palette,
    Briefcase, Settings, MessageSquare, FileText, Plus, TrendingUp
} from "lucide-react"
import { ProjectVisibility, Status, TaskStatus, TeamType, Role } from "@prisma/client"
import Link from "next/link"
import { CreateProjectSheet } from "@/components/projects/createprojectsheet"

// Team type icon mapping
const TEAM_ICONS = {
    [TeamType.TECHNICAL]: Code,
    [TeamType.MARKETING]: Megaphone,
    [TeamType.SALES]: ShoppingCart,
    [TeamType.DESIGN]: Palette,
    [TeamType.OPERATIONS]: Settings,
    [TeamType.FINANCE]: Briefcase,
    [TeamType.CUSTOM]: Users,
}

// Status colors
const STATUS_COLORS = {
    [Status.IN_PROGRESS]: "bg-blue-500",
    [Status.COMPLETED]: "bg-green-500",
    [Status.ON_HOLD]: "bg-yellow-500",
    [Status.CANCELLED]: "bg-red-500",
}

interface ProjectTask {
    status: TaskStatus
}

interface TeamAssignment {
    id: string
    team: {
        teamType: TeamType
        displayName: string
        color: string | null
    }
}

interface Project {
    id: string
    title: string
    description: string | null
    status: Status
    visibility: ProjectVisibility
    budget: number
    currency: string
    user: {
        name: string | null
        email: string | null
        image: string | null
    }
    tasks: ProjectTask[]
    _count?: {
        tasks: number
        messages: number
    }
    members?: { id: string }[]
    assignedTeams?: TeamAssignment[]
    slug: string
}

interface CompanyProjectsPageClientProps {
    projects: Project[]
    user: {
        role: string
    }
}

function getTaskProgress(tasks: ProjectTask[]) {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length
    return Math.round((completedTasks / tasks.length) * 100)
}

function formatCurrency(amount: number, currency: string) {
    const symbols: Record<string, string> = {
        USD: '$',
        INR: '₹',
        NPR: 'Rs.'
    }
    return `${symbols[currency] || '$'}${amount.toLocaleString()}`
}

export function CompanyProjectsPageClient({ projects, user }: CompanyProjectsPageClientProps) {
    const isCompanyOwner = user.role === Role.COMPANY_OWNER

    // Calculate company-wide statistics
    const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === Status.IN_PROGRESS).length,
        completed: projects.filter(p => p.status === Status.COMPLETED).length,
        onHold: projects.filter(p => p.status === Status.ON_HOLD).length,
        totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
        totalTasks: projects.reduce((sum, p) => sum + (p._count?.tasks || 0), 0),
        completedTasks: projects.reduce((sum, p) => sum + p.tasks.filter((t: ProjectTask) => t.status === TaskStatus.COMPLETED).length, 0)
    }

    const overallProgress = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        {isCompanyOwner ? 'All Company Projects' : 'Team Projects Overview'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {
                            isCompanyOwner
                                ? 'Manage and oversee all projects across your company'
                                : 'View projects assigned to your teams'
                        }
                    </p>
                </div>
                {
                    isCompanyOwner && (
                        <CreateProjectSheet
                            trigger={
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    New Project
                                </Button>
                            }
                        />
                    )
                }
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                                {stats.active} Active
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                {stats.completed} Done
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${stats.totalBudget.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all projects
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallProgress}%</div>
                        <Progress value={overallProgress} className="h-2 mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTasks}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.completedTasks} completed
                        </p>
                    </CardContent>
                </Card>
            </div>
            {
                projects.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                            <p className="text-muted-foreground mb-4">
                                {
                                    isCompanyOwner
                                        ? "No projects have been created in your company yet."
                                        : "No projects are assigned to your teams yet."
                                }
                            </p>
                            {
                                isCompanyOwner && (
                                    <CreateProjectSheet
                                        trigger={
                                            <Button className="gap-2">
                                                <Plus className="w-4 h-4" />
                                                Create First Project
                                            </Button>
                                        }
                                    />
                                )
                            }
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {
                            projects.map((project) => {
                                const progress = getTaskProgress(project.tasks)

                                return (
                                    <Card key={project.id} className="group hover:shadow-lg transition-shadow">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <CardTitle className="text-lg line-clamp-1">
                                                            {project.title}
                                                        </CardTitle>
                                                        {
                                                            project.visibility === ProjectVisibility.PRIVATE && (
                                                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                                                            )
                                                        }
                                                        <Badge variant="outline" className="text-xs">
                                                            {project.status.toLowerCase().replace('_', ' ')}
                                                        </Badge>
                                                    </div>

                                                    {
                                                        project.description && (
                                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                                {project.description}
                                                            </p>
                                                        )
                                                    }

                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[project.status as keyof typeof STATUS_COLORS]}`} />
                                                        <span className="text-sm font-medium capitalize">
                                                            {project.status.toLowerCase().replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0 space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarImage src={project.user.image || undefined} />
                                                    <AvatarFallback className="text-xs">
                                                        {project.user.name?.[0] || project.user.email?.[0] || 'C'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-muted-foreground">
                                                    {project.user.name || project.user.email}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">
                                                    {formatCurrency(project.budget, project.currency)}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Progress</span>
                                                    <span className="font-medium">{progress}%</span>
                                                </div>
                                                <Progress value={progress} className="h-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Teams</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {
                                                        project.assignedTeams?.slice(0, 3).map((assignment: TeamAssignment) => {
                                                            const IconComponent = TEAM_ICONS[assignment.team.teamType] || Users
                                                            return (
                                                                <div
                                                                    key={assignment.id}
                                                                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs"
                                                                    style={{
                                                                        backgroundColor: assignment.team.color ? `${assignment.team.color}15` : undefined,
                                                                        color: assignment.team.color || undefined
                                                                    }}
                                                                >
                                                                    <IconComponent className="w-3 h-3" />
                                                                    <span>{assignment.team.displayName}</span>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    {
                                                        project.assignedTeams && project.assignedTeams.length > 3 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                +{project.assignedTeams.length - 3} more
                                                            </Badge>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                                                <div className="text-center">
                                                    <div className="flex items-center justify-center mb-1">
                                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-sm font-medium">{project._count?.tasks || 0}</p>
                                                    <p className="text-xs text-muted-foreground">Tasks</p>
                                                </div>
                                                <div className="text-center">
                                                    <div className="flex items-center justify-center mb-1">
                                                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-sm font-medium">{project._count?.messages || 0}</p>
                                                    <p className="text-xs text-muted-foreground">Messages</p>
                                                </div>
                                                <div className="text-center">
                                                    <div className="flex items-center justify-center mb-1">
                                                        <Users className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-sm font-medium">{project.members?.length || 0}</p>
                                                    <p className="text-xs text-muted-foreground">Members</p>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <Link href={`/projects/${project.slug}`} className="w-full">
                                                    <Button variant="outline" className="w-full" size="sm">
                                                        View Project
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}
