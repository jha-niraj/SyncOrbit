import { Role } from "@prisma/client"
import {
    Home, Briefcase, Users, Building2, BarChart3, Settings, UserPlus, Crown, Calendar,
    MessageSquare, FileText, Layers, Target, TrendingUp, DollarSign, Eye,
    Award, Wrench, Receipt, FolderOpen, ClipboardList, CheckSquare, Clock
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
    // Company Owner Navigation - Single unified view
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
                        name: "Internal Metrics",
                        icon: Home,
                        description: "Internal operations overview"
                    },
                    {
                        path: "dashboard/external",
                        name: "Client Overview",
                        icon: Building2,
                        description: "Client projects overview"
                    }
                ]
            },
            {
                path: "projects",
                name: "Projects",
                icon: Briefcase,
                description: "Manage all projects",
                children: [
                    {
                        path: "projects",
                        name: "All Projects",
                        icon: Layers,
                        description: "View all projects"
                    },
                    {
                        path: "projects/internal",
                        name: "Internal Projects",
                        icon: Briefcase,
                        description: "Company internal projects"
                    },
                    {
                        path: "projects/client",
                        name: "Client Projects",
                        icon: Building2,
                        description: "Client deliverables"
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
                path: "clients",
                name: "Clients",
                icon: Building2,
                description: "Client management and relationships"
            },
            {
                path: "tasks",
                name: "Task Board",
                icon: CheckSquare,
                description: "Company-wide task management"
            },
            {
                path: "schedule",
                name: "Schedule",
                icon: Calendar,
                description: "Calendar and milestones"
            },
            {
                path: "analytics",
                name: "Analytics",
                icon: BarChart3,
                description: "Business insights and reports",
                children: [
                    {
                        path: "analytics/internal",
                        name: "Internal Analytics",
                        icon: TrendingUp,
                        description: "Internal productivity metrics"
                    },
                    {
                        path: "analytics/clients",
                        name: "Client Analytics",
                        icon: Building2,
                        description: "Client project metrics"
                    }
                ]
            },
            {
                path: "tools",
                name: "Tools",
                icon: Wrench,
                description: "Company tools and utilities",
                children: [
                    {
                        path: "tools/reports",
                        name: "Reports",
                        icon: ClipboardList,
                        description: "Generate company reports"
                    },
                    {
                        path: "tools/invoices",
                        name: "Invoices",
                        icon: Receipt,
                        description: "Manage invoices and billing"
                    },
                    {
                        path: "tools/documents",
                        name: "Documents",
                        icon: FolderOpen,
                        description: "Company documents"
                    }
                ]
            },
            {
                path: "settings",
                name: "Settings",
                icon: Settings,
                description: "Company configuration"
            }
        ],
        secondary: [
            {
                path: "#referral",
                name: "Referral Program",
                icon: UserPlus,
                description: "Invite and earn",
                action: "referral"
            }
        ]
    },

    // Team Head Navigation - Single unified view
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
                        name: "Team Overview",
                        icon: Home,
                        description: "Internal team metrics"
                    },
                    {
                        path: "dashboard/external",
                        name: "Client Work",
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
                        description: "View all accessible projects"
                    },
                    {
                        path: "projects/my-projects",
                        name: "My Projects",
                        icon: Target,
                        description: "Projects I lead"
                    },
                    {
                        path: "projects/team-projects",
                        name: "Team Projects",
                        icon: Users,
                        description: "Projects assigned to my teams"
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
                icon: CheckSquare,
                description: "Manage team tasks and assignments"
            },
            {
                path: "schedule",
                name: "Schedule",
                icon: Calendar,
                description: "Team calendar and milestones"
            },
            {
                path: "analytics",
                name: "Analytics",
                icon: TrendingUp,
                description: "Performance metrics",
                children: [
                    {
                        path: "analytics/team",
                        name: "Team Performance",
                        icon: TrendingUp,
                        description: "Internal team analytics"
                    },
                    {
                        path: "analytics/clients",
                        name: "Client Analytics",
                        icon: Building2,
                        description: "Client project analytics"
                    }
                ]
            },
            {
                path: "tools",
                name: "Tools",
                icon: Wrench,
                description: "Team tools and utilities",
                children: [
                    {
                        path: "tools/reports",
                        name: "Team Reports",
                        icon: ClipboardList,
                        description: "Generate team reports"
                    },
                    {
                        path: "tools/documents",
                        name: "Documents",
                        icon: FolderOpen,
                        description: "Team documents"
                    }
                ]
            },
            {
                path: "settings",
                name: "Team Settings",
                icon: Settings,
                description: "Configure your teams"
            }
        ],
        secondary: [
            {
                path: "#referral",
                name: "Referral Program",
                icon: UserPlus,
                description: "Invite and earn",
                action: "referral"
            }
        ]
    },

    // Team Member Navigation - Single unified view
    {
        role: Role.TEAM_MEMBER,
        primary: [
            {
                path: "dashboard",
                name: "Dashboard",
                icon: Home,
                description: "Your work overview"
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
                icon: CheckSquare,
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
            },
            {
                path: "timesheets",
                name: "Timesheets",
                icon: Clock,
                description: "Log your work hours"
            }
        ],
        secondary: [
            {
                path: "#referral",
                name: "Referral Program",
                icon: UserPlus,
                description: "Invite and earn",
                action: "referral"
            }
        ]
    },

    // Client Navigation - External view only with Invitations
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
                path: "documents",
                name: "Documents",
                icon: FolderOpen,
                description: "Shared documents and files"
            },
            {
                path: "feedback",
                name: "Feedback",
                icon: Award,
                description: "Provide project feedback"
            },
            {
                path: "invitations",
                name: "Invitations",
                icon: UserPlus,
                description: "Project invitations"
            }
        ],
        secondary: [
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
            "Accept project invitations"
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