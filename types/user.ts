import { Role } from "@prisma/client"

export interface User {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: Role
}

export interface SessionUser {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: Role
    companyId?: string | null
}

export interface AuthFormData {
    name?: string
    email?: string
    password?: string
    role?: Role
}

export interface RegistrationData {
    name: string
    email: string
    password?: string
    role: Role
    companyName?: string
    companyShortName?: string
    referralCode?: string
    companyId?: string
    teamId?: string | null
}
