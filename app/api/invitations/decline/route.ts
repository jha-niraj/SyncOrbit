import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { InvitationStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const invitationId = searchParams.get('id')

        if (!invitationId) {
            return NextResponse.json(
                { error: "Invitation ID is required" },
                { status: 400 }
            )
        }

        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
            include: {
                company: true,
                project: true,
                sender: {
                    select: { name: true }
                }
            }
        })

        if (!invitation) {
            return NextResponse.json(
                { error: "Invitation not found" },
                { status: 404 }
            )
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            return NextResponse.json(
                { error: "This invitation has already been responded to" },
                { status: 400 }
            )
        }

        // Update invitation status
        await prisma.invitation.update({
            where: { id: invitationId },
            data: { status: InvitationStatus.DECLINED }
        })

        // Redirect to a thank you page or homepage
        const redirectUrl = new URL('/', request.url)
        redirectUrl.searchParams.set('message', 'Invitation declined')
        return NextResponse.redirect(redirectUrl)

    } catch (error) {
        console.error("Decline invitation error:", error)
        return NextResponse.json(
            { error: "Failed to decline invitation" },
            { status: 500 }
        )
    }
}
