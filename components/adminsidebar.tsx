"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, ChevronRight, Users, Settings, Home, Plus, BarChart3, Shield } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { signOut, useSession } from "next-auth/react"

export interface AdminRoute {
    path: string
    name: string
    icon?: React.ReactNode
    status: string
}

interface AdminSidebarProps {
    isCollapsed: boolean
    toggleSidebar: () => void
}

const AdminSidebar = ({ isCollapsed, toggleSidebar }: AdminSidebarProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()

    const isActiveRoute = (path: string) => {
        if (path === "") {
            // For dashboard, check if we're exactly at /admin or /admin/
            return pathname === "/admin" || pathname === "/admin/"
        }
        // For other routes, check if pathname exactly matches the route
        return pathname === `/admin/${path}`
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
        router.push(`/admin/${path}`)
    }

    const routes: AdminRoute[] = [
        {
            path: "",
            name: "Dashboard",
            icon: <Home className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "createproject",
            name: "Create Project",
            icon: <Plus className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "users",
            name: "Manage Users",
            icon: <Users className="h-5 w-5" />,
            status: "active"
        },
        {
            path: "analytics",
            name: "Analytics",
            icon: <BarChart3 className="h-5 w-5" />,
            status: "active"
        },
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
                className="fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm z-20 sm:block hidden"
                animate={{ width: isCollapsed ? 60 : 240 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="flex flex-col h-full relative">
                    <div className="flex items-center justify-center p-4 h-[80px] border-b border-gray-200 dark:border-gray-800">
                        <Link href="/admin" className="flex gap-2 items-center justify-center group cursor-pointer">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <motion.div
                                animate={{
                                    opacity: isCollapsed ? 0 : 1,
                                    x: isCollapsed ? -20 : 0,
                                    width: isCollapsed ? 0 : "auto",
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                style={{ overflow: "hidden" }}
                            >
                                <div className="whitespace-nowrap">
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Admin Panel
                                    </h1>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                    <div className="flex-grow overflow-y-auto py-6">
                        <div className={`space-y-2 ${isCollapsed ? "px-2" : "px-4"}`}>
                            {
                                displayRoutes.map((route, index) => {
                                    const isActive = isActiveRoute(route.path) || (route.path === "" && pathname === "/admin")

                                    return (
                                        <Tooltip key={index}>
                                            <TooltipTrigger asChild>
                                                <motion.button
                                                    onClick={() => handleNavigation(route.path)}
                                                    className="block w-full cursor-pointer"
                                                    whileHover={{ x: isCollapsed ? 0 : 4 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    transition={{ duration: 0.1 }}
                                                >
                                                    <div
                                                        className={`
                                                    ${isActive
                                                                ? "bg-red-600 text-white"
                                                                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                                            } 
                                                    flex items-center rounded-lg transition-all duration-200 cursor-pointer
                                                    ${isCollapsed ? "justify-center px-3 py-4" : "px-4 py-3"}
                                                `}
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
                    </div>
                    <motion.button
                        onClick={toggleSidebar}
                        className="absolute top-1/2 -translate-y-1/2 -right-4 p-2 bg-white dark:bg-gray-900 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 z-30 cursor-pointer"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        animate={{ rotate: isCollapsed ? 0 : 180 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                    {
                        session?.user && (
                            <div className="border-t border-gray-200 dark:border-gray-800 p-4 mt-auto bg-gray-50 dark:bg-gray-800">
                                <div className={`flex items-center justify-between ${isCollapsed ? "flex-col" : "flex-row"}`}>
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                                            <AvatarImage src={session.user.image || "/placeholder.svg"} alt={session.user.name || "User"} />
                                            <AvatarFallback className="bg-red-600 text-white text-sm font-bold">
                                                {
                                                    session.user.name
                                                        ?.split(" ")
                                                        .map((n: string) => n[0])
                                                        .join("") || "A"
                                                }
                                            </AvatarFallback>
                                        </Avatar>
                                        {!isCollapsed && (
                                            <div className="flex flex-col">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {session.user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {session.user.role}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {!isCollapsed && (
                                        <Button
                                            onClick={handleSignOut}
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )
                    }
                </div>
            </motion.div>
        </TooltipProvider>
    )
}

export default AdminSidebar 