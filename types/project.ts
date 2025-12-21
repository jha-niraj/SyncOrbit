// Project related types
import { TaskStatus, ProjectVisibility, Status } from "@prisma/client"

export interface ProjectTask {
    id: string
    title: string
    status: TaskStatus
    priority?: string
    project?: {
        title: string
    }
    assignedDeveloper?: {
        id: string
        name?: string | null
        email?: string | null
        image?: string | null
    } | null
}

export interface ProjectMember {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
}

export interface ProjectTeam {
    id: string
    team: {
        id: string
        teamType: string
        displayName: string
        color: string | null
    }
}

export interface Project {
    id: string
    title: string
    description: string | null
    status: Status
    visibility: ProjectVisibility
    budget: number
    currency: string
    slug: string
    startDate: Date
    endDate: Date | null
    user: {
        id: string
        name: string | null
        email: string | null
        image: string | null
    }
    tasks: ProjectTask[]
    members?: ProjectMember[]
    assignedTeams?: ProjectTeam[]
    _count?: {
        tasks: number
        messages: number
        members: number
    }
    createdAt?: Date
    updatedAt?: Date
}

export interface ProjectStats {
    total: number
    active: number
    completed: number
    onHold: number
    totalTasks: number
    completedTasks: number
    myTasks: number
    myCompletedTasks: number
}