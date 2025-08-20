"use client"

import { useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Moon, Sun, Home, User, LogOut, Shield, LogIn, Users, Bell, Settings } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "./ui/dropdown-menu"
import {
    Popover, PopoverContent, PopoverTrigger
} from "./ui/popover"
import { motion } from "framer-motion"
import { signOut, useSession } from "next-auth/react"
import { toast } from "sonner"
import Link from "next/link"
import { Badge } from "./ui/badge"
import { cn } from "@/lib/utils"
import { getRecentNotifications, markNotificationAsRead } from "@/actions/notifications.action"
import { format } from "date-fns"
import { Notification } from "@/types/notifications"

const MainNavbar = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const { data: session } = useSession();
    const { theme, setTheme } = useTheme()
    const [scrolled, setScrolled] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, []);

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
            setNotificationsOpen(false)
        } catch (error) {
            console.error("Failed to mark notification as read:", error)
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, []);

    const getPageTitle = () => {
        const pathSegments = pathname.split("/").filter(Boolean)
        const currentPath = pathSegments[pathSegments.length - 1] || "dashboard"

        switch (currentPath) {
            case "dashboard":
                return "Dashboard"
            case "projects":
                return "Projects"
            case "team":
                return "Team"
            case "analytics":
                return "Analytics"
            case "feedback":
                return "Feedback"
            case "profile":
                return "Profile"
            case "settings":
                return "Settings"
            case "chat":
                return "Chat"
            default:
                return currentPath.charAt(0).toUpperCase() + currentPath.slice(1)
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success("Logged out successfully")
        } catch (error) {
            console.error("Sign out error:", error)
        }
    }

    return (
        <nav
            className={cn(
                "fixed top-0 right-0 transition-all duration-300 z-10",
                isCollapsed ? "left-0 sm:left-[60px]" : "left-0 sm:left-[200px]",
                scrolled 
                    ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm" 
                    : "bg-background/50 backdrop-blur-sm border-b border-border/20"
            )}
        >
            <div className="px-3 sm:px-6 py-3 sm:py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <motion.h1
                                className="text-lg sm:text-xl font-bold text-foreground truncate"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={pathname}
                            >
                                {getPageTitle()}
                            </motion.h1>
                            {
                                session?.user && (
                                    <Badge 
                                        variant="secondary" 
                                        className="hidden sm:flex bg-primary/10 text-primary border-primary/20"
                                    >
                                        <Shield className="h-3 w-3 mr-1" />
                                        {session.user.role}
                                    </Badge>
                                )
                            }
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Notifications for Developers and PMs */}
                        {session?.user && ["DEVELOPER", "PRODUCTMANAGER"].includes(session.user.role) && (
                            <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="relative h-9 w-9 rounded-xl p-0 hover:bg-muted/50 transition-all"
                                    >
                                        <Bell className="h-4 w-4 text-foreground" />
                                        {unreadCount > 0 && (
                                            <Badge
                                                variant="destructive"
                                                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                                            >
                                                {unreadCount > 99 ? "99+" : unreadCount}
                                            </Badge>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 mr-2 border border-border/50 shadow-xl bg-background/95 backdrop-blur-xl" align="end">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-sm">Notifications</h4>
                                            <Link href="/notifications">
                                                <Button variant="ghost" size="sm" className="text-xs">
                                                    View All
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="space-y-2 max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <p className="text-sm text-muted-foreground text-center py-4">
                                                    No notifications
                                                </p>
                                            ) : (
                                                notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        onClick={() => handleNotificationClick(notification)}
                                                        className={cn(
                                                            "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50",
                                                            notification.read ? "border-border/50" : "border-primary/20 bg-primary/5"
                                                        )}
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            {notification.sender?.image ? (
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarImage src={notification.sender.image} />
                                                                    <AvatarFallback className="text-xs">
                                                                        {notification.sender.name?.[0] || "S"}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            ) : (
                                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                                    <Bell className="h-3 w-3 text-primary" />
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium leading-none mb-1">
                                                                    {notification.title}
                                                                </p>
                                                                {notification.description && (
                                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                                        {notification.description}
                                                                    </p>
                                                                )}
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}

                        <div className="hidden md:flex items-center bg-muted/50 rounded-xl p-1 border border-border/50">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "h-8 w-8 p-0 rounded-lg transition-all cursor-pointer",
                                    theme === "light" 
                                        ? "bg-background shadow-sm border border-border/50" 
                                        : "hover:bg-muted"
                                )}
                                onClick={() => setTheme("light")}
                            >
                                <Sun className="h-4 w-4 text-foreground" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "h-8 w-8 p-0 rounded-lg transition-all cursor-pointer",
                                    theme === "dark" 
                                        ? "bg-background shadow-sm border border-border/50" 
                                        : "hover:bg-muted"
                                )}
                                onClick={() => setTheme("dark")}
                            >
                                <Moon className="h-4 w-4 text-foreground" />
                            </Button>
                        </div>
                        {
                            session?.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-9 w-9 rounded-xl p-0 hover:bg-muted/50 transition-all">
                                            <Avatar className="h-9 w-9 border-2 border-border/50 shadow-sm">
                                                <AvatarImage src={session?.user?.image || "/placeholder.svg"} alt={session?.user?.name || "User"} />
                                                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                                                    {
                                                        session.user.name
                                                            ?.split(" ")
                                                            .map((n: string) => n[0])
                                                            .join("") || "U"
                                                    }
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-64 mr-2 border border-border/50 shadow-xl bg-background/95 backdrop-blur-xl" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-semibold leading-none text-foreground">{session.user.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                                <div className="flex items-center gap-1 mt-2">
                                                    <Badge variant="outline" className="text-xs border-primary/20 bg-primary/10 text-primary">
                                                        <Shield className="w-3 h-3 mr-1" />
                                                        {session.user.role}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer md:hidden" onClick={() => router.push("/dashboard")}>
                                            <Home className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer md:hidden"
                                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                        >
                                            {
                                                theme === "dark" ? (
                                                    <>
                                                        <Sun className="mr-2 h-4 w-4" />
                                                        <span>Light Mode</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Moon className="mr-2 h-4 w-4" />
                                                        <span>Dark Mode</span>
                                                    </>
                                                )
                                            }
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="md:hidden" />                                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/associations")}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Associations</span>
                        </DropdownMenuItem>
                        {/* Role Settings for Product Managers */}
                        {session.user.role === "PRODUCTMANAGER" && (
                            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/role-settings")}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Role Settings</span>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer text-destructive hover:text-destructive focus:text-destructive" onClick={handleSignOut}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Sign Out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/signin">
                                    <Button
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg transition-all duration-200 rounded-xl"
                                        size="sm"
                                    >
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Sign In
                                    </Button>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default MainNavbar; 