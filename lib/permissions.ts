import { Role, Permission, User, Team, TeamMember } from "@prisma/client"
import { prisma } from "@/lib/prisma"

// Extended user type with team relationships
export interface UserWithTeams extends User {
    ownedCompany?: { id: string; name: string } | null
    company?: { id: string; name: string } | null
    ledTeams?: Team[]
    teamMemberships?: (TeamMember & {
        team: Team
    })[]
}

// Permission definitions for each role
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [Role.COMPANY_OWNER]: [
        // Full permissions for company owners
        Permission.VIEW_ALL_PROJECTS,
        Permission.CREATE_PROJECTS,
        Permission.EDIT_PROJECTS,
        Permission.DELETE_PROJECTS,
        Permission.CREATE_TASKS,
        Permission.EDIT_TASKS,
        Permission.DELETE_TASKS,
        Permission.ASSIGN_TASKS,
        Permission.INVITE_TEAM_MEMBERS,
        Permission.REMOVE_TEAM_MEMBERS,
        Permission.MANAGE_TEAM_SETTINGS,
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_FINANCIAL_DATA,
        Permission.GENERATE_REPORTS,
        Permission.MANAGE_CLIENTS,
        Permission.VIEW_CLIENT_DATA,
        Permission.MANAGE_COMPANY_SETTINGS,
        Permission.MANAGE_ROLES,
        Permission.MANAGE_PERMISSIONS,
    ],
    [Role.TEAM_HEAD]: [
        // Team heads can manage projects and their teams
        Permission.VIEW_ALL_PROJECTS,
        Permission.CREATE_PROJECTS,
        Permission.EDIT_PROJECTS,
        Permission.CREATE_TASKS,
        Permission.EDIT_TASKS,
        Permission.ASSIGN_TASKS,
        Permission.INVITE_TEAM_MEMBERS,
        Permission.REMOVE_TEAM_MEMBERS,
        Permission.MANAGE_TEAM_SETTINGS,
        Permission.VIEW_ANALYTICS,
        Permission.GENERATE_REPORTS,
        Permission.MANAGE_CLIENTS,
        Permission.VIEW_CLIENT_DATA,
    ],
    [Role.TEAM_MEMBER]: [
        // Team members have limited permissions
        Permission.VIEW_TEAM_PROJECTS,
        Permission.CREATE_TASKS,
        Permission.EDIT_TASKS,
        Permission.VIEW_ANALYTICS,
    ],
    [Role.CLIENT]: [
        // Clients can only view their projects
        Permission.VIEW_CLIENT_DATA,
    ],
    [Role.ADMIN]: [
        // Super admin has all permissions
        ...Object.values(Permission)
    ]
}

// Check if user has a specific permission
export async function userHasPermission(
    user: UserWithTeams | string,
    permission: Permission,
    context?: {
        projectId?: string
        teamId?: string
        companyId?: string
    }
): Promise<boolean> {
    try {
        let userData: UserWithTeams

        if (typeof user === 'string') {
            const fetchedUser = await prisma.user.findUnique({
                where: { id: user },
                include: {
                    ownedCompany: { select: { id: true, name: true } },
                    company: { select: { id: true, name: true } },
                    ledTeams: true,
                    teamMemberships: {
                        include: { team: true },
                        where: { isActive: true }
                    }
                }
            })

            if (!fetchedUser) return false
            userData = fetchedUser
        } else {
            userData = user
        }

        // Check role-based permissions
        const rolePermissions = ROLE_PERMISSIONS[userData.role] || []
        if (!rolePermissions.includes(permission)) {
            return false
        }

        // Additional context-based checks
        if (context) {
            return await checkContextualPermissions(userData, permission, context)
        }

        return true
    } catch (error) {
        console.error('Error checking user permission:', error)
        return false
    }
}

// Check contextual permissions (project-specific, team-specific, etc.)
async function checkContextualPermissions(
    user: UserWithTeams,
    permission: Permission,
    context: {
        projectId?: string
        teamId?: string
        companyId?: string
    }
): Promise<boolean> {
    // Company owners and admins have full access
    if (user.role === Role.COMPANY_OWNER || user.role === Role.ADMIN) {
        return true
    }

    // Project-specific permissions
    if (context.projectId) {
        const project = await prisma.project.findUnique({
            where: { id: context.projectId },
            include: {
                assignedTeams: { include: { team: true } },
                projectInvites: { where: { userId: user.id } }
            }
        })

        if (!project) return false

        // Check if user has access to the project
        const hasProjectAccess = 
            // User created the project
            project.userId === user.id ||
            // Project is public and user is in the company
            (project.visibility === 'PUBLIC' && 
             (project.companyId === user.companyId || project.companyId === user.ownedCompany?.id)) ||
            // User is explicitly invited to private project
            (project.visibility === 'PRIVATE' && project.projectInvites.length > 0) ||
            // User's team is assigned to the project
            project.assignedTeams.some(pt => 
                user.teamMemberships?.some(tm => tm.teamId === pt.teamId)
            )

        if (!hasProjectAccess) return false
    }

    // Team-specific permissions
    if (context.teamId) {
        // Team heads can manage their own teams
        if (user.role === Role.TEAM_HEAD) {
            const isTeamHead = user.ledTeams?.some(team => team.id === context.teamId)
            if (!isTeamHead) return false
        }
        
        // Team members can only access their own team
        if (user.role === Role.TEAM_MEMBER) {
            const isTeamMember = user.teamMemberships?.some(tm => tm.teamId === context.teamId)
            if (!isTeamMember) return false
        }
    }

    return true
}

