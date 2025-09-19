// Role settings related types and interfaces
import { Role } from '@prisma/client'

export interface UserWithRole {
    id: string
    name: string
    email: string
    image?: string
    role: Role
    userRole?: Role
    projects?: any[]
    assignedTasks?: any[]
}

export interface RoleUpdateData {
    userId: string
    userRole: Role
}
