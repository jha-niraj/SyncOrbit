import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { InternalDashboard } from "@/components/dashboard/InternalDashboard"
import { Role } from "@prisma/client"

export default async function DashboardPage() {
	const session = await auth()
	if (!session?.user) redirect("/signin")

	const userRole = session.user.role

	// Redirect clients to client dashboard
	if (userRole === Role.CLIENT) {
		redirect("/dashboard/clients")
	}

	// Fetch Internal Dashboard Data
	// 1. Stats
	const totalProjects = await prisma.project.count({
		where: {
			company: {
				users: {
					some: {
						email: session.user.email
					}
				}
			}
		}
	})

	const activeProjectsCount = await prisma.project.count({
		where: {
			status: "IN_PROGRESS",
			company: {
				users: {
					some: {
						email: session.user.email
					}
				}
			}
		}
	})

	const completedProjectsCount = await prisma.project.count({
		where: {
			status: "COMPLETED",
			company: {
				users: {
					some: {
						email: session.user.email
					}
				}
			}
		}
	})

	const totalTeamMembers = await prisma.user.count({
		where: {
			company: {
				users: {
					some: {
						email: session.user.email
					}
				}
			},
			role: {
				in: [Role.TEAM_MEMBER, Role.TEAM_HEAD]
			}
		}
	})

	// 2. Recent Projects
	const recentProjects = await prisma.project.findMany({
		where: {
			company: {
				users: {
					some: {
						email: session.user.email
					}
				}
			}
		},
		orderBy: {
			updatedAt: 'desc'
		},
		take: 6,
		select: {
			id: true,
			title: true,
			description: true,
			status: true,
			endDate: true
		}
	})

	const stats = {
		totalProjects,
		activeProjects: activeProjectsCount,
		completedProjects: completedProjectsCount,
		totalTeamMembers
	}

	return <InternalDashboard user={session.user} stats={stats} recentProjects={recentProjects} />
}