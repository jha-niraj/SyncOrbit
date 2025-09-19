import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Role } from "@prisma/client";

const createProjectSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    slug: z.string().min(1).max(100),
    clientId: z.string().min(1),
    clientType: z.enum(['EXTERNAL', 'INTERNAL']),
    budget: z.number().positive(),
    currency: z.enum(['USD', 'INR', 'NPR']).default('USD'),
    paidAmount: z.number().min(0).optional().default(0),
    paymentStatus: z.enum(['PENDING', 'PARTIAL', 'COMPLETED']).default('PENDING'),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    livePreviewUrl: z.string().url().optional().or(z.literal('')),
    figmaUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    documentsUrl: z.string().url().optional().or(z.literal('')),
    otherLinks: z.string().optional(),
    developerIds: z.array(z.string()).optional().default([]),
});

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is admin (uncomment this when you want to enforce admin access)
        // if (session.user.role !== 'ADMIN') {
        //     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        // }

        const body = await req.json();
        const validatedData = createProjectSchema.parse(body);

        // Check if client exists
        const client = await prisma.user.findFirst({
            where: {
                id: validatedData.clientId,
                role: Role.CLIENT
            },
            include: {
                company: true
            }
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        if (!client.companyId) {
            return NextResponse.json({ error: "Client must be associated with a company" }, { status: 400 });
        }

        // Check if slug is unique
        const existingProject = await prisma.project.findUnique({
            where: { slug: validatedData.slug }
        });

        if (existingProject) {
            return NextResponse.json({ error: "Project slug already exists" }, { status: 400 });
        }

        // Verify developers exist
        if (validatedData.developerIds.length > 0) {
            const developers = await prisma.user.findMany({
                where: {
                    id: { in: validatedData.developerIds },
                    role: { in: [Role.TEAM_MEMBER, Role.TEAM_HEAD, Role.COMPANY_OWNER] }
                }
            });

            if (developers.length !== validatedData.developerIds.length) {
                return NextResponse.json({ error: "Some developers not found" }, { status: 400 });
            }
        }

        // Create the project
        const project = await prisma.project.create({
            data: {
                title: validatedData.title,
                description: validatedData.description || '',
                slug: validatedData.slug,
                userId: validatedData.clientId,
                companyId: client.companyId,
                clientType: validatedData.clientType,
                budget: validatedData.budget,
                currency: validatedData.currency,
                paidAmount: validatedData.paidAmount,
                paymentStatus: validatedData.paymentStatus,
                startDate: validatedData.startDate ? new Date(validatedData.startDate) : new Date(),
                endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
                status: 'IN_PROGRESS',
                // Project links
                livePreviewUrl: validatedData.livePreviewUrl || null,
                figmaUrl: validatedData.figmaUrl || null,
                githubUrl: validatedData.githubUrl || null,
                documentsUrl: validatedData.documentsUrl || null,
                otherLinks: validatedData.otherLinks || null,
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
        });

        // Create initial tasks for assigned developers (optional placeholder tasks)
        if (validatedData.developerIds.length > 0) {
            const tasks = validatedData.developerIds.map((developerId, index) => ({
                title: `Development Task ${index + 1}`,
                description: `Task assigned to developer for ${validatedData.title}`,
                projectId: project.id,
                assignedDeveloperId: developerId,
                status: 'YET_TO_START' as const
            }));

            await prisma.task.createMany({
                data: tasks
            });
        }

        return NextResponse.json({ 
            success: true, 
            project,
            message: "Project created successfully"
        });
    } catch (error) {
        console.error("Project creation error:", error);
        
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid input data", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
} 