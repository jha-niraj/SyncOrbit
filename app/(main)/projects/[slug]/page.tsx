"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DollarSign, Users, ArrowLeft, CheckCircle, Target, MessageSquare, CreditCard, Plus, Clock, ListTodo } from "lucide-react"
import Link from "next/link"
import { getProjectBySlug } from "@/actions/(client)/project.action"
import { ProjectClientWrapper } from "./_components/ProjectClientWrapper"
import { ProjectLinks } from "./_components/ProjectLinks"
import { FeedbackDisplay } from "./_components/FeedbackDisplay"
import { TaskManagementSheet } from "./_components/TaskManagementSheet"
import { CreateTaskSheet } from "./_components/CreateTaskSheet"
import { useSession } from "next-auth/react"
import { ProjectStoreProvider } from "./_components/ProjectStoreProvider"
import { formatCurrency, getCurrencySymbol, getPaymentProgress, useProjectStore } from "@/store/useProjectStore"
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

	const handleFeedbackAdded = () => {
		// Scroll to feedback section using ID
		setTimeout(() => {
			const feedbackSection = document.getElementById('feedback-section')
			if (feedbackSection) {
				feedbackSection.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
					inline: 'nearest'
				})
			}
		}, 200)
	}

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

	const totalTasks = project.tasks.length
	const overallCompletedTasks = completedTasks.length
	const progressPercentage = totalTasks > 0 ? (overallCompletedTasks / totalTasks) * 100 : 0

	const paymentProgress = getPaymentProgress(project.paidAmount, project.budget)
	const requiredUpfront = project.budget * 0.3

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

	const getPaymentStatusColor = (status: string) => {
		switch (status) {
			case 'COMPLETED':
				return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
			case 'PARTIAL':
				return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
			case 'PENDING':
				return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
			default:
				return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
		}
	}

	const assignedDevelopers = project.tasks
		.map((task: any) => task.assignedDeveloper)
		.filter((dev: any, index: number, self: any[]) => dev && self.findIndex((d: any) => d?.id === dev.id) === index)

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

						{
							task.description && (
								<p className="text-sm text-muted-foreground mb-3">{task.description}</p>
							)
						}

						{
							subtaskCount > 0 && (
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="text-xs text-muted-foreground">
											{completedSubtasks} of {subtaskCount} subtasks
										</span>
										<span className="text-xs font-medium">{progress}%</span>
									</div>
									<Progress value={progress} className="h-1" />
								</div>
							)
						}

						<div className="flex items-center justify-between mt-3">
							<Badge className={`${getTaskStatusColor(task.status)} border text-xs`}>
								{task.status.replace('_', ' ')}
							</Badge>
							{
								task.assignedDeveloper && (
									<span className="text-xs text-muted-foreground">
										{task.assignedDeveloper.name}
									</span>
								)
							}
						</div>
					</div>
				}
			/>
		)
	}

	const renderKanbanColumn = (title: string, tasks: any[], status: TaskStatus, icon: React.ReactNode) => (
		<div className="space-y-4 shadow-md dark:border-gray-200 dark:border-2 rounded-xl p-4">
			<div className="flex items-center justify-between border-b-2 border-gray-400 dark:border-gray-200 pb-2">
				<h3 className="font-semibold text-center text-foreground flex items-center justify-center gap-2">
					{icon}
					{title} ({tasks.length})
				</h3>
				{
					isDeveloper && status !== TaskStatus.COMPLETED && (
						<div className="flex gap-2">
							{
								tasks.map((task: any) => (
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
					)
				}
			</div>
			<div className="space-y-3 min-h-32">
				{
					tasks.length > 0 ? (
						tasks.map(renderTaskCard)
					) : (
						<div className="text-center py-8 text-muted-foreground">
							<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
								{icon}
							</div>
							<p className="text-sm">No tasks in {title.toLowerCase()}</p>
						</div>
					)
				}
			</div>
		</div>
	)

	return (
		<ProjectStoreProvider initialProject={initialProject}>
			<div className="min-h-screen bg-gradient-to-bl dark:from-black dark:via-gray-900 dark:to-black">
				<div className="">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
							<div className="space-y-8">
								<div>
									<h1 className="text-5xl font-bold text-black dark:text-white mb-6">
										{project.title}
									</h1>
									<p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
										{project.description || "No description provided"}
									</p>
									<div className="flex items-center gap-4">
										<ProjectClientWrapper
											projectId={project.id}
											projectTitle={project.title}
											initialMessages={project.messages || []}
											userRole={session?.user?.role}
											onFeedbackAdded={handleFeedbackAdded}
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-8">
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<DollarSign className="h-6 w-6 text-black dark:text-white" />
										</div>
										<div className="flex-1">
											<p className="text-sm text-gray-700 dark:text-gray-300">Budget ({project.currency})</p>
											<p className="text-2xl font-bold text-black dark:text-white">
												{formatCurrency(project.budget, project.currency)}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<CreditCard className="h-6 w-6 text-black dark:text-white" />
										</div>
										<div className="flex-1">
											<p className="text-sm text-gray-700 dark:text-gray-300">Payment Status</p>
											<p className="text-2xl font-bold text-black dark:text-white">
												{Math.round(paymentProgress)}% Paid
											</p>
										</div>
									</div>
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<Target className="h-6 w-6 text-black dark:text-white" />
										</div>
										<div className="flex-1">
											<p className="text-sm text-gray-700 dark:text-gray-300">Progress</p>
											<p className="text-2xl font-bold text-black dark:text-white">
												{Math.round(progressPercentage)}%
											</p>
										</div>
									</div>
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
											<Users className="h-6 w-6 text-black dark:text-white" />
										</div>
										<div className="flex-1">
											<p className="text-sm text-gray-700 dark:text-gray-300">Team Size</p>
											<p className="text-2xl font-bold text-black dark:text-white">
												{assignedDevelopers.length} Developers
											</p>
										</div>
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="border-gray-200 border-2 rounded-xl p-6">
										<h3 className="text-lg font-semibold text-black dark:text-white mb-4">Payment Progress</h3>
										<div className="space-y-3">
											<div className="flex justify-between items-center">
												<span className="text-sm text-gray-700 dark:text-gray-300">Paid Amount</span>
												<span className="text-sm font-bold text-black dark:text-white">
													{Math.round(paymentProgress)}%
												</span>
											</div>
											<div className="w-full bg-gray-700 rounded-full h-3">
												<div
													className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
													style={{ width: `${Math.min(paymentProgress, 100)}%` }}
												/>
											</div>
											<div className="text-sm text-gray-700 dark:text-gray-300">
												{formatCurrency(project.paidAmount, project.currency)} of {formatCurrency(project.budget, project.currency)}
											</div>
											<div className="text-xs text-gray-700 dark:text-gray-300">
												Minimum 30% ({formatCurrency(requiredUpfront, project.currency)}) required to start
											</div>
										</div>
									</div>
									<div className="border-gray-200 border-2 rounded-xl p-6">
										<h3 className="text-lg font-semibold text-black dark:text-white mb-4">Project Progress</h3>
										<div className="space-y-3">
											<div className="flex justify-between items-center">
												<span className="text-sm text-gray-700 dark:text-gray-300">Completion</span>
												<span className="text-sm font-bold text-black dark:text-white">
													{Math.round(progressPercentage)}%
												</span>
											</div>
											<div className="w-full bg-gray-700 rounded-full h-3">
												<div
													className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
													style={{ width: `${Math.min(progressPercentage, 100)}%` }}
												/>
											</div>
											<div className="text-sm text-gray-700 dark:text-gray-300">
												{overallCompletedTasks} of {totalTasks} tasks completed
											</div>
											<div className="text-xs text-gray-700 dark:text-gray-300">
												Track progress across all project milestones
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="space-y-6">
								<ProjectLinks project={project} />
								<div className="border-gray-200 border-2 rounded-xl p-6">
									<h3 className="text-lg font-semibold text-black dark:text-white mb-4">
										Payment Information
									</h3>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-700 dark:text-gray-300">Payment Status</span>
											<Badge className={`${getPaymentStatusColor(project.paymentStatus)} border`}>
												{project.paymentStatus}
											</Badge>
										</div>
										<div className="space-y-2">
											<div className="flex justify-between items-center">
												<span className="text-sm text-gray-700 dark:text-gray-300">Progress</span>
												<span className="text-sm font-semibold">
													{formatCurrency(project.paidAmount, project.currency)} of {formatCurrency(project.budget, project.currency)}
												</span>
											</div>
											<Progress value={paymentProgress} className="h-2" />
										</div>
										<div className="text-xs text-gray-700 dark:text-gray-300 mt-2">
											Minimum 30% ({formatCurrency(requiredUpfront, project.currency)}) required to start project
										</div>
									</div>
								</div>
								<div className="border-gray-200 border-2 rounded-xl p-6">
									<h3 className="text-lg font-semibold text-black dark:text-white mb-4">
										Client Information
									</h3>
									<div className="space-y-4">
										<div className="flex items-center gap-4">
											<Avatar className="h-12 w-12 border-2 border-gray-200">
												<AvatarImage src={project.user.image || "/placeholder.svg"} alt={project.user.name || "Client"} />
												<AvatarFallback className="bg-black text-white text-lg font-bold">
													{project.user.name?.split(" ").map((n: string) => n[0]).join("") || "C"}
												</AvatarFallback>
											</Avatar>
											<div>
												<h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
													{project.user.name || "Unknown Client"}
												</h4>
												<p className="text-gray-700 dark:text-gray-300">
													{project.user.email || "No email provided"}
												</p>
											</div>
										</div>
										<div className="grid grid-cols-2 gap-4 pt-4 border-t">
											<div>
												<p className="text-sm text-gray-700 dark:text-gray-300">Project Type</p>
												<p className="font-medium text-gray-700 dark:text-gray-300">
													{project.clientType || "Standard"}
												</p>
											</div>
											<div>
												<p className="text-sm text-gray-700 dark:text-gray-300">Currency</p>
												<p className="font-medium text-gray-700 dark:text-gray-300">
													{getCurrencySymbol(project.currency)} {project.currency}
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="w-full px-4 sm:px-6 lg:px-8 py-12">
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
						<div className="lg:col-span-3">
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
										{
											isDeveloper && (
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
											)
										}
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
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{renderKanbanColumn("Initiate", initiateeTasks, TaskStatus.YET_TO_START, <ListTodo className="h-4 w-4" />)}
								{renderKanbanColumn("Working", workingTasks, TaskStatus.IN_PROGRESS, <Clock className="h-4 w-4" />)}
								{renderKanbanColumn("Completed", completedTasks, TaskStatus.COMPLETED, <CheckCircle className="h-4 w-4" />)}
							</div>
						</div>
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Users className="h-5 w-5" />
										Team Members
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{
											assignedDevelopers.length > 0 ? (
												assignedDevelopers.map((developer: any) => (
													<div key={developer?.id} className="flex items-center gap-3">
														<Avatar className="h-10 w-10 border-2 border-gray-200">
															<AvatarImage src={developer?.image || "/placeholder.svg"} alt={developer?.name || "Developer"} />
															<AvatarFallback className="bg-black text-white text-sm font-bold">
																{developer?.name?.split(" ").map((n: string) => n[0]).join("") || "D"}
															</AvatarFallback>
														</Avatar>
														<div className="flex-1">
															<h4 className="font-medium text-foreground">
																{developer?.name || "Unknown Developer"}
															</h4>
															<p className="text-sm text-muted-foreground">
																Developer
															</p>
														</div>
													</div>
												))
											) : (
												<p className="text-sm text-muted-foreground">
													No team members assigned yet
												</p>
											)
										}
									</div>
								</CardContent>
							</Card>
							<Card id="feedback-section">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<MessageSquare className="h-5 w-5" />
										Client Feedback ({(storeProject?.feedbacks || project?.feedbacks || []).length})
									</CardTitle>
									<CardDescription>
										Feedback and feature requests from the client
									</CardDescription>
								</CardHeader>
								<CardContent>
									<FeedbackDisplay feedbacks={project.feedbacks || []} />
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Quick Stats</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">Total Tasks</span>
											<span className="font-medium">{totalTasks}</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">Completed Tasks</span>
											<span className="font-medium text-green-600">{overallCompletedTasks}</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">Feedback Items</span>
											<span className="font-medium text-blue-600">{(storeProject?.feedbacks || project?.feedbacks || []).length}</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">Team Size</span>
											<span className="font-medium">{assignedDevelopers.length}</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">Payment Progress</span>
											<span className="font-medium text-green-600">{Math.round(paymentProgress)}%</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</ProjectStoreProvider>
	)
} 