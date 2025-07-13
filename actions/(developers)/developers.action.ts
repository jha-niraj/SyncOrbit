"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { TaskStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schemas for validation
const createTaskSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	projectId: z.string(),
})

const updateTaskStatusSchema = z.object({
	taskId: z.string(),
	status: z.nativeEnum(TaskStatus),
})

const createSubTaskSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	taskId: z.string(),
})

const updateSubTaskSchema = z.object({
	subTaskId: z.string(),
	completed: z.boolean(),
})

const deleteSubTaskSchema = z.object({
	subTaskId: z.string(),
})

const deleteTaskSchema = z.object({
	taskId: z.string(),
})

// Create a new task
export async function createTask(data: z.infer<typeof createTaskSchema>) {
	try {
		const session = await auth()
		if (!session?.user || !['DEVELOPER', 'PRODUCTMANAGER', 'ADMIN'].includes(session.user.role)) {
			return { success: false, error: "Unauthorized" }
		}

		const validatedData = createTaskSchema.parse(data)

		// Verify user has access to this project
		const project = await prisma.project.findFirst({
			where: {
				id: validatedData.projectId,
				OR: [
					{ user: { id: session.user.id } },
					{ tasks: { some: { assignedDeveloperId: session.user.id } } }
				]
			}
		})

		if (!project) {
			return { success: false, error: "Project not found or access denied" }
		}

		const task = await prisma.task.create({
			data: {
				title: validatedData.title,
				description: validatedData.description,
				projectId: validatedData.projectId,
				assignedDeveloperId: session.user.id,
				status: TaskStatus.YET_TO_START,
			},
			include: {
				assignedDeveloper: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					}
				},
				subtasks: true,
			}
		})

		revalidatePath(`/projects/${project.slug}`)
		return { success: true, task }
	} catch (error) {
		console.error("Create task error:", error)
		return { success: false, error: "Failed to create task" }
	}
}

// Update task status (for Kanban)
export async function updateTaskStatus(data: z.infer<typeof updateTaskStatusSchema>) {
	try {
		const session = await auth()
		if (!session?.user || !['DEVELOPER', 'PRODUCTMANAGER', 'ADMIN'].includes(session.user.role)) {
			return { success: false, error: "Unauthorized" }
		}

		const validatedData = updateTaskStatusSchema.parse(data)

		// Verify user has access to this task
		const task = await prisma.task.findFirst({
			where: {
				id: validatedData.taskId,
				OR: [
					{ assignedDeveloperId: session.user.id },
					{ project: { user: { id: session.user.id } } }
				]
			},
			include: {
				project: true,
			}
		})

		if (!task) {
			return { success: false, error: "Task not found or access denied" }
		}

		const updatedTask = await prisma.task.update({
			where: { id: validatedData.taskId },
			data: { status: validatedData.status },
			include: {
				assignedDeveloper: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					}
				},
				subtasks: true,
			}
		})

		revalidatePath(`/projects/${task.project.slug}`)
		return { success: true, task: updatedTask }
	} catch (error) {
		console.error("Update task status error:", error)
		return { success: false, error: "Failed to update task status" }
	}
}

// Create a subtask
export async function createSubTask(data: z.infer<typeof createSubTaskSchema>) {
	try {
		const session = await auth()
		if (!session?.user || !['DEVELOPER', 'PRODUCTMANAGER', 'ADMIN'].includes(session.user.role)) {
			return { success: false, error: "Unauthorized" }
		}

		const validatedData = createSubTaskSchema.parse(data)

		// Verify user has access to this task
		const task = await prisma.task.findFirst({
			where: {
				id: validatedData.taskId,
				OR: [
					{ assignedDeveloperId: session.user.id },
					{ project: { user: { id: session.user.id } } }
				]
			},
			include: {
				project: true,
			}
		})

		if (!task) {
			return { success: false, error: "Task not found or access denied" }
		}

		const subTask = await prisma.subTask.create({
			data: {
				title: validatedData.title,
				description: validatedData.description,
				taskId: validatedData.taskId,
			}
		})

		revalidatePath(`/projects/${task.project.slug}`)
		return { success: true, subTask }
	} catch (error) {
		console.error("Create subtask error:", error)
		return { success: false, error: "Failed to create subtask" }
	}
}

