"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role, InvitationType, InvitationStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { sendInvitationEmail } from "@/lib/email"

// Get all associations for the current user
export async function getUserAssociations() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                company: true,
                managedCompany: {
                    include: {
                        users: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                                createdAt: true
                            }
                        }
                    }
                },
                projectMemberships: {
                    include: {
                        project: {
                            select: {
                                id: true,
                                title: true,
                                status: true,
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        company: {
                                            select: {
                                                id: true,
                                                name: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                projects: {
                    include: {
                        members: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        role: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!user) {
            throw new Error("User not found")
        }

        return {
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                // Company user belongs to
                memberOfCompany: user.company,
                // Company user manages (if PM)
                managedCompany: user.managedCompany,
                // Projects user is member of
                projectMemberships: user.projectMemberships,
                // Projects user owns
                ownedProjects: user.projects
            }
        }
    } catch (error) {
        console.error("Get user associations error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get associations"
        }
    }
}

// Invite existing user to company
export async function inviteUserToCompany(email: string, message?: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // Verify user is a Product Manager
        const sender = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { managedCompany: true }
        })

        if (!sender || sender.role !== Role.PRODUCTMANAGER || !sender.managedCompany) {
            throw new Error("Only Product Managers can invite users to companies")
        }

        // Check if user exists
        const targetUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, email: true, role: true, companyId: true }
        })

        if (!targetUser) {
            throw new Error("User not found. They need to register first using a referral code.")
        }

        // Check if user is already part of this company
        if (targetUser.companyId === sender.managedCompany.id) {
            throw new Error("User is already a member of this company")
        }

        // Check if there's already a pending invitation
        const existingInvitation = await prisma.invitation.findFirst({
            where: {
                email,
                companyId: sender.managedCompany.id,
                type: InvitationType.COMPANY_MEMBER,
                status: InvitationStatus.PENDING
            }
        })

        if (existingInvitation) {
            throw new Error("There's already a pending invitation for this user")
        }

        // Create invitation
        const invitation = await prisma.invitation.create({
            data: {
                email,
                type: InvitationType.COMPANY_MEMBER,
                message,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                senderId: sender.id,
                receiverId: targetUser.id,
                companyId: sender.managedCompany.id
            },
            include: {
                company: {
                    select: { name: true }
                },
                sender: {
                    select: { name: true }
                }
            }
        })

        // Send email notification to the user
        try {
            await sendInvitationEmail(
                email,
                targetUser.name || email,
                sender.name || "Product Manager",
                "company",
                sender.managedCompany.name,
                message,
                invitation.id
            )
        } catch (emailError) {
            console.error("Failed to send invitation email:", emailError)
            // Don't fail the invitation creation if email fails
        }

        revalidatePath("/associations")
        
        return {
            success: true,
            message: `Invitation sent to ${email}`,
            invitation
        }
    } catch (error) {
        console.error("Invite user to company error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send invitation"
        }
    }
}

// Invite existing user to project
export async function inviteUserToProject(projectId: string, email: string, role: string = "MEMBER", message?: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // Verify user has permission to invite to this project
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                user: {
                    include: { managedCompany: true }
                }
            }
        })

        if (!project) {
            throw new Error("Project not found")
        }

        // Check if user is the project owner or a PM of the same company
        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { managedCompany: true }
        })

        const canInvite = 
            project.userId === session.user.id || // Project owner
            (currentUser?.role === Role.PRODUCTMANAGER && 
             currentUser.managedCompany?.id === project.user.managedCompany?.id) // Same company PM

        if (!canInvite) {
            throw new Error("You don't have permission to invite users to this project")
        }

        // Check if user exists
        const targetUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true, email: true, role: true }
        })

        if (!targetUser) {
            throw new Error("User not found. They need to register first.")
        }

        // Check if user is already a member of this project
        const existingMember = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId: targetUser.id,
                    projectId
                }
            }
        })

        if (existingMember) {
            throw new Error("User is already a member of this project")
        }

        // Check if there's already a pending invitation
        const existingInvitation = await prisma.invitation.findFirst({
            where: {
                email,
                projectId,
                type: InvitationType.PROJECT_MEMBER,
                status: InvitationStatus.PENDING
            }
        })

        if (existingInvitation) {
            throw new Error("There's already a pending invitation for this user")
        }

        // Create invitation
        const invitation = await prisma.invitation.create({
            data: {
                email,
                type: InvitationType.PROJECT_MEMBER,
                message,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                senderId: session.user.id,
                receiverId: targetUser.id,
                projectId
            },
            include: {
                project: {
                    select: { title: true }
                },
                sender: {
                    select: { name: true }
                }
            }
        })

        // Send email notification to the user
        try {
            await sendInvitationEmail(
                email,
                targetUser.name || email,
                currentUser?.name || "Project Manager",
                "project",
                project.title,
                message,
                invitation.id
            )
        } catch (emailError) {
            console.error("Failed to send invitation email:", emailError)
            // Don't fail the invitation creation if email fails
        }

        revalidatePath("/associations")
        revalidatePath(`/projects/${project.slug}`)
        
        return {
            success: true,
            message: `Invitation sent to ${email}`,
            invitation
        }
    } catch (error) {
        console.error("Invite user to project error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send invitation"
        }
    }
}

