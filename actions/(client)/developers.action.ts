"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { Role } from "@prisma/client"

export async function searchDevelopers(query?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            throw new Error("Unauthorized");
        }

        const developers = await prisma.user.findMany({
            where: {
                role: {
                    in: [Role.TEAM_MEMBER, Role.TEAM_HEAD]
                },
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
                skills: true,
            },
            orderBy: {
                name: 'asc'
            }
        });

        return { 
            success: true, 
            developers: developers.map(dev => ({
                ...dev,
                name: dev.name || 'Unknown Developer'
            }))
        };
    } catch (error) {
        console.error("Developer search error:", error);
        return { success: false, error: "Failed to fetch developers" };
    }
}

export async function getAllDevelopers() {
    return searchDevelopers();
}