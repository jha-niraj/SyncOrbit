"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role, Status } from "@prisma/client"

// Get analytics data for Product Managers and Developers
export async function getAnalyticsData() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // Only allow PMs and Developers to access analytics
        if (session.user.role === Role.CLIENT) {
            throw new Error("Analytics access is restricted to Product Managers and Developers")
        }

        // Get overview stats
        const totalProjects = await prisma.project.count()
        const activeProjects = await prisma.project.count({
            where: { status: Status.IN_PROGRESS }
        })
        const completedProjects = await prisma.project.count({
            where: { status: Status.COMPLETED }
        })
        
        // Get total revenue from all projects
        const projects = await prisma.project.findMany({
            select: { paidAmount: true }
        })
        const totalRevenue = projects.reduce((sum, project) => sum + project.paidAmount, 0)

        // Get team members count
        const teamMembers = await prisma.user.count({
            where: {
                role: {
                    in: [Role.DEVELOPER, Role.PRODUCTMANAGER]
                }
            }
        })

        // Get recent projects for stats
        const recentProjects = await prisma.project.findMany({
            take: 10,
            orderBy: { updatedAt: 'desc' },
            include: {
                user: {
                    select: { name: true }
                },
                _count: {
                    select: { tasks: true, feedbacks: true }
                }
            }
        })

        // Get team performance data
        const developers = await prisma.user.findMany({
            where: { role: Role.DEVELOPER },
            include: {
                assignedTasks: {
                    where: { status: "COMPLETED" },
                    select: { id: true }
                },
                projects: {
                    where: { status: Status.COMPLETED },
                    select: { id: true }
                }
            }
        })

        const teamPerformance = developers.map(dev => ({
            id: dev.id,
            name: dev.name || "Unknown",
            email: dev.email,
            image: dev.image,
            projectsCompleted: dev.projects.length,
            tasksCompleted: dev.assignedTasks.length,
            rating: Math.random() * 0.5 + 4.5, // Mock rating for now
            efficiency: Math.floor(Math.random() * 20 + 80) // Mock efficiency for now
        }))

        // Get recent activity
        const recentActivity = recentProjects.slice(0, 5).map(project => ({
            type: project.status === Status.COMPLETED ? "project_completed" : "project_updated",
            message: `${project.title} ${project.status === Status.COMPLETED ? "completed" : "updated"}`,
            time: formatRelativeTime(project.updatedAt),
            projectId: project.id
        }))

        // Calculate project stats by month (last 6 months)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        
        const monthlyProjects = await prisma.project.findMany({
            where: {
                createdAt: {
                    gte: sixMonthsAgo
                }
            },
            select: {
                createdAt: true,
                status: true,
                paidAmount: true
            }
        })

        const projectStats = generateMonthlyStats(monthlyProjects)

        const overview = {
            totalProjects,
            activeProjects,
            completedProjects,
            totalRevenue,
            teamMembers,
            averageProjectDuration: calculateAverageProjectDuration(recentProjects),
            clientSatisfaction: 4.7, // Mock for now
            onTimeDelivery: Math.floor(Math.random() * 20 + 80) // Mock for now
        }

        return {
            success: true,
            analytics: {
                overview,
                projectStats,
                teamPerformance,
                recentActivity
            }
        }
    } catch (error) {
        console.error("Get analytics data error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get analytics data",
            analytics: null
        }
    }
}

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
        return "Less than an hour ago"
    }
}

// Helper function to calculate average project duration
function calculateAverageProjectDuration(projects: any[]): number {
    if (projects.length === 0) return 0
    
    const completedProjects = projects.filter(p => p.status === Status.COMPLETED)
    if (completedProjects.length === 0) return 0

    const totalDuration = completedProjects.reduce((sum, project) => {
        const duration = (new Date(project.updatedAt).getTime() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30) // in months
        return sum + duration
    }, 0)

    return Math.round((totalDuration / completedProjects.length) * 10) / 10
}

// Helper function to generate monthly stats
function generateMonthlyStats(projects: any[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const stats = []
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthIndex = date.getMonth()
        const year = date.getFullYear()
        
        const monthProjects = projects.filter(p => {
            const projectDate = new Date(p.createdAt)
            return projectDate.getMonth() === monthIndex && projectDate.getFullYear() === year
        })
        
        const completed = monthProjects.filter(p => p.status === Status.COMPLETED).length
        const active = monthProjects.filter(p => p.status === Status.IN_PROGRESS).length
        const revenue = monthProjects.reduce((sum, p) => sum + p.paidAmount, 0)
        
        stats.push({
            month: months[monthIndex],
            completed,
            active,
            revenue
        })
    }
    
    return stats
}