// Accept or decline invitation
export async function respondToInvitation(invitationId: string, action: "accept" | "decline") {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
            include: {
                company: true,
                project: true,
                sender: {
                    select: { name: true }
                }
            }
        })

        if (!invitation) {
            throw new Error("Invitation not found")
        }

        if (invitation.receiverId !== session.user.id) {
            throw new Error("This invitation is not for you")
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            throw new Error("This invitation has already been responded to")
        }

        if (invitation.expiresAt < new Date()) {
            throw new Error("This invitation has expired")
        }

        const newStatus = action === "accept" ? InvitationStatus.ACCEPTED : InvitationStatus.DECLINED

        // Update invitation status
        await prisma.invitation.update({
            where: { id: invitationId },
            data: { status: newStatus }
        })

        if (action === "accept") {
            if (invitation.type === InvitationType.COMPANY_MEMBER && invitation.companyId) {
                // Add user to company
                await prisma.user.update({
                    where: { id: session.user.id },
                    data: { companyId: invitation.companyId }
                })
            } else if (invitation.type === InvitationType.PROJECT_MEMBER && invitation.projectId) {
                // Add user to project
                await prisma.projectMember.create({
                    data: {
                        userId: session.user.id,
                        projectId: invitation.projectId,
                        role: "MEMBER",
                        addedById: invitation.senderId
                    }
                })
            }
        }

        revalidatePath("/associations")
        revalidatePath("/dashboard")
        
        return {
            success: true,
            message: action === "accept" ? "Invitation accepted" : "Invitation declined"
        }
    } catch (error) {
        console.error("Respond to invitation error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to respond to invitation"
        }
    }
}

// Get pending invitations for current user
export async function getPendingInvitations() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        const invitations = await prisma.invitation.findMany({
            where: {
                receiverId: session.user.id,
                status: InvitationStatus.PENDING,
                expiresAt: {
                    gt: new Date()
                }
            },
            include: {
                sender: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                company: {
                    select: {
                        name: true
                    }
                },
                project: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return {
            success: true,
            invitations
        }
    } catch (error) {
        console.error("Get pending invitations error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get invitations",
            invitations: []
        }
    }
}

// Remove user from company (PM only)
export async function removeUserFromCompany(userId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { managedCompany: true }
        })

        if (!currentUser || currentUser.role !== Role.PRODUCTMANAGER || !currentUser.managedCompany) {
            throw new Error("Only Product Managers can remove users from companies")
        }

        // Verify the user is part of this PM's company
        const targetUser = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!targetUser || targetUser.companyId !== currentUser.managedCompany.id) {
            throw new Error("User is not a member of your company")
        }

        // Remove user from company
        await prisma.user.update({
            where: { id: userId },
            data: { companyId: null }
        })

        // Remove from all projects in this company
        await prisma.projectMember.deleteMany({
            where: {
                userId,
                project: {
                    user: {
                        managedCompany: {
                            id: currentUser.managedCompany.id
                        }
                    }
                }
            }
        })

        revalidatePath("/associations")
        
        return {
            success: true,
            message: "User removed from company"
        }
    } catch (error) {
        console.error("Remove user from company error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to remove user"
        }
    }
}

// Remove user from project
export async function removeUserFromProject(projectId: string, userId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // Verify user has permission
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                user: {
                    include: { managedCompany: true }
                }
            }
        })

        if (!project) {
            throw new Error("Project not found")
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { managedCompany: true }
        })

        const canRemove = 
            project.userId === session.user.id || // Project owner
            (currentUser?.role === Role.PRODUCTMANAGER && 
             currentUser.managedCompany?.id === project.user.managedCompany?.id) // Same company PM

        if (!canRemove) {
            throw new Error("You don't have permission to remove users from this project")
        }

        // Remove user from project
        await prisma.projectMember.deleteMany({
            where: {
                userId,
                projectId
            }
        })

        revalidatePath("/associations")
        revalidatePath(`/projects/${project.slug}`)
        
        return {
            success: true,
            message: "User removed from project"
        }
    } catch (error) {
        console.error("Remove user from project error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to remove user"
        }
    }
}
