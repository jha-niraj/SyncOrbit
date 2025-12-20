"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard, Users, Building2, Settings, FileText, BarChart3,
    ChevronLeft, ChevronRight, Shield, Database, Bell
} from "lucide-react"
import {
    Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
} from "@/components/ui/tooltip"

interface AdminSidebarProps {
    isCollapsed: boolean
    toggleSidebar: () => void
}

const adminNavItems = [
    {
        path: "/admin",
        name: "Dashboard",
        icon: LayoutDashboard,
        description: "Admin overview"
    },
    {
        path: "/admin/companies",
        name: "Companies",
        icon: Building2,
        description: "Manage all companies"
    },
    {
        path: "/admin/users",
        name: "Users",
        icon: Users,
        description: "Manage all users"
    },
    {
        path: "/admin/analytics",
        name: "Analytics",
        icon: BarChart3,
        description: "Platform analytics"
    },
    {
        path: "/admin/reports",
        name: "Reports",
        icon: FileText,
        description: "System reports"
    },
    {
        path: "/admin/database",
        name: "Database",
        icon: Database,
        description: "Database management"
    },
    {
        path: "/admin/settings",
        name: "Settings",
        icon: Settings,
        description: "Platform settings"
    }
]

export default function AdminSidebar({ isCollapsed, toggleSidebar }: AdminSidebarProps) {
    const pathname = usePathname()

    const renderNavItem = (item: typeof adminNavItems[0]) => {
        const isActive = pathname === item.path

        const linkContent = (
            <Link
                href={item.path}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-black"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50",
                    isCollapsed && "justify-center px-3"
                )}
            >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {
                    !isCollapsed && (
                        <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
                    )
                }
            </Link>
        )

        return isCollapsed ? (
            <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                    {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-800 dark:border-neutral-200">
                    {item.name}
                </TooltipContent>
            </Tooltip>
        ) : linkContent
    }

    return (
        <TooltipProvider>
            <aside
                className={cn(
                    "fixed top-0 left-0 h-screen bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col z-40 transition-all duration-300",
                    isCollapsed ? "w-[90px]" : "w-64"
                )}
            >
                <div className={cn("p-6 flex items-center relative border-b border-neutral-200 dark:border-neutral-800", isCollapsed ? "justify-center" : "gap-3")}>
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-white" />
                        </div>

                        {
                            !isCollapsed && (
                                <div className="flex-1 text-left min-w-0">
                                    <h1 className="font-bold text-neutral-900 dark:text-white truncate tracking-tight">Admin Panel</h1>
                                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate uppercase tracking-widest font-mono">
                                        System Control
                                    </p>
                                </div>
                            )
                        }
                    </Link>
                    <button
                        onClick={toggleSidebar}
                        className="absolute top-6 -right-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors z-50 shadow-lg"
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4 text-neutral-900 dark:text-white" /> : <ChevronLeft className="w-4 h-4 text-neutral-900 dark:text-white" />}
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                    {adminNavItems.map((item) => renderNavItem(item))}
                </nav>

                <div className="mt-auto border-t border-neutral-200 dark:border-neutral-800">
                    <div className="p-3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/admin/notifications"
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all w-full",
                                        pathname === '/admin/notifications'
                                            ? "bg-neutral-900 dark:bg-white text-white dark:text-black"
                                            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50",
                                        isCollapsed && "justify-center"
                                    )}
                                >
                                    <div className="relative">
                                        <Bell className="h-5 w-5 flex-shrink-0" />
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </div>
                                    {
                                        !isCollapsed && (
                                            <span className="whitespace-nowrap overflow-hidden">Notifications</span>
                                        )
                                    }
                                </Link>
                            </TooltipTrigger>
                            {
                                isCollapsed && (
                                    <TooltipContent side="right" className="bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-800 dark:border-neutral-200">
                                        Notifications
                                    </TooltipContent>
                                )
                            }
                        </Tooltip>
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    )
}
