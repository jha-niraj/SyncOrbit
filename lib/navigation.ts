import { Role } from "@prisma/client"
import {
    Home, Briefcase, Users, Building2, BarChart3, Settings, UserPlus, Crown, Calendar,
    MessageSquare, FileText, Bell, Layers, Target, TrendingUp, DollarSign, Eye,
    Award, Coffee
} from "lucide-react"

export interface NavigationItem {
    path: string
    name: string
    icon: React.ComponentType<{ className?: string }>
    description?: string
    badge?: {
        text: string
        variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    }
    children?: NavigationItem[]
    action?: string
}

export interface RoleNavigation {
    role: Role
    primary: NavigationItem[]
    secondary?: NavigationItem[]
}

// Navigation configurations for different roles
export const roleNavigations: RoleNavigation[] = [
    // Company Owner Navigation
    {
        role: Role.COMPANY_OWNER,
        primary: [
            {
                path: "dashboard",
                name: "Dashboard",
                icon: Home,
                description: "Overview and metrics",
                children: [
                    {
                        path: "dashboard",
                        name: "Internal",
                        icon: Home,
                        description: "Internal projects overview"
                    },
                    {
                        path: "dashboard/clients",
                        name: "External",
                        icon: Building2,
                        description: "Client projects overview"
                    }
                ]
            },
            {
                path: "projects",
                name: "Projects",
                icon: Briefcase,
                description: "Manage projects",
                children: [
                    {
                        path: "projects",
                        name: "All Projects",
                        icon: Layers,
                        description: "View all projects"
                    },
                    {
                        path: "#create-project",
                        name: "Create Project",
                        icon: FileText,
                        description: "Start a new project",
                        action: "create_project"
                    }
                ]
            },
            {
                path: "teams",
                name: "Teams",
                icon: Users,
                description: "Manage company teams and members"
            },
            {
                path: "analytics",
                name: "Analytics",
                icon: BarChart3,
                description: "Business insights and reports"
            },
            {
                path: "clients",
                name: "Clients",
                icon: Building2,
                description: "Client management and relationships"
            }
        ],
        secondary: [
            {
                path: "#referral",
                name: "Referral Program",
                icon: UserPlus,
                description: "Invite and earn",
                action: "referral"
            },
            {
                path: "settings",
                name: "Company Settings",
                icon: Settings,
                description: "Company configuration"
            },
            {
                path: "invitations",
                name: "Invitations",
                icon: UserPlus,
                description: "Manage team invitations"
            }
        ]
    },

    // Team Head Navigation
    {
        role: Role.TEAM_HEAD,
        primary: [
            {
                path: "dashboard",
                name: "Dashboard",
                icon: Home,
                description: "Team overview and metrics",
                children: [
                    {
                        path: "dashboard",
                        name: "Internal",
                        icon: Home,
                        description: "Internal projects overview"
                    },
                    {
                        path: "dashboard/clients",
                        name: "External",
                        icon: Building2,
                        description: "Client projects overview"
                    }
                ]
            },
            {
                path: "projects",
                name: "Projects",
                icon: Briefcase,
                description: "Manage projects",
                children: [
                    {
                        path: "projects",
                        name: "All Projects",
                        icon: Briefcase,
                        description: "View all projects"
                    },
                    {
                        path: "team-projects",
                        name: "Team Projects",
                        icon: Target,
                        description: "Projects assigned to your teams"
                    },
                    {
                        path: "#create-project",
                        name: "Create Project",
                        icon: FileText,
                        description: "Start a new project",
                        action: "create_project"
                    }
                ]
            },
            {
                path: "teams",
                name: "My Teams",
                icon: Crown,
                description: "Teams you lead"
            },
            {
                path: "tasks",
                name: "Task Board",
                icon: FileText,
                description: "Manage team tasks and assignments"
            },
            {
                path: "analytics",
                name: "Analytics",
                icon: TrendingUp,
                description: "Performance metrics",
                children: [
                    {
                        path: "analytics/clients",
                        name: "Clients",
                        icon: Users,
                        description: "Client project analytics"
                    },
                    {
                        path: "analytics/internal",
                        name: "Internal",
                        icon: TrendingUp,
                        description: "Internal project analytics"
                    }
                ]
            },
        ],
        secondary: [
            {
                path: "#referral",
                name: "Referral Program",
                icon: UserPlus,
                description: "Invite and earn",
                action: "referral"
            },
            {
                path: "team-settings",
                name: "Team Settings",
                icon: Settings,
                description: "Configure your teams"
            },
            {
                path: "schedule",
                name: "Schedule",
                icon: Calendar,
                description: "Team calendar and milestones"
            },
            {
                path: "reports",
                name: "Reports",
                icon: FileText,
                description: "Generate team reports"
            },
            {
                path: "profile",
                name: "Profile",
                icon: Settings,
                description: "Manage your profile"
            },
            {
                path: "notifications",
                name: "Notifications",
                icon: Bell,
                description: "Your notifications"
            }
        ]
    },

    // Team Member Navigation
    {
        role: Role.TEAM_MEMBER,
        primary: [
            {
                path: "dashboard",
                name: "Dashboard",
                icon: Home,
                description: "Your work overview",
                children: [
                    {
                        path: "dashboard",
                        name: "Internal",
                        icon: Home,
                        description: "Internal projects overview"
                    },
                    {
                        path: "dashboard/clients",
                        name: "External",
                        icon: Building2,
                        description: "Client projects overview"
                    }
                ]
            },
            {
                path: "projects",
                name: "My Projects",
                icon: Briefcase,
                description: "Projects you're working on"
            },
            {
                path: "tasks",
                name: "My Tasks",
                icon: FileText,
                description: "Your assigned tasks"
            },
            {
                path: "teams",
                name: "My Teams",
                icon: Users,
                description: "Teams you belong to"
            },
            {
                path: "schedule",
                name: "Schedule",
                icon: Calendar,
                description: "Your calendar and deadlines"
            },
            {
                path: "progress",
                name: "Progress",
                icon: TrendingUp,
                description: "Track your work progress"
            }
        ],
        secondary: [
            {
                path: "#referral",
                name: "Referral Program",
                icon: UserPlus,
                description: "Invite and earn",
                action: "referral"
            },
            {
                path: "profile",
                name: "Profile",
                icon: Settings,
                description: "Manage your profile"
            },
            {
                path: "notifications",
                name: "Notifications",
                icon: Bell,
                description: "Your notifications"
            },
            {
                path: "timesheets",
                name: "Timesheets",
                icon: Coffee,
                description: "Log your work hours"
            }
        ]
    },

    // Client Navigation
    {
        role: Role.CLIENT,
        primary: [
            {
                path: "dashboard",
                name: "Dashboard",
                icon: Home,
                description: "Project overview"
            },
            {
                path: "projects",
                name: "My Projects",
                icon: Briefcase,
                description: "Your projects"
            },
            {
                path: "progress",
                name: "Progress",
                icon: Eye,
                description: "Track project progress"
            },
            {
                path: "invoices",
                name: "Invoices",
                icon: DollarSign,
                description: "Billing and payments"
            },
            {
                path: "messages",
                name: "Messages",
                icon: MessageSquare,
                description: "Communicate with teams"
            },
            {
                path: "feedback",
                name: "Feedback",
                icon: Award,
                description: "Provide project feedback"
            }
        ],
        secondary: [
            {
                path: "profile",
                name: "Profile",
                icon: Settings,
                description: "Manage your profile"
            },
            {
                path: "companies",
                name: "Service Providers",
                icon: Building2,
                description: "Your service providers"
            }
        ]
    }
]

