"use client"

import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
    Building2, Users, DollarSign, EyeOff, Code, Megaphone, ShoppingCart, Palette,
    Briefcase, Settings, MessageSquare, FileText
} from "lucide-react"
import {
    ProjectVisibility, Status, TaskStatus, TeamType
} from "@prisma/client"
import Link from "next/link"
import { CreateProjectModal } from "@/components/projects/CreateProjectModal"

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

interface Project {
    id: string
    title: string
    slug: string
    description: string | null
    visibility: ProjectVisibility
    status: Status
    budget: number
    currency: string
    user: {
        name: string | null
        email: string | null
        image: string | null
    }
    tasks: ProjectTask[]
    assignedTeams?: Array<{
        id: string
        team: {
            displayName: string
            teamType: TeamType
            color: string | null
        }
    }>
    members?: unknown[]
    _count?: {
        tasks: number
        messages: number
    }
}

interface ProjectsPageClientProps {
    projects: Project[]
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

export default function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">My Projects</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your assigned projects and collaborate with your teams
                    </p>
                </div>
                <CreateProjectModal
                    trigger={
                        <Button className="gap-2">
                            <Building2 className="w-4 h-4" />
                            New Project
                        </Button>
                    }
                />
            </div>

            {projects.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                        <p className="text-muted-foreground mb-4">
                            You haven&apos;t been assigned to any projects yet, or there are no projects created.
                        </p>
                        <CreateProjectModal
                            trigger={
                                <Button className="gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Create First Project
                                </Button>
                            }
                        />
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => {
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
                                                {project.visibility === ProjectVisibility.PRIVATE && (
                                                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                                                )}
                                            </div>

                                            {project.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {project.description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[project.status]}`} />
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
                                            {project.assignedTeams?.slice(0, 3).map((assignment) => {
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
                                            })}
                                            {project.assignedTeams && project.assignedTeams.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{project.assignedTeams.length - 3} more
                                                </Badge>
                                            )}
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
                    })}
                </div>
            )}
        </div>
    )
}
