"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
    User, LogOut, ChevronLeft, ChevronRight, Mail, Phone, ChevronDown
} from "lucide-react"
import {
    Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
} from "@/components/ui/tooltip"
import {
    useSidebar
} from "@/components/navigation/sidebarprovider"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/ui/themetoggle"
import Image from "next/image"
import { getNavigationForRole, type NavigationItem } from "@/lib/navigation"
import { Role } from "@prisma/client"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"
import { Bell } from "lucide-react"

export function Sidebar() {
    const {
        isCollapsed, setIsCollapsed
    } = useSidebar()
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const pathname = usePathname()
    const router = useRouter()
    const { data: session, status } = useSession()
    const profileTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

    useEffect(() => {
        setIsMobileOpen(false)
    }, [pathname])

    const handleProfileMouseEnter = () => {
        if (profileTimeoutRef.current) {
            clearTimeout(profileTimeoutRef.current)
        }
        setProfileDropdownOpen(true)
    }

    const handleProfileMouseLeave = () => {
        if (profileTimeoutRef.current) {
            clearTimeout(profileTimeoutRef.current)
        }
        profileTimeoutRef.current = setTimeout(() => {
            setProfileDropdownOpen(false)
        }, 150)
    }

    const handleSignOut = async () => {
        await signOut()
        setProfileDropdownOpen(false)
        toast.success("Session Terminated", {
            description: "You have been logged out successfully"
        })
    }

    const toggleItemExpanded = (path: string) => {
        setExpandedItems(prev => {
            // If clicking on already expanded item, close it
            if (prev.includes(path)) {
                return prev.filter(p => p !== path)
            }
            // Otherwise, close all others and open this one (accordion behavior)
            return [path]
        })
    }

    // Get navigation items based on user role
    const userRole = session?.user?.role as Role | undefined
    const navigation = userRole ? getNavigationForRole(userRole) : null
    const navItems = navigation?.primary
    const secondaryItems = navigation?.secondary

    const renderNavItem = (item: NavigationItem, depth: number = 0) => {
        const isActive = pathname === `/${item.path}` || pathname.startsWith(`/${item.path}/`)
        const hasChildren = item.children && item.children.length > 0
        const isExpanded = expandedItems.includes(item.path)
        const Icon = item.icon

        if (hasChildren) {
            return (
                <div key={item.path} className="space-y-1">
                    <button
                        onClick={() => toggleItemExpanded(item.path)}
                        className={cn(
                            "flex items-center w-full gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group",
                            isActive
                                ? "bg-neutral-900 dark:bg-white text-white dark:text-black"
                                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50",
                            isCollapsed && "justify-center px-3"
                        )}
                    >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {
                            !isCollapsed && (
                                <>
                                    <span className="flex-1 text-left whitespace-nowrap overflow-hidden">{item.name}</span>
                                    <ChevronDown className={cn(
                                        "h-4 w-4 transition-transform",
                                        isExpanded && "rotate-180"
                                    )} />
                                </>
                            )
                        }
                    </button>
                    <AnimatePresence>
                        {
                            isExpanded && !isCollapsed && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden pl-4 space-y-1"
                                >
                                    {
                                        item.children?.map((child) => renderNavItem(child, depth + 1))
                                    }
                                </motion.div>
                            )
                        }
                    </AnimatePresence>
                </div>
            )
        }

        const linkContent = (
            <Link
                key={item.path}
                href={item.action ? '#' : `/${item.path}`}
                onClick={(e) => {
                    if (item.action) {
                        e.preventDefault()
                        toast.info("Coming Soon", {
                            description: `${item.name} feature is under development`
                        })
                    }
                }}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    depth > 0 && "text-xs",
                    isActive
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-black"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50",
                    isCollapsed && "justify-center px-3"
                )}
            >
                <Icon className={cn("flex-shrink-0", depth > 0 ? "h-4 w-4" : "h-5 w-5")} />
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

    const SidebarContent = () => (
        <>
            <div className={cn("p-6 flex items-center relative border-b border-neutral-200 dark:border-neutral-800", isCollapsed ? "justify-center" : "gap-3")}>
                <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" fill="#335CFF" />
                            <path opacity="0.48" d="M15.4244 25.3192C15.0551 25.3192 14.71 25.5027 14.5034 25.8088L12.1693 29.2673C11.6713 30.0053 12.2 31 13.0903 31H24.5112C24.8805 31 25.2257 30.8165 25.4322 30.5104L33.8307 18.066C34.3287 17.328 33.8 16.3333 32.9097 16.3333H25.1826C24.8133 16.3333 24.4681 16.5168 24.2616 16.8229L19.3536 24.0953C18.8371 24.8605 17.9743 25.3192 17.0511 25.3192H15.4244Z" fill="url(#paint0_linear_92_1022)" />
                            <path d="M13.6666 10.0303C14.0744 9.38864 14.7818 9 15.5421 9H24.9773C25.8538 9 26.3852 9.96737 25.9151 10.7071L18.3334 22.6364C17.9256 23.278 17.2182 23.6667 16.4579 23.6667H7.02269C6.14621 23.6667 5.61481 22.6993 6.08494 21.9596L13.6666 10.0303Z" fill="url(#paint1_linear_92_1022)" />
                            <defs>
                                <linearGradient id="paint0_linear_92_1022" x1="23" y1="16.3333" x2="23" y2="38.5732" gradientUnits="userSpaceOnUse">
                                    <stop offset="0.313079" stopColor="white" />
                                    <stop offset="1" stopColor="white" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="paint1_linear_92_1022" x1="16.0001" y1="9" x2="16.0001" y2="28.3944" gradientUnits="userSpaceOnUse">
                                    <stop offset="0.38239" stopColor="white" />
                                    <stop offset="1" stopColor="white" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {
                        !isCollapsed && (
                            <div className="flex-1 text-left min-w-0 hidden lg:block">
                                <h1 className="font-bold text-neutral-900 dark:text-white truncate tracking-tight">SyncOrbit</h1>
                                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate uppercase tracking-widest font-mono">
                                    Project Management
                                </p>
                            </div>
                        )
                    }
                </Link>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:block absolute top-6 -right-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors z-50 shadow-lg"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4 text-neutral-900 dark:text-white" /> : <ChevronLeft className="w-4 h-4 text-neutral-900 dark:text-white" />}
                </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                {navItems?.map((item) => renderNavItem(item))}
                {
                    secondaryItems && secondaryItems.length > 0 && (
                        <>
                            <div className="pt-4 pb-2">
                                {
                                    !isCollapsed && (
                                        <p className="text-[10px] font-mono font-bold uppercase text-neutral-500 dark:text-neutral-400 px-2 tracking-widest">Quick Actions</p>
                                    )
                                }
                            </div>
                            {secondaryItems.map((item) => renderNavItem(item))}
                        </>
                    )
                }
            </nav>
            <div className="mt-auto border-t border-neutral-200 dark:border-neutral-800">
                <div className={cn(
                    "p-3 border-b border-neutral-200 dark:border-neutral-800",
                    isCollapsed ? "space-y-3" : "grid grid-cols-2 gap-4"
                )}>
                    <div className={cn(isCollapsed && "flex flex-col items-center")}>
                        {
                            !isCollapsed && (
                                <p className="text-[10px] font-mono font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-2 tracking-widest">System</p>
                            )
                        }
                        <div className={cn(
                            "flex items-center gap-2",
                            isCollapsed && "justify-center"
                        )}>
                            <ThemeToggle />
                        </div>
                    </div>
                    <div className={cn(isCollapsed && "flex flex-col items-center")}>
                        {
                            !isCollapsed && (
                                <p className="text-[10px] font-mono font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-2 tracking-widest">Support</p>
                            )
                        }
                        <div className={cn(
                            "flex gap-2",
                            isCollapsed ? "flex-col items-center" : "justify-start"
                        )}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="tel:+1234567890" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-800 dark:border-neutral-200">
                                    Call Support
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="mailto:support@syncorbit.com" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-800 dark:border-neutral-200">
                                    Email Support
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/notifications"
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all w-full",
                                    pathname === '/notifications'
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
                {
                    status === "authenticated" && session ? (
                        <div
                            className="relative px-3 py-2"
                            onMouseEnter={handleProfileMouseEnter}
                            onMouseLeave={handleProfileMouseLeave}
                        >
                            <button className={cn("flex cursor-pointer items-center gap-3 w-full rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 transition-colors", isCollapsed && "justify-center")}>
                                <div className="flex flex-1 gap-2">
                                    {
                                        session?.user?.image ? (
                                            <Image
                                                className="h-10 w-10 rounded-full border border-neutral-200 dark:border-neutral-800"
                                                src={session.user.image}
                                                alt={`Profile picture of ${session.user.name || 'user'}`}
                                                width={40}
                                                height={40}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center flex-shrink-0 border border-neutral-200 dark:border-neutral-800">
                                                <span className="text-white dark:text-black text-sm font-bold">
                                                    {session?.user?.name?.[0] || 'U'}
                                                </span>
                                            </div>
                                        )
                                    }
                                    {
                                        !isCollapsed && (
                                            <div className="flex-1 text-left hidden lg:block min-w-0">
                                                <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{session?.user?.name || 'User'}</p>
                                                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate font-mono">{session?.user?.email || 'user@example.com'}</p>
                                            </div>
                                        )
                                    }
                                </div>
                                {
                                    !isCollapsed && (
                                        <div className="flex-shrink-0">
                                            <ChevronRight className="w-4 h-4 text-neutral-900 dark:text-white" />
                                        </div>
                                    )
                                }
                            </button>
                            {
                                profileDropdownOpen && (
                                    <div
                                        className="absolute left-full ml-2 bottom-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-2xl z-50 w-64 overflow-hidden"
                                        onMouseEnter={handleProfileMouseEnter}
                                        onMouseLeave={handleProfileMouseLeave}
                                    >
                                        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
                                            <div className="flex items-center gap-3">
                                                {
                                                    session?.user?.image ? (
                                                        <Image
                                                            className="h-12 w-12 rounded-full border border-neutral-200 dark:border-neutral-800"
                                                            src={session.user.image}
                                                            alt={`Profile picture of ${session.user.name || 'user'}`}
                                                            width={48}
                                                            height={48}
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
                                                            <span className="text-white dark:text-black text-lg font-bold">
                                                                {session?.user?.name?.[0] || 'U'}
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                                                        {session?.user?.name || 'User'}
                                                    </h3>
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                                                        {session?.user?.email || 'user@example.com'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => router.push('/profile')}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                            >
                                                <div className="w-8 h-8 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="font-medium text-sm text-neutral-900 dark:text-white">Profile Settings</span>
                                            </button>
                                        </div>
                                        <div className="border-t border-neutral-100 dark:border-neutral-800">
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                                            >
                                                <div className="w-8 h-8 bg-red-500/10 dark:bg-red-500/20 rounded-lg flex items-center justify-center">
                                                    <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                </div>
                                                <span className="font-medium text-sm">Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    ) : (
                        <button
                            onClick={() => router.push('/signin')}
                            className={cn(
                                "flex items-center w-full rounded-lg p-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 group mx-3 mb-2",
                                isCollapsed && "justify-center"
                            )}
                            title="Sign In"
                        >
                            <User className="h-5 w-5" />
                            {!isCollapsed && <span className="ml-3">Sign In</span>}
                        </button>
                    )
                }
            </div>
        </>
    )

    return (
        <TooltipProvider>
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed top-6 left-6 z-50 lg:hidden bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shadow-lg"
                aria-label="Toggle sidebar"
            >
                {
                    !isMobileOpen && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )
                }
            </button>

            {
                isMobileOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )
            }
            <aside
                className={cn(
                    "fixed top-0 left-0 h-screen bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col z-40 transition-all duration-300",
                    "hidden lg:flex",
                    isCollapsed ? "lg:w-[90px]" : "lg:w-64",
                    "lg:translate-x-0"
                )}
            >
                <SidebarContent />
            </aside>
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetContent side="left" className="p-0 w-64 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                    <div className="flex flex-col h-full">
                        <SidebarContent />
                    </div>
                </SheetContent>
            </Sheet>
        </TooltipProvider>
    )
}