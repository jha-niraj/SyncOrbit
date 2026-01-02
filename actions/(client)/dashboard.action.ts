'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Status, TaskStatus } from "@prisma/client";

import { ProjectWithRelations } from "@/types/project";
import { ClientDashboardData, Invoice } from "@/types/dashboard";

export async function getClientDashboardData(): Promise<ClientDashboardData> {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				totalSpent: true
			}
		});

		if (!user) {
			throw new Error("User not found");
		}

		// Fetch projects
		const projects = await prisma.project.findMany({
			where: { userId: session.user.id },
			include: {
				user: true,
				assignedTeams: {
					include: {
						team: {
							include: {
								head: true
							}
						}
					}
				},
				members: {
					include: {
						user: true
					}
				},
				tasks: {
					include: {
						assignedDeveloper: true,
						assignedTeam: true,
						project: true,
						subtasks: true,
						_count: true
					}
				},
				_count: {
					select: {
						tasks: true,
						messages: true,
						feedbacks: true,
						members: true
					}
				}
			},
			orderBy: { updatedAt: 'desc' }
		}) as ProjectWithRelations[];

		// Fetch payments as invoices
		const payments = await prisma.payment.findMany({
			where: { userId: session.user.id },
			orderBy: { createdAt: 'desc' },
			take: 5
		});

		const invoices: Invoice[] = payments.map(p => ({
			id: p.id,
			amount: p.amount,
			status: p.status,
			createdAt: p.createdAt
		}));

		// Calculate stats
		const activeProjects = projects.filter(p => p.status === Status.IN_PROGRESS).length;

		let totalFiles = 0;
		projects.forEach(p => {
			p.tasks.forEach(t => {
				totalFiles += t._count?.attachments || 0;
			});
		});

		// Count messages
		const unreadMessages = await prisma.message.count({
			where: {
				project: { userId: session.user.id },
				userId: { not: session.user.id }
			}
		});

		return {
			projects,
			invoices,
			stats: {
				activeProjects,
				totalFiles,
				unreadMessages
			}
		};

	} catch (error) {
		console.error('Error fetching dashboard data:', error);
		throw error;
	}
}

// Get Developer Internal Dashboard Data (Internal Projects)
export async function getDeveloperInternalDashboardData() {
	return getDeveloperDashboardDataByType('INTERNAL')
}

// Get Developer External Dashboard Data (External Projects)
export async function getDeveloperExternalDashboardData() {
	return getDeveloperDashboardDataByType('EXTERNAL')
}

// Helper function to get developer dashboard data by client type
async function getDeveloperDashboardDataByType(type: 'INTERNAL' | 'EXTERNAL') {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Check if user is developer or product manager
		if (!['TEAM_MEMBER', 'TEAM_HEAD', 'COMPANY_OWNER'].includes(session.user.role)) {
			throw new Error("Access denied");
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				skills: true,
			}
		});

		if (!user) {
			throw new Error("User not found");
		}

		// Get projects assigned to this developer filtered by client type
		const projects = await prisma.project.findMany({
			where: {
				tasks: {
					some: {
						assignedDeveloperId: session.user.id
					}
				},
				clientType: type === 'INTERNAL' ? 'INTERNAL' : 'EXTERNAL'
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					}
				},
				tasks: {
					where: {
						assignedDeveloperId: session.user.id
					},
					select: {
						id: true,
						title: true,
						description: true,
						status: true,
						createdAt: true,
						updatedAt: true,
					}
				},
				_count: {
					select: {
						tasks: true,
						feedbacks: true,
					}
				}
			},
			orderBy: {
				updatedAt: 'desc'
			}
		});

		// Get task statistics
		const allTasks = await prisma.task.findMany({
			where: {
				assignedDeveloperId: session.user.id,
				project: {
					clientType: type === 'INTERNAL' ? 'INTERNAL' : 'EXTERNAL'
				}
			},
			select: {
				status: true
			}
		});

		const taskStats = {
			total: allTasks.length,
			completed: allTasks.filter(task => task.status === 'COMPLETED').length,
			inProgress: allTasks.filter(task => task.status === 'IN_PROGRESS').length,
			yetToStart: allTasks.filter(task => task.status === 'YET_TO_START').length,
		};

		// Get project statistics
		const projectStats = {
			total: projects.length,
			inProgress: projects.filter(p => p.status === 'IN_PROGRESS').length,
			completed: projects.filter(p => p.status === 'COMPLETED').length,
			onHold: projects.filter(p => p.status === 'ON_HOLD').length,
			cancelled: projects.filter(p => p.status === 'CANCELLED').length,
		};

		return {
			user,
			projects,
			taskStats,
			projectStats,
		};
	} catch (error) {
		console.error(`Error fetching developer ${type} dashboard data:`, error);
		throw error;
	}
}

// Deprecated: Use getDeveloperInternalDashboardData instead
export async function getDeveloperDashboardData() {
	return getDeveloperInternalDashboardData()
}
