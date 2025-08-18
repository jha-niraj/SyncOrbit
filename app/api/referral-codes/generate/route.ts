import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Only Product Managers can generate referral codes
        if (session.user.role !== "PRODUCTMANAGER") {
            return NextResponse.json(
                { error: "Only Product Managers can generate referral codes" },
                { status: 403 }
            )
        }

        const body = await request.json()
        const { role, maxUses, expiresAt, description } = body

        // Validate the role
        if (!role || !Object.values(Role).includes(role)) {
            return NextResponse.json(
                { error: "Invalid role specified" },
                { status: 400 }
            )
        }

        // Generate a unique referral code
        const generateCode = () => {
            const prefix = role === "CLIENT" ? "CL" : role === "DEVELOPER" ? "DV" : "PM"
            const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
            return `${prefix}-${randomPart}`
        }

        let code = generateCode()
        
        // Ensure the code is unique
        let existingCode = await prisma.referralCode.findUnique({
            where: { code }
        })
        
        while (existingCode) {
            code = generateCode()
            existingCode = await prisma.referralCode.findUnique({
                where: { code }
            })
        }

        // Get user's company
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { managedCompany: true }
        })

        if (!user?.managedCompany) {
            return NextResponse.json(
                { error: "Product Manager must be associated with a company" },
                { status: 400 }
            )
        }

        // Create the referral code
        const referralCode = await prisma.referralCode.create({
            data: {
                code,
                role,
                maxUses: maxUses || 1,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                description,
                generatedById: session.user.id,
                companyId: user.managedCompany.id
            },
            include: {
                generatedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true,
                        shortName: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            referralCode
        })

    } catch (error) {
        console.error("Generate referral code error:", error)
        return NextResponse.json(
            { error: "Failed to generate referral code" },
            { status: 500 }
        )
    }
}
