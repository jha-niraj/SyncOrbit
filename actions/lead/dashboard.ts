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
                headId: session.user.id
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
                tasks: {
                    include: {
                        assignedDeveloper: true,
                        assignedTeam: true,
                        project: true,
                        subtasks: true,
                        _count: true
                    }
                },
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
                _count: {
                    select: {
                        tasks: true,
                        messages: true,
                        feedbacks: true,
                        members: true
                    }
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
                status: { in: ['YET_TO_START', 'IN_PROGRESS'] }
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
