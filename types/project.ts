// Project related types
export interface ProjectTask {
    id: string
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    assignedDeveloper?: {
        id: string
        name?: string | null
        email?: string | null
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
    status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
    visibility: 'PUBLIC' | 'PRIVATE'
    budget: number
    currency: string
    slug: string
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
