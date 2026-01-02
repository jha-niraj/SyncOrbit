"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import KanbanBoard, { Column } from "@/components/kanbanboard"
import { TaskStatus } from "@prisma/client"
import { updateTask } from "@/actions/tasks.action"
import { toast } from "sonner"
import { TaskDetailsSheet } from "@/components/projects/task-sheets"
import { TaskWithRelations } from "@/types/task"

interface TaskboardClientProps {
    tasks: TaskWithRelations[]
}

export default function TaskboardClient({ tasks: initialTasks }: TaskboardClientProps) {
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const router = useRouter()

    const getColumns = (taskList: TaskWithRelations[]): Column[] => {
        const columns: Column[] = [
            { id: TaskStatus.YET_TO_START, title: 'To Do', color: '#64748b', tasks: [] },
            { id: TaskStatus.IN_PROGRESS, title: 'In Progress', color: '#3b82f6', tasks: [] },
            { id: TaskStatus.COMPLETED, title: 'Completed', color: '#22c55e', tasks: [] },
        ]

        taskList.forEach(t => {
            const col = columns.find(c => c.id === t.status)
            if (col) {
                col.tasks.push({
                    id: t.id,
                    title: t.title,
                    description: t.description || undefined,
                    priority: t.priority.toLowerCase() as "low" | "medium" | "high",
                    dueDate: undefined,
                    assignee: t.assignedDeveloper ? {
                        name: t.assignedDeveloper.name || "User",
                        avatar: t.assignedDeveloper.image || ""
                    } : undefined,
                    comments: 0,
                    attachments: 0,
                    tags: [t.project.title] // Tag with Project Name
                })
            }
        })
        return columns
    }

    const columns = getColumns(initialTasks)
    const selectedTask = initialTasks.find(t => t.id === selectedTaskId) || null

    const handleMoveTask = async (taskId: string, sourceCol: string, targetCol: string) => {
        if (sourceCol === targetCol) return
        try {
            await updateTask({
                taskId,
                status: targetCol as TaskStatus
            })
            toast.success("Task updated")
            router.refresh()
        } catch {
            toast.error("Failed to move task")
        }
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-x-auto pb-4">
                <KanbanBoard
                    columns={columns}
                    onTaskClick={setSelectedTaskId}
                    onMoveTask={handleMoveTask}
                />
            </div>
            <TaskDetailsSheet
                task={selectedTask}
                open={!!selectedTaskId}
                onOpenChange={(open: boolean) => {
                    if (!open) setSelectedTaskId(null)
                    if (!open) router.refresh() // Refresh when closing to ensure data consistency
                }}
            />
        </div>
    )
}
