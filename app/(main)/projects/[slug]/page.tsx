"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DollarSign, Users, ArrowLeft, CheckCircle, Target, MessageSquare, CreditCard, Plus, Clock, ListTodo, MessageCircle } from "lucide-react"
import Link from "next/link"
import { getProjectBySlug } from "@/actions/(client)/project.action"
import { TaskManagementSheet } from "./_components/TaskManagementSheet"
import { CreateTaskSheet } from "./_components/CreateTaskSheet"
import { useSession } from "next-auth/react"
import { ProjectStoreProvider } from "./_components/ProjectStoreProvider"
import { formatCurrency, getPaymentProgress, useProjectStore } from "@/store/useProjectStore"
import { TaskStatus } from "@prisma/client"
import { updateTaskStatus } from "@/actions/(developers)/developers.action"
import { toast } from "sonner"

interface ProjectPageProps {
	params: Promise<{
		slug: string
	}>
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ProjectPage({ params }: ProjectPageProps) {
	const [initialProject, setInitialProject] = useState<any>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [refreshKey, setRefreshKey] = useState(0)
	const { data: session } = useSession()
	const { project: storeProject } = useProjectStore()

	const project = storeProject || initialProject
	const isDeveloper = session?.user?.role && ['DEVELOPER', 'PRODUCTMANAGER', 'ADMIN'].includes(session.user.role)

	useEffect(() => {
		const loadProject = async () => {
			const { slug } = await params
			const result = await getProjectBySlug(slug)
			if (result.success && result.project) {
				setInitialProject(result.project)
			}
			setIsLoading(false)
		}
		loadProject()
	}, [params, refreshKey])

	// Get slug for navigation
	const [slug, setSlug] = useState<string>("")
	useEffect(() => {
		const getSlug = async () => {
			const { slug: paramSlug } = await params
			setSlug(paramSlug)
		}
		getSlug()
	}, [params])

	const handleTaskCreated = () => {
		setRefreshKey(prev => prev + 1)
	}

	const handleTaskStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
		try {
			const result = await updateTaskStatus({ taskId, status: newStatus })
			if (result.success) {
				toast.success("Task status updated successfully")
				setRefreshKey(prev => prev + 1)
			} else {
				toast.error(result.error || "Failed to update task status")
			}
		} catch (error) {
			console.error("Update task status error:", error)
			toast.error("Failed to update task status")
		}
	}

	// Calculate subtask progress for each task
	const getTaskProgress = (task: any) => {
		if (!task.subtasks || task.subtasks.length === 0) return 0
		const completed = task.subtasks.filter((st: any) => st.completed).length
		return Math.round((completed / task.subtasks.length) * 100)
	}

