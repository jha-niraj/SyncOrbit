import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is admin (uncomment this when you want to enforce admin access)
        // if (session.user.role !== 'ADMIN') {
        //     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        // }

        const developers = await prisma.user.findMany({
            where: {
                role: {
                    in: [Role.TEAM_MEMBER, Role.TEAM_HEAD, Role.COMPANY_OWNER]
                }
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

        return NextResponse.json({ 
            success: true, 
            developers: developers.map(dev => ({
                ...dev,
                name: dev.name || 'Unknown Developer'
            }))
        });
    } catch (error) {
        console.error("Developer search error:", error);
        return NextResponse.json(
            { error: "Failed to fetch developers" },
            { status: 500 }
        );
    }
} 