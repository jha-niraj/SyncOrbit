"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role, TaskStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schema for creating tasks with cross-team assignment
const createTaskSchema = z.object({
    title: z.string().min(1, "Task title is required").max(200, "Title must be less than 200 characters"),
    description: z.string().optional(),
    projectId: z.string().min(1, "Project ID is required"),
    assignedTeamId: z.string().min(1, "Team assignment is required"),
    assignedDeveloperId: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
    duration: z.number().min(0).max(1000).optional(),
    startDate: z.date().optional(),
    dueDate: z.date().optional()
})

const updateTaskSchema = z.object({
    taskId: z.string().min(1, "Task ID is required"),
    title: z.string().min(1, "Task title is required").max(200, "Title must be less than 200 characters").optional(),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    assignedTeamId: z.string().optional(),
    assignedDeveloperId: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    duration: z.number().min(0).max(1000).optional(),
    startDate: z.date().optional(),
    dueDate: z.date().optional()
})

// Helper function to check if user can assign tasks to a specific team
async function canAssignToTeam(userId: string, teamId: string, projectId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            ownedCompany: true,
            ledTeams: true,
            company: true
        }
    })

    if (!user) return { canAssign: false, error: "User not found" }

    // Get the project to check if it's assigned to the user's teams
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            assignedTeams: {
                include: { team: true }
            }
        }
    })

    if (!project) return { canAssign: false, error: "Project not found" }

    // Get the target team
    const targetTeam = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
            members: true,
            head: true
        }
    })

    if (!targetTeam) return { canAssign: false, error: "Team not found" }

    const companyId = user.ownedCompany?.id || user.company?.id

    // Check if target team belongs to the same company
    if (targetTeam.companyId !== companyId) {
        return { canAssign: false, error: "Cannot assign tasks to teams outside your company" }
    }

    // Check if the project is assigned to the target team
    const isProjectAssignedToTeam = project.assignedTeams.some(pt => pt.teamId === teamId)
    if (!isProjectAssignedToTeam) {
        return { canAssign: false, error: "Project is not assigned to the target team" }
    }

    // Permission checks
    if (user.role === Role.COMPANY_OWNER) {
        return { canAssign: true, user, targetTeam }
    }

    if (user.role === Role.TEAM_HEAD) {
        // Team heads can assign tasks to any team that's assigned to the project
        // if they have permission on the project (their team is also assigned or they're the head of the target team)
        const userTeamIds = user.ledTeams.map(t => t.id)
        const isUserTeamOnProject = project.assignedTeams.some(pt => userTeamIds.includes(pt.teamId))
        const isHeadOfTargetTeam = targetTeam.headId === userId

        if (isUserTeamOnProject || isHeadOfTargetTeam) {
            return { canAssign: true, user, targetTeam }
        }

        return { canAssign: false, error: "You can only assign tasks to teams you lead or teams on projects where your team is involved" }
    }

    return { canAssign: false, error: "Insufficient permissions to assign tasks" }
}

// Helper function to check if user can assign tasks to a specific team member
async function canAssignToMember(userId: string, developerId: string, teamId: string) {
    const developer = await prisma.user.findUnique({
        where: { id: developerId },
        include: {
            teamMemberships: {
                include: { team: true }
            }
        }
    })

    if (!developer) return { canAssign: false, error: "Developer not found" }

    // Check if developer is a member of the target team
    const isMemberOfTeam = developer.teamMemberships.some(membership => membership.teamId === teamId)

    if (!isMemberOfTeam) {
        return { canAssign: false, error: "Developer is not a member of the target team" }
    }

    return { canAssign: true, developer }
}

