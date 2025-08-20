// Analytics related types and interfaces

export interface AnalyticsData {
    overview: AnalyticsOverview
    projectStats: ProjectStat[]
    teamPerformance: TeamPerformanceMember[]
    recentActivity: RecentActivity[]
}

export interface AnalyticsOverview {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    totalRevenue: number
    teamMembers: number
    onTimeDelivery: number
    clientSatisfaction: number
    averageProjectDuration: number
}

export interface ProjectStat {
    month: string
    completed: number
    active: number
    revenue: number
}

export interface TeamPerformanceMember {
    name: string
    rating: number
    efficiency: number
    projectsCompleted: number
    tasksCompleted: number
}

export interface RecentActivity {
    type: 'project_completed' | 'milestone_reached' | 'new_client' | 'team_added'
    message: string
    time: string
}

export interface StatCardProps {
    title: string
    value: string | number
    change?: number
    icon: React.ComponentType<any>
    trend?: 'up' | 'down'
    description?: string
}

export interface ChartCardProps {
    title: string
    children: React.ReactNode
}
