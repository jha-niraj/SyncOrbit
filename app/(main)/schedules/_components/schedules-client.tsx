"use client"

import { useState } from "react"
import { format, isSameDay, addDays } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TaskDetailsSheet } from "@/components/projects/task-sheets"
import { TaskWithRelations } from "@/types/task"

interface ScheduleClientProps {
    tasks: TaskWithRelations[]
}

export default function ScheduleClient({ tasks }: ScheduleClientProps) {
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const selectedTask = tasks.find(t => t.id === selectedTaskId) || null

    // Group tasks by date
    const today = new Date()
    const tomorrow = addDays(today, 1)

    const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== "COMPLETED")
    const todayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), today))
    const tomorrowTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), tomorrow))
    const upcomingTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) > tomorrow)
    const noDateTasks = tasks.filter(t => !t.dueDate && t.status !== "COMPLETED")

    const renderTaskGroup = (title: string, groupTasks: TaskWithRelations[], variant: "default" | "destructive" | "secondary" = "default") => {
        if (groupTasks.length === 0) return null

        return (
            <div className="mb-8">
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${variant === "destructive" ? "text-red-500" : ""}`}>
                    {title} <Badge variant={variant}>{groupTasks.length}</Badge>
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groupTasks.map((task) => (
                        <Card
                            key={task.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setSelectedTaskId(task.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="text-xs">
                                        {task.project.title}
                                    </Badge>
                                    <Badge className={
                                        task.priority === "URGENT" ? "bg-red-500" :
                                            task.priority === "HIGH" ? "bg-orange-500" :
                                                "bg-blue-500"
                                    }>{task.priority}</Badge>
                                </div>
                                <h3 className="font-medium mb-1 line-clamp-1">{task.title}</h3>
                                {task.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>}

                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2 border-t">
                                    <div className="flex items-center gap-1">
                                        <CalendarIcon className="w-3 h-3" />
                                        {task.dueDate ? format(new Date(task.dueDate), "MMM d") : "No date"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {task.assignedDeveloper && (
                                            <Avatar className="w-5 h-5">
                                                <AvatarImage src={task.assignedDeveloper.image || undefined} />
                                                <AvatarFallback>{task.assignedDeveloper.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="h-full overflow-y-auto">
            {renderTaskGroup("Overdue", overdueTasks, "destructive")}
            {renderTaskGroup("Today", todayTasks, "default")}
            {renderTaskGroup("Tomorrow", tomorrowTasks, "default")}
            {renderTaskGroup("Upcoming", upcomingTasks, "secondary")}
            {renderTaskGroup("Backlog (No Date)", noDateTasks, "secondary")}

            <TaskDetailsSheet
                task={selectedTask}
                open={!!selectedTaskId}
                onOpenChange={(open: boolean) => !open && setSelectedTaskId(null)}
            />
        </div>
    )
}
