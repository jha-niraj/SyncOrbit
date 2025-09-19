"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role, ProjectVisibility, InvitationStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { nanoid } from "nanoid"

// Schema for creating project invitations
const createProjectInviteSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    userIds: z.array(z.string()).min(1, "At least one user must be invited"),
    message: z.string().optional(),
    expiresAt: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Invalid expiration date"
    })
})

// Schema for requesting project access
const requestProjectAccessSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    message: z.string().optional()
})

// Schema for responding to invitations
const respondToInviteSchema = z.object({
    inviteId: z.string().min(1, "Invite ID is required"),
    response: z.enum(['accept', 'decline'])
})

// Helper function to check if user can invite others to a project
async function canInviteToProject(userId: string, projectId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            ownedCompany: true,
            company: true,
            ledTeams: true
        }
    })

    if (!user) return { canInvite: false, error: "User not found" }

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            assignedTeams: {
                include: { team: true }
            }
        }
    })

    if (!project) return { canInvite: false, error: "Project not found" }

    // Only private projects support invitations
    if (project.visibility !== ProjectVisibility.PRIVATE) {
        return { canInvite: false, error: "Only private projects support invitations" }
    }

    // Permission checks
    if (user.role === Role.COMPANY_OWNER) {
        // Company owners can invite to projects in their company
        const companyId = user.ownedCompany?.id || user.company?.id
        if (project.companyId === companyId) {
            return { canInvite: true, user, project }
        }
    } else if (user.role === Role.TEAM_HEAD) {
        // Team heads can invite to projects assigned to their teams
        const userTeamIds = user.ledTeams.map(t => t.id)
        const hasTeamOnProject = project.assignedTeams.some(pt => userTeamIds.includes(pt.teamId))
        
        if (hasTeamOnProject) {
            return { canInvite: true, user, project }
        }
    }

    // Project owner (client) can always invite
    if (project.userId === userId) {
        return { canInvite: true, user, project }
    }

    return { canInvite: false, error: "You don't have permission to invite users to this project" }
}

// Create project invitations
export async function createProjectInvites(data: z.infer<typeof createProjectInviteSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const validatedData = createProjectInviteSchema.parse(data)

        // Check permissions
        const { canInvite, user, project, error: permissionError } = await canInviteToProject(
            session.user.id,
            validatedData.projectId
        )

        if (!canInvite) {
            return { success: false, error: permissionError || "Cannot invite to project" }
        }

        // Check if users exist and don't already have access
        const inviteUsers = await prisma.user.findMany({
            where: {
                id: { in: validatedData.userIds }
            }
        })

        if (inviteUsers.length !== validatedData.userIds.length) {
            return { success: false, error: "One or more users not found" }
        }

        // Check for existing invites or access
        const existingInvites = await prisma.projectInvite.findMany({
            where: {
                projectId: validatedData.projectId,
                userId: { in: validatedData.userIds }
            }
        })

        const existingMembers = await prisma.projectMember.findMany({
            where: {
                projectId: validatedData.projectId,
                userId: { in: validatedData.userIds }
            }
        })

        const alreadyInvited = existingInvites.map(i => i.userId)
        const alreadyMembers = existingMembers.map(m => m.userId)
        const cannotInvite = [...new Set([...alreadyInvited, ...alreadyMembers])]

        const validUserIds = validatedData.userIds.filter(id => !cannotInvite.includes(id))

        if (validUserIds.length === 0) {
            return { success: false, error: "All selected users already have access or pending invitations" }
        }

        // Create invitations
        const invites = await prisma.$transaction(
            validUserIds.map(userId => 
                prisma.projectInvite.create({
                    data: {
                        id: nanoid(),
                        projectId: validatedData.projectId,
                        userId: userId,
                        invitedById: session.user.id
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        },
                        project: {
                            select: {
                                id: true,
                                title: true,
                                slug: true
                            }
                        }
                    }
                })
            )
        )

        revalidatePath(`/projects/${project!.slug}`)
        revalidatePath('/projects')

        return {
            success: true,
            invites,
            message: `Invitations sent to ${validUserIds.length} user(s)`,
            skippedCount: cannotInvite.length
        }
    } catch (error) {
        console.error("Create project invites error:", error)
        
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0]?.message || "Invalid input data"
            }
        }
        
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create invitations"
        }
    }
}

// Request access to a private project
export async function requestProjectAccess(data: z.infer<typeof requestProjectAccessSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const validatedData = requestProjectAccessSchema.parse(data)

        const project = await prisma.project.findUnique({
            where: { id: validatedData.projectId },
            include: {
                user: true,
                assignedTeams: {
                    include: { team: true }
                }
            }
        })

        if (!project) {
            return { success: false, error: "Project not found" }
        }

        if (project.visibility !== ProjectVisibility.PRIVATE) {
            return { success: false, error: "This project is not private" }
        }

        // Check if user already has access or pending request
        const existingInvite = await prisma.projectInvite.findFirst({
            where: {
                projectId: validatedData.projectId,
                userId: session.user.id
            }
        })

        if (existingInvite) {
            return { success: false, error: "You already have access or a request to this project" }
        }

        const existingMember = await prisma.projectMember.findFirst({
            where: {
                projectId: validatedData.projectId,
                userId: session.user.id
            }
        })

        if (existingMember) {
            return { success: false, error: "You already have access to this project" }
        }

        // Create access request
        const invite = await prisma.projectInvite.create({
            data: {
                id: nanoid(),
                projectId: validatedData.projectId,
                userId: session.user.id,
                invitedById: project.userId // Set to project owner for notification
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
                project: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                }
            }
        })

        return {
            success: true,
            invite,
            message: "Access request sent successfully"
        }
    } catch (error) {
        console.error("Request project access error:", error)
        
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0]?.message || "Invalid input data"
            }
        }
        
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to request access"
        }
    }
}

