// Dashboard and analytics types
export interface DashboardData {
    projects: DashboardProject[]
    stats: DashboardStats
    recentActivity: ActivityItem[]
}

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

export interface DashboardStats {
    totalProjects: number
    activeProjects: number
    completedTasks: number
    teamMembers: number
    revenue?: number
}

export interface ActivityItem {
    id: string
    type: 'project_created' | 'task_completed' | 'member_added' | 'status_changed'
    message: string
    timestamp: Date
    user?: {
        name?: string | null
        image?: string | null
    }
}

export interface AnalyticsData {
    period: 'week' | 'month' | 'year'
    metrics: {
        projectsCompleted: number
        tasksCompleted: number
        revenue: number
        teamEfficiency: number
    }
    charts: {
        projectTimeline: ChartDataPoint[]
        taskDistribution: ChartDataPoint[]
        revenueGrowth: ChartDataPoint[]
    }
}

export interface ChartDataPoint {
    label: string
    value: number
    date?: Date
}
