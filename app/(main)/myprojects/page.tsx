import { auth } from "@/auth"
import { getUserProjects } from "@/actions/projects.action"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
    User, Users, DollarSign, EyeOff, Code, Megaphone, ShoppingCart, Palette,
    Briefcase, Settings, MessageSquare, FileText, Plus, Target, Activity
} from "lucide-react"
import { ProjectVisibility, Status, TaskStatus, TeamType, Role } from "@prisma/client"
import { redirect } from "next/navigation"
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

export default async function MyProjectsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    const result = await getUserProjects()

    if (!result.success) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">Failed to load your projects</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            {result.error}
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { projects } = result
    const userRole = session.user.role

    // Calculate user's project statistics
    const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === Status.IN_PROGRESS).length,
        completed: projects.filter(p => p.status === Status.COMPLETED).length,
        onHold: projects.filter(p => p.status === Status.ON_HOLD).length,
        totalTasks: projects.reduce((sum, p) => sum + (p._count?.tasks || 0), 0),
        completedTasks: projects.reduce((sum, p) => sum + p.tasks.filter(t => t.status === TaskStatus.COMPLETED).length, 0),
        myTasks: projects.reduce((sum, p) => sum + p.tasks.filter(t => t.assignedDeveloper?.id === session.user.id).length, 0),
        myCompletedTasks: projects.reduce((sum, p) => sum + p.tasks.filter(t => t.assignedDeveloper?.id === session.user.id && t.status === TaskStatus.COMPLETED).length, 0)
    }

    const overallProgress = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0
    const myTaskProgress = stats.myTasks > 0 ? Math.round((stats.myCompletedTasks / stats.myTasks) * 100) : 0

    // Role-specific title and description
    const getTitleAndDescription = () => {
        switch (userRole) {
            case Role.CLIENT:
                return {
                    title: "My Projects",
                    description: "Track the progress of your commissioned projects"
                }
            case Role.TEAM_MEMBER:
                return {
                    title: "My Assigned Projects",
                    description: "Projects and tasks you're working on"
                }
            case Role.TEAM_HEAD:
                return {
                    title: "My Team's Projects",
                    description: "Projects assigned to teams you lead"
                }
            case Role.COMPANY_OWNER:
                return {
                    title: "My Projects Overview",
                    description: "Personal view of your company's projects"
                }
            default:
                return {
                    title: "My Projects",
                    description: "Your personal project dashboard"
                }
        }
    }

    const { title, description } = getTitleAndDescription()
    const canCreateProjects = userRole === Role.COMPANY_OWNER || userRole === Role.TEAM_HEAD

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="text-muted-foreground mt-1">{description}</p>
                </div>

                {
                    canCreateProjects && (
                        <CreateProjectModal
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
                        <CardTitle className="text-sm font-medium">My Projects</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
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
                        <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallProgress}%</div>
                        <Progress value={overallProgress} className="h-2 mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">All Tasks</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTasks}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.completedTasks} completed
                        </p>
                    </CardContent>
                </Card>
                {
                    userRole !== Role.CLIENT && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
                                <User className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.myTasks}</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Progress value={myTaskProgress} className="h-1 flex-1" />
                                    <span className="text-xs font-medium">{myTaskProgress}%</span>
                                </div>
                            </CardContent>
                        </Card>
                    )
                }
            </div>
            {
                projects.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                            <p className="text-muted-foreground mb-4">
                                {
                                    userRole === Role.CLIENT
                                        ? "You haven't commissioned any projects yet."
                                        : userRole === Role.TEAM_MEMBER
                                            ? "No projects have been assigned to your teams yet."
                                            : "You don't have any projects assigned yet."
                                }
                            </p>
                            {
                                canCreateProjects && (
                                    <CreateProjectModal
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
                                const myTasksInProject = project.tasks.filter(t => t.assignedDeveloper?.id === session.user.id)
                                const myTasksCount = myTasksInProject.length
                                const myCompletedTasksCount = myTasksInProject.filter(t => t.status === TaskStatus.COMPLETED).length

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
                                                        <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[project.status]}`} />
                                                        <span className="text-sm font-medium capitalize">
                                                            {project.status.toLowerCase().replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-0 space-y-4">
                                            {
                                                userRole !== Role.CLIENT && (
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
                                                )
                                            }

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
                                            {
                                                userRole !== Role.CLIENT && myTasksCount > 0 && (
                                                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-muted-foreground">My Tasks</span>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {myCompletedTasksCount}/{myTasksCount}
                                                            </Badge>
                                                        </div>
                                                        <Progress
                                                            value={myTasksCount > 0 ? (myCompletedTasksCount / myTasksCount) * 100 : 0}
                                                            className="h-1"
                                                        />
                                                    </div>
                                                )
                                            }
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Teams</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {
                                                        project.assignedTeams?.slice(0, 3).map((assignment) => {
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