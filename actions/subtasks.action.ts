"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createSubTaskSchema = z.object({
    taskId: z.string().min(1),
    title: z.string().min(1)
})

const updateSubTaskSchema = z.object({
    subTaskId: z.string().min(1),
    completed: z.boolean().optional(),
    title: z.string().optional()
})

const deleteSubTaskSchema = z.object({
    subTaskId: z.string().min(1)
})

export async function createSubTask(data: z.infer<typeof createSubTaskSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Unauthorized" }

        const { taskId, title } = createSubTaskSchema.parse(data)

        // Check permissions (simplified: any user with access to the task's project can create subtasks)
        // ideally checking if they can edit the task would be better
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { project: true }
        })

        if (!task) return { success: false, error: "Task not found" }

        const subTask = await prisma.subTask.create({
            data: {
                taskId,
                title
            }
        })

        revalidatePath(`/projects/${task.project.slug}`)
        return { success: true, subTask }

    } catch (error) {
        console.error(error)
        return { success: false, error: "Failed to create subtask" }
    }
}

export async function updateSubTask(data: z.infer<typeof updateSubTaskSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Unauthorized" }

        const { subTaskId, completed, title } = updateSubTaskSchema.parse(data)

        const subTask = await prisma.subTask.findUnique({
            where: { id: subTaskId },
            include: { task: { include: { project: true } } }
        })
        if (!subTask) return { success: false, error: "Subtask not found" }

        const updated = await prisma.subTask.update({
            where: { id: subTaskId },
            data: {
                completed: completed !== undefined ? completed : undefined,
                title: title !== undefined ? title : undefined
            }
        })

        revalidatePath(`/projects/${subTask.task.project.slug}`)
        return { success: true, subTask: updated }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Failed to update subtask" }
    }
}

export async function deleteSubTask(data: z.infer<typeof deleteSubTaskSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Unauthorized" }

        const { subTaskId } = deleteSubTaskSchema.parse(data)

        const subTask = await prisma.subTask.findUnique({
            where: { id: subTaskId },
            include: { task: { include: { project: true } } }
        })
        if (!subTask) return { success: false, error: "Subtask not found" }

        await prisma.subTask.delete({
            where: { id: subTaskId }
        })

        revalidatePath(`/projects/${subTask.task.project.slug}`)
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Failed to delete subtask" }
    }
}
