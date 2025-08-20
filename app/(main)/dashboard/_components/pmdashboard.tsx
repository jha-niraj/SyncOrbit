"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	DollarSign,
	Users,
	Building2,
	TrendingUp,
	CheckCircle,
	AlertCircle,
	Code,
	Target,
	Calendar,
	Copy,
	Share2,
	Activity,
	Briefcase
} from "lucide-react"
import { formatCurrency } from "@/store/useProjectStore"
import { toast } from "sonner"
import Link from "next/link"
import { Status } from "@prisma/client"

interface PMDashboardData {
	company: {
		id: string
		name: string
		shortName: string
		devReferralCode: string
		clientReferralCode: string
		createdAt: Date
		users: { id: string; name: string | null; email: string | null; image: string | null; role: string; createdAt: Date; assignedTasks: { id: string; title: string; status: string; createdAt: Date; project: { id: string; title: string; slug: string } }[] }[]
		productManager: {
			id: string
			name: string | null
			email: string | null
			image: string | null
		}
	}
	projects: { id: string; title: string; slug: string; description: string | null; status: string; budget: number; paidAmount: number; currency: string; createdAt: Date; user: { id: string; name: string | null; email: string | null; image: string | null }; tasks: { id: string; title: string; status: string }[] }[]
	statistics: {
		totalProjects: number
		completedProjects: number
		activeProjects: number
		totalRevenue: number
		paidAmount: number
		pendingAmount: number
		developersCount: number
		clientsCount: number
	}
	developers: { id: string; name: string | null; email: string | null; image: string | null; role: string; createdAt: Date; assignedTasks: { id: string; title: string; status: string; createdAt: Date; project: { id: string; title: string; slug: string } }[]; taskStats: { total: number; completed: number; inProgress: number; completionRate: number } }[]
	clients: { id: string; name: string | null; email: string | null; image: string | null; role: string; createdAt: Date; assignedTasks: { id: string; title: string; status: string; createdAt: Date; project: { id: string; title: string; slug: string } }[] }[]
}

interface PMDashboardProps {
	data: PMDashboardData
}

