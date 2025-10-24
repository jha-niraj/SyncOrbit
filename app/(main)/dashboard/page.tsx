import { getClientDashboardData, getDeveloperDashboardData } from "@/actions/(client)/dashboard.action";
import { getOwnerDashboardData } from "@/actions/(productmanager)/pm.action";
import { getDashboardMetrics } from "@/actions/dashboard.action";
import { auth } from "@/auth";
import { DashboardStats } from "./_components/DashboardStats";
import QuickStatsCards from "@/components/dashboard/QuickStatsCards";
import { ProjectCard } from "./_components/ProjectCard";
import { CompletedProjects } from "./_components/CompletedProjects";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Status } from "@prisma/client";
import { MessageCircle, Calendar, ArrowRight, Code, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import { DeveloperDashboard } from "./_components/developerdashboard";
import { PMDashboard } from "./_components/pmdashboard";
import { ActivityFeed } from "@/components/activity-feed";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function DashboardPage() {
	const session = await auth();

	if (!session?.user) {
		return (
			<div className="min-h-screen bg-gradient-to-bl dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
					<p className="text-gray-600 mt-2">Please sign in to continue</p>
				</div>
			</div>
		);
	}

	const userRole = session.user.role;
    console.log(session.user);

	if (userRole === 'COMPANY_OWNER') {
		const result = await getOwnerDashboardData();
		if (result.success && result.data) {
			return <PMDashboard data={result.data} />;
		} else {
			return <PMSetupView />;
		}
	}

	if (userRole === 'TEAM_MEMBER') {
		const data = await getDeveloperDashboardData();
		return <DeveloperDashboardView data={data} userRole={userRole} />;
	}

	// Default to client dashboard
	const data = await getClientDashboardData();
	return await ClientDashboardView({ data });
}

function PMSetupView() {
	return (
		<div className="min-h-screen bg-gradient-to-bl dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
			<div className="max-w-2xl mx-auto p-8 text-center">
				<Card className="bg-white dark:bg-gray-800 shadow-xl">
					<CardHeader className="pb-6">
						<div className="mx-auto mb-4 w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
							<BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
						</div>
						<CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
							Welcome, Product Manager!
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
								Your company profile is being set up. Please complete your profile setup to access the full dashboard.
							</p>
						</div>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/profile">
								<Button size="lg" className="w-full sm:w-auto">
									<Users className="mr-2 h-5 w-5" />
									Complete Profile Setup
									<ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

async function ClientDashboardView({ data }: { data: any }) {
	const inProgressProjects = data.projects.filter((p: any) => p.status === Status.IN_PROGRESS);
	const completedProjects = data.projects.filter((p: any) => p.status === Status.COMPLETED);
	
	// Get enhanced dashboard metrics
	const dashboardMetrics = await getDashboardMetrics();

	if (data.projects.length === 0) {
		return (
			<div className="min-h-screen bg-gradient-to-bl dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
				<div className="max-w-2xl mx-auto p-8 text-center">
					<Card className="bg-white dark:bg-gray-800 shadow-xl">
						<CardHeader className="pb-6">
							<div className="mx-auto mb-4 w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
							</div>
							<CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
								Welcome to Shunya Tech!
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
									We&apos;re excited to have you on board! It looks like you don&apos;t have any projects yet.
									Let&apos;s get started by discussing your project requirements.
								</p>
								<p className="text-gray-600 dark:text-gray-400">
									Our team is ready to help you bring your ideas to life. Contact us to schedule a consultation or fill out our project inquiry form.
								</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link href="/contact">
									<Button size="lg" className="w-full sm:w-auto">
										<MessageCircle className="mr-2 h-5 w-5" />
										Contact Our Team
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
								<Link href="/contact">
									<Button variant="outline" size="lg" className="w-full sm:w-auto">
										<Calendar className="mr-2 h-5 w-5" />
										Schedule Meeting
									</Button>
								</Link>
							</div>
							<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
								<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
									What happens next?
								</h3>
								<ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
									<li>• We&apos;ll discuss your project requirements and goals</li>
									<li>• Our team will create a custom project proposal</li>
									<li>• Once approved, we&apos;ll start working on your project</li>
									<li>• Track progress right here in your dashboard</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-bl dark:from-black dark:via-gray-900 dark:to-black">
			<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
				<div className="flex flex-col space-y-8">
					<div className="flex flex-col space-y-2">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
							Welcome back, {data.user.name}!
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Here&apos;s an overview of your projects and progress.
						</p>
					</div>
					{/* Enhanced Quick Stats Cards */}
					<QuickStatsCards 
						metrics={dashboardMetrics}
						loading={false}
					/>

					<Separator className="bg-gray-200 dark:bg-gray-800" />

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
									Projects in Progress
								</h2>
								<span className="text-sm text-gray-500 dark:text-gray-400">
									{inProgressProjects.length} active
								</span>
							</div>
							{
								inProgressProjects.length > 0 ? (
									<div className="grid gap-6">
										{
											inProgressProjects.map((project: any) => (
												<ProjectCard key={project.id} project={project} />
											))
										}
									</div>
								) : (
									<div className="text-center py-12">
										<div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
											<svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
										</div>
										<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
											No active projects
										</h3>
										<p className="text-gray-600 dark:text-gray-400">
											You don&apos;t have any projects in progress at the moment.
										</p>
									</div>
								)
							}
						</div>
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
								Completed Projects
							</h2>
							<span className="text-sm text-gray-500 dark:text-gray-400">
								{completedProjects.length} done
							</span>
						</div>
						<CompletedProjects projects={completedProjects} />
						
						{/* Activity Feed */}
						<ActivityFeed 
							variant="dashboard" 
							maxItems={8}
							showFilters={false}
							autoRefresh={true}
						/>
					</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function DeveloperDashboardView({ data, userRole }: { data: any; userRole: string }) {
	if (data.projects.length === 0) {
		return (
			<div className="min-h-screen bg-gradient-to-bl dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
				<div className="max-w-2xl mx-auto p-8 text-center">
					<Card className="bg-white dark:bg-gray-800 shadow-xl">
						<CardHeader className="pb-6">
							<div className="mx-auto mb-4 w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<Code className="w-8 h-8 text-blue-600 dark:text-blue-400" />
							</div>
							<CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
								Welcome to the Developer Platform!
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
									Hi {data.user.name}! You don&apos;t have any projects assigned yet.
								</p>
								<p className="text-gray-600 dark:text-gray-400">
									Once projects are assigned to you, you&apos;ll be able to track your tasks and collaborate with the team here.
								</p>
							</div>
							<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
								<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
									As a {userRole.toLowerCase()}, you can:
								</h3>
								<ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
									<li>• View and manage assigned tasks</li>
									<li>• Collaborate with clients through project chat</li>
									<li>• Update task status and progress</li>
									<li>• Access project resources and documentation</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return <DeveloperDashboard data={data} userRole={userRole} />;
}