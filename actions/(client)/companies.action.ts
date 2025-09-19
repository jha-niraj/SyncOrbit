"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

// Get companies associated with the current client
export async function getClientCompanies() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // Only allow clients to access this
        if (session.user.role !== Role.CLIENT) {
            throw new Error("Only clients can access this data")
        }

        // Get projects where the user is the client
        const userProjects = await prisma.project.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                user: {
                    include: {
                        ownedCompany: {
                            select: {
                                id: true,
                                name: true,
                                shortName: true,
                                logo: true,
                                owner: {
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

        // Also get companies where the user is a member
        const memberCompanies = await prisma.company.findMany({
            where: {
                users: {
                    some: {
                        id: session.user.id
                    }
                }
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                _count: {
                    select: {
                        users: true
                    }
                }
            }
        })

        // Extract unique companies from projects
        const projectCompanies = userProjects
            .map(project => project.user.ownedCompany)
            .filter(company => company !== null)
            .reduce((unique: any[], company) => {
                if (!unique.find((c: any) => c.id === company.id)) {
                    unique.push(company)
                }
                return unique
            }, [])

        // Combine and deduplicate companies
        const allCompanies = [...memberCompanies, ...projectCompanies]
            .reduce((unique: any[], company) => {
                if (!unique.find((c: any) => c.id === company.id)) {
                    unique.push(company)
                }
                return unique
            }, [])

        // Get project counts for each company
        const companiesWithProjectCounts = await Promise.all(
            allCompanies.map(async (company: any) => {
                const projectCount = await prisma.project.count({
                    where: {
                        userId: session.user.id,
                        user: {
                            ownedCompany: {
                                id: company.id
                            }
                        }
                    }
                })

                return {
                    ...company,
                    productManager: company.owner, // Map owner to productManager for backward compatibility
                    projectCount,
                    _count: company._count || { users: 1 }
                }
            })
        )

        return {
            success: true,
            companies: companiesWithProjectCounts
        }
    } catch (error) {
        console.error("Get client companies error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get companies",
            companies: []
        }
    }
}

// Get detailed company information for a client
export async function getClientCompanyDetails(companyShortName: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // Only allow clients to access this
        if (session.user.role !== Role.CLIENT) {
            throw new Error("Only clients can access this data")
        }

        const company = await prisma.company.findUnique({
            where: { shortName: companyShortName },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        bio: true
                    }
                },
                users: {
                    where: {
                        role: {
                            in: [Role.TEAM_MEMBER, Role.TEAM_HEAD]
                        }
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        bio: true,
                        skills: true,
                        assignedTasks: {
                            where: {
                                project: {
                                    userId: session.user.id
                                }
                            },
                            select: {
                                id: true,
                                title: true,
                                status: true,
                                project: {
                                    select: {
                                        id: true,
                                        title: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!company) {
            throw new Error("Company not found")
        }

        // Get client's projects with this company
        const clientProjects = await prisma.project.findMany({
            where: {
                userId: session.user.id,
                user: {
                    ownedCompany: {
                        id: company.id
                    }
                }
            },
            include: {
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
                _count: {
                    select: {
                        tasks: true,
                        feedbacks: true,
                        messages: true
                    }
                }
            }
        })

        // Check if client has access to this company
        const hasAccess = clientProjects.length > 0 || 
                         company.users.some(user => user.id === session.user.id)

        if (!hasAccess) {
            throw new Error("Access denied to this company")
        }

        return {
            success: true,
            company: {
                ...company,
                productManager: company.owner, // Map owner to productManager for backward compatibility
                projects: clientProjects
            }
        }
    } catch (error) {
        console.error("Get client company details error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to get company details",
            company: null
        }
    }
}
