"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role, InvitationType, InvitationStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validation schemas
const acceptInvitationSchema = z.object({
    invitationId: z.string().min(1, "Invitation ID is required"),
})

// Get user's pending invitations
export async function getUserInvitations() {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized", invitations: [] }
        }

        const invitations = await prisma.invitation.findMany({
            where: {
                email: session.user.email,
                status: InvitationStatus.PENDING,
                expiresAt: {
                    gt: new Date()
                }
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        logo: true
                    }
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        teamType: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return {
            success: true,
            invitations
        }
    } catch (error) {
        console.error("Get user invitations error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get invitations",
            invitations: []
        }
    }
}

// Accept team invitation
export async function acceptInvitation(data: z.infer<typeof acceptInvitationSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id || !session?.user?.email) {
            return { success: false, error: "Unauthorized" }
        }

        const validatedData = acceptInvitationSchema.parse(data)

        const invitation = await prisma.invitation.findUnique({
            where: { id: validatedData.invitationId },
            include: {
                company: true,
                team: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!invitation) {
            return { success: false, error: "Invitation not found" }
        }

        if (invitation.email !== session.user.email) {
            return { success: false, error: "This invitation is not for you" }
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            return { success: false, error: "Invitation has already been processed" }
        }

        if (invitation.expiresAt < new Date()) {
            return { success: false, error: "Invitation has expired" }
        }

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update invitation status
            await tx.invitation.update({
                where: { id: validatedData.invitationId },
                data: {
                    status: InvitationStatus.ACCEPTED,
                    receiverId: session.user.id
                }
            })

            // Update user's company if not already set
            if (!session.user.companyId && invitation.companyId) {
                await tx.user.update({
                    where: { id: session.user.id },
                    data: { companyId: invitation.companyId }
                })
            }

            let updatedUser = null

            // Handle different invitation types
            if (invitation.type === InvitationType.TEAM_HEAD) {
                // Make user a team head
                await tx.user.update({
                    where: { id: session.user.id },
                    data: { role: Role.TEAM_HEAD }
                })

                // Assign as team head
                await tx.team.update({
                    where: { id: invitation.teamId! },
                    data: { headId: session.user.id }
                })

                // Also add as team member
                await tx.teamMember.create({
                    data: {
                        userId: session.user.id,
                        teamId: invitation.teamId!,
                        roleTitle: invitation.roleTitle!,
                        addedById: invitation.senderId
                    }
                })

                updatedUser = await tx.user.findUnique({
                    where: { id: session.user.id },
                    include: {
                        ledTeams: true,
                        teamMemberships: {
                            include: { team: true }
                        }
                    }
                })

            } else if (invitation.type === InvitationType.TEAM_MEMBER) {
                // Make user a team member
                await tx.user.update({
                    where: { id: session.user.id },
                    data: { role: Role.TEAM_MEMBER }
                })

                // Add as team member
                await tx.teamMember.create({
                    data: {
                        userId: session.user.id,
                        teamId: invitation.teamId!,
                        roleTitle: invitation.roleTitle!,
                        addedById: invitation.senderId
                    }
                })

                updatedUser = await tx.user.findUnique({
                    where: { id: session.user.id },
                    include: {
                        teamMemberships: {
                            include: { team: true }
                        }
                    }
                })

            } else if (invitation.type === InvitationType.CLIENT) {
                // Keep user as client but associate with company
                updatedUser = await tx.user.findUnique({
                    where: { id: session.user.id },
                    include: { company: true }
                })
            }

            return { invitation, updatedUser }
        })

        revalidatePath("/dashboard")
        revalidatePath("/teams")
        revalidatePath("/invitations")

        return {
            success: true,
            invitation: result.invitation,
            user: result.updatedUser,
            message: `Successfully joined ${result.invitation.team?.name || result.invitation.company?.name} as ${result.invitation.roleTitle || 'member'}`
        }

    } catch (error) {
        console.error("Accept invitation error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to accept invitation"
        }
    }
}

// Decline invitation
export async function declineInvitation(invitationId: string) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" }
        }

        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
            include: {
                company: true,
                team: true
            }
        })

        if (!invitation) {
            return { success: false, error: "Invitation not found" }
        }

        if (invitation.email !== session.user.email) {
            return { success: false, error: "This invitation is not for you" }
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            return { success: false, error: "Invitation has already been processed" }
        }

        await prisma.invitation.update({
            where: { id: invitationId },
            data: { status: InvitationStatus.DECLINED }
        })

        revalidatePath("/invitations")

        return {
            success: true,
            message: `Invitation to ${invitation.team?.name || invitation.company?.name} declined`
        }

    } catch (error) {
        console.error("Decline invitation error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to decline invitation"
        }
    }
}

// Get invitation by token (for public invitation links)
export async function getInvitationByToken(token: string) {
    try {
        const invitation = await prisma.invitation.findUnique({
            where: { id: token },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        description: true
                    }
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        teamType: true,
                        description: true,
                        color: true
                    }
                }
            }
        })

        if (!invitation) {
            return { success: false, error: "Invitation not found", invitation: null }
        }

        return {
            success: true,
            invitation
        }

    } catch (error) {
        console.error("Get invitation by token error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get invitation",
            invitation: null
        }
    }
}

