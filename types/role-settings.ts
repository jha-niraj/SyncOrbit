// Role settings related types and interfaces

export interface UserWithRole {
    id: string
    name: string
    email: string
    image?: string
    role: 'DEVELOPER' | 'PRODUCTMANAGER' | 'CLIENT' | 'ADMIN'
    userRole?: 'BASIC_DEVELOPER' | 'PROJECT_CREATOR' | 'SENIOR_DEVELOPER' | 'TEAM_LEAD'
    projects?: any[]
    assignedTasks?: any[]
}

export interface RoleUpdateData {
    userId: string
    userRole: 'BASIC_DEVELOPER' | 'PROJECT_CREATOR' | 'SENIOR_DEVELOPER' | 'TEAM_LEAD'
}