export function PMDashboard({ data }: PMDashboardProps) {
	const [copiedCode, setCopiedCode] = useState<string | null>(null)

	const currentProjects = data.projects.filter(p => p.status === Status.IN_PROGRESS)
	const completedProjects = data.projects.filter(p => p.status === Status.COMPLETED)
	const paymentProgress = data.statistics.totalRevenue > 0 ? (data.statistics.paidAmount / data.statistics.totalRevenue) * 100 : 0

	const copyToClipboard = (text: string, type: string) => {
		navigator.clipboard.writeText(text)
		setCopiedCode(type)
		toast.success(`${type} link copied to clipboard!`)
		setTimeout(() => setCopiedCode(null), 2000)
	}

	const getDeveloperReferralLink = () => {
		const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://shunyatech.com'
		return `${baseUrl}/devs/signup?ref=${data.company.devReferralCode}`
	}

	const getClientReferralLink = () => {
		const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://shunyatech.com'
		return `${baseUrl}/signup?ref=${data.company.clientReferralCode}`
	}

	return (
		<div className="min-h-screen bg-white dark:bg-neutral-900">
			<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
				<div className="flex flex-col space-y-8">
					<div className="flex flex-col space-y-2">
						<div className="flex items-center gap-3">
							<Building2 className="h-8 w-8 text-blue-600" />
							<div>
								<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
									{data.company.name}
								</h1>
								<p className="text-gray-600 dark:text-gray-400">
									Company Dashboard - {data.company.shortName}
								</p>
							</div>
						</div>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Projects</CardTitle>
								<Briefcase className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{data.statistics.totalProjects}</div>
								<div className="flex items-center gap-2 mt-1">
									<div className="text-xs text-muted-foreground">
										{data.statistics.activeProjects} active
									</div>
									<Badge variant="secondary" className="text-xs">
										{data.statistics.completedProjects} completed
									</Badge>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
								<DollarSign className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{formatCurrency(data.statistics.totalRevenue, 'USD')}</div>
								<div className="flex items-center gap-2 mt-1">
									<div className="text-xs text-green-600">
										{formatCurrency(data.statistics.paidAmount, 'USD')} received
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Team Size</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{data.statistics.developersCount}</div>
								<div className="flex items-center gap-2 mt-1">
									<div className="text-xs text-muted-foreground">
										{data.statistics.clientsCount} clients
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Payment Progress</CardTitle>
								<TrendingUp className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{Math.round(paymentProgress)}%</div>
								<div className="flex items-center gap-2 mt-1">
									<Progress value={paymentProgress} className="h-2 flex-1" />
								</div>
							</CardContent>
						</Card>
					</div>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Share2 className="h-5 w-5" />
								Referral Links
							</CardTitle>
							<CardDescription>
								Share these links to invite developers and clients to your company
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label className="text-sm font-medium">Developer Referral Link</Label>
									<div className="flex items-center gap-2">
										<div className="flex-1 p-2 bg-muted rounded-md text-sm font-mono">
											{getDeveloperReferralLink()}
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => copyToClipboard(getDeveloperReferralLink(), 'Developer')}
										>
											{
												copiedCode === 'Developer' ? (
													<CheckCircle className="h-4 w-4" />
												) : (
													<Copy className="h-4 w-4" />
												)
											}
										</Button>
									</div>
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium">Client Referral Link</Label>
									<div className="flex items-center gap-2">
										<div className="flex-1 p-2 bg-muted rounded-md text-sm font-mono">
											{getClientReferralLink()}
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => copyToClipboard(getClientReferralLink(), 'Client')}
										>
											{
												copiedCode === 'Client' ? (
													<CheckCircle className="h-4 w-4" />
												) : (
													<Copy className="h-4 w-4" />
												)
											}
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 space-y-6">
							<Tabs defaultValue="current" className="w-full">
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="current">Current Projects</TabsTrigger>
									<TabsTrigger value="completed">Completed Projects</TabsTrigger>
								</TabsList>
								<TabsContent value="current" className="space-y-4">
									<div className="flex items-center justify-between">
										<h2 className="text-xl font-semibold">Current Projects</h2>
										<Badge variant="outline">{currentProjects.length} projects</Badge>
									</div>
									{
										currentProjects.length > 0 ? (
											<div className="space-y-4">
												{
													currentProjects.map((project) => (
														<ProjectCard key={project.id} project={project} />
													))
												}
											</div>
										) : (
											<div className="text-center py-8">
												<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
												<h3 className="text-lg font-medium mb-2">No active projects</h3>
												<p className="text-muted-foreground">
													All projects are completed or you haven&apos;t started any yet.
												</p>
											</div>
										)
									}
								</TabsContent>
								<TabsContent value="completed" className="space-y-4">
									<div className="flex items-center justify-between">
										<h2 className="text-xl font-semibold">Completed Projects</h2>
										<Badge variant="outline">{completedProjects.length} projects</Badge>
									</div>
									{
										completedProjects.length > 0 ? (
											<div className="space-y-4">
												{
													completedProjects.map((project) => (
														<ProjectCard key={project.id} project={project} />
													))
												}
											</div>
										) : (
											<div className="text-center py-8">
												<CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
												<h3 className="text-lg font-medium mb-2">No completed projects</h3>
												<p className="text-muted-foreground">
													Completed projects will appear here.
												</p>
											</div>
										)
									}
								</TabsContent>
							</Tabs>
						</div>
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Code className="h-5 w-5" />
										Developers ({data.developers.length})
									</CardTitle>
								</CardHeader>
								<CardContent>
									{
										data.developers.length > 0 ? (
											<div className="space-y-4">
												{
													data.developers.map((developer) => (
														<DeveloperCard key={developer.id} developer={developer} />
													))
												}
											</div>
										) : (
											<div className="text-center py-4">
												<Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
												<p className="text-sm text-muted-foreground">
													No developers yet. Share your referral link to invite developers.
												</p>
											</div>
										)
									}
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Activity className="h-5 w-5" />
										Developer Activity
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{
											data.developers.map((developer) => (

												<div key={developer.id} className="space-y-2">
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-2">
															<Avatar className="h-6 w-6">
																<AvatarImage src={developer.image || undefined} />
																<AvatarFallback className="text-xs">
																	{developer.name?.charAt(0) || 'D'}
																</AvatarFallback>
															</Avatar>
															<span className="text-sm font-medium">{developer.name}</span>
														</div>
														<Badge variant="outline" className="text-xs">
															{developer.taskStats.completionRate}%
														</Badge>
													</div>
													<div className="space-y-1">
														<div className="flex justify-between text-xs text-muted-foreground">
															<span>{developer.taskStats.completed} completed</span>
															<span>{developer.taskStats.total} total</span>
														</div>
														<Progress value={developer.taskStats.completionRate} className="h-1" />
													</div>
												</div>
											))
										}
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function ProjectCard({ project }: { project: { id: string; title: string; slug: string; description: string | null; status: string; budget: number; paidAmount: number; currency: string; createdAt: Date; user: { id: string; name: string | null; email: string | null; image: string | null }; tasks: { id: string; title: string; status: string }[] } }) {
	const completedTasks = project.tasks.filter((task) => task.status === 'COMPLETED').length
	const totalTasks = project.tasks.length
	const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
	const paymentProgress = project.budget > 0 ? (project.paidAmount / project.budget) * 100 : 0

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<Link href={`/projects/${project.slug}`} className="hover:underline">
							<CardTitle className="text-lg">{project.title}</CardTitle>
						</Link>
						<CardDescription className="line-clamp-2">
							{project.description || "No description provided"}
						</CardDescription>
					</div>
					<Badge
						className={`${project.status === Status.COMPLETED ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
					>
						{project.status}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<Target className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Progress</span>
							</div>
							<div className="space-y-1">
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>{completedTasks} / {totalTasks} tasks</span>
									<span>{Math.round(progress)}%</span>
								</div>
								<Progress value={progress} className="h-2" />
							</div>
						</div>
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<DollarSign className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Payment</span>
							</div>
							<div className="space-y-1">
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>{formatCurrency(project.paidAmount, project.currency)}</span>
									<span>{Math.round(paymentProgress)}%</span>
								</div>
								<Progress value={paymentProgress} className="h-2" />
							</div>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">
								{new Date(project.createdAt).toLocaleDateString()}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Avatar className="h-6 w-6">
								<AvatarImage src={project.user.image || undefined} />
								<AvatarFallback className="text-xs">
									{project.user.name?.charAt(0) || 'C'}
								</AvatarFallback>
							</Avatar>
							<span className="text-sm text-muted-foreground">{project.user.name}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

function DeveloperCard({ developer }: { developer: { id: string; name: string | null; email: string | null; image: string | null; role: string; createdAt: Date; assignedTasks: { id: string; title: string; status: string; createdAt: Date; project: { id: string; title: string; slug: string } }[]; taskStats: { total: number; completed: number; inProgress: number; completionRate: number } } }) {
	return (
		<div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
			<Avatar className="h-10 w-10">
				<AvatarImage src={developer.image || undefined} />
				<AvatarFallback>{developer.name?.charAt(0) || 'D'}</AvatarFallback>
			</Avatar>
			<div className="flex-1 space-y-1">
				<div className="flex items-center justify-between">
					<h4 className="font-medium">{developer.name}</h4>
					<Badge variant="secondary" className="text-xs">
						{developer.taskStats.total} tasks
					</Badge>
				</div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>{developer.taskStats.completed} completed</span>
					<span>•</span>
					<span>{developer.taskStats.inProgress} in progress</span>
				</div>
			</div>
		</div>
	)
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
	return <label className={className}>{children}</label>
} 