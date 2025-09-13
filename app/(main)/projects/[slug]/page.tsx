"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	DollarSign, Users, ArrowLeft, CheckCircle, Target, MessageSquare,
	CreditCard, Plus, Clock, ListTodo, MessageCircle
} from "lucide-react"
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
import { KanbanBoard } from "@/components/kanban-board"
import { ProjectHealth } from "@/components/project-health"
import { ProjectHealthData } from "@/lib/utils/healthScore"
import { ActivityFeed } from "@/components/activity-feed"
import { differenceInDays } from "date-fns"

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
	const overallCompletedTasks = project?.tasks?.filter((task: any) => task.status === TaskStatus.COMPLETED).length || 0
	const progressPercentage = totalTasks > 0 ? (overallCompletedTasks / totalTasks) * 100 : 0
	const paymentProgress = getPaymentProgress(project?.paidAmount || 0, project?.budget || 0)
	const assignedDevelopers = project?.tasks
		?.map((task: any) => task.assignedDeveloper)
		?.filter((dev: any, index: number, self: any[]) => dev && self.findIndex((d: any) => d?.id === dev.id) === index) || []

	// Prepare health score data
	const getHealthData = (): ProjectHealthData | null => {
		if (!project) return null
		
		try {
			// Count tasks by status
			const yetToStartTasks = project.tasks?.filter((task: any) => task.status === 'YET_TO_START').length || 0
			const inProgressTasks = project.tasks?.filter((task: any) => task.status === 'WORKING').length || 0
			const completedTasks = project.tasks?.filter((task: any) => task.status === 'COMPLETED').length || 0
			
			// For overdue tasks, we need to check if endDate exists and has passed
			const overdueTasksCount = project.endDate && new Date() > new Date(project.endDate) 
				? yetToStartTasks + inProgressTasks 
				: 0
			
			// Calculate feedback metrics
			const feedbacks = project.feedbacks || []
			const averageRating = feedbacks.length > 0 
				? feedbacks.reduce((sum: number, f: any) => sum + (f.rating || 3), 0) / feedbacks.length 
				: 0
			
			return {
				id: project.id,
				title: project.title,
				startDate: new Date(project.startDate),
				endDate: project.endDate ? new Date(project.endDate) : null,
				status: project.status,
				budget: project.budget,
				paidAmount: project.paidAmount || 0,
				tasks: {
					total: totalTasks,
					completed: completedTasks,
					inProgress: inProgressTasks,
					yetToStart: yetToStartTasks,
					overdue: overdueTasksCount
				},
				timeline: {
					totalDuration: project.endDate 
						? differenceInDays(new Date(project.endDate), new Date(project.startDate))
						: 0,
					elapsed: differenceInDays(new Date(), new Date(project.startDate)),
					remaining: project.endDate 
						? Math.max(0, differenceInDays(new Date(project.endDate), new Date()))
						: 0
				},
				feedback: feedbacks.length > 0 ? {
					averageRating,
					totalFeedbacks: feedbacks.length
				} : undefined,
				budgetUtilization: (project.paidAmount || 0) / project.budget * 100
			}
		} catch (error) {
			console.error('Error preparing health data:', error)
			return null
		}
	}
	
	const healthData = getHealthData()




	return (
		<ProjectStoreProvider initialProject={initialProject}>
			<div className="min-h-screen bg-background">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
					<div className="space-y-6 mb-12">
						<div>
							<h1 className="text-4xl font-bold text-foreground mb-4">
								{project.title}
							</h1>
							<p className="text-xl text-muted-foreground leading-relaxed">
								{project.description || "No description provided"}
							</p>
						</div>
						{
							project.feedbacks && project.feedbacks.length > 0 && (
								<Card className="border-l-4 border-l-blue-500">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-blue-600">
											<MessageSquare className="h-5 w-5" />
											Recent Feedback
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{
												project.feedbacks.slice(0, 2).map((feedback: any, index: number) => (
													<div key={index} className="border-l-2 border-muted pl-4">
														<p className="text-sm text-muted-foreground">{feedback.message}</p>
														<p className="text-xs text-muted-foreground mt-1">
															{new Date(feedback.createdAt).toLocaleDateString()}
														</p>
													</div>
												))
											}
											{
												project.feedbacks.length > 2 && (
													<Link href={`/projects/${slug}/feedback`}>
														<Button variant="link" className="p-0 h-auto text-blue-600">
															View all {project.feedbacks.length} feedback items →
														</Button>
													</Link>
												)
											}
										</div>
									</CardContent>
								</Card>
							)
						}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
						
						{/* Project Health Score and Activity Feed */}
						{healthData && (
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<div className="lg:col-span-2">
									<ProjectHealth 
										data={healthData} 
										variant="detailed" 
										showRecommendations={true}
									/>
								</div>
								<div className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle className="flex items-center gap-2">
												<Target className="h-5 w-5" />
												Progress Overview
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div>
												<div className="flex justify-between text-sm mb-2">
													<span>Task Progress</span>
													<span className="font-semibold">{Math.round(progressPercentage)}%</span>
												</div>
												<Progress value={progressPercentage} className="h-2" />
											</div>
											<div>
												<div className="flex justify-between text-sm mb-2">
													<span>Payment Progress</span>
													<span className="font-semibold">{Math.round(paymentProgress)}%</span>
												</div>
												<Progress value={paymentProgress} className="h-2" />
											</div>
											<div className="grid grid-cols-2 gap-2 text-center pt-2">
												<div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
													<div className="text-2xl font-bold text-blue-600">{overallCompletedTasks}</div>
													<div className="text-xs text-blue-600">Completed</div>
												</div>
												<div className="p-2 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
													<div className="text-2xl font-bold text-gray-600">{totalTasks - overallCompletedTasks}</div>
													<div className="text-xs text-gray-600">Remaining</div>
												</div>
											</div>
										</CardContent>
									</Card>
									
									{/* Project Activity Feed */}
									<ActivityFeed 
										variant="dashboard"
										projectId={project.id}
										maxItems={6}
										showFilters={false}
										autoRefresh={true}
									/>
								</div>
							</div>
						)}
					</div>

					{/* Kanban Board with Task Management */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="flex items-center gap-2">
										<ListTodo className="h-5 w-5" />
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
							<KanbanBoard 
								tasks={project.tasks || []}
								userRole={session?.user?.role || ""}
								onTaskUpdate={handleTaskCreated}
								projectId={project.id}
							/>
						</CardContent>
					</Card>
				</div>
			</div>
		</ProjectStoreProvider>
	)
}