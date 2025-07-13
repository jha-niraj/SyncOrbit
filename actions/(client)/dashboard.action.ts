'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Status, TaskStatus } from "@prisma/client";

interface ProjectWithDetails {
	id: string;
	title: string;
	description: string | null;
	slug: string;
	status: Status;
	budget: number;
	currency: string;
	startDate: Date;
	endDate: Date | null;
	tasks: {
		id: string;
		title: string;
		status: TaskStatus;
		assignedDeveloper: {
			id: string;
			name: string | null;
			image: string | null;
		} | null;
	}[];
	feedbacks: {
		id: string;
		title: string;
		description: string | null;
		createdAt: Date;
	}[];
}

interface DashboardData {
	user: {
		id: string;
		name: string | null;
		email: string | null;
		image: string | null;
		totalSpent: number;
	};
	projects: ProjectWithDetails[];
	projectStats: {
		total: number;
		inProgress: number;
		completed: number;
		onHold: number;
		cancelled: number;
	};
	taskStats: {
		total: number;
		completed: number;
		inProgress: number;
		yetToStart: number;
	};
}

export async function getClientDashboardData(): Promise<DashboardData> {
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
				totalSpent: true,
				projects: {
					select: {
						id: true,
						title: true,
						description: true,
						slug: true,
						status: true,
						budget: true,
						currency: true,
						startDate: true,
						endDate: true,
						tasks: {
							select: {
								id: true,
								title: true,
								status: true,
								assignedDeveloper: {
									select: {
										id: true,
										name: true,
										image: true
									}
								}
							}
						},
						feedbacks: {
							select: {
								id: true,
								title: true,
								description: true,
								createdAt: true
							}
						}
					}
				}
			}
		});

		if (!user) {
			throw new Error("User not found");
		}

		// Calculate project statistics
		const projectStats = {
			total: user.projects.length,
			inProgress: user.projects.filter(p => p.status === Status.IN_PROGRESS).length,
			completed: user.projects.filter(p => p.status === Status.COMPLETED).length,
			onHold: user.projects.filter(p => p.status === Status.ON_HOLD).length,
			cancelled: user.projects.filter(p => p.status === Status.CANCELLED).length
		};

		// Calculate task statistics for all projects
		const taskStats = user.projects.reduce((acc, project) => {
			acc.total += project.tasks.length;
			acc.completed += project.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
			acc.inProgress += project.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
			acc.yetToStart += project.tasks.filter(t => t.status === TaskStatus.YET_TO_START).length;
			return acc;
		}, { total: 0, completed: 0, inProgress: 0, yetToStart: 0 });

		return {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				image: user.image,
				totalSpent: user.totalSpent
			},
			projects: user.projects,
			projectStats,
			taskStats
		};
	} catch (error) {
		console.error('Error fetching dashboard data:', error);
		throw error;
	}
}

export async function getDeveloperDashboardData() {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Check if user is developer or product manager
		if (!['DEVELOPER', 'PRODUCTMANAGER'].includes(session.user.role)) {
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

		// Get projects assigned to this developer
		const projects = await prisma.project.findMany({
			where: {
				tasks: {
					some: {
						assignedDeveloperId: session.user.id
					}
				}
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
				assignedDeveloperId: session.user.id
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
		console.error('Error fetching developer dashboard data:', error);
		throw error;
	}
}
