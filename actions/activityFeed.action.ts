"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ActivityItem, ActivityFilters, ActivityType } from "@/lib/utils/activityFeed"

interface GetActivitiesOptions extends ActivityFilters {
  includeSelfActivities?: boolean // Whether to include activities by the current user
}

/**
 * Get activity feed data for the current user based on their role and projects
 */
export async function getActivities(options: GetActivitiesOptions = {}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { 
        success: false, 
        error: "Unauthorized", 
        activities: [] 
      }
    }

    const userId = session.user.id
    const userRole = session.user.role
    const activities: ActivityItem[] = []

    // Determine which projects the user can see activities for
    let projectIds: string[] = []
    
    if (userRole === 'ADMIN') {
      // Admin can see all activities
      const projects = await prisma.project.findMany({
        select: { id: true }
      })
      projectIds = projects.map(p => p.id)
    } else if (userRole === 'PRODUCTMANAGER') {
      // Product managers can see activities for their company's projects
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { managedCompany: { include: { users: { select: { projects: { select: { id: true } } } } } } }
      })
      
      if (user?.managedCompany) {
        const allProjects = user.managedCompany.users.flatMap(u => u.projects.map(p => p.id))
        projectIds = [...new Set(allProjects)]
      }
    } else {
      // Clients and developers can see activities for projects they're part of
      const userProjects = await prisma.project.findMany({
        where: {
          OR: [
            { userId }, // Projects they own
            { members: { some: { userId } } } // Projects they're members of
          ]
        },
        select: { id: true }
      })
      projectIds = userProjects.map(p => p.id)
    }

    // Apply project filter from options
    if (options.projectIds && options.projectIds.length > 0) {
      projectIds = projectIds.filter(id => options.projectIds!.includes(id))
    }

    // Date range for queries
    const dateFrom = options.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    const dateTo = options.dateTo || new Date()
    const limit = options.limit || 50

    // 1. Project Activities
    if (!options.types || options.types.some(t => t.startsWith('project_'))) {
      const projects = await prisma.project.findMany({
        where: {
          id: { in: projectIds },
          createdAt: { gte: dateFrom, lte: dateTo }
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true, role: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      projects.forEach(project => {
        activities.push({
          id: `project_created_${project.id}`,
          type: 'project_created',
          title: 'New Project Created',
          description: `Created project "${project.title}"`,
          timestamp: project.createdAt,
          user: project.user,
          metadata: {
            projectId: project.id,
            projectSlug: project.slug,
            projectTitle: project.title
          },
          actionUrl: `/projects/${project.slug}`
        })
      })
    }

    // 2. Task Activities
    if (!options.types || options.types.some(t => t.startsWith('task_'))) {
      const tasks = await prisma.task.findMany({
        where: {
          projectId: { in: projectIds },
          createdAt: { gte: dateFrom, lte: dateTo }
        },
        include: {
          project: { 
            select: { id: true, slug: true, title: true, user: { 
              select: { id: true, name: true, email: true, image: true, role: true }
            }}
          },
          assignedDeveloper: {
            select: { id: true, name: true, email: true, image: true, role: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      tasks.forEach(task => {
        // Task created
        activities.push({
          id: `task_created_${task.id}`,
          type: 'task_created',
          title: 'Task Created',
          description: `Created task "${task.title}" in ${task.project.title}`,
          timestamp: task.createdAt,
          user: task.project.user,
          metadata: {
            projectId: task.projectId,
            projectSlug: task.project.slug,
            projectTitle: task.project.title,
            taskId: task.id,
            taskTitle: task.title
          },
          actionUrl: `/projects/${task.project.slug}`
        })

        // Task assigned (if assigned to someone)
        if (task.assignedDeveloper) {
          activities.push({
            id: `task_assigned_${task.id}`,
            type: 'task_assigned',
            title: 'Task Assigned',
            description: `Assigned "${task.title}" to ${task.assignedDeveloper.name || task.assignedDeveloper.email}`,
            timestamp: task.createdAt,
            user: task.project.user,
            metadata: {
              projectId: task.projectId,
              projectSlug: task.project.slug,
              projectTitle: task.project.title,
              taskId: task.id,
              taskTitle: task.title,
              targetUserId: task.assignedDeveloper.id,
              targetUserName: task.assignedDeveloper.name || undefined
            },
            actionUrl: `/projects/${task.project.slug}`
          })
        }
      })
    }

    // 3. SubTask Activities
    if (!options.types || options.types.some(t => t.startsWith('subtask_'))) {
      const subtasks = await prisma.subTask.findMany({
        where: {
          task: { projectId: { in: projectIds } },
          createdAt: { gte: dateFrom, lte: dateTo }
        },
        include: {
          task: {
            include: {
              project: { 
                select: { id: true, slug: true, title: true }
              },
              assignedDeveloper: {
                select: { id: true, name: true, email: true, image: true, role: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      subtasks.forEach(subtask => {
        if (subtask.task.assignedDeveloper) {
          activities.push({
            id: `subtask_created_${subtask.id}`,
            type: 'subtask_created',
            title: 'Subtask Created',
            description: `Created subtask "${subtask.title}" in task "${subtask.task.title}"`,
            timestamp: subtask.createdAt,
            user: subtask.task.assignedDeveloper,
            metadata: {
              projectId: subtask.task.projectId,
              projectSlug: subtask.task.project.slug,
              projectTitle: subtask.task.project.title,
              taskId: subtask.task.id,
              taskTitle: subtask.task.title
            },
            actionUrl: `/projects/${subtask.task.project.slug}`
          })

          // If subtask is completed, add completion activity
          if (subtask.completed) {
            activities.push({
              id: `subtask_completed_${subtask.id}`,
              type: 'subtask_completed',
              title: 'Subtask Completed',
              description: `Completed subtask "${subtask.title}"`,
              timestamp: subtask.updatedAt,
              user: subtask.task.assignedDeveloper,
              metadata: {
                projectId: subtask.task.projectId,
                projectSlug: subtask.task.project.slug,
                projectTitle: subtask.task.project.title,
                taskId: subtask.task.id,
                taskTitle: subtask.task.title
              },
              actionUrl: `/projects/${subtask.task.project.slug}`
            })
          }
        }
      })
    }

    // 4. Message Activities
    if (!options.types || options.types.includes('message_sent')) {
      const messages = await prisma.message.findMany({
        where: {
          projectId: { in: projectIds },
          createdAt: { gte: dateFrom, lte: dateTo }
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true, role: true }
          },
          project: {
            select: { id: true, slug: true, title: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      messages.forEach(message => {
        activities.push({
          id: `message_sent_${message.id}`,
          type: 'message_sent',
          title: 'Message Sent',
          description: `Sent a message in ${message.project.title}`,
          timestamp: message.createdAt,
          user: message.user,
          metadata: {
            projectId: message.projectId,
            projectSlug: message.project.slug,
            projectTitle: message.project.title
          },
          actionUrl: `/projects/${message.project.slug}/chat`
        })
      })
    }

    // 5. Feedback Activities
    if (!options.types || options.types.some(t => t.startsWith('feedback_'))) {
      const feedbacks = await prisma.feedback.findMany({
        where: {
          projectId: { in: projectIds },
          createdAt: { gte: dateFrom, lte: dateTo }
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true, role: true }
          },
          project: {
            select: { id: true, slug: true, title: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      feedbacks.forEach(feedback => {
        activities.push({
          id: `feedback_created_${feedback.id}`,
          type: 'feedback_created',
          title: 'Feedback Submitted',
          description: `Submitted feedback "${feedback.title}" for ${feedback.project.title}`,
          timestamp: feedback.createdAt,
          user: feedback.user,
          metadata: {
            projectId: feedback.projectId,
            projectSlug: feedback.project.slug,
            projectTitle: feedback.project.title
          },
          actionUrl: `/projects/${feedback.project.slug}/feedback`
        })
      })
    }

    // 6. User Activities (for PMs and Admins)
    if ((userRole === 'PRODUCTMANAGER' || userRole === 'ADMIN') && 
        (!options.types || options.types.some(t => t.startsWith('user_')))) {
      
      let userQuery: any = {
        createdAt: { gte: dateFrom, lte: dateTo }
      }

      // For PMs, only show users from their company
      if (userRole === 'PRODUCTMANAGER') {
        const pmUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { companyId: true }
        })
        if (pmUser?.companyId) {
          userQuery.companyId = pmUser.companyId
        }
      }

      const recentUsers = await prisma.user.findMany({
        where: userQuery,
        orderBy: { createdAt: 'desc' },
        take: Math.min(limit, 20), // Limit user activities
        select: { id: true, name: true, email: true, image: true, role: true, createdAt: true }
      })

      recentUsers.forEach(user => {
        activities.push({
          id: `user_joined_${user.id}`,
          type: 'user_joined',
          title: 'New User Joined',
          description: `${user.name || user.email} joined as ${user.role.toLowerCase()}`,
          timestamp: user.createdAt,
          user: user,
          metadata: {
            targetUserId: user.id,
            targetUserName: user.name || undefined
          }
        })
      })
    }

    // Filter by user IDs if specified
    let filteredActivities = activities
    if (options.userIds && options.userIds.length > 0) {
      filteredActivities = activities.filter(activity => 
        options.userIds!.includes(activity.user.id)
      )
    }

    // Filter out self activities if requested
    if (options.includeSelfActivities === false) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.user.id !== userId
      )
    }

    // Sort by timestamp (newest first) and apply final limit
    filteredActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    filteredActivities = filteredActivities.slice(0, options.limit || 50)

    return {
      success: true,
      activities: filteredActivities
    }

  } catch (error) {
    console.error("Get activities error:", error)
    return {
      success: false,
      error: "Failed to fetch activities",
      activities: []
    }
  }
}

/**
 * Get recent activities for dashboard (simplified version)
 */
export async function getDashboardActivities(limit = 10) {
  return getActivities({
    limit,
    includeSelfActivities: false,
    // Only include most important activity types for dashboard
    types: [
      'project_created',
      'task_assigned',
      'task_status_changed', 
      'subtask_completed',
      'feedback_created',
      'user_joined'
    ]
  })
}

/**
 * Get project-specific activities
 */
export async function getProjectActivities(projectId: string, limit = 20) {
  return getActivities({
    projectIds: [projectId],
    limit,
    includeSelfActivities: true
  })
}