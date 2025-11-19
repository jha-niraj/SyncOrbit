"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

interface GenerateReferralLinkParams {
    role: Role
    teamId?: string
}

export async function generateReferralLink({ role, teamId }: GenerateReferralLinkParams) {
    try {
        const session = await auth()
        if (!session?.user?.companyId) {
            return { success: false, error: "Unauthorized" }
        }

        const company = await prisma.company.findUnique({
            where: { id: session.user.companyId },
            select: {
                devReferralCode: true,
                clientReferralCode: true,
                id: true
            }
        })

        if (!company) {
            return { success: false, error: "Company not found" }
        }

        // Determine which base code to use
        // Currently we have devReferralCode and clientReferralCode
        // We might need to enhance this system later for more granular codes
        // For now, we'll use devReferralCode for TEAM_MEMBER and TEAM_HEAD
        // and clientReferralCode for CLIENT

        let code = ""
        if (role === Role.CLIENT) {
            code = company.clientReferralCode || ""
        } else {
            code = company.devReferralCode || ""
        }

        if (!code) {
            return { success: false, error: "Referral code not found for this role" }
        }

        // Construct the URL
        // We can append extra params for role and teamId that the signup page can parse
        // e.g. ?ref=CODE&role=TEAM_MEMBER&team=teamId

        const params = new URLSearchParams()
        params.append("ref", code)

        // Only add role if it's specific (though the code implies it)
        // But adding it helps the signup page pre-select or validate
        params.append("role", role)

        if (teamId) {
            params.append("team", teamId)
        }

        const link = `${process.env.NEXT_PUBLIC_APP_URL}/signup?${params.toString()}`

        return { success: true, link }
    } catch (error) {
        console.error("Error generating referral link:", error)
        return { success: false, error: "Failed to generate link" }
    }
}
