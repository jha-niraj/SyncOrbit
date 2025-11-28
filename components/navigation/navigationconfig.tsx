import React from "react";
import { 
    Home, Users, Briefcase, BarChart3, Calendar, MessageSquare, 
    UserPlus, Settings, Building2, FileText, DollarSign 
} from "lucide-react";
import { UserRole, SidebarMode } from "./sidebarcontext";

export interface NavItem {
    to: string;
    label: string;
    icon: React.ReactNode;
    status?: 'active' | 'coming_soon';
    roles?: UserRole[];  // Empty array means all roles can access
    modes?: SidebarMode[];  // Empty array means available in both modes
    badge?: string | number;
}

export interface NavigationConfig {
    internal: NavItem[];
    external: NavItem[];
    common: NavItem[];
}

/**
 * Navigation configuration for the sidebar
 * Items are organized by mode (internal/external) and common items
 */
export const navigationConfig: NavigationConfig = {
    // Internal mode items - for team operations and internal work
    internal: [
        {
            to: "/dashboard",
            label: "Dashboard",
            icon: <Home className="h-5 w-5" />,
            status: "active",
            roles: ['COMPANY_OWNER', 'TEAM_HEAD', 'TEAM_MEMBER'],
            modes: ['internal']
        },
        {
            to: "/team",
            label: "Team",
            icon: <Users className="h-5 w-5" />,
            status: "active",
            roles: ['COMPANY_OWNER', 'TEAM_HEAD', 'TEAM_MEMBER'],
            modes: ['internal']
        },
        {
            to: "/analytics",
            label: "Analytics",
            icon: <BarChart3 className="h-5 w-5" />,
            status: "active",
            roles: ['COMPANY_OWNER', 'TEAM_HEAD', 'ADMIN'],  // TEAM_MEMBER excluded
            modes: ['internal']
        },
        {
            to: "/calendar",
            label: "Calendar",
            icon: <Calendar className="h-5 w-5" />,
            status: "active",
            roles: ['COMPANY_OWNER', 'TEAM_HEAD', 'TEAM_MEMBER', 'ADMIN'],
            modes: ['internal']
        },
        {
            to: "/communications",
            label: "Communications",
            icon: <MessageSquare className="h-5 w-5" />,
            status: "active",
            roles: ['COMPANY_OWNER', 'TEAM_HEAD', 'TEAM_MEMBER', 'ADMIN'],
            modes: ['internal']
        }
    ],
    
    // External mode items - for client-facing work
    external: [
        {
            to: "/client-dashboard",
            label: "Dashboard",
            icon: <Home className="h-5 w-5" />,
            status: "active",
            roles: ['COMPANY_OWNER', 'TEAM_HEAD', 'CLIENT'],
            modes: ['external']
        },
        {
            to: "/companies",
            label: "Companies",
            icon: <Building2 className="h-5 w-5" />,
            status: "active",
            roles: ['CLIENT'],  // Only clients see this
            modes: ['external']
        },
        {
            to: "/client-analytics",
            label: "Analytics",
            icon: <BarChart3 className="h-5 w-5" />,
            status: "active",
            roles: ['COMPANY_OWNER', 'TEAM_HEAD'],
            modes: ['external']
        },
        {
            to: "/invoices",
            label: "Invoices",
            icon: <DollarSign className="h-5 w-5" />,
            status: "active",
            roles: ['COMPANY_OWNER', 'TEAM_HEAD', 'CLIENT'],
            modes: ['external']
        },
        {
            to: "/reports",
            label: "Reports",
            icon: <FileText className="h-5 w-5" />,
            status: "active",
            roles: ['COMPANY_OWNER', 'TEAM_HEAD', 'CLIENT'],
            modes: ['external']
        }
    ],
    
    // Common items - available in both modes
    common: [
        {
            to: "/projects",
            label: "Projects",
            icon: <Briefcase className="h-5 w-5" />,
            status: "active",
            roles: [],  // All roles
            modes: []   // Both modes
        },
        {
            to: "/invitations",
            label: "Invitations",
            icon: <UserPlus className="h-5 w-5" />,
            status: "active",
            roles: ['COMPANY_OWNER', 'TEAM_HEAD'],  // Only owners and heads
            modes: []   // Both modes
        },
        {
            to: "/settings",
            label: "Settings",
            icon: <Settings className="h-5 w-5" />,
            status: "active",
            roles: [],  // All roles
            modes: []   // Both modes
        }
    ]
};

/**
 * Get navigation items filtered by user role and current mode
 */
export function getNavigationItems(
    userRole: UserRole | undefined,
    currentMode: SidebarMode
): NavItem[] {
    // Default to CLIENT role if no role provided
    const role = userRole || 'CLIENT';
    
    // Determine which items to include based on mode
    let items: NavItem[] = [];
    
    if (currentMode === 'internal') {
        items = [...navigationConfig.internal, ...navigationConfig.common];
    } else {
        items = [...navigationConfig.external, ...navigationConfig.common];
    }
    
    // Filter by role and mode
    return items.filter(item => {
        // Check role access
        const hasRoleAccess = !item.roles || item.roles.length === 0 || item.roles.includes(role);
        
        // Check mode access
        const hasModeAccess = !item.modes || item.modes.length === 0 || item.modes.includes(currentMode);
        
        // Check status
        const isActive = !item.status || item.status === 'active';
        
        return hasRoleAccess && hasModeAccess && isActive;
    });
}

/**
 * Check if a navigation item should be displayed for a given role and mode
 */
export function shouldDisplayNavItem(
    item: NavItem,
    userRole: UserRole | undefined,
    currentMode: SidebarMode
): boolean {
    const role = userRole || 'CLIENT';
    
    // Check role access
    const hasRoleAccess = !item.roles || item.roles.length === 0 || item.roles.includes(role);
    
    // Check mode access
    const hasModeAccess = !item.modes || item.modes.length === 0 || item.modes.includes(currentMode);
    
    // Check status
    const isActive = !item.status || item.status === 'active';
    
    return hasRoleAccess && hasModeAccess && isActive;
}
