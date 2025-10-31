import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"
import { Role } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string | null
            name: string | null
            image?: string | null
            role: Role
            companyId?: string | null
            isCompanyOwner?: boolean
            isTeamHead?: boolean
            hasTeams?: boolean
            bio?: string | null
            emailVerified?: Date | null
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        id: string
        email: string | null
        name: string | null
        image?: string | null
        role: Role
        companyId?: string | null
        isCompanyOwner?: boolean
        isTeamHead?: boolean
        hasTeams?: boolean
        bio?: string | null
        emailVerified?: Date | null
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string
        email: string | null
        name: string | null
        image?: string | null
        role: Role
        companyId?: string | null
        isCompanyOwner?: boolean
        isTeamHead?: boolean
        hasTeams?: boolean
        roleExplicitlyChosen?: boolean
        needsOnboarding?: boolean
        googleUser?: {
            email: string
            name: string
            image?: string
        }
        bio?: string | null
        emailVerified?: Date | null
    }
}