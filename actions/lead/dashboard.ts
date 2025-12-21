"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getLeadDashboardData() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // A Team Head leads specific teams. 
        // We need to find projects where their teams are assigned.
        const myLedTeams = await prisma.team.findMany({
            where: {
                members: {
                    some: {
                        userId: session.user.id,
                        role: 'TEAM_HEAD' // Assuming memberships have roles or user.role is enough
                    }
                }
            }
        })

        const teamIds = myLedTeams.map(t => t.id)

        const teamProjects = await prisma.project.findMany({
            where: {
                assignedTeams: {
                    some: {
                        teamId: { in: teamIds }
                    }
                }
            },
            include: {
                tasks: true,
                _count: {
                    select: { tasks: true, members: true }
                }
            }
        })

        const teamMembers = await prisma.user.count({
            where: {
                teamMemberships: {
                    some: {
                        teamId: { in: teamIds }
                    }
                }
            }
        })

        const pendingTasks = await prisma.task.count({
            where: {
                project: {
                    assignedTeams: {
                        some: {
                            teamId: { in: teamIds }
                        }
                    }
                },
                status: { in: ['TODO', 'IN_PROGRESS'] }
            }
        })

        return {
            projects: teamProjects,
            stats: {
                activeProjects: teamProjects.filter(p => p.status === 'IN_PROGRESS').length,
                teamSize: teamMembers,
                pendingTasks,
                completionRate: teamProjects.length > 0
                    ? Math.round((teamProjects.filter(p => p.status === 'COMPLETED').length / teamProjects.length) * 100)
                    : 0
            }
        }
    } catch (error) {
        console.error('Error fetching lead dashboard data:', error)
        return null
    }
}
