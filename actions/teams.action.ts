"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role, TeamType, InvitationType, InvitationStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validation schemas
const createTeamSchema = z.object({
    name: z.string().min(1, "Team name is required"),
    displayName: z.string().min(1, "Display name is required"),
    teamType: z.nativeEnum(TeamType),
    description: z.string().optional(),
    color: z.string().optional(),
    headRoleTitle: z.string().min(1, "Head role title is required"),
})

const inviteTeamHeadSchema = z.object({
    teamId: z.string().min(1, "Team ID is required"),
    email: z.string().email("Valid email is required"),
    roleTitle: z.string().min(1, "Role title is required"),
    message: z.string().optional(),
})

const inviteTeamMemberSchema = z.object({
    teamId: z.string().min(1, "Team ID is required"),
    email: z.string().email("Valid email is required"),
    roleTitle: z.string().min(1, "Role title is required"),
    message: z.string().optional(),
})

const updateTeamMemberRoleSchema = z.object({
    teamMemberId: z.string().min(1, "Team member ID is required"),
    roleTitle: z.string().min(1, "Role title is required"),
})

// Helper function to check if user can manage teams
async function canManageTeams(userId: string, teamId?: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            ownedCompany: true,
            ledTeams: true
        }
    })

    if (!user) return { canManage: false, error: "User not found" }
    
    // Company owners can manage all teams
    if (user.role === Role.COMPANY_OWNER && user.ownedCompany) {
        return { canManage: true, user, company: user.ownedCompany }
    }
    
    // Team heads can only manage their own team
    if (user.role === Role.TEAM_HEAD && teamId) {
        const isTeamHead = user.ledTeams.some(team => team.id === teamId)
        if (isTeamHead) {
            const company = await prisma.company.findFirst({
                where: { id: user.companyId! }
            })
            return { canManage: true, user, company }
        }
    }
    
    return { canManage: false, error: "Insufficient permissions" }
}

// Create a new team (Company Owner only)
export async function createTeam(data: z.infer<typeof createTeamSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const validatedData = createTeamSchema.parse(data)

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { ownedCompany: true }
        })

        if (!user || user.role !== Role.COMPANY_OWNER || !user.ownedCompany) {
            return { success: false, error: "Only company owners can create teams" }
        }

        // Check if team name already exists in company
        const existingTeam = await prisma.team.findFirst({
            where: {
                companyId: user.ownedCompany.id,
                name: validatedData.name
            }
        })

        if (existingTeam) {
            return { success: false, error: "Team name already exists in your company" }
        }

        const team = await prisma.team.create({
            data: {
                name: validatedData.name,
                displayName: validatedData.displayName,
                teamType: validatedData.teamType,
                description: validatedData.description,
                color: validatedData.color,
                companyId: user.ownedCompany.id,
            },
            include: {
                company: true,
                head: true,
                members: {
                    include: {
                        user: {
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

        revalidatePath("/dashboard")
        revalidatePath("/teams")

        return {
            success: true,
            team,
            message: `${validatedData.name} created successfully`
        }
    } catch (error) {
        console.error("Create team error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create team"
        }
    }
}

// Get all teams for a company
export async function getCompanyTeams() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", teams: [] }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                company: true,
                ownedCompany: true
            }
        })

        if (!user || (!user.company && !user.ownedCompany)) {
            return { success: false, error: "User not associated with any company", teams: [] }
        }

        const companyId = user.ownedCompany?.id || user.company?.id

        const teams = await prisma.team.findMany({
            where: {
                companyId: companyId!,
                isActive: true
            },
            include: {
                head: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                members: {
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
                    where: { isActive: true }
                },
                assignedProjects: {
                    include: {
                        project: {
                            select: {
                                id: true,
                                title: true,
                                status: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        members: true,
                        assignedProjects: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        })

        return {
            success: true,
            teams,
            userRole: user.role
        }
    } catch (error) {
        console.error("Get company teams error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get teams",
            teams: []
        }
    }
}

// Get team details with members
export async function getTeamDetails(teamId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", team: null }
        }

        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                company: true,
                head: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        bio: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                                bio: true,
                                skills: true,
                                role: true,
                                createdAt: true
                            }
                        },
                        addedBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    },
                    where: { isActive: true },
                    orderBy: { joinedAt: 'asc' }
                },
                assignedProjects: {
                    include: {
                        project: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                status: true,
                                startDate: true,
                                endDate: true
                            }
                        }
                    }
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        assignedDeveloper: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!team) {
            return { success: false, error: "Team not found", team: null }
        }

        // Check if user can view this team
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                company: true,
                ownedCompany: true,
                teamMemberships: true
            }
        })

        if (!user) {
            return { success: false, error: "User not found", team: null }
        }

        // Company owner can see all teams
        // Team heads can see their own team
        // Team members can see their own team
        const canView = 
            user.role === Role.COMPANY_OWNER ||
            team.headId === user.id ||
            user.teamMemberships.some(membership => membership.teamId === teamId) ||
            (user.company?.id === team.companyId || user.ownedCompany?.id === team.companyId)

        if (!canView) {
            return { success: false, error: "Access denied", team: null }
        }

        return {
            success: true,
            team,
            userRole: user.role,
            canManage: user.role === Role.COMPANY_OWNER || team.headId === user.id
        }
    } catch (error) {
        console.error("Get team details error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get team details",
            team: null
        }
    }
}

