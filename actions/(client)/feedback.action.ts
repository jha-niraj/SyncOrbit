"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role, FeedbackStatus } from "@prisma/client"

// Get feedback for a specific project
export async function getProjectFeedback(projectSlug: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // First get the project to verify access
        const project = await prisma.project.findUnique({
            where: { slug: projectSlug },
            include: {
                members: {
                    where: { userId: session.user.id }
                },
                tasks: {
                    where: { assignedDeveloperId: session.user.id },
                    select: { id: true }
                }
            }
        })

        if (!project) {
            throw new Error("Project not found")
        }

        // Check access permissions
        const hasAccess = 
            project.userId === session.user.id || // Client owns the project
            project.tasks.length > 0 || // Developer assigned to tasks
            project.members.length > 0 || // User is a member
            session.user.role === Role.COMPANY_OWNER // Company owner has access to all

        if (!hasAccess) {
            throw new Error("Access denied to this project")
        }

        // Get feedback for the project
        const feedback = await prisma.feedback.findMany({
            where: {
                projectId: project.id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return {
            success: true,
            feedback,
            project: {
                id: project.id,
                title: project.title,
                slug: project.slug
            }
        }
    } catch (error) {
        console.error("Get project feedback error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get feedback",
            feedback: [],
            project: null
        }
    }
}

// Create new feedback
export async function createFeedback(data: {
    projectSlug: string
    title: string
    description: string
    priority?: "LOW" | "MEDIUM" | "HIGH"
    category?: string
}) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // Get the project
        const project = await prisma.project.findUnique({
            where: { slug: data.projectSlug },
            include: {
                members: {
                    where: { userId: session.user.id }
                },
                tasks: {
                    where: { assignedDeveloperId: session.user.id },
                    select: { id: true }
                }
            }
        })

        if (!project) {
            throw new Error("Project not found")
        }

        // Check access permissions
        const hasAccess = 
            project.userId === session.user.id || // Client owns the project
            project.tasks.length > 0 || // Developer assigned to tasks
            project.members.length > 0 || // User is a member
            session.user.role === Role.COMPANY_OWNER // Company owner has access to all

        if (!hasAccess) {
            throw new Error("Access denied to this project")
        }

        // Create the feedback
        const feedback = await prisma.feedback.create({
            data: {
                title: data.title,
                description: data.description,
                status: FeedbackStatus.PENDING,
                userId: session.user.id,
                projectId: project.id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true
                    }
                }
            }
        })

        return {
            success: true,
            feedback
        }
    } catch (error) {
        console.error("Create feedback error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create feedback",
            feedback: null
        }
    }
}

// Update feedback status
export async function updateFeedbackStatus(feedbackId: string, status: FeedbackStatus) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // Get the feedback with project info
        const feedback = await prisma.feedback.findUnique({
            where: { id: feedbackId },
            include: {
                project: {
                    include: {
                        members: {
                            where: { userId: session.user.id }
                        },
                        tasks: {
                            where: { assignedDeveloperId: session.user.id },
                            select: { id: true }
                        }
                    }
                }
            }
        })

        if (!feedback) {
            throw new Error("Feedback not found")
        }

        // Check access permissions
        const hasAccess = 
            feedback.project.userId === session.user.id || // Client owns the project
            feedback.project.tasks.length > 0 || // Developer assigned to tasks
            feedback.project.members.length > 0 || // User is a member
            session.user.role === Role.COMPANY_OWNER // Company owner has access to all

        if (!hasAccess) {
            throw new Error("Access denied to this feedback")
        }

        // Update the feedback
        const updatedFeedback = await prisma.feedback.update({
            where: { id: feedbackId },
            data: { status },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true
                    }
                }
            }
        })

        return {
            success: true,
            feedback: updatedFeedback
        }
    } catch (error) {
        console.error("Update feedback status error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update feedback",
            feedback: null
        }
    }
}
