"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"

export interface Task {
    id: string
    title: string
    description: string
    status: "yetToStart" | "inProgress" | "completed"
    priority: "low" | "medium" | "high"
    dueDate: string
    assignee: {
        id: string
        name: string
        avatar: string
    }
}

interface TaskCardProps {
    task: Task
    onDragStart?: (e: React.DragEvent, task: Task) => void
}

export function TaskCard({ task, onDragStart }: TaskCardProps) {
    const priorityColors = {
        low: "bg-green-500/10 text-green-500 border-green-500/20",
        medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        high: "bg-red-500/10 text-red-500 border-red-500/20"
    }

    const statusColors = {
        yetToStart: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        inProgress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        completed: "bg-green-500/10 text-green-500 border-green-500/20"
    }

    const statusLabels = {
        yetToStart: "To Start",
        inProgress: "In Progress",
        completed: "Completed"
    }

    return (
        <Card 
            className="cursor-move hover:shadow-md transition-shadow"
            draggable
            onDragStart={(e) => onDragStart?.(e, task)}
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{task.title}</CardTitle>
                    <Badge variant="outline" className={priorityColors[task.priority]}>
                        {task.priority}
                    </Badge>
                </div>
                <CardDescription className="mt-2">
                    <Badge variant="outline" className={statusColors[task.status]}>
                        {statusLabels[task.status]}
                    </Badge>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    {task.description}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={task.assignee.avatar} />
                            <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                            {task.assignee.name}
                        </span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span className="text-xs">{formatDate(task.dueDate)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 