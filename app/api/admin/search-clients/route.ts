import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is admin (uncomment this when you want to enforce admin access)
        // if (session.user.role !== 'ADMIN') {
        //     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        // }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json({ clients: [] });
        }

        const clients = await prisma.user.findMany({
            where: {
                role: 'CLIENT',
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

        // Transform the data to match the expected format
        const transformedClients = clients.map(client => ({
            id: client.id,
            name: client.name || 'Unknown',
            email: client.email || '',
            image: client.image,
            totalSpent: client.totalSpent,
            projectsCount: client._count.projects
        }));

        return NextResponse.json({ clients: transformedClients });
    } catch (error) {
        console.error("Client search error:", error);
        return NextResponse.json(
            { error: "Failed to search clients" },
            { status: 500 }
        );
    }
} 