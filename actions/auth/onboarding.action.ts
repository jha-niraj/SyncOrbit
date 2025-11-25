"use server"

import { prisma } from "@/lib/prisma"
import { Role, TeamType, InvitationType } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validation schemas
const companyOnboardingSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    image: z.string().optional(),
    companyName: z.string().min(1, "Company name is required"),
    companyDescription: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    selectedTeams: z.array(z.object({
        type: z.nativeEnum(TeamType),
        name: z.string().min(1),
        displayName: z.string().min(1),
        headRoleTitle: z.string().min(1),
        description: z.string().optional(),
        color: z.string().optional(),
    })).min(1, "At least one team is required"),
})

const invitationAcceptSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    image: z.string().optional(),
    invitationId: z.string().min(1),
})

// Complete company onboarding (for new company owners)
export async function completeCompanyOnboarding(data: z.infer<typeof companyOnboardingSchema>) {
    try {
        const validatedData = companyOnboardingSchema.parse(data)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
            include: { ownedCompany: true }
        })

        if (existingUser && existingUser.ownedCompany) {
            return {
                success: false,
                error: "User already owns a company"
            }
        }

        // Check if company name is already taken
        const existingCompany = await prisma.company.findFirst({
            where: {
                name: validatedData.companyName
            }
        })

        if (existingCompany) {
            return {
                success: false,
                error: "Company name already exists. Please choose a different name."
            }
        }

        // Create short name from company name
        const baseShortName = validatedData.companyName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 8)
        const shortName = `${baseShortName}${Math.random().toString(36).substring(2, 4)}`

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {
            let user = existingUser

            // Create or update user
            if (!user) {
                user = await tx.user.create({
                    data: {
                        email: validatedData.email,
                        name: validatedData.name,
                        image: validatedData.image,
                        role: Role.COMPANY_OWNER,
                        emailVerified: new Date(),
                    },
                    include: { ownedCompany: true }
                })
            } else {
                user = await tx.user.update({
                    where: { id: user.id },
                    data: {
                        name: validatedData.name,
                        image: validatedData.image,
                        role: Role.COMPANY_OWNER,
                        emailVerified: new Date(),
                    },
                    include: { ownedCompany: true }
                })
            }

            // Create company
            const company = await tx.company.create({
                data: {
                    name: validatedData.companyName,
                    shortName: shortName,
                    description: validatedData.companyDescription,
                    website: validatedData.website || undefined,
                    ownerId: user.id,
                }
            })

            // Update user with company ID
            await tx.user.update({
                where: { id: user.id },
                data: { companyId: company.id }
            })

            // Create teams and send invitations
            const createdTeams = []
            for (const teamData of validatedData.selectedTeams) {
                const team = await tx.team.create({
                    data: {
                        name: teamData.name,
                        displayName: teamData.displayName,
                        teamType: teamData.type,
                        description: teamData.description,
                        color: teamData.color,
                        companyId: company.id,
                    }
                })

                createdTeams.push({
                    ...team,
                    headRoleTitle: teamData.headRoleTitle
                })
            }

            return { user, company, teams: createdTeams }
        })

        revalidatePath("/dashboard")
        revalidatePath("/teams")

        return {
            success: true,
            user: result.user,
            company: result.company,
            teams: result.teams,
            message: `Welcome to SyncOrbit! ${validatedData.companyName} has been created with ${result.teams.length} teams.`
        }
    } catch (error) {
        console.error("Complete company onboarding error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to complete company onboarding"
        }
    }
}

// Accept invitation and complete profile (for team members/heads)
export async function completeInvitationOnboarding(data: z.infer<typeof invitationAcceptSchema>) {
    try {
        const validatedData = invitationAcceptSchema.parse(data)

        const invitation = await prisma.invitation.findUnique({
            where: { id: validatedData.invitationId },
            include: {
                company: true,
                team: true,
                sender: { select: { name: true, email: true } }
            }
        })

        if (!invitation) {
            return {
                success: false,
                error: "Invitation not found or expired"
            }
        }

        if (invitation.email !== validatedData.email) {
            return {
                success: false,
                error: "This invitation is not for your email address"
            }
        }

        if (invitation.status !== "PENDING") {
            return {
                success: false,
                error: "This invitation has already been processed"
            }
        }

        if (invitation.expiresAt < new Date()) {
            return {
                success: false,
                error: "This invitation has expired"
            }
        }

        // Check if user already exists
        let existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email }
        })

        const result = await prisma.$transaction(async (tx) => {
            let user = existingUser

            // Create or update user
            if (!user) {
                user = await tx.user.create({
                    data: {
                        email: validatedData.email,
                        name: validatedData.name,
                        image: validatedData.image,
                        role: invitation.type === InvitationType.TEAM_HEAD ? Role.TEAM_HEAD : 
                              invitation.type === InvitationType.TEAM_MEMBER ? Role.TEAM_MEMBER : Role.CLIENT,
                        companyId: invitation.companyId,
                        emailVerified: new Date(),
                    }
                })
            } else {
                user = await tx.user.update({
                    where: { id: user.id },
                    data: {
                        name: validatedData.name,
                        image: validatedData.image,
                        role: invitation.type === InvitationType.TEAM_HEAD ? Role.TEAM_HEAD : 
                              invitation.type === InvitationType.TEAM_MEMBER ? Role.TEAM_MEMBER : Role.CLIENT,
                        companyId: invitation.companyId || user.companyId,
                    }
                })
            }

            // Update invitation
            await tx.invitation.update({
                where: { id: validatedData.invitationId },
                data: {
                    status: "ACCEPTED",
                    receiverId: user.id
                }
            })

            // Handle team assignments
            if (invitation.teamId && invitation.type === InvitationType.TEAM_HEAD) {
                // Make user the team head
                await tx.team.update({
                    where: { id: invitation.teamId },
                    data: { headId: user.id }
                })

                // Also add as team member
                await tx.teamMember.create({
                    data: {
                        userId: user.id,
                        teamId: invitation.teamId,
                        roleTitle: invitation.roleTitle!,
                        addedById: invitation.senderId
                    }
                })
            } else if (invitation.teamId && invitation.type === InvitationType.TEAM_MEMBER) {
                // Add as team member
                await tx.teamMember.create({
                    data: {
                        userId: user.id,
                        teamId: invitation.teamId,
                        roleTitle: invitation.roleTitle!,
                        addedById: invitation.senderId
                    }
                })
            }

            return { user, invitation }
        })

        revalidatePath("/dashboard")
        revalidatePath("/teams")

        return {
            success: true,
            user: result.user,
            role: result.user.role,
            company: invitation.company?.name,
            team: invitation.team?.name,
            roleTitle: invitation.roleTitle,
            message: `Welcome to ${invitation.company?.name}! You've joined as ${invitation.roleTitle} in the ${invitation.team?.name || 'company'}.`
        }
    } catch (error) {
        console.error("Complete invitation onboarding error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to complete onboarding"
        }
    }
}

// Legacy function for backward compatibility (clients without invitations)
export async function completeClientOnboarding(data: { email: string; name: string; image?: string }) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        })

        let user = existingUser
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    image: data.image,
                    role: Role.CLIENT,
                    emailVerified: new Date(),
                }
            })
        } else {
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: data.name,
                    image: data.image,
                    role: Role.CLIENT,
                }
            })
        }

        return {
            success: true,
            user,
            message: "Welcome to SyncOrbit! You can now create projects and work with development teams."
        }
    } catch (error) {
        console.error("Complete client onboarding error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to complete client onboarding"
        }
    }
}
