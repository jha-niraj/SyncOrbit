"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

export async function getCompanyClients() {
    const session = await auth()
    if (!session?.user?.email) {
        return { error: "Unauthorized" }
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { company: true, ownedCompany: true }
    })

    if (!user) return { error: "User not found" }

    const companyId = user.companyId || user.ownedCompany?.id

    if (!companyId) return { error: "Company not found" }

    // Check permissions (Company Owner or Team Head)
    if (user.role !== Role.COMPANY_OWNER && user.role !== Role.TEAM_HEAD) {
        return { error: "Permission denied" }
    }

    try {
        const clients = await prisma.user.findMany({
            where: {
                companyId: companyId,
                role: Role.CLIENT
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                isActive: true,
                createdAt: true,
                totalSpent: true,
                _count: {
                    select: {
                        projects: true,
                        projectMemberships: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return { success: true, data: clients }
    } catch (error) {
        console.error("Error fetching clients:", error)
        return { error: "Failed to fetch clients" }
    }
}

export async function getClientDetails(clientId: string) {
    const session = await auth()
    if (!session?.user?.email) {
        return { error: "Unauthorized" }
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { company: true, ownedCompany: true }
    })

    if (!user) return { error: "User not found" }

    const companyId = user.companyId || user.ownedCompany?.id

    if (!companyId) return { error: "Company not found" }

    // Check permissions
    if (user.role !== Role.COMPANY_OWNER && user.role !== Role.TEAM_HEAD) {
        return { error: "Permission denied" }
    }

    try {
        const client = await prisma.user.findUnique({
            where: {
                id: clientId,
                companyId: companyId,
                role: Role.CLIENT
            },
            include: {
                projectMemberships: {
                    include: {
                        project: {
                            select: {
                                id: true,
                                title: true,
                                status: true,
                                budget: true,
                                startDate: true,
                                endDate: true
                            }
                        }
                    }
                }
            }
        })

        if (!client) return { error: "Client not found" }

        return { success: true, data: client }
    } catch (error) {
        console.error("Error fetching client details:", error)
        return { error: "Failed to fetch client details" }
    }
}
