"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, ChevronRight, UserPlus, Users, Briefcase, BarChart3, Settings, Home, Building2 } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export interface Route {
    path: string
    name: string
    icon?: React.ReactNode
    status: string
}

interface SidebarProps {
    isCollapsed: boolean
    toggleSidebar: () => void
}

const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()

    const isActiveRoute = (path: string) => {
        return pathname.includes(path)
    }

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Failed to sign out", error)
            toast.error("Failed to sign out")
        }
    }

    const handleNavigation = (path: string) => {
        router.push(`/${path}`)
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
        {
            path: "settings",
            name: "Settings",
            icon: <Settings className="h-5 w-5" />,
            status: "active"
        }
    ];

    const displayRoutes = routes.filter((route) => route.status === "active")

    return (
        <TooltipProvider>
            <motion.div
                className={cn(
                    "fixed top-0 left-0 h-full border-r shadow-lg z-20 sm:block hidden",
                    "bg-background/80 backdrop-blur-xl border-border/50"
                )}
                animate={{ width: isCollapsed ? 60 : 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="flex flex-col h-full relative">
                    <div className="flex items-center justify-center p-4 h-[80px] border-b border-border/20">
                        <Link href={session ? "/dashboard" : "/"} className="flex gap-3 items-center justify-center group cursor-pointer">
                            <Image
                                src="/projectcentral.png"
                                alt="Project Central Main Logo"
                                height={20}
                                width={20}
                            />
                            {
                                isCollapsed ? ""
                                    :
                                    <h1>Project Central</h1>
                            }
                        </Link>
                    </div>
                    <div className="flex-grow overflow-y-auto py-6">
                        {
                            session ? (
                                <div className={`space-y-1 ${isCollapsed ? "px-2" : "px-4"}`}>
                                    {
                                        displayRoutes.map((route, index) => {
                                            const isActive = isActiveRoute(route.path)

                                            return (
                                                <Tooltip key={index}>
                                                    <TooltipTrigger asChild>
                                                        <motion.button
                                                            onClick={() => handleNavigation(route.path)}
                                                            className="block w-full cursor-pointer group"
                                                            whileHover={{ x: isCollapsed ? 0 : 2 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <div
                                                                className={cn(
                                                                    "flex items-center rounded-xl transition-all duration-200 cursor-pointer",
                                                                    isCollapsed ? "justify-center px-3 py-4" : "px-4 py-3",
                                                                    isActive
                                                                        ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                                                                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent"
                                                                )}
                                                            >
                                                                {
                                                                    isCollapsed ? (
                                                                        <div className="flex items-center justify-center">
                                                                            <div className="transition-all duration-200">
                                                                                {route.icon}
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-3 w-full">
                                                                            <div className="flex-shrink-0">
                                                                                {route.icon}
                                                                            </div>
                                                                            <span className="text-sm font-medium truncate">
                                                                                {route.name}
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        </motion.button>
                                                    </TooltipTrigger>
                                                    {
                                                        isCollapsed && (
                                                            <TooltipContent side="right">
                                                                <p>{route.name}</p>
                                                            </TooltipContent>
                                                        )
                                                    }
                                                </Tooltip>
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <div className={`${isCollapsed ? "px-2" : "px-4"} text-center`}>
                                    {
                                        !isCollapsed && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="bg-muted/50 rounded-xl p-6 mb-4 border border-border/50"
                                            >
                                                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                                                    <UserPlus className="w-6 h-6 text-primary-foreground" />
                                                </div>
                                                <h3 className="text-lg font-bold text-foreground mb-2">Join Project Central</h3>
                                                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                                    Sign in to access your projects, manage team, and track development progress.
                                                </p>
                                                <Link href="/signin">
                                                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                                                        Sign In
                                                    </Button>
                                                </Link>
                                            </motion.div>
                                        )
                                    }
                                    {
                                        isCollapsed && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href="/signin">
                                                        <Button
                                                            size="sm"
                                                            className="w-10 h-10 p-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                                                        >
                                                            <UserPlus className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    <p>Sign In</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                    <motion.button
                        onClick={toggleSidebar}
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 -right-4 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-30 cursor-pointer",
                            "bg-background/95 backdrop-blur-sm border border-border/50 hover:bg-muted/50"
                        )}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        animate={{ rotate: isCollapsed ? 0 : 180 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                    {
                        session?.user && (
                            <div className="border-t border-border/20 p-4 mt-auto bg-muted/30 backdrop-blur-sm">
                                <div className={`flex items-center justify-between ${isCollapsed ? "flex-col gap-2" : "flex-row"}`}>
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-10 w-10 border-2 border-border/50 shadow-sm">
                                            <AvatarImage src={session.user.image || "/placeholder.svg"} alt={session.user.name || "User"} />
                                            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                                                {
                                                    session.user.name
                                                        ?.split(" ")
                                                        .map((n: string) => n[0])
                                                        .join("") || "U"
                                                }
                                            </AvatarFallback>
                                        </Avatar>
                                        {!isCollapsed && (
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {session.user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {session.user.role}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleSignOut}
                                                className={cn(
                                                    "cursor-pointer transition-all duration-200 rounded-xl",
                                                    isCollapsed ? "h-10 w-10 p-0" : "px-3",
                                                    "hover:bg-destructive/10 text-destructive hover:text-destructive"
                                                )}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                {!isCollapsed && <span className="ml-2 text-sm">Sign Out</span>}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side={isCollapsed ? "right" : "top"}>
                                            <p>Sign Out</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        )
                    }
                </div>
            </motion.div>
            {/* Mobile Navigation */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-lg z-20">
                <div className="flex justify-around py-3">
                    {
                        displayRoutes.slice(0, 4).map((route) => {
                            const isActive = isActiveRoute(route.path)
                            return (
                                <button
                                    key={route.path}
                                    onClick={() => handleNavigation(route.path)}
                                    className={cn(
                                        "flex flex-col items-center gap-1 text-xs transition-colors duration-200 focus:outline-none px-2 py-1 rounded-lg",
                                        isActive
                                            ? 'text-primary bg-primary/10'
                                            : 'text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    {route.icon}
                                    <span className="text-xs font-medium">{route.name}</span>
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </TooltipProvider>
    )
}

export default Sidebar; 