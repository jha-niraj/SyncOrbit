import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { InvitationStatus, InvitationType } from "@prisma/client"

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
                },
                receiver: {
                    select: { id: true, name: true }
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

        if (invitation.expiresAt < new Date()) {
            return NextResponse.json(
                { error: "This invitation has expired" },
                { status: 400 }
            )
        }

        if (!invitation.receiver) {
            return NextResponse.redirect(new URL('/signup', request.url))
        }

        // Update invitation status
        await prisma.invitation.update({
            where: { id: invitationId },
            data: { status: InvitationStatus.ACCEPTED }
        })

        // Add user to company or project
        if (invitation.type === InvitationType.COMPANY_MEMBER && invitation.companyId) {
            await prisma.user.update({
                where: { id: invitation.receiver.id },
                data: { companyId: invitation.companyId }
            })
        } else if (invitation.type === InvitationType.PROJECT_MEMBER && invitation.projectId) {
            await prisma.projectMember.create({
                data: {
                    userId: invitation.receiver.id,
                    projectId: invitation.projectId,
                    role: "MEMBER",
                    addedById: invitation.senderId
                }
            })
        }

        // Redirect to dashboard with success message
        const redirectUrl = new URL('/dashboard', request.url)
        redirectUrl.searchParams.set('message', 'Invitation accepted successfully!')
        return NextResponse.redirect(redirectUrl)

    } catch (error) {
        console.error("Accept invitation error:", error)
        return NextResponse.json(
            { error: "Failed to accept invitation" },
            { status: 500 }
        )
    }
}
