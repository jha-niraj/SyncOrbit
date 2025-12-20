// User and authentication related types
export interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: 'COMPANY_OWNER' | 'TEAM_HEAD' | 'TEAM_MEMBER' | 'CLIENT' | 'ADMIN'
}

export interface SessionUser {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: string
}

export interface AuthFormData {
    email: string
    password: string
    name?: string
    confirmPassword?: string
}

export interface PasswordValidation {
    minLength: boolean
    hasUpperCase: boolean
    hasLowerCase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
}
