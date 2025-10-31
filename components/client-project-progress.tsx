"use client"

import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs"
import {
    Users, Clock, CheckCircle, AlertTriangle,
    Calendar, Target, Activity, MessageSquare, Code, Megaphone, ShoppingCart,
    Palette, Briefcase, Settings, Star
} from "lucide-react"
import { TaskStatus, TeamType, Status } from "@prisma/client"
import { formatDistanceToNow, format, differenceInDays } from "date-fns"

// Team type icons
const TEAM_ICONS = {
    [TeamType.TECHNICAL]: Code,
    [TeamType.MARKETING]: Megaphone,
    [TeamType.SALES]: ShoppingCart,
    [TeamType.DESIGN]: Palette,
    [TeamType.OPERATIONS]: Settings,
    [TeamType.FINANCE]: Briefcase,
    [TeamType.CUSTOM]: Users,
}

interface ProjectData {
    id: string
    title: string
    description?: string
    status: Status
    budget: number
    currency: string
    startDate: Date
    endDate?: Date
    assignedTeams: Array<{
        id: string
        team: {
            id: string
            displayName: string
            teamType: TeamType
            color?: string
            head: {
                id: string
                name: string
                image?: string
            }
        }
    }>
    tasks: Array<{
        id: string
        title: string
        status: TaskStatus
        priority: string
        assignedTeam: {
            id: string
            displayName: string
            teamType: TeamType
            color?: string
        }
        assignedDeveloper?: {
            id: string
            name: string
            image?: string
        }
        dueDate?: Date
        estimatedHours?: number
        actualHours?: number
    }>
    feedbacks: Array<{
        id: string
        message: string
        rating?: number
        createdAt: Date
        user: {
            name: string
            image?: string
        }
    }>
    messages: Array<{
        id: string
        content: string
        createdAt: Date
        user: {
            name: string
            image?: string
        }
    }>
    createdAt: Date
    updatedAt: Date
}

interface ClientProjectProgressProps {
    project: ProjectData
}

