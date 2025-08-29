"use client"

import React from "react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, UserPlus, Users, Briefcase, BarChart3, Home, Building2, Bell, Sun, Moon, User } from "lucide-react"
import Link from "next/link"
import { TooltipProvider } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getRecentNotifications, markNotificationAsRead } from "@/actions/notifications.action"
import { Notification } from "@/types/notifications"
import { format } from "date-fns"

export interface Route {
    path: string
    name: string
    icon?: React.ReactNode
    status: string
}

const Sidebar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session, status } = useSession()
    const { theme, setTheme } = useTheme()
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    const isActiveRoute = (path: string) => {
        return pathname.includes(path)
    }

    const handleNavigation = (path: string) => {
        router.push(`/${path}`)
    }

    const handleLinkClick = (href: string) => {
        setProfileDropdownOpen(false)
        router.push(`/${href}`)
    }

    // Fetch notifications for developers and PMs
    useEffect(() => {
        if (session?.user && ["DEVELOPER", "PRODUCTMANAGER"].includes(session.user.role)) {
            fetchNotifications()
        }
    }, [session])

    const fetchNotifications = async () => {
        try {
            const result = await getRecentNotifications(5)
            if (result.success) {
                setNotifications(result.notifications || [])
                setUnreadCount(result.unreadCount || 0)
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error)
        }
    }

    const handleNotificationClick = async (notification: Notification) => {
        try {
            await markNotificationAsRead(notification.id)
            setUnreadCount(prev => Math.max(0, prev - 1))
            
            if (notification.actionUrl) {
                router.push(notification.actionUrl)
            }
            setNotificationsDropdownOpen(false)
        } catch (error) {
            console.error("Failed to mark notification as read:", error)
        }
    }

    const routes: Route[] = [
        {
            path: "dashboard",
            name: "Dashboard",
            icon: <Home className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "projects",
            name: "Projects",
            icon: <Briefcase className="h-5 w-5" />,
            status: "active"
        },
        // Show companies only for clients
        ...(session?.user?.role === 'CLIENT' ? [
            {
                path: "companies",
                name: "Companies",
                icon: <Building2 className="h-5 w-5" />,
                status: "active"
            }
        ] : []),
        {
            path: "associations",
            name: "Associations",
            icon: <UserPlus className="h-5 w-5" />,
            status: "active"
        },
        // Hide team and analytics from clients
        ...(session?.user?.role !== 'CLIENT' ? [
            {
                path: "team",
                name: "Team",
                icon: <Users className="h-5 w-5" />,
                status: "active"
            },
            {
                path: "analytics",
                name: "Analytics",
                icon: <BarChart3 className="h-5 w-5" />,
                status: "active"
            }
        ] : []),
    ];

    const displayRoutes = routes.filter((route) => route.status === "active")

    return (
        <TooltipProvider>
            <div className="fixed top-0 left-0 h-full w-[100px] bg-background dark:bg-background border-r border-border z-20 sm:block hidden">
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="flex items-center justify-center p-4 h-[80px]">
                        <Link href={session ? "/dashboard" : "/"} className="transition-opacity hover:opacity-80">
                            <div className="relative h-[40px] w-[40px]">
                                <Image
                                    src="/projectcentral.png"
                                    alt="Project Central"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Routes */}
                    <div className="flex-grow overflow-y-auto py-4">
                        <div className="flex flex-col items-center space-y-4">
                            <SidebarLinks routes={displayRoutes} isActiveRoute={isActiveRoute} />
                        </div>
                    </div>
                    
                    {/* Bottom Section - Notifications, Theme, Profile, Logout */}
                    <div className="px-2 mb-4 mt-auto space-y-2">
                        {/* Notifications - Only for Developers and PMs */}
                        {session?.user && ["DEVELOPER", "PRODUCTMANAGER"].includes(session.user.role) && (
                            <DropdownMenu open={notificationsDropdownOpen} onOpenChange={setNotificationsDropdownOpen}>
                                <DropdownMenuTrigger asChild>
                                    <button className="relative flex items-center justify-center w-full rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:bg-muted group">
                                        <Bell className="h-5 w-5 stroke-2" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                                                {unreadCount > 9 ? "9+" : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-80 ml-4" align="start" side="right">
                                    <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-4 text-center text-muted-foreground">
                                                No notifications
                                            </div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <DropdownMenuItem
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className={cn(
                                                        "cursor-pointer p-3 focus:bg-muted",
                                                        !notification.read && "bg-primary/5 border-l-2 border-l-primary"
                                                    )}
                                                >
                                                    <div className="flex flex-col gap-1 w-full">
                                                        <p className="font-medium text-sm">{notification.title}</p>
                                                        {notification.description && (
                                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                                {notification.description}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">
                                                            {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                                                        </p>
                                                    </div>
                                                </DropdownMenuItem>
                                            ))
                                        )}
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleLinkClick('notifications')} className="cursor-pointer text-center">
                                        <span className="w-full text-center">View All Notifications</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Theme Switcher */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="flex items-center justify-center w-full rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:bg-muted group"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 stroke-2" />
                            ) : (
                                <Moon className="h-5 w-5 stroke-2" />
                            )}
                        </button>

                        {/* Profile Dropdown */}
                        {status === "authenticated" && session ? (
                            <DropdownMenu open={profileDropdownOpen} onOpenChange={setProfileDropdownOpen}>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center justify-center w-full rounded-lg p-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:bg-muted group">
                                        {session?.user?.image ? (
                                            <Image
                                                className="h-6 w-6 rounded-full"
                                                src={session.user.image}
                                                alt={`Profile picture of ${session.user.name || 'user'}`}
                                                width={24}
                                                height={24}
                                            />
                                        ) : (
                                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                                                <span className="text-foreground text-xs font-semibold">
                                                    {session?.user?.name?.[0] || 'U'}
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 ml-4" align="start" side="right">
                                    <DropdownMenuLabel className="p-4">
                                        <div className="flex items-center gap-3">
                                            {session?.user?.image ? (
                                                <Image
                                                    className="h-12 w-12 rounded-full"
                                                    src={session.user.image}
                                                    alt={`Profile picture of ${session.user.name || 'user'}`}
                                                    width={48}
                                                    height={48}
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                                    <span className="text-foreground text-lg font-semibold">
                                                        {session?.user?.name?.[0] || 'U'}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm text-foreground">
                                                    {session?.user?.name || 'User'}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {session?.user?.email || 'user@example.com'}
                                                </p>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem onClick={() => handleLinkClick('profile')} className="cursor-pointer">
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <User className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="font-medium">Profile</span>
                                        </div>
                                    </DropdownMenuItem>

                                    {/* Role Settings for Product Managers */}
                                    {session.user.role === "PRODUCTMANAGER" && (
                                        <DropdownMenuItem onClick={() => handleLinkClick('role-settings')} className="cursor-pointer">
                                            <div className="flex items-center gap-3 w-full">
                                                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                                    <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <span className="font-medium">Role Settings</span>
                                            </div>
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem 
                                        onClick={async () => {
                                            await signOut()
                                            setProfileDropdownOpen(false)
                                            toast.success("Logged out successfully")
                                        }} 
                                        className="cursor-pointer text-destructive focus:text-destructive"
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                                                <LogOut className="w-4 h-4 text-destructive" />
                                            </div>
                                            <span className="font-medium">Sign Out</span>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            /* Sign In Button (shown only when not authenticated) */
                            <button
                                onClick={() => router.push('/signin')}
                                className="flex items-center justify-center w-full rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:bg-muted group"
                                title="Sign In"
                            >
                                <User className="h-5 w-5 stroke-2" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Mobile Bottom Navigation */}
            <div className="mt-6 sm:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-20">
                <div className="flex justify-around items-center py-2 px-2">
                    {/* Navigation Routes */}
                    {displayRoutes.slice(0, 3).map((route) => {
                        const isActive = isActiveRoute(route.path)
                        return (
                            <button
                                key={route.path}
                                onClick={() => handleNavigation(route.path)}
                                className={cn(
                                    "flex flex-col items-center gap-1 text-xs py-2 px-3 rounded-lg transition-all focus:outline-none",
                                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                                )}
                            >
                                {route.icon}
                                <span className="text-[10px]">{route.name}</span>
                            </button>
                        )
                    })}
                    
                    {/* Theme Switcher */}
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="flex flex-col items-center gap-1 text-xs py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground transition-all focus:outline-none"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                        <span className="text-[10px]">Theme</span>
                    </button>

                    {/* Profile/Auth */}
                    {status === "authenticated" && session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex flex-col items-center gap-1 text-xs py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground transition-all focus:outline-none">
                                    {session?.user?.image ? (
                                        <Image
                                            className="h-5 w-5 rounded-full"
                                            src={session.user.image}
                                            alt={`Profile picture of ${session.user.name || 'user'}`}
                                            width={20}
                                            height={20}
                                        />
                                    ) : (
                                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                                            <span className="text-foreground text-[10px] font-semibold">
                                                {session?.user?.name?.[0] || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-[10px]">Profile</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 mb-2" align="center" side="top">
                                <DropdownMenuLabel className="p-4">
                                    <div className="flex items-center gap-3">
                                        {session?.user?.image ? (
                                            <Image
                                                className="h-10 w-10 rounded-full"
                                                src={session.user.image}
                                                alt={`Profile picture of ${session.user.name || 'user'}`}
                                                width={40}
                                                height={40}
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                <span className="text-foreground text-sm font-semibold">
                                                    {session?.user?.name?.[0] || 'U'}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-sm text-foreground">
                                                {session?.user?.name || 'User'}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                {session?.user?.email || 'user@example.com'}
                                            </p>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={() => handleLinkClick('profile')} className="cursor-pointer">
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-medium">Profile</span>
                                    </div>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem 
                                    onClick={async () => {
                                        await signOut()
                                        toast.success("Logged out successfully")
                                    }} 
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                                            <LogOut className="w-4 h-4 text-destructive" />
                                        </div>
                                        <span className="font-medium">Sign Out</span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <button
                            onClick={() => router.push('/signin')}
                            className="flex flex-col items-center gap-1 text-xs py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground transition-all focus:outline-none"
                        >
                            <User className="h-5 w-5" />
                            <span className="text-[10px]">Login</span>
                        </button>
                    )}
                </div>
            </div>
        </TooltipProvider>
    )
}

interface SidebarLinksProps {
    routes: Route[]
    isActiveRoute: (path: string) => boolean
}

const SidebarLinks = ({ routes, isActiveRoute }: SidebarLinksProps) => {
    const router = useRouter()

    const handleNavigation = (path: string) => {
        router.push(`/${path}`)
    }

    return (
        <div className="space-y-4">
            {routes.map((route, index) => {
                const isActive = isActiveRoute(route.path)

                return (
                    <button key={index} onClick={() => handleNavigation(route.path)} className="block w-full">
                        <div
                            className={cn(
                                "flex flex-col items-center justify-center rounded-lg p-2 text-sm font-medium transition-all cursor-pointer group",
                                isActive 
                                    ? "bg-primary text-primary-foreground" 
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className="h-5 w-5 stroke-2">{route.icon}</div>
                            <h1 className="text-xs mt-1">{route.name}</h1>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}

export default Sidebar; 