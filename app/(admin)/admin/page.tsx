import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, MessageSquare, TrendingUp } from "lucide-react"
import Link from "next/link"
import { getAdminDashboardData } from "@/actions/(admin)/dashboard.action"
import { formatDate } from "@/lib/utils"

interface Project {
	id: string;
	title: string;
	slug: string;
	status: string;
	budget: number;
	currency: string;
	startDate: Date;
	createdAt: Date;
	user: {
		name: string | null;
		email: string | null;
	};
	_count: {
		tasks: number;
	};
}

interface User {
	id: string;
	name: string | null;
	email: string | null;
	role: string;
	createdAt: Date;
	_count: {
		projects: number;
	};
}

export default async function AdminDashboard() {
	const result = await getAdminDashboardData()

	if (!result.success) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						Error Loading Dashboard
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						{result.error || "Failed to load dashboard data"}
					</p>
				</div>
			</div>
		)
	}

	const { systemOverview, users, projects } = result.data!

	const formatCurrencyAmount = (amount: number, currency: string) => {
		const symbols = {
			USD: '$',
			INR: '₹',
			NPR: 'Rs.'
		};
		return `${symbols[currency as keyof typeof symbols] || currency} ${amount.toLocaleString()}`;
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'IN_PROGRESS':
				return "bg-blue-100 text-blue-700 border-blue-200"
			case 'COMPLETED':
				return "bg-green-100 text-green-700 border-green-200"
			case 'ON_HOLD':
				return "bg-yellow-100 text-yellow-700 border-yellow-200"
			case 'CANCELLED':
				return "bg-red-100 text-red-700 border-red-200"
			default:
				return "bg-gray-100 text-gray-700 border-gray-200"
		}
	}

	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1 p-6">
				<div className="max-w-7xl mx-auto space-y-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
								Admin Dashboard
							</h1>
							<p className="text-gray-600 dark:text-gray-400 mt-1">
								Overview of your system and recent activity
							</p>
						</div>
						<Link href="/admin/createproject">
							<Button className="bg-blue-600 hover:bg-blue-700">
								Create New Project
							</Button>
						</Link>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Users</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{systemOverview.totalUsers}</div>
								<p className="text-xs text-muted-foreground">
									<span className="text-green-600 font-medium">+{systemOverview.recentUsers}</span> new this month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Projects</CardTitle>
								<FileText className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{systemOverview.totalProjects}</div>
								<p className="text-xs text-muted-foreground">
									<span className="text-green-600 font-medium">+{systemOverview.recentProjects}</span> new this month
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
								<MessageSquare className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{systemOverview.totalFeedback}</div>
								<p className="text-xs text-muted-foreground">
									<span className="text-green-600 font-medium">+{systemOverview.recentFeedback}</span> new this month
								</p>
							</CardContent>
						</Card>
					</div>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="h-5 w-5" />
								Recent Projects
							</CardTitle>
							<CardDescription>
								Latest projects created in the system
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Project Name</TableHead>
											<TableHead>Client</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Budget</TableHead>
											<TableHead>Tasks</TableHead>
											<TableHead>Created</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{
											projects.length > 0 ? (
												projects.map((project: Project) => (
													<TableRow key={project.id}>
														<TableCell className="font-medium">
															<Link
																href={`/projects/${project.slug}`}
																className="hover:text-blue-600 transition-colors"
															>
																{project.title}
															</Link>
														</TableCell>
														<TableCell>
															<div>
																<div className="font-medium">
																	{project.user.name || "Unknown"}
																</div>
																<div className="text-sm text-gray-500">
																	{project.user.email}
																</div>
															</div>
														</TableCell>
														<TableCell>
															<Badge className={`${getStatusColor(project.status)} border text-xs`}>
																{project.status.replace('_', ' ')}
															</Badge>
														</TableCell>
														<TableCell>
															<div className="font-medium">
																{formatCurrencyAmount(project.budget, project.currency)}
															</div>
														</TableCell>
														<TableCell>
															<div className="text-sm">
																{project._count.tasks} tasks
															</div>
														</TableCell>
														<TableCell>
															<div className="text-sm text-gray-500">
																{formatDate(project.createdAt)}
															</div>
														</TableCell>
														<TableCell>
															<Link href={`/projects/${project.slug}`}>
																<Button variant="outline" size="sm">
																	View
																</Button>
															</Link>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell colSpan={7} className="text-center py-8">
														<div className="text-gray-500 dark:text-gray-400">
															No projects found
														</div>
													</TableCell>
												</TableRow>
											)
										}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="h-5 w-5" />
								Recent Users
							</CardTitle>
							<CardDescription>
								Recently registered users in the system
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Email</TableHead>
											<TableHead>Role</TableHead>
											<TableHead>Projects</TableHead>
											<TableHead>Joined</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{
											users.length > 0 ? (
												users.map((user: User) => (
													<TableRow key={user.id}>
														<TableCell className="font-medium">
															{user.name || "Unknown"}
														</TableCell>
														<TableCell>{user.email}</TableCell>
														<TableCell>
															<Badge variant="outline" className="text-xs">
																{user.role}
															</Badge>
														</TableCell>
														<TableCell>
															<div className="text-sm">
																{user._count.projects} projects
															</div>
														</TableCell>
														<TableCell>
															<div className="text-sm text-gray-500">
																{formatDate(user.createdAt)}
															</div>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell colSpan={5} className="text-center py-8">
														<div className="text-gray-500 dark:text-gray-400">
															No users found
														</div>
													</TableCell>
												</TableRow>
											)
										}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	)
}