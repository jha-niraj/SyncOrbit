"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, User, LogOut, Bell, Sun, Moon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSidebar, canUserSwitchMode, UserRole } from "./sidebarcontext";
import { NavMenu } from "./rendersidebarlinks";
import { ModeSwitcher } from "./modeswitcher";
import { getNavigationItems } from "./navigationconfig";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import Image from "next/image";

const NewSidebar = () => {
    const { isCollapsed, setIsCollapsed, mode, setCanSwitchMode } = useSidebar();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const profileTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { data: session, status } = useSession();
    const { theme, setTheme } = useTheme();

    // Determine user role and set canSwitchMode
    useEffect(() => {
        if (session?.user?.role) {
            const userRole = session.user.role as UserRole;
            setCanSwitchMode(canUserSwitchMode(userRole));
        } else {
            setCanSwitchMode(false);
        }
    }, [session, setCanSwitchMode]);

    // Get navigation items based on user role and current mode
    const userRole = session?.user?.role as UserRole | undefined;
    const navigationItems = getNavigationItems(userRole, mode);

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

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const handleSignOut = async () => {
        await signOut();
        setProfileDropdownOpen(false);
        toast.success("Logged out successfully");
    };

    return (
        <TooltipProvider>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed top-6 left-6 z-50 lg:hidden bg-card border border-border text-foreground p-2 rounded-lg hover:bg-secondary transition-all shadow-lg"
                aria-label="Toggle sidebar"
            >
                {!isMobileOpen && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-screen bg-card border-r border-border flex flex-col z-40 transition-all duration-300",
                    "hidden lg:flex",
                    isCollapsed ? "lg:w-[90px]" : "lg:w-64",
                    "lg:translate-x-0",
                    isMobileOpen ? "flex translate-x-0 w-64" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className={cn("p-6 flex items-center relative", isCollapsed ? "justify-center" : "gap-3")}>
                    {isMobileOpen && (
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="absolute top-4 right-4 lg:hidden p-1 rounded-lg hover:bg-secondary"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    
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

                        {!isCollapsed && (
                            <div className="flex-1 text-left min-w-0">
                                <h1 className="font-semibold text-black dark:text-white truncate">SyncOrbit</h1>
                                <p className="text-xs text-gray-800 dark:text-gray-200 truncate">
                                    {mode === 'internal' ? 'Internal Operations' : 'Client Services'}
                                </p>
                            </div>
                        )}
                    </Link>
                    
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:block absolute top-6 -right-3 bg-card border border-border rounded-full p-1 hover:bg-secondary transition-colors z-50"
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                {/* Mode Switcher */}
                <ModeSwitcher />

                {/* Navigation */}
                <nav className="flex-1 px-4 overflow-y-auto">
                    <div className="space-y-1">
                        <NavMenu items={navigationItems} isCollapsed={isCollapsed} />
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border space-y-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={cn(
                            "flex items-center w-full rounded-lg p-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:bg-muted group",
                            isCollapsed && "justify-center"
                        )}
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        {!isCollapsed && <span className="ml-3">Theme</span>}
                    </button>

                    {/* Profile */}
                    {status === "authenticated" && session ? (
                        <div
                            className="relative"
                            onMouseEnter={handleProfileMouseEnter}
                            onMouseLeave={handleProfileMouseLeave}
                        >
                            <button className={cn("flex cursor-pointer items-center gap-3 w-full rounded-lg hover:bg-secondary p-2 transition-colors", isCollapsed && "justify-center")}>
                                <div className="flex flex-1 gap-2">
                                    {session?.user?.image ? (
                                        <Image
                                            className="h-10 w-10 rounded-full"
                                            src={session.user.image}
                                            alt={`Profile picture of ${session.user.name || 'user'}`}
                                            width={40}
                                            height={40}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                            <span className="text-primary-foreground text-sm font-semibold">
                                                {session?.user?.name?.[0] || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    {!isCollapsed && (
                                        <div className="flex-1 text-left hidden lg:block min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{session?.user?.name || 'User'}</p>
                                            <p className="text-xs text-muted-foreground truncate">{session?.user?.email || 'user@example.com'}</p>
                                        </div>
                                    )}
                                </div>
                                {!isCollapsed && (
                                    <div className="flex-shrink-0">
                                        <ChevronRight className="flex flex-shrink-0 items-center justify-end" />
                                    </div>
                                )}
                            </button>
                            {profileDropdownOpen && (
                                <div
                                    className="absolute left-full ml-2 bottom-0 bg-card border border-border rounded-lg shadow-xl z-50 w-64 overflow-hidden"
                                    onMouseEnter={handleProfileMouseEnter}
                                    onMouseLeave={handleProfileMouseLeave}
                                >
                                    <div className="p-4">
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
                                                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                                                    <span className="text-primary-foreground text-lg font-semibold">
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
                                    </div>
                                    <div className="border-t border-border">
                                        <button
                                            onClick={() => router.push('/profile')}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <User className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="font-medium">Profile</span>
                                        </button>
                                    </div>
                                    <div className="border-t border-border">
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-destructive"
                                        >
                                            <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                                                <LogOut className="w-4 h-4 text-destructive" />
                                            </div>
                                            <span className="font-medium">Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => router.push('/signin')}
                            className={cn(
                                "flex items-center w-full rounded-lg p-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all hover:bg-muted group",
                                isCollapsed && "justify-center"
                            )}
                            title="Sign In"
                        >
                            <User className="h-5 w-5" />
                            {!isCollapsed && <span className="ml-3">Sign In</span>}
                        </button>
                    )}
                </div>
            </aside>
        </TooltipProvider>
    );
};

export default NewSidebar;
