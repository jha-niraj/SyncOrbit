"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, CheckCircle, ListTodo, GripVertical } from "lucide-react"
import { TaskStatus } from "@prisma/client"
import { updateTaskStatus } from "@/actions/(developers)/developers.action"
import { toast } from "sonner"
import { TaskManagementSheet } from "@/app/(main)/projects/[slug]/_components/TaskManagementSheet"

interface Task {
	id: string
	title: string
	description: string | null
	status: TaskStatus
	assignedDeveloper?: {
		id: string
		name: string | null
		image: string | null
	} | null
	subtasks?: Array<{
		id: string
		completed: boolean
	}>
	createdAt: Date
	updatedAt: Date
}

interface KanbanBoardProps {
	tasks: Task[]
	userRole: string
	onTaskUpdate: () => void
	projectId: string
}

interface KanbanColumn {
	id: TaskStatus
	title: string
	icon: React.ReactNode
	color: string
	tasks: Task[]
}

export function KanbanBoard({ tasks, userRole, onTaskUpdate }: KanbanBoardProps) {
	const [draggedTask, setDraggedTask] = useState<Task | null>(null)
	const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(null)

	const isDeveloper = ['DEVELOPER', 'PRODUCTMANAGER', 'ADMIN'].includes(userRole)

	// Calculate task progress
	const getTaskProgress = (task: Task) => {
		if (!task.subtasks || task.subtasks.length === 0) return 0
		const completed = task.subtasks.filter(st => st.completed).length
		return Math.round((completed / task.subtasks.length) * 100)
	}

	// Define columns
	const columns: KanbanColumn[] = [
		{
			id: TaskStatus.YET_TO_START,
			title: "To Start",
			icon: <ListTodo className="h-4 w-4" />,
			color: "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800",
			tasks: tasks.filter(task => task.status === TaskStatus.YET_TO_START)
		},
		{
			id: TaskStatus.IN_PROGRESS,
			title: "In Progress",
			icon: <Clock className="h-4 w-4" />,
			color: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
			tasks: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS)
		},
		{
			id: TaskStatus.COMPLETED,
			title: "Completed",
			icon: <CheckCircle className="h-4 w-4" />,
			color: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
			tasks: tasks.filter(task => task.status === TaskStatus.COMPLETED)
		}
	]

	const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
		if (!isDeveloper) return

		setDraggedTask(task)
		e.dataTransfer.effectAllowed = "move"
		e.dataTransfer.setData("text/html", e.currentTarget.outerHTML)

		// Add visual feedback
		const draggedElement = e.currentTarget as HTMLElement
		draggedElement.style.opacity = "0.5"
	}, [isDeveloper])

	const handleDragEnd = useCallback((e: React.DragEvent) => {
		const draggedElement = e.currentTarget as HTMLElement
		draggedElement.style.opacity = "1"
		setDraggedTask(null)
		setDraggedOverColumn(null)
	}, [])

	const handleDragOver = useCallback((e: React.DragEvent, columnStatus: TaskStatus) => {
		e.preventDefault()
		e.dataTransfer.dropEffect = "move"
		setDraggedOverColumn(columnStatus)
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		const rect = e.currentTarget.getBoundingClientRect()
		if (
			e.clientX <= rect.left ||
			e.clientX >= rect.right ||
			e.clientY <= rect.top ||
			e.clientY >= rect.bottom
		) {
			setDraggedOverColumn(null)
		}
	}, [])

	const handleDrop = useCallback(async (e: React.DragEvent, newStatus: TaskStatus) => {
		e.preventDefault()

		if (!draggedTask || !isDeveloper) return

		if (draggedTask.status === newStatus) {
			setDraggedOverColumn(null)
			return
		}

		try {
			const result = await updateTaskStatus({
				taskId: draggedTask.id,
				status: newStatus
			})

			if (result.success) {
				toast.success(`Task moved to ${columns.find(col => col.id === newStatus)?.title}`)
				onTaskUpdate()
			} else {
				toast.error(result.error || "Failed to update task status")
			}
		} catch (error) {
			console.error("Update task status error:", error)
			toast.error("Failed to update task status")
		} finally {
			setDraggedOverColumn(null)
		}
	}, [draggedTask, isDeveloper, columns, onTaskUpdate])

	const renderTaskCard = (task: Task) => {
		const progress = getTaskProgress(task)
		const subtaskCount = task.subtasks?.length || 0
		const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0

		return (
			<TaskManagementSheet
				key={task.id}
				taskId={task.id}
				userRole={userRole}
				trigger={
					<Card
						className={`cursor-pointer hover:shadow-lg transition-all duration-200 border ${task.status === TaskStatus.COMPLETED
								? "border-green-200 bg-green-50/50 dark:bg-green-900/10"
								: "border-border hover:border-primary/50"
							}`}
						draggable={isDeveloper}
						onDragStart={(e) => handleDragStart(e, task)}
						onDragEnd={handleDragEnd}
					>
						<CardContent className="p-4">
							{isDeveloper && (
								<div className="flex items-center mb-2">
									<GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
								</div>
							)}

							<div className="flex items-start justify-between mb-3">
								<h4 className={`font-medium text-sm leading-tight ${task.status === TaskStatus.COMPLETED ? "line-through text-muted-foreground" : ""
									}`}>
									{task.title}
								</h4>

								{task.assignedDeveloper && (
									<Avatar className="h-6 w-6 flex-shrink-0 ml-2">
										<AvatarImage
											src={task.assignedDeveloper.image || "/placeholder.svg"}
											alt={task.assignedDeveloper.name || "Developer"}
										/>
										<AvatarFallback className="text-xs">
											{task.assignedDeveloper.name?.split(" ").map(n => n[0]).join("") || "D"}
										</AvatarFallback>
									</Avatar>
								)}
							</div>

							{task.description && (
								<p className={`text-xs text-muted-foreground mb-3 line-clamp-2 ${task.status === TaskStatus.COMPLETED ? "line-through" : ""
									}`}>
									{task.description}
								</p>
							)}

							{subtaskCount > 0 && (
								<div className="space-y-2 mb-3">
									<div className="flex justify-between items-center">
										<span className="text-xs text-muted-foreground">
											{completedSubtasks} of {subtaskCount} subtasks
										</span>
										<span className="text-xs font-medium">{progress}%</span>
									</div>
									<Progress value={progress} className="h-1" />
								</div>
							)}

							<div className="flex items-center justify-between">
								<Badge
									variant="outline"
									className={`text-xs ${task.status === TaskStatus.COMPLETED
											? "border-green-500 text-green-700 dark:text-green-300"
											: task.status === TaskStatus.IN_PROGRESS
												? "border-blue-500 text-blue-700 dark:text-blue-300"
												: "border-gray-500 text-gray-700 dark:text-gray-300"
										}`}
								>
									{task.status.replace('_', ' ')}
								</Badge>

								<span className="text-xs text-muted-foreground">
									{new Date(task.updatedAt).toLocaleDateString()}
								</span>
							</div>
						</CardContent>
					</Card>
				}
			/>
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-foreground">Task Board</h2>
					<p className="text-muted-foreground">
						{isDeveloper ? "Drag and drop tasks to update their status" : "View and manage project tasks"}
					</p>
				</div>
				<div className="text-sm text-muted-foreground">
					Total Tasks: {tasks.length}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{columns.map((column) => (
					<Card
						key={column.id}
						className={`transition-all duration-200 ${draggedOverColumn === column.id
								? "ring-2 ring-primary ring-offset-2 shadow-lg"
								: ""
							}`}
						onDragOver={(e) => handleDragOver(e, column.id)}
						onDragLeave={handleDragLeave}
						onDrop={(e) => handleDrop(e, column.id)}
					>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2 text-base">
									{column.icon}
									{column.title}
									<Badge variant="secondary" className="ml-auto">
										{column.tasks.length}
									</Badge>
								</CardTitle>
							</div>
						</CardHeader>

						<CardContent>
							<div className={`min-h-[400px] space-y-3 p-2 rounded-lg border-2 border-dashed transition-colors ${draggedOverColumn === column.id
									? "border-primary bg-primary/5"
									: "border-transparent"
								}`}>
								{column.tasks.length > 0 ? (
									column.tasks.map(renderTaskCard)
								) : (
									<div className="flex flex-col items-center justify-center py-12 text-center">
										<div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${column.color}`}>
											{column.icon}
										</div>
										<p className="text-sm font-medium text-muted-foreground mb-1">
											No tasks in {column.title.toLowerCase()}
										</p>
										{isDeveloper && column.id === TaskStatus.YET_TO_START && (
											<p className="text-xs text-muted-foreground">
												Add new tasks to get started
											</p>
										)}
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Legend for drag and drop */}
			{isDeveloper && (
				<div className="text-center">
					<p className="text-sm text-muted-foreground">
						💡 <strong>Tip:</strong> Drag tasks between columns to update their status
					</p>
				</div>
			)}
		</div>
	)
}