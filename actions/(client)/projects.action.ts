"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role, Currency, ClientType } from "@prisma/client"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"
import { projectCreationClientTemplate, ProjectEmailData } from "@/lib/email-templates/projectEmailTemplates"

// Schema for project creation
const createProjectSchema = z.object({
    title: z.string().min(1, "Project title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().optional(),
    budget: z.number().min(0, "Budget must be a positive number"),
    currency: z.nativeEnum(Currency),
    clientType: z.nativeEnum(ClientType),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid start date"
    }),
    endDate: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Invalid end date"
    }),
    clientEmail: z.string().email("Invalid email address").optional(),
    livePreviewUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    figmaUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    documentsUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    otherLinks: z.string().optional()
})

type CreateProjectInput = z.infer<typeof createProjectSchema>

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Send project creation email to client
async function sendProjectCreationEmail(project: any, clientEmail: string, creatorName: string, creatorEmail: string) {
    try {
        const emailData: ProjectEmailData = {
            projectTitle: project.title,
            projectDescription: project.description || undefined,
            clientName: project.user.name || clientEmail.split('@')[0],
            clientEmail: clientEmail,
            managerName: creatorName,
            managerEmail: creatorEmail,
            companyName: "SyncOrbit",
            projectUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/projects/${project.slug}`,
            budget: project.budget,
            currency: project.currency,
            startDate: project.startDate.toLocaleDateString(),
            endDate: project.endDate ? project.endDate.toLocaleDateString() : undefined
        }

        const template = projectCreationClientTemplate(emailData)

        await resend.emails.send({
            from: `SyncOrbit <noreply@${process.env.RESEND_DOMAIN || 'localhost.com'}>`,
            to: clientEmail,
            subject: template.subject,
            html: template.html,
            text: template.text
        })

        console.log(`Project creation email sent to ${clientEmail} for project ${project.title}`)
        return true
    } catch (error) {
        console.error('Failed to send project creation email:', error)
        return false
    }
}

// Create a new project
export async function createProject(data: CreateProjectInput) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // Only Company Owners and Team Heads can create projects
        if (session.user.role !== Role.COMPANY_OWNER && session.user.role !== Role.TEAM_HEAD) {
            throw new Error("Only Company Owners and Team Heads can create projects")
        }

        // Get user with company info
        const userWithCompany = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { company: true, ownedCompany: true }
        })

        if (!userWithCompany) {
            throw new Error("User not found")
        }

        // Determine company ID
        const companyId = userWithCompany.ownedCompany?.id || userWithCompany.companyId
        
        if (!companyId) {
            throw new Error("User must be associated with a company to create projects")
        }

        // Validate input data
        const validatedData = createProjectSchema.parse(data)

        // Generate unique slug from title
        const baseSlug = validatedData.title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50)

        let slug = baseSlug
        let counter = 1
        
        // Ensure slug is unique
        while (await prisma.project.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`
            counter++
        }

        // Handle client creation or assignment
        let clientUserId: string
        
        if (validatedData.clientType === ClientType.EXTERNAL && validatedData.clientEmail) {
            // Check if client already exists
            let existingClient = await prisma.user.findUnique({
                where: { email: validatedData.clientEmail }
            })

            if (!existingClient) {
                // Create new client user
                existingClient = await prisma.user.create({
                    data: {
                        email: validatedData.clientEmail,
                        name: validatedData.clientEmail.split('@')[0], // Use email prefix as name
                        role: Role.CLIENT,
                        emailVerified: new Date() // Auto-verify for external clients
                    }
                })
            }
            
            clientUserId = existingClient.id
        } else {
            // For internal clients, use the current user as client
            clientUserId = session.user.id
        }

        // Create the project
        const project = await prisma.project.create({
            data: {
                title: validatedData.title,
                description: validatedData.description || null,
                slug,
                budget: validatedData.budget,
                currency: validatedData.currency,
                clientType: validatedData.clientType,
                startDate: new Date(validatedData.startDate),
                endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
                livePreviewUrl: validatedData.livePreviewUrl || null,
                figmaUrl: validatedData.figmaUrl || null,
                githubUrl: validatedData.githubUrl || null,
                documentsUrl: validatedData.documentsUrl || null,
                otherLinks: validatedData.otherLinks || null,
                userId: clientUserId,
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
                }
            }
        })

        // Add the creator as a project member if they're not the client
        if (session.user.id !== clientUserId) {
            await prisma.projectMember.create({
                data: {
                    userId: session.user.id,
                    projectId: project.id,
                    role: session.user.role === Role.COMPANY_OWNER ? "MANAGER" : "DEVELOPER",
                    addedById: session.user.id
                }
            })
        }

        // Send email notification to client for external projects
        if (validatedData.clientType === ClientType.EXTERNAL) {
            const clientEmail = validatedData.clientEmail || project.user.email
            const creatorName = session.user.name || session.user.email || 'Project Manager'
            const creatorEmail = session.user.email || 'manager@SyncOrbit.com'
            
            if (clientEmail) {
                try {
                    await sendProjectCreationEmail(project, clientEmail, creatorName, creatorEmail)
                } catch (emailError) {
                    // Log email error but don't fail project creation
                    console.error('Email notification failed:', emailError)
                }
            }
        }

        // Revalidate the projects page
        revalidatePath('/projects')
        revalidatePath('/dashboard')

        return {
            success: true,
            project,
            message: validatedData.clientType === ClientType.EXTERNAL 
                ? "Project created successfully! Client notification email has been sent."
                : "Project created successfully!"
        }
    } catch (error) {
        console.error("Create project error:", error)
        
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0]?.message || "Invalid input data",
                project: null
            }
        }
        
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create project",
            project: null
        }
    }
}

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
                            ownedCompany: {
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
        } else if (session.user.role === Role.COMPANY_OWNER) {
            // Get projects from the company owner's company
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                include: { ownedCompany: true }
            })

            if (!user?.ownedCompany) {
                throw new Error("Company Owner must be associated with a company")
            }

            projects = await prisma.project.findMany({
                where: {
                    companyId: user.ownedCompany.id
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
        } else if (session.user.role === Role.TEAM_MEMBER || session.user.role === Role.TEAM_HEAD) {
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
                        ownedCompany: {
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

        if (!hasAccess && session.user.role !== Role.COMPANY_OWNER && session.user.role !== Role.TEAM_HEAD) {
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