// Invite team head
export async function inviteTeamHead(data: z.infer<typeof inviteTeamHeadSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const validatedData = inviteTeamHeadSchema.parse(data)

        const { canManage, user, company, error } = await canManageTeams(session.user.id, validatedData.teamId)
        if (!canManage) {
            return { success: false, error: error || "Insufficient permissions" }
        }

        // Check if team exists and doesn't have a head
        const team = await prisma.team.findUnique({
            where: { id: validatedData.teamId },
            include: { head: true }
        })

        if (!team) {
            return { success: false, error: "Team not found" }
        }

        if (team.head) {
            return { success: false, error: "Team already has a head" }
        }

        // Check if user is already invited
        const existingInvitation = await prisma.invitation.findFirst({
            where: {
                email: validatedData.email,
                teamId: validatedData.teamId,
                type: InvitationType.TEAM_HEAD,
                status: InvitationStatus.PENDING
            }
        })

        if (existingInvitation) {
            return { success: false, error: "User already invited as team head" }
        }

        // Create invitation
        const invitation = await prisma.invitation.create({
            data: {
                email: validatedData.email,
                type: InvitationType.TEAM_HEAD,
                roleTitle: validatedData.roleTitle,
                message: validatedData.message,
                senderId: session.user.id,
                teamId: validatedData.teamId,
                companyId: company!.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
            include: {
                team: true,
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
                }
            }
        })

        // TODO: Send email notification

        revalidatePath("/teams")
        revalidatePath(`/teams/${validatedData.teamId}`)

        return {
            success: true,
            invitation,
            message: `Invitation sent to ${validatedData.email} as ${validatedData.roleTitle}`
        }
    } catch (error) {
        console.error("Invite team head error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send invitation"
        }
    }
}

// Invite team member
export async function inviteTeamMember(data: z.infer<typeof inviteTeamMemberSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const validatedData = inviteTeamMemberSchema.parse(data)

        const { canManage, user, company, error } = await canManageTeams(session.user.id, validatedData.teamId)
        if (!canManage) {
            return { success: false, error: error || "Insufficient permissions" }
        }

        // Check if team exists
        const team = await prisma.team.findUnique({
            where: { id: validatedData.teamId }
        })

        if (!team) {
            return { success: false, error: "Team not found" }
        }

        // Check if user is already a member
        const existingMember = await prisma.teamMember.findFirst({
            where: {
                teamId: validatedData.teamId,
                user: {
                    email: validatedData.email
                }
            }
        })

        if (existingMember) {
            return { success: false, error: "User is already a team member" }
        }

        // Check if user is already invited
        const existingInvitation = await prisma.invitation.findFirst({
            where: {
                email: validatedData.email,
                teamId: validatedData.teamId,
                type: InvitationType.TEAM_MEMBER,
                status: InvitationStatus.PENDING
            }
        })

        if (existingInvitation) {
            return { success: false, error: "User already invited to this team" }
        }

        // Create invitation
        const invitation = await prisma.invitation.create({
            data: {
                email: validatedData.email,
                type: InvitationType.TEAM_MEMBER,
                roleTitle: validatedData.roleTitle,
                message: validatedData.message,
                senderId: session.user.id,
                teamId: validatedData.teamId,
                companyId: company!.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
            include: {
                team: true,
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
                }
            }
        })

        // TODO: Send email notification

        revalidatePath("/teams")
        revalidatePath(`/teams/${validatedData.teamId}`)

        return {
            success: true,
            invitation,
            message: `Invitation sent to ${validatedData.email} as ${validatedData.roleTitle}`
        }
    } catch (error) {
        console.error("Invite team member error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send invitation"
        }
    }
}

