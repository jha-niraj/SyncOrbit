"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ActivityItem } from "@/types/dashboard"
import {
    DashboardMetrics,
    getTimePeriods,
    generateTrendData,
    calculatePercentageChange,
    calculateCompletionRate,
    calculateTeamUtilization
} from "@/lib/utils/dashboardStats"
import { differenceInDays } from "date-fns"

export async function getOwnerDashboardData() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { company: true }
        })

        if (!user?.companyId) {
            throw new Error("User has no company context")
        }

        const timePeriods = getTimePeriods()

        // Get all projects for the company
        const allProjects = await prisma.project.findMany({
            where: {
                companyId: user.companyId
            },
            include: {
                tasks: true,
                user: true,
                assignedTeams: {
                    include: {
                        team: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' },
            take: 10
        })

        // Get basic stats
        const projectStats = await prisma.project.groupBy({
            by: ['status'],
            where: { companyId: user.companyId },
            _count: true
        })

        const teamCount = await prisma.team.count({
            where: { companyId: user.companyId }
        })

        const memberCount = await prisma.user.count({
            where: { companyId: user.companyId }
        })

        // Recent activity (using notifications as fallback or returning empty)
        const recentActivity: ActivityItem[] = []

        return {
            projects: allProjects,
            stats: {
                totalProjects: projectStats.reduce((acc, curr) => acc + curr._count, 0),
                activeProjects: projectStats.find(s => s.status === 'IN_PROGRESS')?._count || 0,
                completedProjects: projectStats.find(s => s.status === 'COMPLETED')?._count || 0,
                totalTeams: teamCount,
                totalMembers: memberCount
            },
            recentActivity
        }
    } catch (error) {
        console.error('Error fetching owner dashboard data:', error)
        return null
    }
}