// Get navigation for a specific role
export function getNavigationForRole(role: Role): RoleNavigation | undefined {
    return roleNavigations.find(nav => nav.role === role)
}

// Check if user has access to a specific path based on role
export function hasAccessToPath(role: Role, path: string): boolean {
    const navigation = getNavigationForRole(role)
    if (!navigation) return false

    const allPaths = [
        ...navigation.primary.map(item => item.path),
        ...(navigation.secondary?.map(item => item.path) || [])
    ]

    return allPaths.includes(path)
}

// Get role-specific features and capabilities
export const roleFeatures = {
    [Role.COMPANY_OWNER]: {
        name: "Company Owner",
        color: "bg-purple-500",
        permissions: [
            "Create and manage teams",
            "Invite team heads and members",
            "View all company projects",
            "Access analytics and reports",
            "Manage company settings",
            "Handle client relationships"
        ]
    },
    [Role.TEAM_HEAD]: {
        name: "Team Head",
        color: "bg-blue-500",
        permissions: [
            "Lead assigned teams",
            "Create team projects",
            "Invite team members",
            "Assign tasks to team",
            "View team analytics",
            "Manage team settings"
        ]
    },
    [Role.TEAM_MEMBER]: {
        name: "Team Member",
        color: "bg-green-500",
        permissions: [
            "Work on assigned projects",
            "Complete assigned tasks",
            "View team information",
            "Track personal progress",
            "Collaborate with team",
            "Submit timesheets"
        ]
    },
    [Role.CLIENT]: {
        name: "Client",
        color: "bg-orange-500",
        permissions: [
            "View project progress",
            "Provide feedback",
            "Communicate with teams",
            "Access project deliverables",
            "Manage billing information",
            "Rate service quality"
        ]
    },
    [Role.ADMIN]: {
        name: "Admin",
        color: "bg-red-500",
        permissions: [
            "Full system access",
            "Manage all companies",
            "Manage all users",
            "System configuration",
            "View all data",
            "Platform administration"
        ]
    }
}

// Navigation helpers
export function getRoleDisplayName(role: Role): string {
    return roleFeatures[role]?.name || role
}

export function getRoleColor(role: Role): string {
    return roleFeatures[role]?.color || "bg-gray-500"
}

export function getRolePermissions(role: Role): string[] {
    return roleFeatures[role]?.permissions || []
}