"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role, ProjectVisibility, Status, Currency, ClientType, TaskStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schema for creating projects with multi-team assignment
const createProjectSchema = z.object({
    title: z.string().min(1, "Project title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().optional(),
    budget: z.number().min(0, "Budget must be a positive number"),
    currency: z.nativeEnum(Currency),
    clientType: z.nativeEnum(ClientType),
    visibility: z.nativeEnum(ProjectVisibility),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid start date"
    }),
    endDate: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Invalid end date"
    }),
    clientEmail: z.string().email("Invalid email address").optional(),
    assignedTeamIds: z.array(z.string()).min(1, "At least one team must be assigned"),
    livePreviewUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    figmaUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    documentsUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    otherLinks: z.string().optional()
})

const updateProjectSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    title: z.string().min(1, "Project title is required").max(100, "Title must be less than 100 characters").optional(),
    description: z.string().optional(),
    budget: z.number().min(0, "Budget must be a positive number").optional(),
    currency: z.nativeEnum(Currency).optional(),
    visibility: z.nativeEnum(ProjectVisibility).optional(),
    status: z.nativeEnum(Status).optional(),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid start date"
    }).optional(),
    endDate: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Invalid end date"
    }),
    assignedTeamIds: z.array(z.string()).optional(),
    livePreviewUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    figmaUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    documentsUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    otherLinks: z.string().optional()
})

// Helper function to check project creation permissions
async function canCreateProjects(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            ownedCompany: true,
            company: true,
            ledTeams: true
        }
    })

    if (!user) return { canCreate: false, error: "User not found" }

    // Company owners and team heads can create projects
    const canCreate = user.role === Role.COMPANY_OWNER || user.role === Role.TEAM_HEAD

    return {
        canCreate,
        user,
        company: user.ownedCompany || user.company,
        error: !canCreate ? "Only Company Owners and Team Heads can create projects" : undefined
    }
}

// Helper function to check if user can assign teams to projects
async function canAssignTeams(userId: string, teamIds: string[]) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            ownedCompany: true,
            ledTeams: true,
            company: true
        }
    })

    if (!user) return { canAssign: false, error: "User not found" }

    const companyId = user.ownedCompany?.id || user.company?.id
    if (!companyId) return { canAssign: false, error: "User not associated with any company" }

    // Get teams to verify they belong to the same company
    const teams = await prisma.team.findMany({
        where: {
            id: { in: teamIds },
            companyId: companyId
        }
    })

    if (teams.length !== teamIds.length) {
        return { canAssign: false, error: "One or more teams not found or not accessible" }
    }

    // Company owners can assign any teams
    if (user.role === Role.COMPANY_OWNER) {
        return { canAssign: true, user, teams }
    }

    // Team heads can only assign teams they lead
    if (user.role === Role.TEAM_HEAD) {
        const ledTeamIds = user.ledTeams.map(team => team.id)
        const canAssignAll = teamIds.every(teamId => ledTeamIds.includes(teamId))

        if (!canAssignAll) {
            return { canAssign: false, error: "You can only assign teams you lead" }
        }

        return { canAssign: true, user, teams }
    }

    return { canAssign: false, error: "Insufficient permissions to assign teams" }
}

