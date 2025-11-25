"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
    LogOut, User, Sun, Moon, Bell, Users as UsersIcon, Award, BellOff,
    LayoutDashboard, Briefcase, FileText, Settings, Shield, UserPlus,
    Layers, Target, TrendingUp, Calendar, Coffee, Eye, DollarSign, MessageSquare
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    getRecentNotifications, markNotificationAsRead
} from "@/actions/notifications.action";
import { format } from "date-fns";
import { Role } from "@prisma/client";
import { getNavigationForRole, NavigationItem } from "@/lib/navigation";
import { CreateProjectSheet } from "@/components/projects/createprojectsheet";
import { ReferralSheet } from "@/components/referral/ReferralSheet";

interface NavDropdownProps {
    isActive: boolean;
    onNavigate: (path: string, action?: string) => void;
    icon: React.ReactNode;
    label: string;
    dropdownItems: Array<{
        path: string;
        name: string;
        icon?: React.ReactNode;
        iconColor?: string;
        action?: string;
    }>;
}

const NavDropdown = ({ isActive, onNavigate, icon, label, dropdownItems }: NavDropdownProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Detect screen size
    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 640); // sm breakpoint
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const calculatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.top,
                left: rect.right + 8 // 8px gap (ml-2)
            });
        }
    };

    const handleMouseEnter = () => {
        // Only use hover on larger screens
        if (isSmallScreen) return;

        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }

        calculatePosition();
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        // Only use hover on larger screens
        if (isSmallScreen) return;

        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
        dropdownTimeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 150);
    };

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        calculatePosition();
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown when clicking outside (for mobile and click interactions)
    useEffect(() => {
        if (!isDropdownOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
                const dropdown = document.querySelector(`[data-dropdown="${label}"]`);
                if (dropdown && !dropdown.contains(e.target as Node)) {
                    setIsDropdownOpen(false);
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isDropdownOpen, label]);

    return (
        <div
            className="relative w-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                ref={buttonRef}
                onClick={handleClick}
                className={cn(
                    "flex flex-col items-center justify-center rounded-lg p-2 text-sm font-medium transition-all cursor-pointer group w-full",
                    isActive
                        ? "bg-white dark:bg-white text-black"
                        : "hover:bg-neutral-800 text-neutral-300 hover:text-white"
                )}
            >
                <div className="h-5 w-5 stroke-2">{icon}</div>
                <h1 className="text-xs mt-1">{label}</h1>
            </button>

            {isDropdownOpen && (
                <div
                    data-dropdown={label}
                    className="fixed bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50 min-w-[200px] overflow-hidden"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-2">
                        {dropdownItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate(item.path, item.action);
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
                            >
                                <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center text-lg">
                                    {typeof item.icon === 'string' ? (
                                        <span>{item.icon}</span>
                                    ) : (
                                        <div className={item.iconColor}>{item.icon}</div>
                                    )}
                                </div>
                                <span className="font-medium">{item.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

interface RoleBasedSidebarProps {
    collapsed?: boolean; // Kept for compatibility but not used in new design
    onToggle?: () => void; // Kept for compatibility
}

export default function RoleBasedSidebar({ collapsed, onToggle }: RoleBasedSidebarProps) {
    const { data: session, status } = useSession();
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const profileTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const notificationsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Sheet states
    const [createProjectOpen, setCreateProjectOpen] = useState(false);
    const [referralOpen, setReferralOpen] = useState(false);

    const isActiveRoute = (path: string) => {
        if (path === 'dashboard') {
            return pathname === '/dashboard' || pathname === '/dashboard/clients';
        }
        return pathname.includes(path);
    };

    const handleNavigation = (path: string, action?: string) => {
        if (action) {
            if (action === 'create_project') {
                setCreateProjectOpen(true);
            } else if (action === 'referral') {
                setReferralOpen(true);
            }
            setIsSidebarOpen(false);
            return;
        }

        // Handle hash links or empty paths
        if (path.startsWith('#') || !path) return;

        router.push(`/${path}`);
        setIsSidebarOpen(false);
    };

    const handleLinkClick = (href: string) => {
        setProfileDropdownOpen(false);
        setIsSidebarOpen(false);
        router.push(`/${href}`);
    };

    // Fetch notifications
    useEffect(() => {
        if (session?.user?.email) {
            fetchNotifications();
        }
    }, [session?.user?.email]);

    const fetchNotifications = async () => {
        try {
            const result = await getRecentNotifications(5);
            if (result.success) {
                setNotifications(result.notifications || []);
                setUnreadCount(result.unreadCount || 0);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        try {
            if (!notification.read) {
                await markNotificationAsRead(notification.id);
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
                );
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

    // Get navigation for current user role
    const userRole = session?.user?.role as Role;
    const navigation = userRole ? getNavigationForRole(userRole) : null;

    if (!session?.user || !navigation) {
        return null;
    }

    // Transform navigation items to match the new sidebar structure
    const allItems = [...navigation.primary, ...(navigation.secondary || [])];

    return (
        <TooltipProvider>
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-2 left-2 z-30 sm:hidden bg-black text-white p-2 rounded-lg border border-neutral-800 hover:bg-neutral-900 transition-all"
                aria-label="Toggle sidebar"
            >
                {
                    !isSidebarOpen && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )
                }
            </button>
            {
                isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-10 sm:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )
            }
            <div className={cn(
                "fixed top-0 left-0 h-full w-[90px] bg-black dark:bg-black border-r border-neutral-800 z-20 transition-transform duration-300",
                "sm:translate-x-0", // Always visible on sm and larger
                isSidebarOpen ? "translate-x-0" : "-translate-x-full" // Toggle on small screens
            )}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center p-3 h-[70px]">
                        <Link href={session ? "/dashboard" : "/"} className="transition-opacity hover:opacity-80">
                            <div className="relative h-[36px] w-[36px]">
                                <Image
                                    src="/logo/whitelogo.svg"
                                    alt="SyncOrbit"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>
                    <div className="flex-grow overflow-y-auto py-3 px-2">
                        <div className="flex flex-col items-center space-y-2">
                            {
                                allItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const hasChildren = item.children && item.children.length > 0;
                                    const isActive = isActiveRoute(item.path);

                                    if (hasChildren) {
                                        return (
                                            <NavDropdown
                                                key={index}
                                                isActive={isActive}
                                                onNavigate={handleNavigation}
                                                icon={<Icon className="w-5 h-5" />}
                                                label={item.name}
                                                dropdownItems={item.children!.map(child => {
                                                    const ChildIcon = child.icon;
                                                    return {
                                                        path: child.path,
                                                        name: child.name,
                                                        icon: <ChildIcon className="w-4 h-4" />,
                                                        action: child.action
                                                    };
                                                })}
                                            />
                                        );
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleNavigation(item.path, item.action)}
                                            className="block w-full"
                                        >
                                            <div
                                                className={cn(
                                                    "flex flex-col items-center justify-center rounded-lg p-2 text-sm font-medium transition-all cursor-pointer group",
                                                    isActive
                                                        ? "bg-white dark:bg-white text-black"
                                                        : "hover:bg-neutral-800 text-neutral-300 hover:text-white"
                                                )}
                                            >
                                                <div className="h-5 w-5 stroke-2">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <h1 className="text-xs mt-1 text-center">{item.name}</h1>
                                            </div>
                                        </button>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div className="px-2 mb-3 mt-auto space-y-2">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="flex items-center justify-center w-full rounded-lg p-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-all hover:bg-neutral-800 group"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {
                                theme === 'dark' ? (
                                    <Sun className="h-5 w-5 stroke-2" />
                                ) : (
                                    <Moon className="h-5 w-5 stroke-2" />
                                )
                            }
                        </button>

                        {
                            status === "authenticated" && session && (
                                <div
                                    className="relative"
                                    onMouseEnter={handleNotificationsMouseEnter}
                                    onMouseLeave={handleNotificationsMouseLeave}
                                >
                                    <button className="relative flex items-center justify-center w-full rounded-lg p-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-all hover:bg-neutral-800 group">
                                        <Bell className="h-5 w-5 stroke-2" />
                                        {
                                            unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-semibold">
                                                    {unreadCount > 9 ? "9+" : unreadCount}
                                                </span>
                                            )
                                        }
                                    </button>

                                    {
                                        notificationsDropdownOpen && (
                                            <div
                                                className="absolute left-full ml-2 bottom-0 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50 w-80 max-h-96 overflow-hidden"
                                                onMouseEnter={handleNotificationsMouseEnter}
                                                onMouseLeave={handleNotificationsMouseLeave}
                                            >
                                                <div className="p-3 border-b border-neutral-800">
                                                    <h3 className="font-semibold text-white">Notifications</h3>
                                                </div>
                                                <div className="max-h-80 overflow-y-auto">
                                                    {
                                                        notifications.length === 0 ? (
                                                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                                                <BellOff className="h-12 w-12 text-neutral-600 mb-3" />
                                                                <p className="text-sm text-neutral-400">No notifications yet</p>
                                                            </div>
                                                        ) : (
                                                            <div className="p-2">
                                                                {
                                                                    notifications.map((notification) => (
                                                                        <button
                                                                            key={notification.id}
                                                                            onClick={() => handleNotificationClick(notification)}
                                                                            className={cn(
                                                                                "w-full text-left p-3 rounded-md transition-colors mb-2",
                                                                                !notification.read
                                                                                    ? "bg-blue-500/10 hover:bg-blue-500/20 border-l-2 border-l-blue-500"
                                                                                    : "hover:bg-neutral-800"
                                                                            )}
                                                                        >
                                                                            <div className="flex flex-col gap-1">
                                                                                <div className="flex items-center gap-2">
                                                                                    <p className="font-medium text-sm text-white">{notification.title}</p>
                                                                                    {
                                                                                        !notification.read && (
                                                                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                                                        )
                                                                                    }
                                                                                </div>
                                                                                {
                                                                                    notification.description && (
                                                                                        <p className="text-xs text-neutral-400 line-clamp-2">
                                                                                            {notification.description}
                                                                                        </p>
                                                                                    )
                                                                                }
                                                                                <p className="text-xs text-neutral-500">
                                                                                    {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                                                                                </p>
                                                                            </div>
                                                                        </button>
                                                                    ))
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div className="p-2 border-t border-neutral-800">
                                                    <button
                                                        onClick={() => handleLinkClick('notifications')}
                                                        className="w-full text-center py-2 text-sm text-blue-400 hover:text-blue-300 font-medium"
                                                    >
                                                        View All Notifications
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }

                        {
                            status === "authenticated" && session ? (
                                <div
                                    className="relative"
                                    onMouseEnter={handleProfileMouseEnter}
                                    onMouseLeave={handleProfileMouseLeave}
                                >
                                    <button className="flex items-center justify-center w-full rounded-lg p-2 text-sm font-medium text-neutral-300 hover:text-white transition-all hover:bg-neutral-800 group">
                                        {
                                            session?.user?.image ? (
                                                <Image
                                                    className="h-7 w-7 rounded-full"
                                                    src={session.user.image}
                                                    alt={`Profile picture of ${session.user.name || 'user'}`}
                                                    width={28}
                                                    height={28}
                                                />
                                            ) : (
                                                <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center">
                                                    <span className="text-black text-xs font-semibold">
                                                        {session?.user?.name?.[0] || 'U'}
                                                    </span>
                                                </div>
                                            )
                                        }
                                    </button>

                                    {
                                        profileDropdownOpen && (
                                            <div
                                                className="absolute left-full ml-2 bottom-0 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50 w-64 overflow-hidden"
                                                onMouseEnter={handleProfileMouseEnter}
                                                onMouseLeave={handleProfileMouseLeave}
                                            >
                                                <div className="p-4 border-b border-neutral-800">
                                                    <div className="flex items-center gap-3">
                                                        {
                                                            session?.user?.image ? (
                                                                <Image
                                                                    className="h-12 w-12 rounded-full"
                                                                    src={session.user.image}
                                                                    alt={`Profile picture of ${session.user.name || 'user'}`}
                                                                    width={48}
                                                                    height={48}
                                                                />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                                                                    <span className="text-black text-lg font-semibold">
                                                                        {session?.user?.name?.[0] || 'U'}
                                                                    </span>
                                                                </div>
                                                            )
                                                        }
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-sm text-white truncate">
                                                                {session?.user?.name || 'User'}
                                                            </h3>
                                                            <p className="text-xs text-neutral-400 truncate">
                                                                {session?.user?.email || 'user@example.com'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-2">
                                                    <button
                                                        onClick={() => handleLinkClick('profile')}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
                                                    >
                                                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                                            <User className="w-4 h-4 text-blue-400" />
                                                        </div>
                                                        <span className="font-medium">Profile</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleLinkClick('permissions')}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
                                                    >
                                                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                                            <Shield className="w-4 h-4 text-blue-400" />
                                                        </div>
                                                        <span className="font-medium">Permissions</span>
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            await signOut({ callbackUrl: "/" });
                                                            setProfileDropdownOpen(false);
                                                            toast.success("Logged out successfully");
                                                        }}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                                                    >
                                                        <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                                                            <LogOut className="w-4 h-4 text-red-400" />
                                                        </div>
                                                        <span className="font-medium">Sign Out</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            ) : (
                                <button
                                    onClick={() => router.push('/signin')}
                                    className="flex items-center justify-center w-full rounded-lg p-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-all hover:bg-neutral-800 group"
                                    title="Sign In"
                                >
                                    <User className="h-5 w-5 stroke-2" />
                                </button>
                            )
                        }
                    </div>
                </div>

                <CreateProjectSheet
                    open={createProjectOpen}
                    onOpenChange={setCreateProjectOpen}
                />
                <ReferralSheet
                    open={referralOpen}
                    onOpenChange={setReferralOpen}
                />
            </div>
        </TooltipProvider>
    );
}