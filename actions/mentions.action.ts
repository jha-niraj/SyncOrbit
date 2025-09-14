"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/actions/notifications.action"
import { 
  MentionUser, 
  getMentionedUsers, 
  createMentionNotification 
} from "@/lib/utils/mentions"

export interface MentionContext {
  type: 'task_comment' | 'project_comment' | 'message' | 'feedback'
  entityId: string
  entityTitle: string
  content: string
  projectId?: string
}

/**
 * Process mentions and create notifications
 */
export async function processMentions(
  content: string,
  context: MentionContext,
  availableUsers: MentionUser[]
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Authentication required")
    }

    const mentioner: MentionUser = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email!,
      image: session.user.image || null
    }

    // Get mentioned users from the content
    const mentionedUsers = getMentionedUsers(content, availableUsers)

    if (mentionedUsers.length === 0) {
      return { success: true, mentionedCount: 0 }
    }

    // Create notifications for each mentioned user
    const notificationPromises = mentionedUsers.map(async (user) => {
      const message = createMentionNotification(mentioner, context)
      
      return createNotification(
        user.id,
        "You were mentioned",
        message,
        "MENTION",
        getActionUrl(context),
        {
          mentionerId: mentioner.id,
          mentionerName: mentioner.name || mentioner.email,
          entityType: context.type,
          entityId: context.entityId,
          projectId: context.projectId
        }
      )
    })

    await Promise.all(notificationPromises)

    // Log the mention activity
    if (context.projectId) {
      await logMentionActivity(mentioner, mentionedUsers, context)
    }

    return {
      success: true,
      mentionedCount: mentionedUsers.length,
      mentionedUsers
    }

  } catch (error) {
    console.error('Error processing mentions:', error)
    return {
      success: false,
      error: 'Failed to process mentions'
    }
  }
}

/**
 * Get the action URL for the mention notification
 */
function getActionUrl(context: MentionContext): string {
  switch (context.type) {
    case 'task_comment':
      return `/projects/${context.projectId}?task=${context.entityId}`
    case 'project_comment':
      return `/projects/${context.entityId}`
    case 'message':
      return `/projects/${context.projectId}/messages`
    case 'feedback':
      return `/projects/${context.projectId}/feedback`
    default:
      return '/dashboard'
  }
}

/**
 * Log mention activity for project timeline
 */
async function logMentionActivity(
  mentioner: MentionUser,
  mentionedUsers: MentionUser[],
  context: MentionContext
) {
  if (!context.projectId) return

  try {
    // This could be expanded to create activity log entries
    // For now, we'll just log to console
    console.log(`${mentioner.name || mentioner.email} mentioned ${mentionedUsers.length} users in ${context.type}`)
  } catch (error) {
    console.error('Error logging mention activity:', error)
  }
}

/**
 * Get available users for mentions in a project
 */
export async function getProjectMentionUsers(projectId: string): Promise<MentionUser[]> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return []
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id },
          { 
            user: {
              companyId: {
                not: null
              }
            }
          }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        tasks: {
          include: {
            assignedDeveloper: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    })

    if (!project) {
      return []
    }

    const users = new Map<string, MentionUser>()

    // Add the client
    if (project.user && project.user.id !== session.user.id) {
      users.set(project.user.id, {
        id: project.user.id,
        name: project.user.name,
        email: project.user.email,
        image: project.user.image
      })
    }

    // Add assigned developers
    project.tasks.forEach(task => {
      if (task.assignedDeveloper && task.assignedDeveloper.id !== session.user.id) {
        users.set(task.assignedDeveloper.id, {
          id: task.assignedDeveloper.id,
          name: task.assignedDeveloper.name,
          email: task.assignedDeveloper.email,
          image: task.assignedDeveloper.image
        })
      }
    })

    return Array.from(users.values()).sort((a, b) => {
      const nameA = a.name || a.email || ''
      const nameB = b.name || b.email || ''
      return nameA.localeCompare(nameB)
    })

  } catch (error) {
    console.error('Error fetching project mention users:', error)
    return []
  }
}

/**
 * Validate user can mention others in a project
 */
export async function canMentionInProject(projectId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return false
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id },
          { 
            user: {
              companyId: {
                not: null
              }
            }
          }
        ]
      }
    })

    return !!project

  } catch (error) {
    console.error('Error checking mention permissions:', error)
    return false
  }
}

/**
 * Search users for mentions across the organization
 */
export async function searchMentionUsers(query: string, limit = 10): Promise<MentionUser[]> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return []
    }

    // Get user's company
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true }
    })

    if (!user?.companyId) {
      return []
    }

    // Search within the company
    const users = await prisma.user.findMany({
      where: {
        companyId: user.companyId,
        id: { not: session.user.id },
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      },
      take: limit,
      orderBy: [
        { name: 'asc' },
        { email: 'asc' }
      ]
    })

    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image
    }))

  } catch (error) {
    console.error('Error searching mention users:', error)
    return []
  }
}