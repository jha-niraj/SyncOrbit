"use client"

import { useState } from "react"
import { Task, TaskCard } from "./task-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TaskBoardProps {
    initialTasks: Task[]
}

export function TaskBoard({ initialTasks }: TaskBoardProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)

    const columns = [
        { id: "yetToStart", title: "To Start" },
        { id: "inProgress", title: "In Progress" },
        { id: "completed", title: "Completed" }
    ] as const

    const handleDragStart = (e: React.DragEvent, task: Task) => {
        e.dataTransfer.setData("taskId", task.id)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent, status: Task["status"]) => {
        e.preventDefault()
        const taskId = e.dataTransfer.getData("taskId")
        
        setTasks(tasks.map(task => 
            task.id === taskId 
                ? { ...task, status } 
                : task
        ))
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Task Board</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {columns.map(column => {
                    const columnTasks = tasks.filter(task => task.status === column.id)
                    
                    return (
                        <Card 
                            key={column.id}
                            className="bg-muted/50"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.id)}
                        >
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {column.title}
                                    <span className="ml-2 text-sm text-muted-foreground">
                                        ({columnTasks.length})
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {columnTasks.map(task => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onDragStart={handleDragStart}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
} 