// Check if user can view a project
export async function canViewProject(userId: string, projectId: string): Promise<boolean> {
    return await userHasPermission(userId, Permission.VIEW_ALL_PROJECTS, { projectId }) ||
           await userHasPermission(userId, Permission.VIEW_TEAM_PROJECTS, { projectId })
}

// Check if user can edit a project
export async function canEditProject(userId: string, projectId: string): Promise<boolean> {
    return await userHasPermission(userId, Permission.EDIT_PROJECTS, { projectId })
}

// Check if user can create projects
export async function canCreateProject(userId: string): Promise<boolean> {
    return await userHasPermission(userId, Permission.CREATE_PROJECTS)
}

// Check if user can manage team
export async function canManageTeam(userId: string, teamId: string): Promise<boolean> {
    return await userHasPermission(userId, Permission.MANAGE_TEAM_SETTINGS, { teamId })
}

// Check if user can assign tasks
export async function canAssignTasks(userId: string, projectId?: string): Promise<boolean> {
    return await userHasPermission(userId, Permission.ASSIGN_TASKS, { projectId })
}

// Check if user can view analytics
export async function canViewAnalytics(userId: string): Promise<boolean> {
    return await userHasPermission(userId, Permission.VIEW_ANALYTICS)
}

// Get user's accessible projects
export async function getUserAccessibleProjects(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            ownedCompany: true,
            company: true,
            teamMemberships: {
                include: { team: true },
                where: { isActive: true }
            }
        }
    })

    if (!user) return []

    const companyId = user.ownedCompany?.id || user.company?.id

    if (user.role === Role.COMPANY_OWNER || user.role === Role.ADMIN) {
        // Company owners see all company projects
        return await prisma.project.findMany({
            where: { companyId },
            include: {
                assignedTeams: { include: { team: true } },
                user: { select: { name: true, image: true } }
            }
        })
    }

    if (user.role === Role.TEAM_HEAD) {
        // Team heads see all company projects (as per our requirement)
        return await prisma.project.findMany({
            where: { companyId },
            include: {
                assignedTeams: { include: { team: true } },
                user: { select: { name: true, image: true } }
            }
        })
    }

    if (user.role === Role.TEAM_MEMBER) {
        const userTeamIds = user.teamMemberships.map(tm => tm.teamId)
        
        return await prisma.project.findMany({
            where: {
                OR: [
                    // Public projects in the company
                    {
                        companyId,
                        visibility: 'PUBLIC'
                    },
                    // Projects assigned to user's teams
                    {
                        assignedTeams: {
                            some: {
                                teamId: { in: userTeamIds }
                            }
                        }
                    },
                    // Private projects user is explicitly invited to
                    {
                        projectInvites: {
                            some: { userId }
                        }
                    }
                ]
            },
            include: {
                assignedTeams: { include: { team: true } },
                user: { select: { name: true, image: true } }
            }
        })
    }

    if (user.role === Role.CLIENT) {
        // Clients see only their own projects
        return await prisma.project.findMany({
            where: {
                OR: [
                    { userId }, // Projects they created
                    { 
                        members: { 
                            some: { userId } 
                        } 
                    } // Projects they're added to
                ]
            },
            include: {
                assignedTeams: { include: { team: true } },
                user: { select: { name: true, image: true } }
            }
        })
    }

    return []
}

// Get user's teams
export async function getUserTeams(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            ownedCompany: { include: { teams: true } },
            company: { include: { teams: true } },
            ledTeams: true,
            teamMemberships: {
                include: { team: true },
                where: { isActive: true }
            }
        }
    })

    if (!user) return []

    if (user.role === Role.COMPANY_OWNER) {
        return user.ownedCompany?.teams || []
    }

    if (user.role === Role.TEAM_HEAD) {
        return user.ledTeams || []
    }

    if (user.role === Role.TEAM_MEMBER) {
        return user.teamMemberships.map(tm => tm.team)
    }

    return []
}

// Middleware helper to check permissions
export function createPermissionChecker(permission: Permission) {
    return async (userId: string, context?: { projectId?: string; teamId?: string }) => {
        return await userHasPermission(userId, permission, context)
    }
}

// Role hierarchy check
export function isHigherRole(role1: Role, role2: Role): boolean {
    const hierarchy = {
        [Role.ADMIN]: 5,
        [Role.COMPANY_OWNER]: 4,
        [Role.TEAM_HEAD]: 3,
        [Role.TEAM_MEMBER]: 2,
        [Role.CLIENT]: 1
    }
    
    return (hierarchy[role1] || 0) > (hierarchy[role2] || 0)
}

// Get user's effective permissions
export async function getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!user) return []

    return ROLE_PERMISSIONS[user.role] || []
}