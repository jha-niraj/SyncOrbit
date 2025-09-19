"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getUsersByCompany() {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "COMPANY_OWNER") {
            throw new Error("Unauthorized: Only company owners can access company users")
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { ownedCompany: true }
        })

        if (!user?.ownedCompany) {
            throw new Error("No company found for this company owner")
        }

        const companyUsers = await prisma.user.findMany({
            where: {
                companyId: user.ownedCompany.id,
                role: "TEAM_MEMBER"
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
                assignedTasks: {
                    include: {
                        project: true
                    }
                },
                projects: {
                    select: {
                        id: true,
                        title: true,
                        status: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return {
            success: true,
            users: companyUsers
        }
    } catch (error) {
        console.error("Get company users error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch company users"
        }
    }
}

export async function updateUserRole(userId: string, newRole: Role) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "COMPANY_OWNER") {
            throw new Error("Unauthorized: Only company owners can update user roles")
        }

        // Verify the user belongs to the Owner's company
        const ownerUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { ownedCompany: true }
        })

        if (!ownerUser?.ownedCompany) {
            throw new Error("No company found for this company owner")
        }

        const targetUser = await prisma.user.findUnique({
            where: { id: userId },
            include: { company: true }
        })

        if (!targetUser) {
            throw new Error("User not found")
        }

        if (targetUser.companyId !== ownerUser.ownedCompany.id) {
            throw new Error("User does not belong to your company")
        }

        if (targetUser.role !== "TEAM_MEMBER") {
            throw new Error("Can only update roles for team members")
        }

        // Update the user role
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        })

        // Create notification for the user
        await prisma.notification.create({
            data: {
                title: "Role Updated",
                description: `Your role has been updated to ${newRole.replace('_', ' ')}`,
                type: "USER_PROMOTED",
                actionUrl: "/profile",
                senderId: session.user.id,
                receiverId: userId
            }
        })

        revalidatePath("/role-settings")
        revalidatePath("/team")

        return {
            success: true,
            user: updatedUser
        }
    } catch (error) {
        console.error("Update user role error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update user role"
        }
    }
}

export async function getDeveloperTasks(developerId: string) {
    try {
        const session = await auth()
        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        // Verify access (Owner or the team member themselves)
        if (session.user.role !== "COMPANY_OWNER" && session.user.id !== developerId) {
            throw new Error("Unauthorized: Cannot view other user's tasks")
        }

        const developer = await prisma.user.findUnique({
            where: { id: developerId },
            include: {
                assignedTasks: {
                    include: {
                        project: {
                            select: {
                                id: true,
                                title: true,
                                status: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        })

        if (!developer) {
            throw new Error("Developer not found")
        }

        // Group tasks by project
        const tasksByProject = developer.assignedTasks.reduce((acc, task) => {
            const projectId = task.project.id
            if (!acc[projectId]) {
                acc[projectId] = {
                    project: task.project,
                    tasks: []
                }
            }
            acc[projectId].tasks.push(task)
            return acc
        }, {} as Record<string, { project: any, tasks: any[] }>)

        return {
            success: true,
            developer: {
                id: developer.id,
                name: developer.name,
                email: developer.email,
                role: developer.role
            },
            tasksByProject: Object.values(tasksByProject)
        }
    } catch (error) {
        console.error("Get developer tasks error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch developer tasks"
        }
    }
}
