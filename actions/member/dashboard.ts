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
                project: true
            },
            orderBy: { createdAt: 'desc' }
        })

        // Projects the user is a member of (via teams or direct)
        const myProjects = await prisma.project.findMany({
            where: {
                OR: [
                    { members: { some: { id: session.user.id } } },
                    { assignedTeams: { some: { team: { members: { some: { userId: session.user.id } } } } } }
                ]
            },
            include: {
                _count: {
                    select: { tasks: true }
                }
            }
        })

        const taskStats = {
            total: assignedTasks.length,
            todo: assignedTasks.filter(t => t.status === 'TODO').length,
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
