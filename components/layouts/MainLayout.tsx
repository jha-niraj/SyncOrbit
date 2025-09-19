"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import RoleBasedSidebar from '@/components/navigation/RoleBasedSidebar'
import LoadingScreen from '@/components/loading-screen'
import { cn } from '@/lib/utils'
import { hasAccessToPath } from '@/lib/navigation'
import { Role } from '@prisma/client'

interface MainLayoutProps {
    children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // Check screen size and handle responsive behavior
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            
            // Auto-collapse sidebar on smaller screens
            if (mobile) {
                setSidebarCollapsed(true)
                setMobileMenuOpen(false)
            }
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    // Handle loading state
    if (status === 'loading') {
        return <LoadingScreen routeName="dashboard" />
    }

    // Redirect if not authenticated
    if (!session?.user) {
        router.push('/signin')
        return null
    }

    // Check if user has access to current path
    const currentPath = pathname.split('/')[1] || 'dashboard'
    const userRole = session.user.role as Role
    const hasAccess = hasAccessToPath(userRole, currentPath)
    
    if (!hasAccess && currentPath !== 'dashboard') {
        // Redirect to dashboard if user doesn't have access to current path
        router.push('/dashboard')
        return null
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Desktop Sidebar */}
            {!isMobile && (
                <RoleBasedSidebar collapsed={sidebarCollapsed} />
            )}

            {/* Mobile Sidebar Overlay */}
            {isMobile && mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    
                    {/* Mobile Sidebar */}
                    <div className="fixed left-0 top-0 h-full w-64 z-50 md:hidden">
                        <RoleBasedSidebar collapsed={false} />
                    </div>
                </>
            )}

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                !isMobile && (sidebarCollapsed ? "ml-16" : "ml-64")
            )}>
                {/* Top Bar */}
                <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        {isMobile ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </Button>
                        ) : (
                            /* Desktop Sidebar Toggle */
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        )}

                        {/* Page Title */}
                        <PageTitle pathname={pathname} />
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                        <RoleBasedQuickActions userRole={userRole} />
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="min-h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

interface PageTitleProps {
    pathname: string
}

function PageTitle({ pathname }: PageTitleProps) {
    const getPageTitle = (path: string): string => {
        const segments = path.split('/').filter(Boolean)
        const currentPage = segments[0] || 'dashboard'
        
        const titleMap: Record<string, string> = {
            'dashboard': 'Dashboard',
            'projects': 'Projects', 
            'company-projects': 'All Projects',
            'team-projects': 'Team Projects',
            'teams': 'Teams',
            'tasks': 'Tasks',
            'analytics': 'Analytics',
            'clients': 'Clients',
            'settings': 'Settings',
            'profile': 'Profile',
            'notifications': 'Notifications',
            'invitations': 'Invitations',
            'schedule': 'Schedule',
            'progress': 'Progress',
            'invoices': 'Invoices',
            'messages': 'Messages',
            'feedback': 'Feedback',
            'timesheets': 'Timesheets',
            'reports': 'Reports',
            'companies': 'Service Providers'
        }
        
        return titleMap[currentPage] || currentPage.charAt(0).toUpperCase() + currentPage.slice(1)
    }

    return (
        <h1 className="text-lg font-semibold text-foreground">
            {getPageTitle(pathname)}
        </h1>
    )
}

interface RoleBasedQuickActionsProps {
    userRole: Role
}

function RoleBasedQuickActions({ userRole }: RoleBasedQuickActionsProps) {
    const router = useRouter()

    const quickActions = {
        [Role.COMPANY_OWNER]: [
            { label: 'New Project', action: () => router.push('/projects?modal=create') },
            { label: 'Invite Team', action: () => router.push('/teams?modal=invite') },
        ],
        [Role.TEAM_HEAD]: [
            { label: 'New Project', action: () => router.push('/projects?modal=create') },
            { label: 'Invite Member', action: () => router.push('/teams?modal=invite-member') },
        ],
        [Role.TEAM_MEMBER]: [
            { label: 'My Tasks', action: () => router.push('/tasks') },
        ],
        [Role.CLIENT]: [
            { label: 'Give Feedback', action: () => router.push('/feedback?modal=create') },
        ],
        [Role.ADMIN]: [
            { label: 'Manage System', action: () => router.push('/admin') },
            { label: 'View Reports', action: () => router.push('/reports') },
        ]
    }

    const actions = quickActions[userRole] || []

    if (actions.length === 0) return null

    return (
        <div className="hidden md:flex items-center gap-2">
            {actions.map((action, index) => (
                <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={action.action}
                    className="text-xs"
                >
                    {action.label}
                </Button>
            ))}
        </div>
    )
}