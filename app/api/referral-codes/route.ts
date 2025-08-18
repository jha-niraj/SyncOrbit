import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Only Product Managers can view referral codes
        if (session.user.role !== "PRODUCTMANAGER") {
            return NextResponse.json(
                { error: "Only Product Managers can view referral codes" },
                { status: 403 }
            )
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

        const referralCodes = await prisma.referralCode.findMany({
            where: {
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
                },
                usedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({
            success: true,
            referralCodes
        })

    } catch (error) {
        console.error("Get referral codes error:", error)
        return NextResponse.json(
            { error: "Failed to get referral codes" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth()
        
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Only Product Managers can delete referral codes
        if (session.user.role !== "PRODUCTMANAGER") {
            return NextResponse.json(
                { error: "Only Product Managers can delete referral codes" },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(request.url)
        const codeId = searchParams.get('id')

        if (!codeId) {
            return NextResponse.json(
                { error: "Code ID is required" },
                { status: 400 }
            )
        }

        // Verify the code belongs to the PM's company
        const referralCode = await prisma.referralCode.findFirst({
            where: {
                id: codeId,
                generatedById: session.user.id
            }
        })

        if (!referralCode) {
            return NextResponse.json(
                { error: "Referral code not found or unauthorized" },
                { status: 404 }
            )
        }

        // Delete the referral code
        await prisma.referralCode.delete({
            where: { id: codeId }
        })

        return NextResponse.json({
            success: true,
            message: "Referral code deleted successfully"
        })

    } catch (error) {
        console.error("Delete referral code error:", error)
        return NextResponse.json(
            { error: "Failed to delete referral code" },
            { status: 500 }
        )
    }
}