// Update subtask completion status
export async function updateSubTask(data: z.infer<typeof updateSubTaskSchema>) {
	try {
		const session = await auth()
		if (!session?.user || !['DEVELOPER', 'PRODUCTMANAGER', 'ADMIN'].includes(session.user.role)) {
			return { success: false, error: "Unauthorized" }
		}

		const validatedData = updateSubTaskSchema.parse(data)

		// Verify user has access to this subtask
		const subTask = await prisma.subTask.findFirst({
			where: {
				id: validatedData.subTaskId,
				task: {
					OR: [
						{ assignedDeveloperId: session.user.id },
						{ project: { user: { id: session.user.id } } }
					]
				}
			},
			include: {
				task: {
					include: {
						project: true,
					}
				}
			}
		})

		if (!subTask) {
			return { success: false, error: "Subtask not found or access denied" }
		}

		const updatedSubTask = await prisma.subTask.update({
			where: { id: validatedData.subTaskId },
			data: { completed: validatedData.completed },
		})

		revalidatePath(`/projects/${subTask.task.project.slug}`)
		return { success: true, subTask: updatedSubTask }
	} catch (error) {
		console.error("Update subtask error:", error)
		return { success: false, error: "Failed to update subtask" }
	}
}

// Delete a subtask
export async function deleteSubTask(data: z.infer<typeof deleteSubTaskSchema>) {
	try {
		const session = await auth()
		if (!session?.user || !['DEVELOPER', 'PRODUCTMANAGER', 'ADMIN'].includes(session.user.role)) {
			return { success: false, error: "Unauthorized" }
		}

		const validatedData = deleteSubTaskSchema.parse(data)

		// Verify user has access to this subtask
		const subTask = await prisma.subTask.findFirst({
			where: {
				id: validatedData.subTaskId,
				task: {
					OR: [
						{ assignedDeveloperId: session.user.id },
						{ project: { user: { id: session.user.id } } }
					]
				}
			},
			include: {
				task: {
					include: {
						project: true,
					}
				}
			}
		})

		if (!subTask) {
			return { success: false, error: "Subtask not found or access denied" }
		}

		await prisma.subTask.delete({
			where: { id: validatedData.subTaskId }
		})

		revalidatePath(`/projects/${subTask.task.project.slug}`)
		return { success: true }
	} catch (error) {
		console.error("Delete subtask error:", error)
		return { success: false, error: "Failed to delete subtask" }
	}
}

// Delete a task
export async function deleteTask(data: z.infer<typeof deleteTaskSchema>) {
	try {
		const session = await auth()
		if (!session?.user || !['DEVELOPER', 'PRODUCTMANAGER', 'ADMIN'].includes(session.user.role)) {
			return { success: false, error: "Unauthorized" }
		}

		const validatedData = deleteTaskSchema.parse(data)

		// Verify user has access to this task
		const task = await prisma.task.findFirst({
			where: {
				id: validatedData.taskId,
				OR: [
					{ assignedDeveloperId: session.user.id },
					{ project: { user: { id: session.user.id } } }
				]
			},
			include: {
				project: true,
			}
		})

		if (!task) {
			return { success: false, error: "Task not found or access denied" }
		}

		await prisma.task.delete({
			where: { id: validatedData.taskId }
		})

		revalidatePath(`/projects/${task.project.slug}`)
		return { success: true }
	} catch (error) {
		console.error("Delete task error:", error)
		return { success: false, error: "Failed to delete task" }
	}
}

// Get task with subtasks
export async function getTaskWithSubTasks(taskId: string) {
	try {
		const session = await auth()
		if (!session?.user) {
			return { success: false, error: "Unauthorized" }
		}

		const task = await prisma.task.findFirst({
			where: {
				id: taskId,
				OR: [
					{ assignedDeveloperId: session.user.id },
					{ project: { user: { id: session.user.id } } }
				]
			},
			include: {
				assignedDeveloper: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					}
				},
				subtasks: {
					orderBy: { createdAt: 'asc' }
				},
				project: {
					select: {
						id: true,
						title: true,
						slug: true,
					}
				}
			}
		})

		if (!task) {
			return { success: false, error: "Task not found or access denied" }
		}

		return { success: true, task }
	} catch (error) {
		console.error("Get task with subtasks error:", error)
		return { success: false, error: "Failed to get task details" }
	}
}