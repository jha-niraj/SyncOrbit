"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

// Get messages for a specific project
export async function getProjectMessages(projectSlug: string) {
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

        // Get messages for the project
        const messages = await prisma.message.findMany({
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
                createdAt: 'asc'
            }
        })

        return {
            success: true,
            messages,
            project: {
                id: project.id,
                title: project.title,
                slug: project.slug
            }
        }
    } catch (error) {
        console.error("Get project messages error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get messages",
            messages: [],
            project: null
        }
    }
}

// Send a new message
export async function sendMessage(data: {
    projectSlug: string
    content: string
    imageUrl?: string
    linkUrl?: string
    linkTitle?: string
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

        // Create the message
        const message = await prisma.message.create({
            data: {
                content: data.content,
                imageUrl: data.imageUrl,
                linkUrl: data.linkUrl,
                linkTitle: data.linkTitle,
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
            message
        }
    } catch (error) {
        console.error("Send message error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send message",
            message: null
        }
    }
}