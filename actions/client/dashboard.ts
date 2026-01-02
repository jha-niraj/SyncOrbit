'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Status, TaskStatus } from "@prisma/client";

import { ProjectWithRelations } from "@/types/project";
import { ClientDashboardData, Invoice } from "@/types/dashboard";

export async function getClientDashboardData(): Promise<ClientDashboardData> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        // Fetch projects
        const projects = await prisma.project.findMany({
            where: { userId: session.user.id },
            include: {
                user: true,
                assignedTeams: {
                    include: {
                        team: {
                            include: {
                                head: true
                            }
                        }
                    }
                },
                members: {
                    include: {
                        user: true
                    }
                },
                tasks: {
                    include: {
                        assignedDeveloper: true,
                        assignedTeam: true,
                        project: true,
                        subtasks: true,
                        _count: true
                    }
                },
                _count: {
                    select: {
                        tasks: true,
                        messages: true,
                        feedbacks: true,
                        members: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        }) as ProjectWithRelations[];

        // Fetch payments as invoices
        const payments = await prisma.payment.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        const invoices: Invoice[] = payments.map(p => ({
            id: p.id,
            amount: p.amount,
            status: p.status,
            createdAt: p.createdAt
        }));

        // Calculate stats
        const activeProjects = projects.filter(p => p.status === Status.IN_PROGRESS).length;

        let totalFiles = 0;
        projects.forEach(p => {
            p.tasks.forEach(t => {
                totalFiles += t._count?.attachments || 0;
            });
        });

        // Count messages
        const unreadMessages = await prisma.message.count({
            where: {
                project: { userId: session.user.id },
                userId: { not: session.user.id }
            }
        });

        return {
            projects,
            invoices,
            stats: {
                activeProjects,
                totalFiles,
                unreadMessages
            }
        };

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
}