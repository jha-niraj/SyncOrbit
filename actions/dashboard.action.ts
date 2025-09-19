"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { 
  DashboardMetrics, 
  calculatePercentageChange, 
  calculateCompletionRate, 
  calculateTeamUtilization, 
  getTimePeriods,
  generateTrendData
} from "@/lib/utils/dashboardStats"
import { differenceInDays } from "date-fns"

export async function getDashboardMetrics(): Promise<DashboardMetrics | null> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true }
    })

    if (!user?.companyId) {
      return null
    }

    const timePeriods = getTimePeriods()

    // Get all projects for the company
    const allProjects = await prisma.project.findMany({
      where: {
        user: {
          companyId: user.companyId
        }
      },
      include: {
        tasks: {
          include: {
            assignedDeveloper: true
          }
        },
        user: {
          include: {
            company: true
          }
        }
      }
    })

    // Get projects from last month for comparison
    const lastMonthProjects = await prisma.project.findMany({
      where: {
        user: {
          companyId: user.companyId
        },
        createdAt: {
          gte: timePeriods.lastMonth.start,
          lte: timePeriods.lastMonth.end
        }
      }
    })

    // Get this month's projects
    const thisMonthProjects = await prisma.project.findMany({
      where: {
        user: {
          companyId: user.companyId
        },
        createdAt: {
          gte: timePeriods.thisMonth.start,
          lte: timePeriods.thisMonth.end
        }
      }
    })

    // Get all tasks
    const allTasks = allProjects.flatMap(project => project.tasks)
    
    // Calculate project statistics
    const activeProjects = allProjects.filter(p => p.status === 'IN_PROGRESS')
    const completedProjects = allProjects.filter(p => p.status === 'COMPLETED')
    const onHoldProjects = allProjects.filter(p => p.status === 'ON_HOLD')
    const overdueProjects = allProjects.filter(p => 
      p.endDate && new Date(p.endDate) < new Date() && p.status !== 'COMPLETED'
    )

    // Calculate task statistics
    const completedTasks = allTasks.filter(t => t.status === 'COMPLETED')
    const inProgressTasks = allTasks.filter(t => t.status === 'IN_PROGRESS')
    // Note: Tasks don't have dueDate in current schema, using createdAt as fallback
    const overdueTasks = allTasks.filter(t => 
      new Date(t.createdAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && t.status === 'IN_PROGRESS'
    )

    // Get team statistics
    const teamMembers = await prisma.user.findMany({
      where: { companyId: user.companyId }
    })
    
    const developers = teamMembers.filter(u => u.role === 'TEAM_MEMBER')
    const activeDevelopers = developers.filter(d => 
      allTasks.some(t => t.assignedDeveloperId === d.id && t.status === 'IN_PROGRESS')
    )

    // Get new team members this month
    const newMembersThisMonth = await prisma.user.count({
      where: {
        companyId: user.companyId,
        createdAt: {
          gte: timePeriods.thisMonth.start,
          lte: timePeriods.thisMonth.end
        }
      }
    })

    // Calculate revenue statistics
    const totalRevenue = allProjects.reduce((sum, project) => {
      // Convert all to USD for calculation (simplified)
      let amount = project.budget
      if (project.currency === 'INR') amount = amount / 83 // Rough conversion
      if (project.currency === 'NPR') amount = amount / 133 // Rough conversion
      return sum + amount
    }, 0)

    const thisMonthRevenue = thisMonthProjects.reduce((sum, project) => {
      let amount = project.budget
      if (project.currency === 'INR') amount = amount / 83
      if (project.currency === 'NPR') amount = amount / 133
      return sum + amount
    }, 0)

    const lastMonthRevenue = lastMonthProjects.reduce((sum, project) => {
      let amount = project.budget
      if (project.currency === 'INR') amount = amount / 83
      if (project.currency === 'NPR') amount = amount / 133
      return sum + amount
    }, 0)

    const pendingProjects = allProjects.filter(p => p.status !== 'COMPLETED')
    const pendingPayments = pendingProjects.reduce((sum, project) => {
      let amount = project.budget
      if (project.currency === 'INR') amount = amount / 83
      if (project.currency === 'NPR') amount = amount / 133
      return sum + amount
    }, 0)

    // Get client statistics
    const allClients = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
        projects: {
          some: {
            user: {
              companyId: user.companyId
            }
          }
        }
      },
      include: {
        projects: {
          where: {
            user: {
              companyId: user.companyId
            }
          }
        }
      }
    })

    const activeClients = allClients.filter(c => 
      c.projects.some(p => p.status === 'IN_PROGRESS')
    )

    const newClientsThisMonth = await prisma.user.count({
      where: {
        role: 'CLIENT',
        createdAt: {
          gte: timePeriods.thisMonth.start,
          lte: timePeriods.thisMonth.end
        },
        projects: {
          some: {
            user: {
              companyId: user.companyId
            }
          }
        }
      }
    })

    // Get feedback for client satisfaction
    const feedbacks = await prisma.feedback.findMany({
      where: {
        project: {
          user: {
            companyId: user.companyId
          }
        }
      }
    })

    // Calculate average satisfaction (assuming feedback has rating field)
    const averageSatisfaction = feedbacks.length > 0 
      ? feedbacks.reduce((sum, f) => sum + 4.2, 0) / feedbacks.length // Mock rating
      : 4.0

    // Calculate metrics
    const revenueGrowth = calculatePercentageChange(thisMonthRevenue, lastMonthRevenue)
    const projectCompletionRate = calculateCompletionRate(completedProjects.length, allProjects.length)
    const taskCompletionRate = calculateCompletionRate(completedTasks.length, allTasks.length)
    const teamUtilization = calculateTeamUtilization(activeDevelopers.length, allTasks.length, allProjects.length)
    
    // Calculate averages
    const averageProjectValue = allProjects.length > 0 ? totalRevenue / allProjects.length : 0
    const averageTasksPerProject = allProjects.length > 0 ? allTasks.length / allProjects.length : 0
    const averageTasksPerDeveloper = developers.length > 0 ? allTasks.length / developers.length : 0
    
    // Calculate average project duration
    const completedProjectDurations = completedProjects
      .filter(p => p.startDate && p.endDate)
      .map(p => differenceInDays(new Date(p.endDate!), new Date(p.startDate!)))
    
    const averageProjectDuration = completedProjectDurations.length > 0
      ? completedProjectDurations.reduce((sum, days) => sum + days, 0) / completedProjectDurations.length
      : 0

    // Calculate team efficiency (mock calculation)
    const teamEfficiency = taskCompletionRate * (teamUtilization / 100)
    
    // Calculate client retention rate (simplified)
    const clientRetentionRate = allClients.length > 0 
      ? (activeClients.length / allClients.length) * 100 
      : 0

    return {
      revenueStats: {
        totalRevenue,
        monthlyRevenue: thisMonthRevenue,
        previousMonthRevenue: lastMonthRevenue,
        revenueGrowth,
        pendingPayments,
        averageProjectValue,
        monthlyTrend: generateTrendData(thisMonthRevenue, 12)
      },
      projectStats: {
        total: allProjects.length,
        active: activeProjects.length,
        completed: completedProjects.length,
        onHold: onHoldProjects.length,
        overdue: overdueProjects.length,
        completionRate: projectCompletionRate,
        averageProjectDuration,
        projectsTrend: generateTrendData(allProjects.length, 7)
      },
      taskStats: {
        total: allTasks.length,
        completed: completedTasks.length,
        inProgress: inProgressTasks.length,
        overdue: overdueTasks.length,
        completionRate: taskCompletionRate,
        averageTasksPerProject,
        tasksTrend: generateTrendData(allTasks.length, 7)
      },
      teamStats: {
        totalMembers: teamMembers.length,
        activeDevelopers: activeDevelopers.length,
        utilization: teamUtilization,
        averageTasksPerDeveloper,
        teamEfficiency,
        newMembersThisMonth,
        utilizationTrend: generateTrendData(teamUtilization, 7)
      },
      clientStats: {
        totalClients: allClients.length,
        activeClients: activeClients.length,
        newClientsThisMonth,
        clientRetentionRate,
        averageSatisfaction,
        clientsTrend: generateTrendData(allClients.length, 7)
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return null
  }
}