export function ClientProjectProgress({ project }: ClientProjectProgressProps) {
    // Calculate overall progress metrics
    const totalTasks = project.tasks.length
    const completedTasks = project.tasks.filter(t => t.status === TaskStatus.COMPLETED).length
    const inProgressTasks = project.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length
    // const yetToStartTasks = project.tasks.filter(t => t.status === TaskStatus.YET_TO_START).length
    const overdueTasks = project.tasks.filter(t =>
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== TaskStatus.COMPLETED
    ).length

    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Timeline calculations
    const daysSinceStart = differenceInDays(new Date(), new Date(project.startDate))
    const totalDuration = project.endDate ? differenceInDays(new Date(project.endDate), new Date(project.startDate)) : null
    const daysRemaining = project.endDate ? Math.max(0, differenceInDays(new Date(project.endDate), new Date())) : null
    const timelineProgress = totalDuration ? Math.min(100, Math.round((daysSinceStart / totalDuration) * 100)) : 0

    // Team-specific progress
    const teamProgress = project.assignedTeams.map(assignment => {
        const teamTasks = project.tasks.filter(t => t.assignedTeam.id === assignment.team.id)
        const teamCompleted = teamTasks.filter(t => t.status === TaskStatus.COMPLETED).length
        const teamInProgress = teamTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length
        const teamProgress = teamTasks.length > 0 ? Math.round((teamCompleted / teamTasks.length) * 100) : 0

        return {
            team: assignment.team,
            totalTasks: teamTasks.length,
            completedTasks: teamCompleted,
            inProgressTasks: teamInProgress,
            progress: teamProgress,
            tasks: teamTasks
        }
    })

    // Recent activity (last 7 days)
    const recentFeedbacks = project.feedbacks
        .filter(f => differenceInDays(new Date(), new Date(f.createdAt)) <= 7)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const recentMessages = project.messages
        .filter(m => differenceInDays(new Date(), new Date(m.createdAt)) <= 7)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Health indicators
    const getHealthStatus = () => {
        if (overdueTasks > totalTasks * 0.2) {
            return { status: 'critical', color: 'text-red-600 bg-red-100', icon: AlertTriangle }
        }
        if (overdueTasks > 0 || (daysRemaining !== null && daysRemaining < totalDuration! * 0.1)) {
            return { status: 'warning', color: 'text-yellow-600 bg-yellow-100', icon: Clock }
        }
        return { status: 'healthy', color: 'text-green-600 bg-green-100', icon: CheckCircle }
    }

    const health = getHealthStatus()
    const HealthIcon = health.icon

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">{project.title}</h2>
                        {
                            project.description && (
                                <p className="text-muted-foreground mt-1">{project.description}</p>
                            )
                        }
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`gap-1 ${health.color}`}>
                            <HealthIcon className="w-3 h-3" />
                            Project {health.status}
                        </Badge>
                        <Badge variant="secondary">
                            {project.status.toLowerCase().replace('_', ' ')}
                        </Badge>
                    </div>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallProgress}%</div>
                        <Progress value={overallProgress} className="h-2 mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                            {completedTasks} of {totalTasks} tasks completed
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Timeline Progress</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{timelineProgress}%</div>
                        <Progress value={timelineProgress} className="h-2 mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                            {
                                daysRemaining !== null
                                    ? `${daysRemaining} days remaining`
                                    : 'No end date set'
                            }
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Work</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressTasks}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            tasks in progress
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team Count</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{project.assignedTeams.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            teams working
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Tabs defaultValue="teams" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="teams">Team Progress</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>
                <TabsContent value="teams" className="space-y-4">
                    <div className="grid gap-4">
                        {
                            teamProgress.map((team) => {
                                const TeamIcon = TEAM_ICONS[team.team.teamType] || Users
                                return (
                                    <Card key={team.team.id}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                        style={{
                                                            backgroundColor: team.team.color ? `${team.team.color}20` : '#f1f5f9',
                                                            color: team.team.color || '#64748b'
                                                        }}
                                                    >
                                                        <TeamIcon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{team.team.displayName}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Led by {team.team.head.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="text-sm">
                                                    {team.progress}% Complete
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <Progress value={team.progress} className="h-3" />

                                                <div className="grid grid-cols-3 gap-4 text-center">
                                                    <div>
                                                        <div className="text-2xl font-bold text-green-600">
                                                            {team.completedTasks}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">Completed</p>
                                                    </div>
                                                    <div>
                                                        <div className="text-2xl font-bold text-blue-600">
                                                            {team.inProgressTasks}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">In Progress</p>
                                                    </div>
                                                    <div>
                                                        <div className="text-2xl font-bold">
                                                            {team.totalTasks}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">Total Tasks</p>
                                                    </div>
                                                </div>

                                                {
                                                    team.tasks.length > 0 && (
                                                        <div className="pt-2 border-t">
                                                            <h4 className="text-sm font-medium mb-2">Recent Tasks</h4>
                                                            <div className="space-y-2">
                                                                {
                                                                    team.tasks.slice(0, 3).map((task) => (
                                                                        <div key={task.id} className="flex items-center justify-between">
                                                                            <span className="text-sm line-clamp-1">
                                                                                {task.title}
                                                                            </span>
                                                                            <Badge
                                                                                variant={task.status === TaskStatus.COMPLETED ? 'default' : 'secondary'}
                                                                                className="text-xs"
                                                                            >
                                                                                {task.status.toLowerCase().replace('_', ' ')}
                                                                            </Badge>
                                                                        </div>
                                                                    ))
                                                                }
                                                                {
                                                                    team.tasks.length > 3 && (
                                                                        <p className="text-xs text-muted-foreground">
                                                                            +{team.tasks.length - 3} more tasks
                                                                        </p>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </TabsContent>
                <TabsContent value="timeline" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Project Started</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(project.startDate), 'MMMM dd, yyyy')}
                                        </p>
                                    </div>
                                    <Badge variant="outline">{daysSinceStart} days ago</Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Timeline Progress</span>
                                        <span className="text-sm font-medium">{timelineProgress}%</span>
                                    </div>
                                    <Progress value={timelineProgress} className="h-2" />
                                </div>
                                {
                                    project.endDate && (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">Target Completion</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(new Date(project.endDate), 'MMMM dd, yyyy')}
                                                </p>
                                            </div>
                                            <Badge variant={daysRemaining! < 7 ? 'destructive' : 'outline'}>
                                                {daysRemaining} days left
                                            </Badge>
                                        </div>
                                    )
                                }
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="activity" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Recent Feedback
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {
                                    recentFeedbacks.length > 0 ? (
                                        <div className="space-y-4">
                                            {
                                                recentFeedbacks.slice(0, 3).map((feedback) => (
                                                    <div key={feedback.id} className="space-y-2">
                                                        <div className="flex items-start gap-2">
                                                            <Avatar className="w-8 h-8">
                                                                <AvatarImage src={feedback.user.image} />
                                                                <AvatarFallback>
                                                                    {feedback.user.name[0]}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                <p className="text-sm">{feedback.message}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {feedback.user.name}
                                                                    </span>
                                                                    {
                                                                        feedback.rating && (
                                                                            <div className="flex items-center gap-1">
                                                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                                <span className="text-xs">{feedback.rating}</span>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {formatDistanceToNow(new Date(feedback.createdAt))} ago
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No recent feedback
                                        </p>
                                    )
                                }
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Project Messages
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {
                                    recentMessages.length > 0 ? (
                                        <div className="space-y-4">
                                            {
                                                recentMessages.slice(0, 3).map((message) => (
                                                    <div key={message.id} className="space-y-2">
                                                        <div className="flex items-start gap-2">
                                                            <Avatar className="w-8 h-8">
                                                                <AvatarImage src={message.user.image} />
                                                                <AvatarFallback>
                                                                    {message.user.name[0]}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                <p className="text-sm">{message.content}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {message.user.name}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {formatDistanceToNow(new Date(message.createdAt))} ago
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No recent messages
                                        </p>
                                    )
                                }
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="feedback" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Feedback History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                project.feedbacks.length > 0 ? (
                                    <div className="space-y-4">
                                        {
                                            project.feedbacks.map((feedback) => (
                                                <div key={feedback.id} className="border rounded-lg p-4">
                                                    <div className="flex items-start gap-3">
                                                        <Avatar className="w-10 h-10">
                                                            <AvatarImage src={feedback.user.image} />
                                                            <AvatarFallback>
                                                                {feedback.user.name[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="font-medium">{feedback.user.name}</span>
                                                                {
                                                                    feedback.rating && (
                                                                        <div className="flex items-center gap-1">
                                                                            {
                                                                                Array.from({ length: 5 }).map((_, i) => (
                                                                                    <Star
                                                                                        key={i}
                                                                                        className={`w-4 h-4 ${i < feedback.rating!
                                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                                : 'text-gray-300'
                                                                                            }`}
                                                                                    />
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    )
                                                                }
                                                                <span className="text-sm text-muted-foreground">
                                                                    {formatDistanceToNow(new Date(feedback.createdAt))} ago
                                                                </span>
                                                            </div>
                                                            <p className="text-sm">{feedback.message}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No feedback yet</p>
                                )
                            }
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}