// Update team member role
export async function updateTeamMemberRole(data: z.infer<typeof updateTeamMemberRoleSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const validatedData = updateTeamMemberRoleSchema.parse(data)

        const teamMember = await prisma.teamMember.findUnique({
            where: { id: validatedData.teamMemberId },
            include: {
                team: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!teamMember) {
            return { success: false, error: "Team member not found" }
        }

        const { canManage, error } = await canManageTeams(session.user.id, teamMember.teamId)
        if (!canManage) {
            return { success: false, error: error || "Insufficient permissions" }
        }

        const updatedMember = await prisma.teamMember.update({
            where: { id: validatedData.teamMemberId },
            data: {
                roleTitle: validatedData.roleTitle
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        revalidatePath("/teams")
        revalidatePath(`/teams/${teamMember.teamId}`)

        return {
            success: true,
            member: updatedMember,
            message: `${teamMember.user.name}'s role updated to ${validatedData.roleTitle}`
        }
    } catch (error) {
        console.error("Update team member role error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update member role"
        }
    }
}

// Remove team member
export async function removeTeamMember(teamMemberId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const teamMember = await prisma.teamMember.findUnique({
            where: { id: teamMemberId },
            include: {
                team: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!teamMember) {
            return { success: false, error: "Team member not found" }
        }

        const { canManage, error } = await canManageTeams(session.user.id, teamMember.teamId)
        if (!canManage) {
            return { success: false, error: error || "Insufficient permissions" }
        }

        // Soft delete - mark as inactive instead of deleting
        await prisma.teamMember.update({
            where: { id: teamMemberId },
            data: { isActive: false }
        })

        revalidatePath("/teams")
        revalidatePath(`/teams/${teamMember.teamId}`)

        return {
            success: true,
            message: `${teamMember.user.name} removed from ${teamMember.team.name}`
        }
    } catch (error) {
        console.error("Remove team member error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to remove team member"
        }
    }
}

// Get pending invitations for a team
export async function getTeamInvitations(teamId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", invitations: [] }
        }

        const { canManage, error } = await canManageTeams(session.user.id, teamId)
        if (!canManage) {
            return { success: false, error: error || "Insufficient permissions", invitations: [] }
        }

        const invitations = await prisma.invitation.findMany({
            where: {
                teamId: teamId,
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
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return {
            success: true,
            invitations
        }
    } catch (error) {
        console.error("Get team invitations error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get invitations",
            invitations: []
        }
    }
}

// Cancel invitation
export async function cancelInvitation(invitationId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
            include: {
                team: true
            }
        })

        if (!invitation) {
            return { success: false, error: "Invitation not found" }
        }

        if (invitation.teamId) {
            const { canManage, error } = await canManageTeams(session.user.id, invitation.teamId)
            if (!canManage) {
                return { success: false, error: error || "Insufficient permissions" }
            }
        }

        await prisma.invitation.update({
            where: { id: invitationId },
            data: { status: InvitationStatus.DECLINED }
        })

        if (invitation.teamId) {
            revalidatePath(`/teams/${invitation.teamId}`)
        }
        revalidatePath("/teams")

        return {
            success: true,
            message: "Invitation cancelled"
        }
    } catch (error) {
        console.error("Cancel invitation error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to cancel invitation"
        }
    }
}