// Create a new project with multi-team assignment
export async function createProject(data: z.infer<typeof createProjectSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const validatedData = createProjectSchema.parse(data)

        // Check permissions
        const { canCreate, user, error: permissionError } = await canCreateProjects(session.user.id)
        if (!canCreate) {
            return { success: false, error: permissionError || "Insufficient permissions" }
        }

        // Validate team assignments
        const { canAssign, teams, error: assignError } = await canAssignTeams(session.user.id, validatedData.assignedTeamIds)
        if (!canAssign) {
            return { success: false, error: assignError || "Cannot assign teams" }
        }

        const companyId = user!.ownedCompany?.id || user!.company?.id
        if (!companyId) {
            return { success: false, error: "User not associated with any company" }
        }

        // Generate unique slug
        const baseSlug = validatedData.title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50)

        let slug = baseSlug
        let counter = 1

        while (await prisma.project.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`
            counter++
        }

        // Handle client creation or assignment
        let clientUserId: string

        if (validatedData.clientType === ClientType.EXTERNAL && validatedData.clientEmail) {
            let existingClient = await prisma.user.findUnique({
                where: { email: validatedData.clientEmail }
            })

            if (!existingClient) {
                existingClient = await prisma.user.create({
                    data: {
                        email: validatedData.clientEmail,
                        name: validatedData.clientEmail.split('@')[0],
                        role: Role.CLIENT,
                        emailVerified: new Date(),
                        companyId: companyId
                    }
                })
            }

            clientUserId = existingClient.id
        } else {
            clientUserId = session.user.id
        }

        // Create project with team assignments in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create the project
            const project = await tx.project.create({
                data: {
                    title: validatedData.title,
                    description: validatedData.description || null,
                    slug,
                    budget: validatedData.budget,
                    currency: validatedData.currency,
                    clientType: validatedData.clientType,
                    visibility: validatedData.visibility,
                    startDate: new Date(validatedData.startDate),
                    endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
                    livePreviewUrl: validatedData.livePreviewUrl || null,
                    figmaUrl: validatedData.figmaUrl || null,
                    githubUrl: validatedData.githubUrl || null,
                    documentsUrl: validatedData.documentsUrl || null,
                    otherLinks: validatedData.otherLinks || null,
                    userId: clientUserId,
                    companyId: companyId
                }
            })

            // Assign teams to the project
            const teamAssignments = await Promise.all(
                validatedData.assignedTeamIds.map(teamId =>
                    tx.projectTeam.create({
                        data: {
                            projectId: project.id,
                            teamId: teamId,
                            assignedById: session.user.id
                        }
                    })
                )
            )

            // Add the creator as a project member if they're not the client
            if (session.user.id !== clientUserId) {
                await tx.projectMember.create({
                    data: {
                        userId: session.user.id,
                        projectId: project.id,
                        role: user!.role === Role.COMPANY_OWNER ? "MANAGER" : "TEAM_HEAD",
                        addedById: session.user.id
                    }
                })
            }

            return { project, teamAssignments }
        })

        revalidatePath('/projects')
        revalidatePath('/dashboard')

        return {
            success: true,
            project: result.project,
            message: `Project "${validatedData.title}" created successfully with ${validatedData.assignedTeamIds.length} team(s) assigned`
        }
    } catch (error) {
        console.error("Create project error:", error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0]?.message || "Invalid input data"
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create project"
        }
    }
}

// Update existing project
export async function updateProject(data: z.infer<typeof updateProjectSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const validatedData = updateProjectSchema.parse(data)

        // Get current project to check permissions
        const existingProject = await prisma.project.findUnique({
            where: { id: validatedData.projectId },
            include: {
                assignedTeams: {
                    include: { team: true }
                }
            }
        })

        if (!existingProject) {
            return { success: false, error: "Project not found" }
        }

        // Check if user can edit this project
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

        // Company owners can edit any project in their company
        // Team heads can edit projects assigned to their teams
        const canEdit = user.role === Role.COMPANY_OWNER ||
            (user.role === Role.TEAM_HEAD &&
                existingProject.assignedTeams.some(pt =>
                    user.ledTeams.some(lt => lt.id === pt.teamId)
                ))

        if (!canEdit) {
            return { success: false, error: "You don't have permission to edit this project" }
        }

        // If updating team assignments, validate them
        if (validatedData.assignedTeamIds) {
            const { canAssign, teams, error: assignError } = await canAssignTeams(session.user.id, validatedData.assignedTeamIds)
            if (!canAssign) {
                return { success: false, error: assignError || "Cannot assign teams" }
            }
        }

        // Update project in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update project details
            const updateData: any = {}
            if (validatedData.title) updateData.title = validatedData.title
            if (validatedData.description !== undefined) updateData.description = validatedData.description
            if (validatedData.budget) updateData.budget = validatedData.budget
            if (validatedData.currency) updateData.currency = validatedData.currency
            if (validatedData.visibility) updateData.visibility = validatedData.visibility
            if (validatedData.status) updateData.status = validatedData.status
            if (validatedData.startDate) updateData.startDate = new Date(validatedData.startDate)
            if (validatedData.endDate !== undefined) {
                updateData.endDate = validatedData.endDate ? new Date(validatedData.endDate) : null
            }
            if (validatedData.livePreviewUrl !== undefined) updateData.livePreviewUrl = validatedData.livePreviewUrl || null
            if (validatedData.figmaUrl !== undefined) updateData.figmaUrl = validatedData.figmaUrl || null
            if (validatedData.githubUrl !== undefined) updateData.githubUrl = validatedData.githubUrl || null
            if (validatedData.documentsUrl !== undefined) updateData.documentsUrl = validatedData.documentsUrl || null
            if (validatedData.otherLinks !== undefined) updateData.otherLinks = validatedData.otherLinks || null

            const project = await tx.project.update({
                where: { id: validatedData.projectId },
                data: updateData
            })

            // Update team assignments if specified
            if (validatedData.assignedTeamIds) {
                // Remove existing team assignments
                await tx.projectTeam.deleteMany({
                    where: { projectId: validatedData.projectId }
                })

                // Add new team assignments
                await Promise.all(
                    validatedData.assignedTeamIds.map(teamId =>
                        tx.projectTeam.create({
                            data: {
                                projectId: validatedData.projectId,
                                teamId: teamId,
                                assignedById: session.user.id
                            }
                        })
                    )
                )
            }

            return project
        })

        revalidatePath('/projects')
        revalidatePath(`/projects/${existingProject.slug}`)

        return {
            success: true,
            project: result,
            message: "Project updated successfully"
        }
    } catch (error) {
        console.error("Update project error:", error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0]?.message || "Invalid input data"
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update project"
        }
    }
}

// Get all projects for current user with role-based filtering
export async function getUserProjects() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", projects: [] }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                company: true,
                ownedCompany: true,
                teamMemberships: true,
                ledTeams: true
            }
        })

        if (!user) {
            return { success: false, error: "User not found", projects: [] }
        }

        let whereClause: any = {}

        switch (user.role) {
            case Role.CLIENT:
                // Clients see only their own projects
                whereClause = {
                    userId: session.user.id
                }
                break

            case Role.COMPANY_OWNER:
                // Company owners see all projects in their company
                whereClause = {
                    companyId: user.ownedCompany?.id || user.company?.id
                }
                break

            case Role.TEAM_HEAD:
                // Team heads see projects assigned to their teams
                const ledTeamIds = user.ledTeams.map(team => team.id)
                whereClause = {
                    assignedTeams: {
                        some: {
                            teamId: { in: ledTeamIds }
                        }
                    }
                }
                break

            case Role.TEAM_MEMBER:
                // Team members see projects from their teams that are public, or private projects they have access to
                const memberTeamIds = user.teamMemberships.map(membership => membership.teamId)
                whereClause = {
                    OR: [
                        {
                            assignedTeams: {
                                some: {
                                    teamId: { in: memberTeamIds }
                                }
                            },
                            visibility: ProjectVisibility.PUBLIC
                        },
                        {
                            projectInvites: {
                                some: {
                                    userId: session.user.id
                                }
                            }
                        }
                    ]
                }
                break
        }

        const projects = await prisma.project.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                assignedTeams: {
                    include: {
                        team: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                                teamType: true,
                                color: true
                            }
                        }
                    }
                },
                tasks: {
                    select: {
                        id: true,
                        status: true,
                        assignedDeveloper: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                role: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        tasks: true,
                        feedbacks: true,
                        messages: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return {
            success: true,
            projects
        }
    } catch (error) {
        console.error("Get user projects error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get projects",
            projects: []
        }
    }
}

// Get company projects (all projects in the company)
export async function getCompanyProjects(providedCompanyId?: string | null) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", projects: [] }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                company: true,
                ownedCompany: true
            }
        })

        if (!user || (!user.company && !user.ownedCompany)) {
            return { success: false, error: "User not associated with any company", projects: [] }
        }

        // Only Company Owners and Team Heads can see all company projects
        if (user.role !== Role.COMPANY_OWNER && user.role !== Role.TEAM_HEAD) {
            return { success: false, error: "Insufficient permissions", projects: [] }
        }

        const companyId = user.ownedCompany?.id || user.company?.id

        const projects = await prisma.project.findMany({
            where: {
                companyId: companyId
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
                assignedTeams: {
                    include: {
                        team: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                                teamType: true,
                                color: true
                            }
                        }
                    }
                },
                tasks: {
                    select: {
                        id: true,
                        status: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                role: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        tasks: true,
                        feedbacks: true,
                        messages: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return {
            success: true,
            projects
        }
    } catch (error) {
        console.error("Get company projects error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get company projects",
            projects: []
        }
    }
}

// Get project details by slug with role-based access control
export async function getProjectBySlug(slug: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", project: null }
        }

        const project = await prisma.project.findUnique({
            where: { slug },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                assignedTeams: {
                    include: {
                        team: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                                teamType: true,
                                color: true,
                                head: {
                                    select: {
                                        id: true,
                                        name: true,
                                        image: true
                                    }
                                }
                            }
                        }
                    }
                },
                tasks: {
                    include: {
                        assignedDeveloper: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        },
                        assignedTeam: {
                            select: {
                                id: true,
                                name: true,
                                displayName: true,
                                color: true
                            }
                        },
                        subtasks: true
                    }
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                role: true
                            }
                        }
                    }
                },
                feedbacks: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                role: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                messages: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                role: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                projectInvites: {
                    where: {
                        userId: session.user.id
                    }
                },
                _count: {
                    select: {
                        tasks: true,
                        feedbacks: true,
                        messages: true
                    }
                }
            }
        })

        if (!project) {
            return { success: false, error: "Project not found", project: null }
        }

        // Check access permissions
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                teamMemberships: true,
                ledTeams: true,
                ownedCompany: true
            }
        })

        if (!user) {
            return { success: false, error: "User not found", project: null }
        }

        let hasAccess = false

        // Client owns the project
        if (project.userId === session.user.id) {
            hasAccess = true
        }
        // Company owner has access to all company projects
        else if (user.role === Role.COMPANY_OWNER && user.ownedCompany?.id === project.companyId) {
            hasAccess = true
        }
        // Team head has access to projects assigned to their teams
        else if (user.role === Role.TEAM_HEAD) {
            const ledTeamIds = user.ledTeams.map(team => team.id)
            hasAccess = project.assignedTeams.some(pt => ledTeamIds.includes(pt.teamId))
        }
        // Team members have access if project is public and assigned to their team, or if they have explicit access to private project
        else if (user.role === Role.TEAM_MEMBER) {
            const memberTeamIds = user.teamMemberships.map(membership => membership.teamId)
            const isAssignedToUserTeam = project.assignedTeams.some(pt => memberTeamIds.includes(pt.teamId))

            hasAccess = isAssignedToUserTeam &&
                (project.visibility === ProjectVisibility.PUBLIC || project.projectInvites.length > 0)
        }
        // Project member
        else if (project.members.some(member => member.userId === session.user.id)) {
            hasAccess = true
        }

        if (!hasAccess) {
            return { success: false, error: "Access denied to this project", project: null }
        }

        return {
            success: true,
            project
        }
    } catch (error) {
        console.error("Get project by slug error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get project",
            project: null
        }
    }
}
// Get projects for teams (used by team heads and members)
export async function getTeamProjects() {
    return await getUserProjects()
}
