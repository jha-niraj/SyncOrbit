"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Target, DollarSign, Calendar } from "lucide-react"
import { formatCurrency } from "@/store/useProjectStore"
import { Status } from "@prisma/client"

interface PMProjectCardProps {
    project: {
        id: string
        title: string
        slug: string
        description: string | null
        status: string
        budget: number
        paidAmount: number
        currency: string
        createdAt: Date
        user: {
            id: string
            name: string | null
            email: string | null
            image: string | null
        }
        tasks: {
            id: string
            title: string
            status: string
        }[]
    }
}

export function PMProjectCard({ project }: PMProjectCardProps) {
    const completedTasks = project.tasks.filter((task) => task.status === 'COMPLETED').length
    const totalTasks = project.tasks.length
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    const paymentProgress = project.budget > 0 ? (project.paidAmount / project.budget) * 100 : 0

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <Link href={`/projects/${project.slug}`} className="hover:underline">
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                        </Link>
                        <CardDescription className="line-clamp-2">
                            {project.description || "No description provided"}
                        </CardDescription>
                    </div>
                    <Badge
                        className={`${project.status === Status.COMPLETED ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                    >
                        {project.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Progress</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{completedTasks} / {totalTasks} tasks</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Payment</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{formatCurrency(project.paidAmount, project.currency)}</span>
                                    <span>{Math.round(paymentProgress)}%</span>
                                </div>
                                <Progress value={paymentProgress} className="h-2" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={project.user.image || undefined} />
                                <AvatarFallback className="text-xs">
                                    {project.user.name?.charAt(0) || 'C'}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{project.user.name}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