// Create a new task with cross-team assignment
export async function createTask(data: z.infer<typeof createTaskSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const validatedData = createTaskSchema.parse(data)

        // Check permissions to assign to the specified team
        const { canAssign, user, targetTeam, error: teamError } = await canAssignToTeam(
            session.user.id,
            validatedData.assignedTeamId,
            validatedData.projectId
        )

        if (!canAssign) {
            return { success: false, error: teamError || "Cannot assign to team" }
        }

        // If assigning to a specific developer, validate that too
        if (validatedData.assignedDeveloperId) {
            const { canAssign: canAssignMember, error: memberError } = await canAssignToMember(
                session.user.id,
                validatedData.assignedDeveloperId,
                validatedData.assignedTeamId
            )

            if (!canAssignMember) {
                return { success: false, error: memberError || "Cannot assign to developer" }
            }
        }

        const task = await prisma.task.create({
            data: {
                title: validatedData.title,
                description: validatedData.description || null,
                projectId: validatedData.projectId,
                assignedTeamId: validatedData.assignedTeamId,
                assignedDeveloperId: validatedData.assignedDeveloperId || null,
                priority: validatedData.priority,
                duration: validatedData.duration || null,
                startDate: validatedData.startDate || null,
                dueDate: validatedData.dueDate || null,
                createdById: session.user.id,
                status: TaskStatus.YET_TO_START
            },
            include: {
                assignedTeam: {
                    select: {
                        id: true,
                        displayName: true,
                        teamType: true,
                        color: true
                    }
                },
                assignedDeveloper: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                createdBy: {
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

        revalidatePath(`/projects/${task.project.slug}`)
        revalidatePath('/projects')

        return {
            success: true,
            task,
            message: `Task "${validatedData.title}" assigned to ${targetTeam?.displayName}${validatedData.assignedDeveloperId ? ` (${task.assignedDeveloper?.name})` : ''
                }`
        }
    } catch (error) {
        console.error("Create task error:", error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0]?.message || "Invalid input data"
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create task"
        }
    }
}

// Update existing task with cross-team reassignment
export async function updateTask(data: z.infer<typeof updateTaskSchema>) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const validatedData = updateTaskSchema.parse(data)

        // Get current task to check permissions
        const existingTask = await prisma.task.findUnique({
            where: { id: validatedData.taskId },
            include: {
                assignedTeam: true,
                assignedDeveloper: true,
                project: {
                    include: {
                        assignedTeams: {
                            include: { team: true }
                        }
                    }
                }
            }
        })

        if (!existingTask) {
            return { success: false, error: "Task not found" }
        }

        // Check if user can edit this task
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                ownedCompany: true,
                ledTeams: true,
                teamMemberships: true
            }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Permission checks
        let canEdit = false

        if (user.role === Role.COMPANY_OWNER) {
            canEdit = true
        } else if (user.role === Role.TEAM_HEAD) {
            // Team heads can edit tasks assigned to their teams or tasks in projects their teams are involved in
            const userTeamIds = user.ledTeams.map(t => t.id)
            const isAssignedTeamLed = existingTask.assignedTeamId ? userTeamIds.includes(existingTask.assignedTeamId) : false
            const isProjectTeamLed = existingTask.project.assignedTeams.some(pt => userTeamIds.includes(pt.teamId))

            canEdit = isAssignedTeamLed || isProjectTeamLed
        } else if (user.role === Role.TEAM_MEMBER) {
            // Team members can only edit tasks assigned to them
            canEdit = existingTask.assignedDeveloperId === session.user.id
        }

        if (!canEdit) {
            return { success: false, error: "You don't have permission to edit this task" }
        }

        // If reassigning to a different team, check permissions
        if (validatedData.assignedTeamId && validatedData.assignedTeamId !== existingTask.assignedTeamId) {
            // Only company owners and team heads can reassign between teams
            if (user.role === Role.TEAM_MEMBER) {
                return { success: false, error: "Team members cannot reassign tasks to different teams" }
            }

            const { canAssign, error: teamError } = await canAssignToTeam(
                session.user.id,
                validatedData.assignedTeamId,
                existingTask.projectId
            )

            if (!canAssign) {
                return { success: false, error: teamError || "Cannot reassign to team" }
            }
        }

        // If reassigning to a specific developer, validate that too
        if (validatedData.assignedDeveloperId) {
            const teamId = validatedData.assignedTeamId || existingTask.assignedTeamId

            if (!teamId) {
                return { success: false, error: "Cannot assign developer without a team" }
            }

            const { canAssign: canAssignMember, error: memberError } = await canAssignToMember(
                session.user.id,
                validatedData.assignedDeveloperId,
                teamId
            )

            if (!canAssignMember) {
                return { success: false, error: memberError || "Cannot assign to developer" }
            }
        }

        // Build update data
        const updateData: any = {}
        if (validatedData.title !== undefined) updateData.title = validatedData.title
        if (validatedData.description !== undefined) updateData.description = validatedData.description
        if (validatedData.status !== undefined) updateData.status = validatedData.status
        if (validatedData.assignedTeamId !== undefined) updateData.assignedTeamId = validatedData.assignedTeamId
        if (validatedData.assignedDeveloperId !== undefined) updateData.assignedDeveloperId = validatedData.assignedDeveloperId
        if (validatedData.priority !== undefined) updateData.priority = validatedData.priority
        if (validatedData.duration !== undefined) updateData.duration = validatedData.duration
        if (validatedData.startDate !== undefined) updateData.startDate = validatedData.startDate
        if (validatedData.dueDate !== undefined) updateData.dueDate = validatedData.dueDate

        const task = await prisma.task.update({
            where: { id: validatedData.taskId },
            data: updateData,
            include: {
                assignedTeam: {
                    select: {
                        id: true,
                        displayName: true,
                        teamType: true,
                        color: true
                    }
                },
                assignedDeveloper: {
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

        revalidatePath(`/projects/${task.project.slug}`)
        revalidatePath('/projects')

        return {
            success: true,
            task,
            message: "Task updated successfully"
        }
    } catch (error) {
        console.error("Update task error:", error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0]?.message || "Invalid input data"
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update task"
        }
    }
}

// Get available teams and members for task assignment
export async function getAssignmentOptions(projectId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", teams: [], members: [] }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                ownedCompany: true,
                ledTeams: true,
                company: true
            }
        })

        if (!user) {
            return { success: false, error: "User not found", teams: [], members: [] }
        }

        // Get project with assigned teams
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                assignedTeams: {
                    include: {
                        team: {
                            include: {
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
                                    }
                                },
                                head: {
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
                }
            }
        })

        if (!project) {
            return { success: false, error: "Project not found", teams: [], members: [] }
        }

        // Filter teams based on user permissions
        let availableTeams = project.assignedTeams.map(pt => pt.team)

        if (user.role === Role.TEAM_HEAD) {
            // Team heads can only assign tasks to teams they lead or teams in projects their teams are involved in
            const userTeamIds = user.ledTeams.map(t => t.id)
            availableTeams = availableTeams.filter(team =>
                userTeamIds.includes(team.id) ||
                project.assignedTeams.some(pt => userTeamIds.includes(pt.teamId))
            )
        }

        // Get all members from available teams
        const members = availableTeams.flatMap(team =>
            team.members.map(member => ({
                ...member.user,
                teamId: team.id,
                teamName: team.displayName,
                teamColor: team.color
            }))
        )

        return {
            success: true,
            teams: availableTeams,
            members
        }
    } catch (error) {
        console.error("Get assignment options error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get assignment options",
            teams: [],
            members: []
        }
    }
}

