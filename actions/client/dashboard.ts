"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Invoice } from "@/types/dashboard"

export async function getClientDashboardData() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        // Projects owned/commissioned by the client
        const commissionedProjects = await prisma.project.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                tasks: true,
                user: true,
                _count: {
                    select: { messages: true, tasks: true, members: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        })

        // Recent invoices
        const invoices: Invoice[] = await (prisma as any).invoice?.findMany({
            where: { clientId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 5
        }) || []

        return {
            projects: commissionedProjects,
            invoices,
            stats: {
                activeProjects: commissionedProjects.filter(p => p.status === 'IN_PROGRESS').length,
                totalFiles: 0,
                unreadMessages: commissionedProjects.reduce((acc, curr) => acc + (curr._count?.messages || 0), 0)
            }
        }
    } catch (error) {
        console.error('Error fetching client dashboard data:', error)
        return null
    }
}
