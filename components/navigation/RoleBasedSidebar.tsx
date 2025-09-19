"use client"

import React, { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import Image from "next/image"
import { 
    LogOut, Sun, Moon, User, Bell, ChevronDown, ChevronUp,
    ShieldCheck, HelpCircle, Settings as SettingsIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger 
} from "@/components/ui/tooltip"
import { 
    getNavigationForRole, getRoleDisplayName, getRoleColor,
    NavigationItem 
} from "@/lib/navigation"
import { Role } from "@prisma/client"
import { toast } from "sonner"

interface RoleBasedSidebarProps {
    collapsed?: boolean
}

export default function RoleBasedSidebar({ collapsed = false }: RoleBasedSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()
    const { theme, setTheme } = useTheme()
    
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["primary"]))
    const [showSecondary, setShowSecondary] = useState(false)

    // Get navigation for current user role
    const userRole = session?.user?.role as Role
    const navigation = userRole ? getNavigationForRole(userRole) : null
    
    const isActiveRoute = (path: string): boolean => {
        if (path === 'dashboard') {
            return pathname === '/dashboard' || pathname === '/'
        }
        return pathname.includes(path)
    }

    const handleNavigation = (path: string) => {
        router.push(`/${path}`)
    }

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: '/' })
            toast.success("Signed out successfully")
        } catch (error) {
            toast.error("Failed to sign out")
        }
    }

    const toggleSection = (section: string) => {
        const newExpanded = new Set(expandedSections)
        if (newExpanded.has(section)) {
            newExpanded.delete(section)
        } else {
            newExpanded.add(section)
        }
        setExpandedSections(newExpanded)
    }

    if (!session?.user || !navigation) {
        return null
    }

    return (
        <TooltipProvider>
            <div className={cn(
                "fixed top-0 left-0 h-full bg-background border-r border-border z-50 flex flex-col transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}>
                {/* Logo Section */}
                <div className="flex items-center p-4 h-16 border-b border-border">
                    <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <div className="relative h-8 w-8 flex-shrink-0">
                            <Image
                                src="/projectcentral.png"
                                alt="Project Central"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        {!collapsed && (
                            <div>
                                <h1 className="text-lg font-bold">ProjectCentral</h1>
                            </div>
                        )}
                    </Link>
                </div>

                {/* User Role Badge */}
                {!collapsed && (
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                getRoleColor(userRole)
                            )} />
                            <div className="flex-1">
                                <p className="text-sm font-medium">{getRoleDisplayName(userRole)}</p>
                                <p className="text-xs text-muted-foreground">
                                    {session.user.name}
                                </p>
                            </div>
                            <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4">
                    {/* Primary Navigation */}
                    <NavigationSection
                        title="Main"
                        items={navigation.primary}
                        collapsed={collapsed}
                        isActiveRoute={isActiveRoute}
                        onNavigate={handleNavigation}
                        expanded={expandedSections.has("primary")}
                        onToggle={() => toggleSection("primary")}
                    />

                    {/* Secondary Navigation */}
                    {navigation.secondary && navigation.secondary.length > 0 && (
                        <>
                            <Separator className="my-4 mx-4" />
                            <NavigationSection
                                title="Settings"
                                items={navigation.secondary}
                                collapsed={collapsed}
                                isActiveRoute={isActiveRoute}
                                onNavigate={handleNavigation}
                                expanded={showSecondary}
                                onToggle={() => setShowSecondary(!showSecondary)}
                                defaultCollapsed={true}
                            />
                        </>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="border-t border-border p-4 space-y-2">
                    {/* Theme Toggle */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size={collapsed ? "icon" : "sm"}
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className={cn("w-full", collapsed ? "justify-center" : "justify-start")}
                            >
                                {theme === 'dark' ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}
                                {!collapsed && (
                                    <span className="ml-2">
                                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                    </span>
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                        </TooltipContent>
                    </Tooltip>

                    {/* Help */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size={collapsed ? "icon" : "sm"}
                                onClick={() => router.push('/help')}
                                className={cn("w-full", collapsed ? "justify-center" : "justify-start")}
                            >
                                <HelpCircle className="h-4 w-4" />
                                {!collapsed && <span className="ml-2">Help & Support</span>}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            Help & Support
                        </TooltipContent>
                    </Tooltip>

                    {/* Profile & Sign Out */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size={collapsed ? "icon" : "sm"}
                                className={cn(
                                    "w-full", 
                                    collapsed ? "justify-center" : "justify-start",
                                    "hover:bg-muted"
                                )}
                            >
                                {session.user.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt="Profile"
                                        width={16}
                                        height={16}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <User className="h-4 w-4" />
                                )}
                                {!collapsed && (
                                    <>
                                        <span className="ml-2 flex-1 text-left truncate">
                                            {session.user.name}
                                        </span>
                                        <ChevronUp className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="right" className="w-64">
                            <DropdownMenuLabel className="p-4">
                                <div className="flex items-center gap-3">
                                    {session.user.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt="Profile"
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                            <User className="h-5 w-5" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">
                                            {session.user.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                        <Badge variant="outline" className="text-xs mt-1">
                                            {getRoleDisplayName(userRole)}
                                        </Badge>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                                onClick={() => router.push('/profile')}
                                className="cursor-pointer"
                            >
                                <User className="w-4 h-4 mr-2" />
                                Profile Settings
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                                onClick={() => router.push('/notifications')}
                                className="cursor-pointer"
                            >
                                <Bell className="w-4 h-4 mr-2" />
                                Notifications
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                                onClick={handleSignOut}
                                className="cursor-pointer text-destructive focus:text-destructive"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </TooltipProvider>
    )
}

interface NavigationSectionProps {
    title: string
    items: NavigationItem[]
    collapsed: boolean
    isActiveRoute: (path: string) => boolean
    onNavigate: (path: string) => void
    expanded: boolean
    onToggle: () => void
    defaultCollapsed?: boolean
}

function NavigationSection({
    title,
    items,
    collapsed,
    isActiveRoute,
    onNavigate,
    expanded,
    onToggle,
    defaultCollapsed = false
}: NavigationSectionProps) {
    if (collapsed) {
        return (
            <div className="px-2 space-y-1">
                {items.map((item) => (
                    <NavigationItem
                        key={item.path}
                        item={item}
                        collapsed={true}
                        isActive={isActiveRoute(item.path)}
                        onClick={() => onNavigate(item.path)}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="px-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="w-full justify-between text-xs text-muted-foreground uppercase tracking-wide mb-2 hover:text-foreground"
            >
                <span className="font-semibold">{title}</span>
                {expanded ? (
                    <ChevronUp className="h-3 w-3" />
                ) : (
                    <ChevronDown className="h-3 w-3" />
                )}
            </Button>
            
            {expanded && (
                <div className="space-y-1">
                    {items.map((item) => (
                        <NavigationItem
                            key={item.path}
                            item={item}
                            collapsed={false}
                            isActive={isActiveRoute(item.path)}
                            onClick={() => onNavigate(item.path)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

interface NavigationItemProps {
    item: NavigationItem
    collapsed: boolean
    isActive: boolean
    onClick: () => void
}

function NavigationItem({ item, collapsed, isActive, onClick }: NavigationItemProps) {
    const Icon = item.icon

    if (collapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={isActive ? "default" : "ghost"}
                        size="icon"
                        onClick={onClick}
                        className="w-full h-10"
                    >
                        <Icon className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex flex-col gap-1">
                    <span className="font-medium">{item.name}</span>
                    {item.description && (
                        <span className="text-xs text-muted-foreground">
                            {item.description}
                        </span>
                    )}
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Button
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={onClick}
            className={cn(
                "w-full justify-start gap-3 h-10 px-3",
                isActive && "font-medium"
            )}
        >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-left truncate">{item.name}</span>
            {item.badge && (
                <Badge 
                    variant={item.badge.variant || "default"} 
                    className="text-xs px-1.5 py-0.5 h-5"
                >
                    {item.badge.text}
                </Badge>
            )}
        </Button>
    )
}