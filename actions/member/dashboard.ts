"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getMemberDashboardData() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // Tasks assigned directly to the user
        const assignedTasks = await prisma.task.findMany({
            where: {
                assignedDeveloperId: session.user.id
            },
            include: {
                project: true,
                assignedDeveloper: true,
                assignedTeam: true,
                subtasks: true,
                _count: true
            },
            orderBy: { createdAt: 'desc' }
        })

        // Projects the user is a member of (via teams or direct)
        const myProjects = await prisma.project.findMany({
            where: {
                OR: [
                    { members: { some: { userId: session.user.id } } },
                    { assignedTeams: { some: { team: { members: { some: { userId: session.user.id } } } } } }
                ]
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

        const taskStats = {
            total: assignedTasks.length,
            todo: assignedTasks.filter(t => t.status === 'YET_TO_START').length,
            inProgress: assignedTasks.filter(t => t.status === 'IN_PROGRESS').length,
            completed: assignedTasks.filter(t => t.status === 'COMPLETED').length
        }

        return {
            assignedTasks: assignedTasks.slice(0, 10),
            projects: myProjects,
            stats: {
                myTasks: taskStats.total,
                myInProgress: taskStats.inProgress,
                myCompleted: taskStats.completed,
                myProjects: myProjects.length
            }
        }
    } catch (error) {
        console.error('Error fetching member dashboard data:', error)
        return null
    }
}
