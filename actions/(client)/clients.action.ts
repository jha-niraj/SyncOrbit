"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function searchClients(query?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        if (query && query.length < 2) {
            return { success: true, clients: [] };
        }

        const clients = await prisma.user.findMany({
            where: {
                role: 'CLIENT',
                ...(query && {
                    OR: [
                        {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        },
                        {
                            email: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    ]
                })
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                totalSpent: true,
                _count: {
                    select: {
                        projects: true
                    }
                }
            },
            take: 10,
            orderBy: {
                name: 'asc'
            }
        });

        const transformedClients = clients.map(client => ({
            id: client.id,
            name: client.name || 'Unknown',
            email: client.email || '',
            image: client.image,
            totalSpent: client.totalSpent,
            projectsCount: client._count.projects
        }));

        return { success: true, clients: transformedClients };
    } catch (error) {
        console.error("Client search error:", error);
        return { success: false, error: "Failed to search clients" };
    }
}

export async function getAllClients() {
    return searchClients();
} 