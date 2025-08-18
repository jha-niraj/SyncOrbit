import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { code } = body

        if (!code) {
            return NextResponse.json(
                { error: "Referral code is required" },
                { status: 400 }
            )
        }

        const referralCode = await prisma.referralCode.findUnique({
            where: { code },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        shortName: true
                    }
                },
                generatedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        if (!referralCode) {
            return NextResponse.json(
                { error: "Invalid referral code" },
                { status: 404 }
            )
        }

        // Check if code is active
        if (referralCode.status !== "ACTIVE") {
            return NextResponse.json(
                { error: "Referral code is not active" },
                { status: 400 }
            )
        }

        // Check if code has expired
        if (referralCode.expiresAt && new Date() > referralCode.expiresAt) {
            // Mark as expired
            await prisma.referralCode.update({
                where: { id: referralCode.id },
                data: { status: "EXPIRED" }
            })
            
            return NextResponse.json(
                { error: "Referral code has expired" },
                { status: 400 }
            )
        }

        // Check if code has reached max uses
        if (referralCode.usedCount >= referralCode.maxUses) {
            // Mark as used
            await prisma.referralCode.update({
                where: { id: referralCode.id },
                data: { status: "USED" }
            })
            
            return NextResponse.json(
                { error: "Referral code has reached maximum uses" },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            referralCode: {
                id: referralCode.id,
                code: referralCode.code,
                role: referralCode.role,
                company: referralCode.company,
                generatedBy: referralCode.generatedBy,
                description: referralCode.description
            }
        })

    } catch (error) {
        console.error("Validate referral code error:", error)
        return NextResponse.json(
            { error: "Failed to validate referral code" },
            { status: 500 }
        )
    }
}
