// Team related types and interfaces

export interface TeamMember {
    id: string
    name: string
    email: string
    image?: string
    role: string
    bio?: string
    skills?: string[]
    createdAt: string
    stats?: TeamMemberStats
    projects?: Project[]
    tasks?: Task[]
}

export interface TeamMemberStats {
    projectCount: number
    completedTasks: number
    inProgressTasks: number
    pendingTasks: number
    totalTasks: number
    completionRate: number
}

export interface DeveloperDetails extends TeamMember {
    stats?: TeamMemberStats
    tasksByProject?: ProjectTaskGroup[]
}

export interface ProjectTaskGroup {
    project: {
        id: string
        title: string
        status: string
    }
    tasks: TaskDetail[]
}

export interface TaskDetail {
    id: string
    title: string
    description?: string
    status: string
    createdAt: string
    duration?: number
}

export interface Project {
    id: string
    title: string
    slug: string
    status: string
}

export interface Task {
    id: string
    title: string
    status: string
    project: Project
}
