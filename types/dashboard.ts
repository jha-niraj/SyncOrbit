import { Project, ProjectWithRelations } from "./project"
import { TaskWithRelations } from "./task"

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
    projects: ProjectWithRelations[]
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
    projects: ProjectWithRelations[]
    stats: {
        activeProjects: number
        teamSize: number
        pendingTasks: number
        completionRate: number
    }
}

// Member Dashboard
export interface MemberDashboardData {
    assignedTasks: TaskWithRelations[]
    projects: ProjectWithRelations[]
    stats: {
        myTasks: number
        myInProgress: number
        myCompleted: number
        myProjects: number
    }
}

// Client Dashboard
export interface ClientDashboardData {
    projects: ProjectWithRelations[]
    invoices: Invoice[]
    stats: {
        activeProjects: number
        totalFiles: number
        unreadMessages: number
    }
}