// Respond to project invitation
export async function respondToProjectInvite(data: z.infer<typeof respondToInviteSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const validatedData = respondToInviteSchema.parse(data)

        const invite = await prisma.projectInvite.findUnique({
            where: { id: validatedData.inviteId },
            include: {
                project: true,
                user: true
            }
        })

        if (!invite) {
            return { success: false, error: "Invitation not found" }
        }

        if (invite.userId !== session.user.id) {
            return { success: false, error: "You can only respond to your own invitations" }
        }

        // Since ProjectInvite doesn't have status field, we'll handle response differently
        const result = await prisma.$transaction(async (tx) => {
            // If accepted, add user as project member
            if (validatedData.response === 'accept') {
                await tx.projectMember.create({
                    data: {
                        userId: session.user.id,
                        projectId: invite.projectId,
                        role: "MEMBER",
                        addedById: invite.invitedById
                    }
                })
            }
            
            // Remove the invitation record since it's been processed
            await tx.projectInvite.delete({
                where: { id: validatedData.inviteId }
            })

            return invite
        })

        revalidatePath(`/projects/${invite.project.slug}`)
        revalidatePath('/projects')

        return {
            success: true,
            invite: result,
            message: `Invitation ${validatedData.response}ed successfully`
        }
    } catch (error) {
        console.error("Respond to project invite error:", error)
        
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0]?.message || "Invalid input data"
            }
        }
        
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to respond to invitation"
        }
    }
}

// Get user's project invitations
export async function getUserProjectInvites() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", invites: [] }
        }

        const invites = await prisma.projectInvite.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        slug: true,
                        budget: true,
                        currency: true,
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    }
                },
                invitedBy: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return {
            success: true,
            invites
        }
    } catch (error) {
        console.error("Get user project invites error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get invitations",
            invites: []
        }
    }
}

// Get project access requests (for project managers)
export async function getProjectAccessRequests(projectId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", requests: [] }
        }

        // Check permissions to view access requests
        const { canInvite, error: permissionError } = await canInviteToProject(
            session.user.id,
            projectId
        )

        if (!canInvite) {
            return { success: false, error: permissionError || "Cannot view access requests", requests: [] }
        }

        const requests = await prisma.projectInvite.findMany({
            where: {
                projectId: projectId
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
            requests
        }
    } catch (error) {
        console.error("Get project access requests error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get access requests",
            requests: []
        }
    }
}

// Approve or reject access request
export async function handleAccessRequest(inviteId: string, action: 'approve' | 'reject') {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const invite = await prisma.projectInvite.findUnique({
            where: { id: inviteId },
            include: {
                project: true,
                user: true
            }
        })

        if (!invite) {
            return { success: false, error: "Access request not found" }
        }

        // Since we don't have status field, we'll assume all invites are pending

        // Check permissions to approve/reject
        const { canInvite, error: permissionError } = await canInviteToProject(
            session.user.id,
            invite.projectId
        )

        if (!canInvite) {
            return { success: false, error: permissionError || "Cannot handle access request" }
        }

        // Handle request and add member if approved
        const result = await prisma.$transaction(async (tx) => {
            if (action === 'approve') {
                await tx.projectMember.create({
                    data: {
                        userId: invite.userId,
                        projectId: invite.projectId,
                        role: "MEMBER",
                        addedById: session.user.id
                    }
                })
            }
            
            // Remove the invite record since it's been processed
            await tx.projectInvite.delete({
                where: { id: inviteId }
            })

            return invite
        })

        revalidatePath(`/projects/${invite.project.slug}`)
        revalidatePath('/projects')

        return {
            success: true,
            result,
            message: `Access request ${action}d successfully`
        }
    } catch (error) {
        console.error("Handle access request error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to handle access request"
        }
    }
}

// Get available users for invitation (company members not already on project)
export async function getInvitableUsers(projectId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", users: [] }
        }

        // Check permissions
        const { canInvite, error: permissionError } = await canInviteToProject(
            session.user.id,
            projectId
        )

        if (!canInvite) {
            return { success: false, error: permissionError || "Cannot invite to project", users: [] }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                ownedCompany: true,
                company: true
            }
        })

        const companyId = user!.ownedCompany?.id || user!.company?.id

        // Get users already on the project (members or invited)
        const existingAccess = await prisma.$transaction([
            prisma.projectMember.findMany({
                where: { projectId },
                select: { userId: true }
            }),
            prisma.projectInvite.findMany({
                where: { 
                    projectId
                },
                select: { userId: true }
            })
        ])

        const excludeUserIds = [
            ...existingAccess[0].map(m => m.userId),
            ...existingAccess[1].map(i => i.userId),
            session.user.id // Exclude current user
        ]

        // Get available company users
        const availableUsers = await prisma.user.findMany({
            where: {
                companyId: companyId,
                id: { notIn: excludeUserIds },
                role: { in: [Role.TEAM_MEMBER, Role.TEAM_HEAD] } // Don't invite other company owners
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true
            },
            orderBy: {
                name: 'asc'
            }
        })

        return {
            success: true,
            users: availableUsers
        }
    } catch (error) {
        console.error("Get invitable users error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get available users",
            users: []
        }
    }
}