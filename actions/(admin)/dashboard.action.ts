'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Role } from "@prisma/client";

export async function getAdminDashboardData() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        // Check if user is admin
        if (session.user.role !== 'ADMIN') {
            throw new Error("Access denied");
        }

        // Get system overview data
        const [totalUsers, totalProjects, totalFeedback] = await Promise.all([
            prisma.user.count(),
            prisma.project.count(),
            prisma.feedback.count()
        ]);

        // Get recent users (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentUsers = await prisma.user.count({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo
                }
            }
        });

        // Get recent projects (last 30 days)
        const recentProjects = await prisma.project.count({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo
                }
            }
        });

        // Get recent feedback (last 30 days)
        const recentFeedback = await prisma.feedback.count({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo
                }
            }
        });

        // Get all users with their details
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        projects: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10
        });

        // Get recent projects with client details
        const recentProjectsList = await prisma.project.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                budget: true,
                currency: true,
                startDate: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        tasks: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10
        });

        return {
            success: true,
            data: {
                systemOverview: {
                    totalUsers,
                    totalProjects,
                    totalFeedback,
                    recentUsers,
                    recentProjects,
                    recentFeedback
                },
                users,
                projects: recentProjectsList
            }
        };
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch dashboard data"
        };
    }
}

export async function updateUserRole(userId: string, newRole: Role) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        // Check if user is admin
        if (session.user.role !== 'ADMIN') {
            throw new Error("Access denied");
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        return {
            success: true,
            user: updatedUser
        };
    } catch (error) {
        console.error('Error updating user role:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update user role"
        };
    }
} 