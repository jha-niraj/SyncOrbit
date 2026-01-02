"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import {
    LogOut, User, Sun, Moon, Bell, ChevronLeft, ChevronRight, ChevronDown,
    AlignLeft, Mail, Phone
} from "lucide-react";
import {
    Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    getRecentNotifications, markNotificationAsRead
} from "@/actions/notifications.action";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/navigation/sidebarprovider";
import { getNavigationForRole, type NavigationItem } from "@/lib/navigation";
import { Role, Notification } from "@prisma/client";
import { toast } from "sonner";

export interface DropdownItem {
    path: string;
    name: string;
    icon?: React.ReactNode;
    description?: string;
}

export interface Route {
    layout: string;
    path: string;
    name: string;
    icon?: React.ReactNode;
    section?: string;
    description?: string;
    status: string;
    color?: string;
    dropdownItems?: DropdownItem[];
    action?: string; // Added to support "Coming Soon" toast
}

export function Sidebar() {
    const { isCollapsed, setIsCollapsed } = useSidebar();
    const { data: session, status } = useSession();
    const { resolvedTheme, setTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const profileTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const notificationsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Get navigation items based on user role
    const userRole = session?.user?.role as Role | undefined;
    const navigation = userRole ? getNavigationForRole(userRole) : null;

    const mapNavigationToRoute = (item: NavigationItem): Route => ({
        layout: "dashboard",
        path: item.path,
        name: item.name,
        icon: <item.icon className="h-4 w-4" />,
        description: item.description,
        status: "active",
        action: item.action,
        dropdownItems: item.children?.map(child => ({
            path: child.path,
            name: child.name,
            icon: <child.icon className="h-4 w-4" />, // Instantiate icon
            description: child.description
        }))
    });

    const primaryRoutes = useMemo(() => navigation?.primary.map(mapNavigationToRoute) || [], [navigation]);
    const secondaryRoutes = useMemo(() => navigation?.secondary?.map(mapNavigationToRoute) || [], [navigation]);

    // Close mobile menu on path change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Handle internal collapse state if not provided (though Layout should provide it)
    const handleCollapseToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleItemExpanded = (path: string) => {
        setExpandedItems(prev => {
            if (prev.includes(path)) {
                return prev.filter(p => p !== path);
            }
            return [path];
        });
    };

    // Auto-expand active parent item
    useEffect(() => {
        const allRoutes = [...primaryRoutes, ...secondaryRoutes];
        for (const route of allRoutes) {
            if (route.dropdownItems) {
                for (const child of route.dropdownItems) {
                    if (pathname.startsWith(`/${child.path}`)) {
                        setExpandedItems(prev => prev.includes(route.path) ? prev : [...prev, route.path]);
                        break;
                    }
                }
            }
        }
    }, [pathname, primaryRoutes, secondaryRoutes]);

    // Fetch notifications
    useEffect(() => {
        if (session?.user) {
            fetchNotifications();
        }
    }, [session]);

    const fetchNotifications = async () => {
        try {
            // Check if getRecentNotifications is available/imported correctly
            if (typeof getRecentNotifications === 'function') {
                const result = await getRecentNotifications(5);
                if (result.success) {
                    setNotifications(result.notifications || []);
                    setUnreadCount(result.unreadCount || 0);
                }
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        try {
            if (!notification.read) {
                if (typeof markNotificationAsRead === 'function') {
                    await markNotificationAsRead(notification.id);
                    setUnreadCount(prev => Math.max(0, prev - 1));
                    setNotifications(prev =>
                        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
                    );
                }
            }

            if (notification.actionUrl) {
                router.push(notification.actionUrl);
            }
            setNotificationsDropdownOpen(false);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleProfileMouseEnter = () => {
        if (profileTimeoutRef.current) {
            clearTimeout(profileTimeoutRef.current);
        }
        setProfileDropdownOpen(true);
    };

    const handleProfileMouseLeave = () => {
        if (profileTimeoutRef.current) {
            clearTimeout(profileTimeoutRef.current);
        }
        profileTimeoutRef.current = setTimeout(() => {
            setProfileDropdownOpen(false);
        }, 150);
    };

    const handleNotificationsMouseEnter = () => {
        if (notificationsTimeoutRef.current) {
            clearTimeout(notificationsTimeoutRef.current);
        }
        setNotificationsDropdownOpen(true);
    };

    const handleNotificationsMouseLeave = () => {
        if (notificationsTimeoutRef.current) {
            clearTimeout(notificationsTimeoutRef.current);
        }
        notificationsTimeoutRef.current = setTimeout(() => {
            setNotificationsDropdownOpen(false);
        }, 150);
    };

    const renderNavItem = (item: Route | DropdownItem, depth: number = 0) => {
        const itemPath = item.path;
        const itemName = item.name;
        const itemIcon = item.icon;
        // Check for 'action' property which we added to Route interface
        const itemAction = 'action' in item ? item.action : undefined;

        const hasChildren = 'dropdownItems' in item && item.dropdownItems && item.dropdownItems.length > 0;

        const isChildActive = hasChildren && (item as Route).dropdownItems!.some((child) => pathname.startsWith(`/${child.path}`));
        const isExpanded = expandedItems.includes(itemPath) || (isChildActive && !isCollapsed);

        if (hasChildren) {
            return (
                <div key={itemPath} className="space-y-1">
                    <button
                        onClick={() => toggleItemExpanded(itemPath)}
                        className={cn(
                            "flex items-center w-full gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group",
                            isChildActive
                                ? "text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800/50"
                                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50",
                            isCollapsed && "justify-center px-3"
                        )}
                    >
                        <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">
                            {itemIcon}
                        </div>
                        {
                            !isCollapsed && (
                                <>
                                    <span className="flex-1 text-left whitespace-nowrap overflow-hidden">{itemName}</span>
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
                                        (item as Route).dropdownItems!.map((child) => renderNavItem(child, depth + 1))
                                    }
                                </motion.div>
                            )
                        }
                    </AnimatePresence>
                </div>
            );
        }

        const isPageActive = pathname === `/${itemPath}` || pathname.startsWith(`/${itemPath}/`);

        const linkContent = (
            <Link
                key={itemPath}
                href={itemAction ? '#' : `/${itemPath}`}
                onClick={(e) => {
                    if (itemAction) {
                        e.preventDefault();
                        toast.info("Coming Soon", {
                            description: `${itemName} feature is under development`
                        });
                    }
                }}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    depth > 0 && "text-xs",
                    isPageActive
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-black"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50",
                    isCollapsed && "justify-center px-3"
                )}
            >
                <div className={cn("flex-shrink-0 flex items-center justify-center", depth > 0 ? "h-4 w-4" : "h-5 w-5")}>
                    {itemIcon}
                </div>
                {
                    !isCollapsed && (
                        <span className="whitespace-nowrap overflow-hidden">{itemName}</span>
                    )
                }
            </Link>
        );

        return isCollapsed ? (
            <Tooltip key={itemPath}>
                <TooltipTrigger asChild>
                    {linkContent}
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-800 dark:border-neutral-200">
                    {itemName}
                </TooltipContent>
            </Tooltip>
        ) : linkContent;
    };

    const renderSidebarContent = () => (
        <>
            <div className={cn("p-6 flex items-center relative border-b border-neutral-200 dark:border-neutral-800", isCollapsed ? "justify-center" : "gap-3")}>
                <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                        <Image
                            src="/mainicon.png"
                            alt="SyncOrbit"
                            width={32}
                            height={32}
                            priority
                            className="object-contain"
                        />
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
                    onClick={handleCollapseToggle}
                    className="hidden lg:block absolute top-6 -right-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors z-50 shadow-lg"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4 text-neutral-900 dark:text-white" /> : <ChevronLeft className="w-4 h-4 text-neutral-900 dark:text-white" />}
                </button>
            </div>
            <ScrollArea className="flex-1">
                <nav className="px-3 py-4 space-y-1">
                    {primaryRoutes.map((route) => renderNavItem(route))}

                    {
                        secondaryRoutes.length > 0 && (
                            <>
                                {
                                    !isCollapsed && (
                                        <div className="mt-4 mb-2 px-3">
                                            <p className="text-[10px] font-mono font-bold uppercase text-neutral-500 dark:text-neutral-400 tracking-widest">
                                                Quick Actions
                                            </p>
                                        </div>
                                    )
                                }
                                <div className={cn("mt-2", isCollapsed && "border-t border-neutral-200 dark:border-neutral-800 pt-2")}>
                                    {secondaryRoutes.map((route) => renderNavItem(route))}
                                </div>
                            </>
                        )
                    }
                </nav>
            </ScrollArea>
            <div className={cn("p-2 border-t border-neutral-200 dark:border-neutral-800")}>
                {
                    !isCollapsed && (
                        <p className="px-2 mb-2 text-[10px] font-mono font-bold uppercase text-neutral-500 dark:text-neutral-400 tracking-widest">Support</p>
                    )
                }
                <div className={cn(
                    "grid gap-2",
                    isCollapsed ? "grid-cols-1 justify-items-center" : "grid-cols-2"
                )}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="tel:+1234567890" className={cn(
                                "flex items-center justify-center rounded-lg p-2 text-sm font-medium transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full text-neutral-600 dark:text-neutral-400 h-9",
                            )}>
                                <Phone className="h-4 w-4" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-neutral-900 dark:bg-white text-white dark:text-black">
                            Call Support
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="mailto:support@syncorbit.com" className={cn(
                                "flex items-center justify-center rounded-lg p-2 text-sm font-medium transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full text-neutral-600 dark:text-neutral-400 h-9",
                            )}>
                                <Mail className="h-4 w-4" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-neutral-900 dark:bg-white text-white dark:text-black">
                            Email Support
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <div className="mt-auto border-t border-neutral-200 dark:border-neutral-800">
                <div className={cn("p-2", isCollapsed ? "flex justify-center" : "grid grid-cols-2 gap-2")}>
                    <div className={isCollapsed ? "mb-2" : ""}>
                        <button
                            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            className={cn(
                                "flex items-center justify-center rounded-lg p-2 text-sm font-medium transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full",
                                isCollapsed && "aspect-square"
                            )}
                            title="Toggle Theme"
                        >
                            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            {!isCollapsed && <span className="ml-2">Theme</span>}
                        </button>
                    </div>
                    {
                        status === "authenticated" && session && (
                            <div
                                className="relative"
                                onMouseEnter={handleNotificationsMouseEnter}
                                onMouseLeave={handleNotificationsMouseLeave}
                            >
                                <button className={cn(
                                    "flex items-center justify-center rounded-lg p-2 text-sm font-medium transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full",
                                    isCollapsed && "aspect-square"
                                )}>
                                    <div className="relative">
                                        <Bell className="h-5 w-5" />
                                        {
                                            unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-600 border border-white dark:border-neutral-950"></span>
                                            )
                                        }
                                    </div>
                                    {!isCollapsed && <span className="ml-2">Inbox</span>}
                                </button>
                                {
                                    notificationsDropdownOpen && (
                                        <div className="absolute bottom-full left-0 mb-2 w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl z-50 overflow-hidden">
                                            <div className="p-3 border-b border-neutral-100 dark:border-neutral-800">
                                                <h3 className="font-semibold text-sm">Notifications</h3>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {
                                                    notifications.length === 0 ? (
                                                        <div className="p-4 text-center text-neutral-500 text-sm">No notifications</div>
                                                    ) : (
                                                        notifications.map(notification => (
                                                            <button
                                                                key={notification.id}
                                                                onClick={() => handleNotificationClick(notification)}
                                                                className={cn(
                                                                    "w-full text-left p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-800/50 last:border-0",
                                                                    !notification.read && "bg-blue-50/50 dark:bg-blue-900/10"
                                                                )}
                                                            >
                                                                <p className="text-sm font-medium line-clamp-1">{notification.title}</p>
                                                                <p className="text-xs text-neutral-500 mt-1">{format(new Date(notification.createdAt), "MMM d, h:mm a")}</p>
                                                            </button>
                                                        ))
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
                {
                    status === "authenticated" && session ? (
                        <div
                            className="relative px-3 py-2"
                            onMouseEnter={handleProfileMouseEnter}
                            onMouseLeave={handleProfileMouseLeave}
                        >
                            <button className={cn("flex cursor-pointer items-center gap-3 w-full rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 transition-colors", isCollapsed && "justify-center")}>
                                {
                                    session?.user?.image ? (
                                        <Image
                                            className="h-8 w-8 rounded-full border border-neutral-200 dark:border-neutral-800"
                                            src={session.user.image}
                                            alt="User"
                                            width={32}
                                            height={32}
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center">
                                            <span className="text-white dark:text-black text-xs font-bold">{session?.user?.name?.[0] || 'U'}</span>
                                        </div>
                                    )
                                }
                                {
                                    !isCollapsed && (
                                        <div className="flex-1 text-left min-w-0 hidden lg:block">
                                            <p className="text-sm font-bold truncate">{session?.user?.name}</p>
                                            <p className="text-[10px] text-neutral-500 truncate">{session?.user?.email}</p>
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
                                        <div className="p-2">
                                            <button onClick={() => router.push('/profile')} className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors text-sm">
                                                <User className="h-4 w-4" />
                                                Profile
                                            </button>
                                            <button onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-md transition-colors text-sm">
                                                <LogOut className="h-4 w-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    ) : (
                        <div className="px-3 py-2">
                            <button
                                onClick={() => router.push('/signin')}
                                className={cn(
                                    "flex items-center w-full rounded-lg p-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800",
                                    isCollapsed && "justify-center"
                                )}
                            >
                                <User className="h-5 w-5" />
                                {!isCollapsed && <span className="ml-3">Sign In</span>}
                            </button>
                        </div>
                    )
                }
            </div>
        </>
    );

    return (
        <TooltipProvider>
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed top-2 left-2 z-50 lg:hidden bg-white dark:bg-neutral-950 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
                <AlignLeft className="h-5 w-5" />
            </button>

            {
                isMobileOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )
            }

            <aside
                className={cn(
                    "fixed top-0 left-0 h-screen bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col z-40 transition-all duration-300",
                    "hidden lg:flex",
                    isCollapsed ? "w-[90px]" : "w-64"
                )}
            >
                {renderSidebarContent()}
            </aside>
            <div className={cn(
                "fixed top-0 left-0 h-full w-64 bg-white dark:bg-neutral-950 z-50 transition-transform duration-300 transform border-r border-neutral-200 dark:border-neutral-800 lg:hidden flex flex-col",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {renderSidebarContent()}
            </div>
        </TooltipProvider>
    );
}

export default Sidebar;