// Get user's tasks with filtering options
export async function getUserTasks(filters?: {
    projectId?: string
    teamId?: string
    status?: TaskStatus
    assignedToMe?: boolean
}) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", tasks: [] }
        }

        const userId = session.user.id

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                teamMemberships: true,
                ledTeams: true,
                ownedCompany: true
            }
        })

        if (!user) {
            return { success: false, error: "User not found", tasks: [] }
        }

        // Build where clause based on user role and filters
        let whereClause: any = {}

        // Base filtering by role
        if (user.role === Role.TEAM_MEMBER) {
            if (filters?.assignedToMe) {
                whereClause.assignedDeveloperId = userId
            } else {
                // Show tasks from user's teams
                const userTeamIds = user.teamMemberships.map(m => m.teamId)
                whereClause.assignedTeamId = { in: userTeamIds }
            }
        } else if (user.role === Role.TEAM_HEAD) {
            // Show tasks from teams the user leads
            const ledTeamIds = user.ledTeams.map(t => t.id)
            if (filters?.assignedToMe) {
                whereClause.assignedDeveloperId = userId
            } else {
                whereClause.assignedTeamId = { in: ledTeamIds }
            }
        }
        // Company owners see all tasks (no additional filtering needed)

        // Apply additional filters
        if (filters?.projectId) {
            whereClause.projectId = filters.projectId
        }

        if (filters?.teamId) {
            whereClause.assignedTeamId = filters.teamId
        }

        if (filters?.status) {
            whereClause.status = filters.status
        }

        const tasks = await prisma.task.findMany({
            where: whereClause,
            include: {
                assignedTeam: {
                    select: {
                        id: true,
                        displayName: true,
                        teamType: true,
                        color: true
                    }
                },
                assignedDeveloper: {
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
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: [
                { priority: 'desc' },
                { createdAt: 'desc' }
            ]
        })

        return {
            success: true,
            tasks
        }
    } catch (error) {
        console.error("Get user tasks error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get tasks",
            tasks: []
        }
    }
}