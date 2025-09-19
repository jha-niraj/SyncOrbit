import { auth } from "@/auth"
import { getProjectBySlug } from "@/actions/projects.action"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
    ArrowLeft, DollarSign, Users, Calendar, Eye, EyeOff, Settings,
    Code, Megaphone, ShoppingCart, Palette, Briefcase, Settings as SettingsIcon,
    MessageSquare, FileText, CheckCircle, Clock, AlertCircle, Target,
    MessageCircle, Plus, Edit, MoreVertical, TrendingUp, Activity,
    Building2, User, Star, ExternalLink, Github, Figma, File,
    BarChart3, PieChart, LineChart
} from "lucide-react"
import { ProjectVisibility, Status, TaskStatus, TeamType, Role, ClientType } from "@prisma/client"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"

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

function getTaskProgress(tasks: any[]) {
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

interface ProjectDetailProps {
    params: Promise<{ slug: string }>
}

export default async function ProjectDetail({ params }: ProjectDetailProps) {
    const session = await auth()
    const { slug } = await params
    
    if (!session?.user) {
        redirect('/signin')
    }

    const result = await getProjectBySlug(slug)
    
    if (!result.success || !result.project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="py-8 text-center">
                        <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">Project Not Found</h3>
                        <p className="text-muted-foreground mb-4">
                            {result.error || "The project you're looking for doesn't exist or you don't have access to it."}
                        </p>
                        <Link href="/projects">
                            <Button className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Projects
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { project } = result
    const userRole = session.user.role
    const userId = session.user.id

    // Calculate project statistics
    const totalTasks = project.tasks?.length || 0
    const completedTasks = project.tasks?.filter(t => t.status === TaskStatus.COMPLETED).length || 0
    const myTasks = project.tasks?.filter(t => t.assignedDeveloper?.id === userId).length || 0
    const myCompletedTasks = project.tasks?.filter(t => t.assignedDeveloper?.id === userId && t.status === TaskStatus.COMPLETED).length || 0
    
    const overallProgress = getTaskProgress(project.tasks || [])
    const myTaskProgress = myTasks > 0 ? Math.round((myCompletedTasks / myTasks) * 100) : 0

    const statusConfig = STATUS_CONFIG[project.status]
    const StatusIcon = statusConfig.icon

    // Role-based permissions
    const isOwner = project.userId === userId
    const isCompanyOwner = userRole === Role.COMPANY_OWNER
    const isTeamHead = userRole === Role.TEAM_HEAD && project.assignedTeams?.some(pt => pt.team.head?.id === userId)
    const isTeamMember = userRole === Role.TEAM_MEMBER
    const isClient = userRole === Role.CLIENT

    const canManage = isCompanyOwner || isTeamHead
    const canViewAllTasks = canManage || isClient
    const canCreateTasks = canManage

    return (
        <div className="container mx-auto py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/projects">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Projects
                    </Button>
                </Link>
                
                <div className="flex items-center gap-2">
                    <Link href={`/projects/${slug}/chat`}>
                        <Button variant="outline" className="gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Chat
                        </Button>
                    </Link>
                    
                    {!isClient && (
                        <Link href={`/projects/${slug}/feedback`}>
                            <Button variant="outline" className="gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Feedback
                            </Button>
                        </Link>
                    )}
                    
                    {canManage && (
                        <Button variant="outline" className="gap-2">
                            <Settings className="w-4 h-4" />
                            Manage
                        </Button>
                    )}
                </div>
            </div>

            {/* Project Header */}
            <div className="space-y-6 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <h1 className="text-4xl font-bold">{project.title}</h1>
                        <div className="flex items-center gap-2">
                            {project.visibility === ProjectVisibility.PRIVATE && (
                                <EyeOff className="w-5 h-5 text-muted-foreground" />
                            )}
                            <Badge variant="outline" className={`gap-1 ${statusConfig.textColor}`}>
                                <StatusIcon className="w-3 h-3" />
                                {project.status.toLowerCase().replace('_', ' ')}
                            </Badge>
                        </div>
                    </div>
                    
                    {project.description && (
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {project.description}
                        </p>
                    )}
                </div>

                {/* Project Links */}
                {(project.livePreviewUrl || project.figmaUrl || project.githubUrl || project.documentsUrl) && (
                    <div className="flex flex-wrap gap-2">
                        {project.livePreviewUrl && (
                            <Link href={project.livePreviewUrl} target="_blank">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    Live Preview
                                </Button>
                            </Link>
                        )}
                        {project.figmaUrl && (
                            <Link href={project.figmaUrl} target="_blank">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Figma className="w-4 h-4" />
                                    Figma
                                </Button>
                            </Link>
                        )}
                        {project.githubUrl && (
                            <Link href={project.githubUrl} target="_blank">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Github className="w-4 h-4" />
                                    GitHub
                                </Button>
                            </Link>
                        )}
                        {project.documentsUrl && (
                            <Link href={project.documentsUrl} target="_blank">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <File className="w-4 h-4" />
                                    Documents
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Key Metrics */}
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
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* My Tasks (for non-clients) */}
                    {!isClient && myTasks > 0 && (
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
                    )}

                    {/* Recent Feedback */}
                    {project.feedbacks && project.feedbacks.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Recent Feedback
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {project.feedbacks.slice(0, 3).map((feedback: any, index: number) => (
                                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={feedback.user?.image} />
                                                <AvatarFallback>
                                                    {feedback.user?.name?.[0] || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-sm">{feedback.message}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-muted-foreground">
                                                        {feedback.user?.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">•</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(feedback.createdAt))} ago
                                                    </span>
                                                    {feedback.rating && (
                                                        <>
                                                            <span className="text-xs text-muted-foreground">•</span>
                                                            <div className="flex items-center gap-1">
                                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                <span className="text-xs">{feedback.rating}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {project.feedbacks.length > 3 && (
                                    <div className="pt-2 border-t">
                                        <Link href={`/projects/${slug}/feedback`}>
                                            <Button variant="outline" size="sm">
                                                View All {project.feedbacks.length} Feedback Items
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Task Overview */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Task Overview
                                </CardTitle>
                                {canCreateTasks && (
                                    <Button size="sm" className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Add Task
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-3">
                                    {Object.values(TaskStatus).map((status) => {
                                        const count = project.tasks?.filter(t => t.status === status).length || 0
                                        const statusConfig = {
                                            [TaskStatus.YET_TO_START]: { color: 'text-gray-600', bg: 'bg-gray-100' },
                                            [TaskStatus.IN_PROGRESS]: { color: 'text-blue-600', bg: 'bg-blue-100' },
                                            [TaskStatus.COMPLETED]: { color: 'text-green-600', bg: 'bg-green-100' },
                                        }[status] || { color: 'text-gray-600', bg: 'bg-gray-100' }
                                        
                                        return (
                                            <div key={status} className="flex items-center justify-between">
                                                <span className="text-sm capitalize">
                                                    {status.toLowerCase().replace('_', ' ')}
                                                </span>
                                                <Badge variant="secondary" className={`${statusConfig.color} ${statusConfig.bg}`}>
                                                    {count}
                                                </Badge>
                                            </div>
                                        )
                                    })}
                                </div>
                                
                                <div className="flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-primary mb-2">
                                            {overallProgress}%
                                        </div>
                                        <p className="text-sm text-muted-foreground">Complete</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Client Information */}
                    {!isClient && (
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
                                        {project.user.name && (
                                            <p className="text-sm text-muted-foreground">
                                                {project.user.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Assigned Teams */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Assigned Teams
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {project.assignedTeams?.map((assignment: any) => {
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
                                            {assignment.team.head && (
                                                <p className="text-xs text-muted-foreground">
                                                    Led by {assignment.team.head.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )
                            }) || (
                                <p className="text-sm text-muted-foreground">No teams assigned</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Project Timeline */}
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
                            
                            {project.endDate && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">End Date</span>
                                    <span className="text-sm font-medium">
                                        {format(new Date(project.endDate), 'MMM dd, yyyy')}
                                    </span>
                                </div>
                            )}
                            
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Created</span>
                                <span className="text-sm font-medium">
                                    {formatDistanceToNow(new Date(project.createdAt))} ago
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
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