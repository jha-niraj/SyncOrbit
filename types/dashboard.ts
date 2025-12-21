// Dashboard and analytics types
import { Project } from "./project"

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

export interface Invoice {
    id: string
    amount: number
    status: string
    createdAt: Date
    dueDate?: Date
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
    assignedTasks: any[] // We can use Task type if we define it more broadly
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
    invoices: Invoice[]
    stats: {
        activeProjects: number
        totalFiles: number
        unreadMessages: number
    }
}
