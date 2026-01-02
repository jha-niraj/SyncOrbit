// Project related types
import { 
    ProjectVisibility, Status, ClientType 
} from "@prisma/client"
import { TaskWithRelations } from "./task"

export interface ProjectUser {
    id: string
    name: string | null
    email: string | null
    image: string | null
}

export interface ProjectTeam {
    id: string
    team: {
        id: string
        teamType: string
        displayName: string
        color: string | null
        head?: {
            id: string
            name: string | null
            image?: string | null
        } | null
    }
}

export interface ProjectMember {
    id: string
    user: {
        id: string
        name: string | null
        image: string | null
        role: string
    }
}

export interface Project {
    id: string
    title: string
    description: string | null
    status: Status
    visibility: ProjectVisibility
    clientType: ClientType
    budget: number
    currency: string
    slug: string
    startDate: Date
    endDate: Date | null
    livePreviewUrl: string | null
    figmaUrl: string | null
    githubUrl: string | null
    documentsUrl: string | null
    companyId: string | null
    userId: string
    createdAt: Date
    updatedAt: Date
}

export interface ProjectWithRelations extends Project {
    user: ProjectUser
    assignedTeams: ProjectTeam[]
    members: ProjectMember[]
    tasks: TaskWithRelations[]
    _count?: {
        tasks: number
        messages: number
        feedbacks: number
        members: number
    }
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