	// Group tasks by status
	const initiateeTasks = project?.tasks?.filter((task: any) => task.status === TaskStatus.YET_TO_START) || []
	const workingTasks = project?.tasks?.filter((task: any) => task.status === TaskStatus.IN_PROGRESS) || []
	const completedTasks = project?.tasks?.filter((task: any) => task.status === TaskStatus.COMPLETED) || []

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading project...</p>
				</div>
			</div>
		)
	}

	if (!project) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-foreground mb-2">
						Project Not Found
					</h1>
					<p className="text-muted-foreground mb-4">
						The project you&apos;re looking for doesn&apos;t exist.
					</p>
					<Link href="/dashboard">
						<Button>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Dashboard
						</Button>
					</Link>
				</div>
			</div>
		)
	}

	const totalTasks = project?.tasks?.length || 0
	const overallCompletedTasks = completedTasks.length
	const progressPercentage = totalTasks > 0 ? (overallCompletedTasks / totalTasks) * 100 : 0
	const paymentProgress = getPaymentProgress(project?.paidAmount || 0, project?.budget || 0)
	const assignedDevelopers = project?.tasks
		?.map((task: any) => task.assignedDeveloper)
		?.filter((dev: any, index: number, self: any[]) => dev && self.findIndex((d: any) => d?.id === dev.id) === index) || []

	const getTaskStatusColor = (status: TaskStatus) => {
		switch (status) {
			case TaskStatus.COMPLETED:
				return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
			case TaskStatus.IN_PROGRESS:
				return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
			case TaskStatus.YET_TO_START:
				return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
			default:
				return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
		}
	}

	const renderTaskCard = (task: any) => {
		const progress = getTaskProgress(task)
		const subtaskCount = task.subtasks?.length || 0
		const completedSubtasks = task.subtasks?.filter((st: any) => st.completed).length || 0

		return (
			<TaskManagementSheet
				key={task.id}
				taskId={task.id}
				userRole={session?.user?.role || ""}
				trigger={
					<div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-2">
								<div className={`w-3 h-3 rounded-full ${task.status === TaskStatus.COMPLETED ? "bg-green-500" :
									task.status === TaskStatus.IN_PROGRESS ? "bg-blue-500" :
										"bg-gray-400"
									}`} />
								<h4 className="font-medium text-foreground">{task.title}</h4>
							</div>
							{task.assignedDeveloper && (
								<Avatar className="h-6 w-6">
									<AvatarImage src={task.assignedDeveloper.image || "/placeholder.svg"} alt={task.assignedDeveloper.name || "Developer"} />
									<AvatarFallback className="text-xs">
										{task.assignedDeveloper.name?.split(" ").map((n: string) => n[0]).join("") || "D"}
									</AvatarFallback>
								</Avatar>
							)}
						</div>

						{task.description && (
							<p className="text-sm text-muted-foreground mb-3">{task.description}</p>
						)}

						{subtaskCount > 0 && (
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-xs text-muted-foreground">
										{completedSubtasks} of {subtaskCount} subtasks
									</span>
									<span className="text-xs font-medium">{progress}%</span>
								</div>
								<Progress value={progress} className="h-1" />
							</div>
						)}

						<div className="flex items-center justify-between mt-3">
							<Badge className={`${getTaskStatusColor(task.status)} border text-xs`}>
								{task.status.replace('_', ' ')}
							</Badge>
							{task.assignedDeveloper && (
								<span className="text-xs text-muted-foreground">
									{task.assignedDeveloper.name}
								</span>
							)}
						</div>
					</div>
				}
			/>
		)
	}

	const renderKanbanColumn = (title: string, tasks: any[], status: TaskStatus, icon: React.ReactNode) => (
		<div className="space-y-4 border rounded-xl p-4 bg-muted/20">
			<div className="flex items-center justify-between border-b pb-2">
				<h3 className="font-semibold text-foreground flex items-center gap-2">
					{icon}
					{title} ({tasks.length})
				</h3>
				{isDeveloper && status !== TaskStatus.COMPLETED && (
					<div className="flex gap-2">
						{tasks.map((task: any) => (
							<Button
								key={task.id}
								variant="ghost"
								size="sm"
								onClick={(e) => {
									e.preventDefault()
									const nextStatus = status === TaskStatus.YET_TO_START ? TaskStatus.IN_PROGRESS : TaskStatus.COMPLETED
									handleTaskStatusUpdate(task.id, nextStatus)
								}}
								className="text-xs"
							>
								Move to {status === TaskStatus.YET_TO_START ? 'Working' : 'Completed'}
							</Button>
						)).slice(0, 1)}
					</div>
				)}
			</div>
			<div className="space-y-3 min-h-32">
				{tasks.length > 0 ? (
					tasks.map(renderTaskCard)
				) : (
					<div className="text-center py-8 text-muted-foreground">
						<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
							{icon}
						</div>
						<p className="text-sm">No tasks in {title.toLowerCase()}</p>
					</div>
				)}
			</div>
		</div>
	)

	return (
		<ProjectStoreProvider initialProject={initialProject}>
			<div className="min-h-screen bg-background">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Back button and navigation */}
					<div className="flex items-center justify-between mb-8">
						<Link href="/projects">
							<Button variant="ghost" className="gap-2">
								<ArrowLeft className="h-4 w-4" />
								Back to Projects
							</Button>
						</Link>
						<div className="flex gap-2">
							<Link href={`/projects/${slug}/chat`}>
								<Button variant="outline" className="gap-2">
									<MessageCircle className="h-4 w-4" />
									Chat
								</Button>
							</Link>
							<Link href={`/projects/${slug}/feedback`}>
								<Button variant="outline" className="gap-2">
									<MessageSquare className="h-4 w-4" />
									Feedback
								</Button>
							</Link>
						</div>
					</div>

					{/* Project Header */}
					<div className="space-y-6 mb-12">
						<div>
							<h1 className="text-4xl font-bold text-foreground mb-4">
								{project.title}
							</h1>
							<p className="text-xl text-muted-foreground leading-relaxed">
								{project.description || "No description provided"}
							</p>
						</div>

						{/* Recent Feedback Preview */}
						{project.feedbacks && project.feedbacks.length > 0 && (
							<Card className="border-l-4 border-l-blue-500">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-blue-600">
										<MessageSquare className="h-5 w-5" />
										Recent Feedback
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{project.feedbacks.slice(0, 2).map((feedback: any, index: number) => (
											<div key={index} className="border-l-2 border-muted pl-4">
												<p className="text-sm text-muted-foreground">{feedback.message}</p>
												<p className="text-xs text-muted-foreground mt-1">
													{new Date(feedback.createdAt).toLocaleDateString()}
												</p>
											</div>
										))}
										{project.feedbacks.length > 2 && (
											<Link href={`/projects/${slug}/feedback`}>
												<Button variant="link" className="p-0 h-auto text-blue-600">
													View all {project.feedbacks.length} feedback items →
												</Button>
											</Link>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Project Stats Grid */}
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
							<Card>
								<CardContent className="flex items-center gap-4 p-6">
									<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
										<DollarSign className="h-6 w-6 text-primary" />
									</div>
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">Budget ({project.currency})</p>
										<p className="text-2xl font-bold text-foreground">
											{formatCurrency(project.budget, project.currency)}
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="flex items-center gap-4 p-6">
									<div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
										<CreditCard className="h-6 w-6 text-green-600" />
									</div>
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">Payment Status</p>
										<p className="text-2xl font-bold text-foreground">
											{Math.round(paymentProgress)}% Paid
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="flex items-center gap-4 p-6">
									<div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
										<Target className="h-6 w-6 text-blue-600" />
									</div>
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">Progress</p>
										<p className="text-2xl font-bold text-foreground">
											{Math.round(progressPercentage)}%
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="flex items-center gap-4 p-6">
									<div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
										<Users className="h-6 w-6 text-purple-600" />
									</div>
									<div className="flex-1">
										<p className="text-sm text-muted-foreground">Team Size</p>
										<p className="text-2xl font-bold text-foreground">
											{assignedDevelopers.length} Developers
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
					{/* Task Management - Kanban Board */}
					<Card className="mb-8">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="flex items-center gap-2">
										<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
										Task Management
									</CardTitle>
									<CardDescription>
										Organize and track tasks across different stages
									</CardDescription>
								</div>
								{isDeveloper && (
									<CreateTaskSheet
										projectId={project.id}
										onTaskCreated={handleTaskCreated}
										trigger={
											<Button>
												<Plus className="h-4 w-4 mr-2" />
												Add Task
											</Button>
										}
									/>
								)}
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium text-muted-foreground">
										Overall Task Progress
									</span>
									<span className="text-sm font-bold text-foreground">
										{overallCompletedTasks} of {totalTasks} tasks completed
									</span>
								</div>
								<Progress value={progressPercentage} className="h-3" />
								<div className="text-center">
									<span className="text-4xl font-bold text-foreground">
										{Math.round(progressPercentage)}%
									</span>
									<p className="text-sm text-muted-foreground">Complete</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Kanban Board */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{renderKanbanColumn("Initiate", initiateeTasks, TaskStatus.YET_TO_START, <ListTodo className="h-4 w-4" />)}
						{renderKanbanColumn("Working", workingTasks, TaskStatus.IN_PROGRESS, <Clock className="h-4 w-4" />)}
						{renderKanbanColumn("Completed", completedTasks, TaskStatus.COMPLETED, <CheckCircle className="h-4 w-4" />)}
					</div>
				</div>
			</div>
		</ProjectStoreProvider>
	)
}