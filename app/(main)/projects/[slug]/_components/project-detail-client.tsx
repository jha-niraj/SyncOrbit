"use client"

import { useState } from "react"
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
    Users, Calendar, DollarSign, FileText,
    EyeOff, Megaphone, ShoppingCart, Palette, SettingsIcon, Briefcase,
    Activity, CheckCircle, ArrowLeft, Settings, ExternalLink,
    Figma, Github, File, Target, User, Plus, Building2, BarChart3, Code,
    AlertCircle, Clock
} from "lucide-react"
import {
    ProjectVisibility, Status, TaskStatus, TeamType, Role, ClientType
} from "@prisma/client"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"

import { ChatSheet } from "@/components/projects/chat-sheet"
import { FeedbackSheet } from "@/components/projects/feedback-sheet"
import { CreateTaskSheet, TaskDetailsSheet } from "@/components/projects/task-sheets"
import KanbanBoard, { Column } from "@/components/kanbanboard"
import { updateTask } from "@/actions/tasks.action"
import { toast } from "sonner"
import { ProjectWithRelations } from "@/types/project"
import { TaskWithRelations } from "@/types/task"

// Team type icon mapping
const TEAM_ICONS = {
    [TeamType.TECHNICAL]: Code,
    [TeamType.MARKETING]: Megaphone,
    [TeamType.SALES]: ShoppingCart,
    [TeamType.DESIGN]: Palette,
    [TeamType.OPERATIONS]: SettingsIcon,
    [TeamType.FINANCE]: Briefcase,
    [TeamType.CUSTOM]: Users,
}

// Status colors and icons
const STATUS_CONFIG = {
    [Status.IN_PROGRESS]: { color: "bg-blue-500", bgColor: "bg-blue-50 dark:bg-blue-950/20", textColor: "text-blue-700 dark:text-blue-300", icon: Activity },
    [Status.COMPLETED]: { color: "bg-green-500", bgColor: "bg-green-50 dark:bg-green-950/20", textColor: "text-green-700 dark:text-green-300", icon: CheckCircle },
    [Status.ON_HOLD]: { color: "bg-yellow-500", bgColor: "bg-yellow-50 dark:bg-yellow-950/20", textColor: "text-yellow-700 dark:text-yellow-300", icon: Clock },
    [Status.CANCELLED]: { color: "bg-red-500", bgColor: "bg-red-50 dark:bg-red-950/20", textColor: "text-red-700 dark:text-red-300", icon: AlertCircle },
}

function getTaskProgress(tasks: TaskWithRelations[]) {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length
    return Math.round((completedTasks / tasks.length) * 100)
}

function formatCurrency(amount: number, currency: string) {
    const symbols: Record<string, string> = {
        USD: '$',
        INR: '₹',
        NPR: 'Rs.',
        EUR: '€',
        GBP: '£'
    }
    return `${symbols[currency] || '$'}${amount.toLocaleString()}`
}

function getKanbanColumns(tasks: TaskWithRelations[]): Column[] {
    const columns: Column[] = [
        { id: TaskStatus.YET_TO_START, title: 'To Do', color: '#64748b', tasks: [] },
        { id: TaskStatus.IN_PROGRESS, title: 'In Progress', color: '#3b82f6', tasks: [] },
        { id: TaskStatus.COMPLETED, title: 'Completed', color: '#22c55e', tasks: [] },
    ]

    tasks.forEach(t => {
        const col = columns.find(c => c.id === t.status)
        if (col) {
            col.tasks.push({
                id: t.id,
                title: t.title,
                description: t.description || undefined,
                priority: t.priority.toLowerCase() as "low" | "medium" | "high",
                dueDate: t.dueDate ? t.dueDate.toISOString() : undefined,
                assignee: t.assignedDeveloper ? {
                    name: t.assignedDeveloper.name || "User",
                    avatar: t.assignedDeveloper.image || ""
                } : undefined,
                comments: t._count?.comments || 0,
                attachments: t._count?.attachments || 0,
                tags: []
            })
        }
    })

    return columns
}

