"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

// Get team members for Product Managers
export async function getTeamMembers() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // Only Product Managers can access team data
        if (session.user.role !== Role.PRODUCTMANAGER) {
            throw new Error("Only Product Managers can access team data")
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { managedCompany: true }
        })

        if (!user?.managedCompany) {
            throw new Error("Product Manager must be associated with a company")
        }

        // Get all team members (developers and clients)
        const teamMembers = await prisma.user.findMany({
            where: {
                OR: [
                    // Users who are members of the company
                    { companyId: user.managedCompany.id },
                    // Clients who have projects managed by this PM
                    {
                        role: Role.CLIENT,
                        projects: {
                            some: {
                                user: {
                                    managedCompany: {
                                        id: user.managedCompany.id
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            include: {
                assignedTasks: {
                    include: {
                        project: {
                            select: {
                                id: true,
                                title: true,
                                slug: true
                            }
                        }
                    }
                },
                projects: {
                    where: {
                        user: {
                            managedCompany: {
                                id: user.managedCompany.id
                            }
                        }
                    },
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        status: true
                    }
                },
                projectMemberships: {
                    include: {
                        project: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                status: true
                            }
                        }
                    }
                }
            }
        })

        // Calculate stats for each team member
        const teamMembersWithStats = teamMembers.map(member => {
            const totalTasks = member.assignedTasks.length
            const completedTasks = member.assignedTasks.filter(task => task.status === 'COMPLETED').length
            const inProgressTasks = member.assignedTasks.filter(task => task.status === 'IN_PROGRESS').length
            const pendingTasks = member.assignedTasks.filter(task => task.status === 'YET_TO_START').length

            // Get unique projects
            const allProjects = [
                ...member.projects,
                ...member.projectMemberships.map(pm => pm.project)
            ]
            const uniqueProjects = allProjects.reduce((unique, project) => {
                if (!unique.find(p => p.id === project.id)) {
                    unique.push(project)
                }
                return unique
            }, [] as any[])

            return {
                id: member.id,
                name: member.name,
                email: member.email,
                image: member.image,
                role: member.role,
                bio: member.bio,
                skills: member.skills,
                createdAt: member.createdAt,
                stats: {
                    totalTasks,
                    completedTasks,
                    inProgressTasks,
                    pendingTasks,
                    projectCount: uniqueProjects.length,
                    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
                },
                projects: uniqueProjects,
                tasks: member.assignedTasks
            }
        })

        return {
            success: true,
            teamMembers: teamMembersWithStats,
            company: user.managedCompany
        }
    } catch (error) {
        console.error("Get team members error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get team members",
            teamMembers: [],
            company: null
        }
    }
}

// Get detailed developer information
export async function getDeveloperDetails(developerId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // Only Product Managers can access detailed developer data
        if (session.user.role !== Role.PRODUCTMANAGER) {
            throw new Error("Only Product Managers can access this data")
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { managedCompany: true }
        })

        if (!user?.managedCompany) {
            throw new Error("Product Manager must be associated with a company")
        }

        // Get developer details
        const developer = await prisma.user.findUnique({
            where: { id: developerId },
            include: {
                assignedTasks: {
                    include: {
                        project: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                status: true,
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        },
                        subtasks: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                projectMemberships: {
                    include: {
                        project: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                status: true,
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!developer) {
            throw new Error("Developer not found")
        }

        // Verify the developer is part of this PM's team
        const isTeamMember = developer.companyId === user.managedCompany.id ||
                           developer.assignedTasks.some(task => 
                               task.project.user.id === session.user.id
                           )

        if (!isTeamMember) {
            throw new Error("Developer is not part of your team")
        }

        // Get project stats
        const allProjects = [
            ...developer.projectMemberships.map(pm => pm.project)
        ]
        const uniqueProjects = allProjects.reduce((unique, project) => {
            if (!unique.find(p => p.id === project.id)) {
                unique.push(project)
            }
            return unique
        }, [] as any[])

        // Calculate task stats by project
        const projectStats = uniqueProjects.map(project => {
            const projectTasks = developer.assignedTasks.filter(task => task.project.id === project.id)
            const completed = projectTasks.filter(task => task.status === 'COMPLETED').length
            const inProgress = projectTasks.filter(task => task.status === 'IN_PROGRESS').length
            const pending = projectTasks.filter(task => task.status === 'YET_TO_START').length

            return {
                project,
                tasks: {
                    total: projectTasks.length,
                    completed,
                    inProgress,
                    pending,
                    completionRate: projectTasks.length > 0 ? (completed / projectTasks.length) * 100 : 0
                },
                taskList: projectTasks
            }
        })

        const totalTasks = developer.assignedTasks.length
        const completedTasks = developer.assignedTasks.filter(task => task.status === 'COMPLETED').length

        return {
            success: true,
            developer: {
                ...developer,
                stats: {
                    totalTasks,
                    completedTasks,
                    inProgressTasks: developer.assignedTasks.filter(task => task.status === 'IN_PROGRESS').length,
                    pendingTasks: developer.assignedTasks.filter(task => task.status === 'YET_TO_START').length,
                    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
                    projectCount: uniqueProjects.length
                },
                projectStats
            }
        }
    } catch (error) {
        console.error("Get developer details error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get developer details",
            developer: null
        }
    }
}
