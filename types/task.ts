import { TaskStatus, Priority } from "@prisma/client"

export interface SubTask {
    id: string
    title: string
    completed: boolean
    createdAt?: Date
    updatedAt?: Date
}

export interface TaskUser {
    id: string
    name: string | null
    email: string | null
    image: string | null
}

export interface TaskTeam {
    id: string
    displayName: string
    color?: string | null
}

export interface TaskProject {
    id: string
    title: string
    slug: string
}

export interface Task {
    id: string
    title: string
    description: string | null
    status: TaskStatus
    priority: Priority
    duration: number | null
    startDate: Date | null
    dueDate: Date | null
    assignedTeamId?: string | null
    assignedDeveloperId?: string | null
    projectId: string
    createdById: string | null
    createdAt: Date
    updatedAt: Date
}

export interface TaskWithRelations extends Task {
    assignedDeveloper?: TaskUser | null
    assignedTeam?: TaskTeam | null
    subtasks?: SubTask[]
    project: TaskProject
    _count?: {
        subtasks: number
        comments?: number
        attachments?: number
    }
}