// Accept invitation by token (for public invitation links)
export async function acceptInvitationByToken(token: string) {
    try {
        const session = await auth()
        if (!session?.user?.id || !session?.user?.email) {
            return { success: false, error: "Authentication required" }
        }

        const invitation = await prisma.invitation.findUnique({
            where: { id: token },
            include: {
                company: true,
                team: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!invitation) {
            return { success: false, error: "Invitation not found" }
        }

        if (invitation.email !== session.user.email) {
            return { success: false, error: "This invitation is not for you" }
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            return { success: false, error: "Invitation has already been processed" }
        }

        if (invitation.expiresAt < new Date()) {
            return { success: false, error: "Invitation has expired" }
        }

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update invitation status
            await tx.invitation.update({
                where: { id: token },
                data: {
                    status: InvitationStatus.ACCEPTED,
                    receiverId: session.user.id
                }
            })

            // Update user's company if not already set
            if (!session.user.companyId && invitation.companyId) {
                await tx.user.update({
                    where: { id: session.user.id },
                    data: { companyId: invitation.companyId }
                })
            }

            let updatedUser = null

            // Handle different invitation types
            if (invitation.type === InvitationType.TEAM_HEAD) {
                // Make user a team head
                await tx.user.update({
                    where: { id: session.user.id },
                    data: { role: Role.TEAM_HEAD }
                })

                // Assign as team head
                await tx.team.update({
                    where: { id: invitation.teamId! },
                    data: { headId: session.user.id }
                })

                // Also add as team member
                await tx.teamMember.create({
                    data: {
                        userId: session.user.id,
                        teamId: invitation.teamId!,
                        roleTitle: invitation.roleTitle!,
                        addedById: invitation.senderId
                    }
                })

                updatedUser = await tx.user.findUnique({
                    where: { id: session.user.id },
                    include: {
                        ledTeams: true,
                        teamMemberships: {
                            include: { team: true }
                        }
                    }
                })

            } else if (invitation.type === InvitationType.TEAM_MEMBER) {
                // Make user a team member
                await tx.user.update({
                    where: { id: session.user.id },
                    data: { role: Role.TEAM_MEMBER }
                })

                // Add as team member
                await tx.teamMember.create({
                    data: {
                        userId: session.user.id,
                        teamId: invitation.teamId!,
                        roleTitle: invitation.roleTitle!,
                        addedById: invitation.senderId
                    }
                })

                updatedUser = await tx.user.findUnique({
                    where: { id: session.user.id },
                    include: {
                        teamMemberships: {
                            include: { team: true }
                        }
                    }
                })

            } else if (invitation.type === InvitationType.CLIENT) {
                // Keep user as client but associate with company
                updatedUser = await tx.user.findUnique({
                    where: { id: session.user.id },
                    include: { company: true }
                })
            }

            return { invitation, updatedUser }
        })

        revalidatePath("/dashboard")
        revalidatePath("/teams")
        revalidatePath("/invitations")

        return {
            success: true,
            invitation: result.invitation,
            user: result.updatedUser,
            message: `Successfully joined ${result.invitation.team?.name || result.invitation.company?.name} as ${result.invitation.roleTitle || 'member'}`
        }

    } catch (error) {
        console.error("Accept invitation by token error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to accept invitation"
        }
    }
}

// Get invitation details by ID (for public invitation acceptance page)
export async function getInvitationDetails(invitationId: string) {
    try {
        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        description: true
                    }
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        teamType: true,
                        description: true,
                        color: true
                    }
                }
            }
        })

        if (!invitation) {
            return { success: false, error: "Invitation not found", invitation: null }
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            return { 
                success: false, 
                error: "This invitation has already been processed", 
                invitation: null 
            }
        }

        if (invitation.expiresAt < new Date()) {
            return { 
                success: false, 
                error: "This invitation has expired", 
                invitation: null 
            }
        }

        return {
            success: true,
            invitation
        }

    } catch (error) {
        console.error("Get invitation details error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get invitation details",
            invitation: null
        }
    }
}

// Resend invitation (for team managers)
export async function resendInvitation(invitationId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
            include: {
                team: true,
                company: true
            }
        })

        if (!invitation) {
            return { success: false, error: "Invitation not found" }
        }

        // Check permissions - only sender, company owner, or team head can resend
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                ownedCompany: true,
                ledTeams: true
            }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        const canResend = 
            invitation.senderId === session.user.id ||
            user.role === Role.COMPANY_OWNER ||
            (invitation.teamId && user.ledTeams.some(team => team.id === invitation.teamId))

        if (!canResend) {
            return { success: false, error: "Insufficient permissions" }
        }

        // Update expiration date
        await prisma.invitation.update({
            where: { id: invitationId },
            data: {
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                status: InvitationStatus.PENDING
            }
        })

        // TODO: Send email notification

        revalidatePath("/teams")
        if (invitation.teamId) {
            revalidatePath(`/teams/${invitation.teamId}`)
        }

        return {
            success: true,
            message: `Invitation resent to ${invitation.email}`
        }

    } catch (error) {
        console.error("Resend invitation error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to resend invitation"
        }
    }
}