"use client"

import { useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Moon, Sun, Home, User, LogOut, Shield, LogIn } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "./ui/dropdown-menu"
import { motion } from "framer-motion"
import { signOut, useSession } from "next-auth/react"
import { toast } from "sonner"
import Link from "next/link"
import { Badge } from "./ui/badge"

const MainNavbar = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const { data: session } = useSession();
    const { theme, setTheme } = useTheme()
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

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
            className={`fixed top-0 right-0 bg-white dark:bg-black backdrop-blur-2xl border-b border-border transition-all duration-300 z-10 ${scrolled ? "shadow-sm bg-background/95" : ""} ${isCollapsed ? "left-0 sm:left-[60px]" : "left-0 sm:left-[240px]"} left-0`}
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
                                    <Badge variant="secondary" className="hidden sm:flex bg-teal-500/10 text-teal-600 border-teal-500/20">
                                        <Shield className="h-3 w-3 mr-1" />
                                        {session.user.role}
                                    </Badge>
                                )
                            }
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden md:flex items-center bg-muted/50 rounded-xl p-1 border border-border/50">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-7 w-7 p-0 rounded-lg transition-all cursor-pointer ${theme === "light" ? "bg-background shadow-sm" : "hover:bg-muted"}`}
                                onClick={() => setTheme("light")}
                            >
                                <Sun className="h-3 w-3 text-amber-500" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-7 w-7 p-0 rounded-lg transition-all cursor-pointer ${theme === "dark" ? "bg-background shadow-sm" : "hover:bg-muted"}`}
                                onClick={() => setTheme("dark")}
                            >
                                <Moon className="h-3 w-3 text-indigo-500" />
                            </Button>
                        </div>
                        {
                            session?.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                                            <Avatar className="h-8 w-8 border-2 border-border/50">
                                                <AvatarImage src={session?.user?.image || "/placeholder.svg"} alt={session?.user?.name || "User"} />
                                                <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold">
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
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Shield className="w-3 h-3 text-teal-500" />
                                                    <span className="text-xs text-teal-600 font-medium">{session.user.role}</span>
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
                                        <DropdownMenuSeparator className="md:hidden" />
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400" onClick={handleSignOut}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Sign Out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/signin">
                                    <Button
                                        className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
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