interface ProjectDetailClientProps {
    project: ProjectWithRelations
    user: {
        id: string
        role: Role
    }
}

export default function ProjectDetailClient({ project, user }: ProjectDetailClientProps) {
    const [createTaskOpen, setCreateTaskOpen] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

    const userRole = user.role
    const userId = user.id

    // Calculate project statistics
    const totalTasks = project.tasks?.length || 0
    const completedTasks = project.tasks?.filter((t) => t.status === TaskStatus.COMPLETED).length || 0
    const myTasks = project.tasks?.filter((t) => t.assignedDeveloper?.id === userId).length || 0
    const myCompletedTasks = project.tasks?.filter((t) => t.assignedDeveloper?.id === userId && t.status === TaskStatus.COMPLETED).length || 0

    const overallProgress = getTaskProgress(project.tasks || [])
    const myTaskProgress = myTasks > 0 ? Math.round((myCompletedTasks / myTasks) * 100) : 0

    const statusConfig = STATUS_CONFIG[project.status as Status] || STATUS_CONFIG[Status.IN_PROGRESS]
    const StatusIcon = statusConfig.icon

    // Role-based permissions
    const isCompanyOwner = userRole === Role.COMPANY_OWNER
    const isTeamHead = userRole === Role.TEAM_HEAD && project.assignedTeams?.some((pt) => pt.team.head?.id === userId)
    const isClient = userRole === Role.CLIENT

    // Client section visibility
    const showClientSection = project.clientType !== ClientType.INTERNAL && !isClient

    const canManage = isCompanyOwner || isTeamHead
    const canCreateTasks = canManage

    const kanbanColumns = getKanbanColumns(project.tasks || [])
    const selectedTask = project.tasks?.find((t) => t.id === selectedTaskId) || null

    const handleMoveTask = async (taskId: string, sourceCol: string, targetCol: string) => {
        if (sourceCol === targetCol) return
        try {
            await updateTask({
                taskId,
                status: targetCol as TaskStatus
            })
            toast.success("Task updated")
        } catch {
            toast.error("Failed to move task")
        }
    }

    return (
        <div className="container mx-auto py-8">
            <CreateTaskSheet
                projectId={project.id}
                projectSlug={project.slug}
                open={createTaskOpen}
                onOpenChange={setCreateTaskOpen}
            />

            <TaskDetailsSheet
                task={selectedTask}
                open={!!selectedTaskId}
                onOpenChange={(open) => !open && setSelectedTaskId(null)}
            />

            <div className="flex items-center justify-between mb-8">
                <Link href="/projects">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Projects
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <ChatSheet slug={project.slug} projectTitle={project.title} />

                    {
                        !isClient && (
                            <FeedbackSheet slug={project.slug} projectTitle={project.title} />
                        )
                    }
                    {
                        canManage && (
                            <Button variant="outline" className="gap-2">
                                <Settings className="w-4 h-4" />
                                Manage
                            </Button>
                        )
                    }
                </div>
            </div>

            <div className="space-y-6 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <h1 className="text-4xl font-bold">{project.title}</h1>
                        <div className="flex items-center gap-2">
                            {
                                project.visibility === ProjectVisibility.PRIVATE && (
                                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                                )
                            }
                            <Badge variant="outline" className={`gap-1 ${statusConfig.textColor}`}>
                                <StatusIcon className="w-3 h-3" />
                                {project.status.toLowerCase().replace('_', ' ')}
                            </Badge>
                        </div>
                    </div>
                    {
                        project.description && (
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {project.description}
                            </p>
                        )
                    }
                </div>
                {
                    (project.livePreviewUrl || project.figmaUrl || project.githubUrl || project.documentsUrl) && (
                        <div className="flex flex-wrap gap-2">
                            {
                                project.livePreviewUrl && (
                                    <Link href={project.livePreviewUrl} target="_blank">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <ExternalLink className="w-4 h-4" />
                                            Live Preview
                                        </Button>
                                    </Link>
                                )
                            }
                            {
                                project.figmaUrl && (
                                    <Link href={project.figmaUrl} target="_blank">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Figma className="w-4 h-4" />
                                            Figma
                                        </Button>
                                    </Link>
                                )
                            }
                            {
                                project.githubUrl && (
                                    <Link href={project.githubUrl} target="_blank">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Github className="w-4 h-4" />
                                            GitHub
                                        </Button>
                                    </Link>
                                )
                            }
                            {
                                project.documentsUrl && (
                                    <Link href={project.documentsUrl} target="_blank">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <File className="w-4 h-4" />
                                            Documents
                                        </Button>
                                    </Link>
                                )
                            }
                        </div>
                    )
                }
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Budget</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(project.budget, project.currency)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {project.clientType === ClientType.EXTERNAL ? 'External Client' : 'Internal Project'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Progress</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallProgress}%</div>
                        <Progress value={overallProgress} className="h-2 mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasks</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTasks}</div>
                        <p className="text-xs text-muted-foreground">
                            {completedTasks} completed
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Teams</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{project.assignedTeams?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {project.members?.length || 0} total members
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    {/* Tasks Section (Replaces Old Task Overview) */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FileText className="w-5 h-5" /> Project Tasks
                            </h2>
                            {canCreateTasks && (
                                <Button onClick={() => setCreateTaskOpen(true)} className="gap-2">
                                    <Plus className="w-4 h-4" /> Create Task
                                </Button>
                            )}
                        </div>
                        <div className="border rounded-xl p-4 bg-muted/20">
                            <KanbanBoard
                                columns={kanbanColumns}
                                onTaskClick={setSelectedTaskId}
                                onMoveTask={handleMoveTask}
                            />
                        </div>
                    </div>

                    {
                        !isClient && myTasks > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        My Tasks in This Project
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-muted-foreground">
                                            {myCompletedTasks} of {myTasks} tasks completed
                                        </span>
                                        <Badge variant="secondary">
                                            {myTaskProgress}% complete
                                        </Badge>
                                    </div>
                                    <Progress value={myTaskProgress} className="h-3" />
                                </CardContent>
                            </Card>
                        )
                    }
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Client Section - Conditionally Rendered */}
                    {
                        showClientSection && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5" />
                                        Client
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={project.user.image || undefined} />
                                            <AvatarFallback>
                                                {project.user.name?.[0] || project.user.email?.[0] || 'C'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">
                                                {project.user.name || project.user.email}
                                            </p>
                                            {
                                                project.user.name && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {project.user.email}
                                                    </p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    }

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Assigned Teams
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {
                                project.assignedTeams?.map((assignment) => {
                                    const IconComponent = TEAM_ICONS[assignment.team.teamType as keyof typeof TEAM_ICONS] || Users
                                    return (
                                        <div key={assignment.id} className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                style={{
                                                    backgroundColor: assignment.team.color ? `${assignment.team.color}20` : '#f1f5f9',
                                                    color: assignment.team.color || '#64748b'
                                                }}
                                            >
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">
                                                    {assignment.team.displayName}
                                                </p>
                                                {
                                                    assignment.team.head && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Led by {assignment.team.head.name}
                                                        </p>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                }) || (
                                    <p className="text-sm text-muted-foreground">No teams assigned</p>
                                )
                            }
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Start Date</span>
                                <span className="text-sm font-medium">
                                    {format(new Date(project.startDate), 'MMM dd, yyyy')}
                                </span>
                            </div>

                            {
                                project.endDate && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">End Date</span>
                                        <span className="text-sm font-medium">
                                            {format(new Date(project.endDate), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                )
                            }

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Created</span>
                                <span className="text-sm font-medium">
                                    {formatDistanceToNow(new Date(project.createdAt))} ago
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Quick Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Messages</span>
                                <Badge variant="outline">
                                    {project._count?.messages || 0}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Feedback Items</span>
                                <Badge variant="outline">
                                    {project._count?.feedbacks || 0}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Last Updated</span>
                                <span className="text-sm font-medium">
                                    {formatDistanceToNow(new Date(project.updatedAt))} ago
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
