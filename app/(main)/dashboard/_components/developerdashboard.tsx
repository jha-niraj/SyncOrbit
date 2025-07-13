"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, AlertCircle, Users, Target, Code2 } from "lucide-react"
import { TaskStatus } from "@prisma/client"

/* eslint-disable @typescript-eslint/no-explicit-any */
interface DeveloperDashboardProps {
    data: {
        user: {
            id: string
            name: string | null
            email: string | null
            role: string
            skills: string | null
        }
        projects: any[]
        taskStats: {
            total: number
            completed: number
            inProgress: number
            yetToStart: number
        }
        projectStats: {
            total: number
            inProgress: number
            completed: number
            onHold: number
            cancelled: number
        }
    }
    userRole: string
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export function DeveloperDashboard({ data, userRole }: DeveloperDashboardProps) {
    const getTaskStatusColor = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.COMPLETED:
                return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300"
            case TaskStatus.IN_PROGRESS:
                return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
            case TaskStatus.YET_TO_START:
                return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-bl dark:from-black dark:via-gray-900 dark:to-black">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col space-y-8">
                    {/* Header */}
                    <div className="flex flex-col space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Welcome back, {data.user.name}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Here&apos;s an overview of your assigned projects and tasks.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <motion.div 
                        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" 
                        variants={container} 
                        initial="hidden" 
                        animate="show"
                    >
                        <motion.div variants={item}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                                    <Code2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{data.taskStats.total}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Across {data.projectStats.total} projects
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div variants={item}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">{data.taskStats.completed}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {data.taskStats.total > 0 ? Math.round((data.taskStats.completed / data.taskStats.total) * 100) : 0}% completion rate
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div variants={item}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                                    <Clock className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">{data.taskStats.inProgress}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Currently working on
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div variants={item}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                                    <AlertCircle className="h-4 w-4 text-orange-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-orange-600">{data.taskStats.yetToStart}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Ready to start
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                    <Separator className="bg-gray-200 dark:bg-gray-800" />

                    {/* Projects and Tasks */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Assigned Projects */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                    Your Projects
                                </h2>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {data.projects.length} assigned
                                </span>
                            </div>
                            <div className="grid gap-6">
                                {data.projects.map((project: any) => {
                                    const taskProgress = project.tasks.length > 0 
                                        ? (project.tasks.filter((t: any) => t.status === 'COMPLETED').length / project.tasks.length) * 100 
                                        : 0;

                                    return (
                                        <motion.div key={project.id} variants={item}>
                                            <Card className="hover:shadow-lg transition-shadow">
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                                                            <CardDescription className="text-sm">
                                                                Client: {project.user.name || project.user.email}
                                                            </CardDescription>
                                                        </div>
                                                        <Badge className={`${getTaskStatusColor(project.status)} border`}>
                                                            {project.status.replace('_', ' ')}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-600 dark:text-gray-400">Your Tasks Progress</span>
                                                            <span className="font-medium">{Math.round(taskProgress)}%</span>
                                                        </div>
                                                        <Progress value={taskProgress} className="h-2" />
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4 text-center">
                                                        <div>
                                                            <p className="text-lg font-bold text-blue-600">
                                                                {project.tasks.filter((t: any) => t.status === 'IN_PROGRESS').length}
                                                            </p>
                                                            <p className="text-xs text-gray-500">In Progress</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-bold text-green-600">
                                                                {project.tasks.filter((t: any) => t.status === 'COMPLETED').length}
                                                            </p>
                                                            <p className="text-xs text-gray-500">Completed</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-bold text-orange-600">
                                                                {project.tasks.filter((t: any) => t.status === 'YET_TO_START').length}
                                                            </p>
                                                            <p className="text-xs text-gray-500">Pending</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-4">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={project.user.image || "/placeholder.svg"} />
                                                                <AvatarFallback className="text-xs">
                                                                    {project.user.name?.charAt(0) || 'C'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                {project.user.name || 'Client'}
                                                            </span>
                                                        </div>
                                                        <Link href={`/projects/${project.slug}`}>
                                                            <Button variant="outline" size="sm">
                                                                View Project
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Info & Recent Tasks */}
                        <div className="space-y-6">
                            {/* Developer Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Your Profile
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Role</div>
                                        <Badge variant="outline" className="mt-1">
                                            {userRole}
                                        </Badge>
                                    </div>
                                    {data.user.skills && (
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Skills</div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {data.user.skills}
                                            </p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-blue-600">{data.projectStats.total}</p>
                                            <p className="text-xs text-gray-500">Projects</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-green-600">{data.taskStats.total}</p>
                                            <p className="text-xs text-gray-500">Total Tasks</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Tasks */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Recent Tasks
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {data.projects.slice(0, 3).map((project: any) => (
                                            project.tasks.slice(0, 2).map((task: any) => (
                                                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border">
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        task.status === 'COMPLETED' ? 'bg-green-500' :
                                                        task.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                                                        'bg-gray-400'
                                                    }`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {task.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {project.title}
                                                        </p>
                                                    </div>
                                                    <Badge className={`${getTaskStatusColor(task.status)} border text-xs`}>
                                                        {task.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                            ))
                                        ))}
                                        {data.projects.length === 0 && (
                                            <p className="text-sm text-gray-500 text-center py-4">
                                                No recent tasks
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 