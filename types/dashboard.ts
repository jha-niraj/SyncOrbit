// Dashboard and analytics types
import { Project } from "./project"

export interface DashboardProject {
    id: string
    title: string
    status: string
    progress: number
    dueDate?: Date
    team?: {
        name: string
        color?: string | null
    }
}

export interface ActivityItem {
    id: string
    type: string
    description: string
    createdAt: Date
    user: {
        name: string | null
        image: string | null
    }
}

// Owner Dashboard
export interface OwnerDashboardData {
    projects: Project[]
    stats: {
        totalProjects: number
        activeProjects: number
        completedProjects: number
        totalTeams: number
        totalMembers: number
    }
    recentActivity: ActivityItem[]
}

// Lead Dashboard
export interface LeadDashboardData {
    projects: Project[]
    stats: {
        activeProjects: number
        teamSize: number
        pendingTasks: number
        completionRate: number
    }
}

// Member Dashboard
export interface MemberDashboardData {
    assignedTasks: any[] // Task type from prisma ideally
    projects: Project[]
    stats: {
        myTasks: number
        myInProgress: number
        myCompleted: number
        myProjects: number
    }
}

// Client Dashboard
export interface ClientDashboardData {
    projects: Project[]
    invoices: any[]
    stats: {
        activeProjects: number
        totalFiles: number
        unreadMessages: number
    }
}
