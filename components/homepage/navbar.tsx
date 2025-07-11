"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
    Menu, Briefcase, Code, Lightbulb, Users, Sun, Moon, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navigation = [
    { name: "Services", href: "/#services", icon: Code, isSection: true },
    { name: "Projects", href: "/projectsdelivered", icon: Briefcase, isSection: false },
    { name: "Approach", href: "/#approach", icon: Lightbulb, isSection: true },
    { name: "About Us", href: "/aboutus", icon: Users, isSection: false },
    { name: "Pricing", href: "/#pricing", icon: Rocket, isSection: true },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (href: string) => {
        if (href.startsWith("/#")) {
            return false;
        }
        return pathname === href;
    };

    const handleNavigation = (href: string, isSection: boolean) => {
        if (isSection) {
            if (pathname !== "/") {
                router.push(href);
            } else {
                const sectionId = href.split("#")[1];
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }
        } else {
            router.push(href);
        }

        setMobileMenuOpen(false);
    };

    return (
        <div className="w-full h-20 flex items-center justify-center fixed top-0 z-50 mt-1">
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn(
                    "w-[100%] w-full md:w-[96%] md:max-w-7xl mx-auto rounded-2xl transition-all duration-300 border border-teal-200/20 dark:border-teal-800/30",
                    scrolled
                        ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-xl shadow-teal-100/20 dark:shadow-teal-900/20"
                        : "bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg shadow-lg shadow-teal-50/30 dark:shadow-teal-900/30",
                )}
            >
                <nav className="px-6" aria-label="Global">
                    <div className="flex items-center justify-between h-16">
                        <motion.div className="flex lg:flex-1" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Link href="/" className="flex items-center group gap-2">
                                <Image
                                    src="/shunyatech.png"
                                    alt="ShunyaTech"
                                    width={32}
                                    height={32}
                                    className="bg-black rounded-full"
                                />
                                <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
                                    ShunyaTech
                                </span>
                            </Link>
                        </motion.div>
                        <div className="hidden lg:flex lg:gap-x-1 items-center">
                            {
                                navigation.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => handleNavigation(item.href, item.isSection)}
                                        className={cn(
                                            "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300",
                                            isActive(item.href)
                                                ? "text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 shadow-sm"
                                                : "text-teal-800 dark:text-teal-200 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50/50 dark:hover:bg-teal-950/30",
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                        {
                                            isActive(item.href) && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full"
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )
                                        }
                                    </button>
                                ))
                            }
                        </div>
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-2">
                            <div className="hidden md:flex items-center bg-stone-100/50 dark:bg-stone-800/50 rounded-xl p-1 border border-stone-200/50 dark:border-stone-700/50">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-7 w-7 p-0 rounded-lg transition-all cursor-pointer ${theme === 'light' ? 'bg-white shadow-sm' : 'hover:bg-stone-700'}`}
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun className="h-3 w-3 text-amber-500" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-7 w-7 p-0 rounded-lg transition-all cursor-pointer ${theme === 'dark' ? 'bg-stone-700 shadow-sm' : 'hover:bg-stone-100'}`}
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon className="h-3 w-3 text-blue-500" />
                                </Button>
                            </div>
                            {
                                status !== "authenticated" ? (
                                    <>
                                        <Link href="/signin">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30"
                                            >
                                                Sign In
                                            </Button>
                                        </Link>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Link href="/signup">
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                                                >
                                                    Get Started Free
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    </>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Link href="/dashboard">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30"
                                            >
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-teal-200 dark:hover:ring-teal-800 transition-all">
                                                    <AvatarImage src={session?.user?.image || undefined} />
                                                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                                                        {session?.user?.name?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                                                <Link href="/profile">
                                                    <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-500">Sign Out</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )
                            }
                        </div>
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" className="lg:hidden text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 rounded-xl">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80 p-0 bg-gradient-to-b from-teal-50 to-white dark:from-teal-950/50 dark:to-gray-950">
                                <SheetHeader className="p-6 border-b border-teal-100 dark:border-teal-900">
                                    <SheetTitle className="text-left text-teal-800 dark:text-teal-200">Navigation</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col h-full">
                                    <div className="flex-1 py-6">
                                        <div className="space-y-2 px-6">
                                            {
                                                navigation.map((item) => (
                                                    <button
                                                        key={item.name}
                                                        onClick={() => handleNavigation(item.href, item.isSection)}
                                                        className="flex items-center gap-3 px-4 py-3 text-base font-medium text-teal-800 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded-xl transition-colors w-full"
                                                    >
                                                        <item.icon className="h-5 w-5" />
                                                        {item.name}
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="border-t border-teal-100 dark:border-teal-900 p-6 space-y-4">
                                        {
                                            status !== "authenticated" ? (
                                                <>
                                                    <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                                                        <Button variant="outline" className="w-full rounded-xl border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300">
                                                            Sign In
                                                        </Button>
                                                    </Link>
                                                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                                        <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl">
                                                            Get Started Free
                                                        </Button>
                                                    </Link>
                                                </>
                                            ) : (
                                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                                    <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl">
                                                        Dashboard
                                                    </Button>
                                                </Link>
                                            )
                                        }
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </nav>
            </motion.header>
        </div>
    );
}