"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

// Get projects for the current user (based on role)
export async function getUserProjects() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        let projects: any[] = []

        if (session.user.role === Role.CLIENT) {
            // Get projects where user is the client
            projects = await prisma.project.findMany({
                where: {
                    userId: session.user.id
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                            managedCompany: {
                                select: {
                                    name: true,
                                    shortName: true
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
        } else if (session.user.role === Role.PRODUCTMANAGER) {
            // Get projects from the PM's managed company
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                include: { managedCompany: true }
            })

            if (!user?.managedCompany) {
                throw new Error("Product Manager must be associated with a company")
            }

            projects = await prisma.project.findMany({
                where: {
                    user: {
                        managedCompany: {
                            id: user.managedCompany.id
                        }
                    }
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
        } else if (session.user.role === Role.DEVELOPER) {
            // Get projects where user is assigned or is a member
            projects = await prisma.project.findMany({
                where: {
                    OR: [
                        {
                            tasks: {
                                some: {
                                    assignedDeveloperId: session.user.id
                                }
                            }
                        },
                        {
                            members: {
                                some: {
                                    userId: session.user.id
                                }
                            }
                        }
                    ]
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
        }

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

// Get project details by slug
export async function getProjectBySlug(slug: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        const project = await prisma.project.findUnique({
            where: { slug },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        managedCompany: {
                            select: {
                                name: true,
                                shortName: true
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
            throw new Error("Project not found")
        }

        // Check access permissions
        const hasAccess = 
            project.userId === session.user.id || // Client owns the project
            (project.tasks && project.tasks.some((task: any) => task.assignedDeveloperId === session.user.id)) || // Developer assigned to tasks
            (project.members && project.members.some((member: any) => member.userId === session.user.id)) // User is a member

        if (!hasAccess && session.user.role !== Role.PRODUCTMANAGER) {
            throw new Error("Access denied to this project")
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
