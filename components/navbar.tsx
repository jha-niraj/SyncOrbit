'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
    Menu, X, Moon, Sun, ArrowRight, User, LayoutDashboard, LogOut,
    Boxes
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useSession, signOut } from 'next-auth/react'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'WorkFlow', href: '#workflow' },
    { name: 'Protocol', href: '#howitworks' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '/aboutus' },
]

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuState, setMenuState] = useState(false);
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLinkClick = (href: string, e?: React.MouseEvent) => {
        setMenuState(false);
        if (href.startsWith('#')) {
            e?.preventDefault();
            if (pathname !== '/') {
                router.push(`/${href}`);
                return;
            }
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50">
            <nav
                className={cn(
                    'w-full transition-all duration-300 border-b',
                    isScrolled
                        ? 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-neutral-200 dark:border-neutral-800 py-3'
                        : 'bg-transparent border-transparent py-5'
                )}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group" aria-label="home">
                            <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-md flex items-center justify-center border border-neutral-800 dark:border-neutral-200">
                                <Boxes className="w-4 h-4 text-white dark:text-black" />
                            </div>
                            <span className="font-bold text-lg tracking-tighter text-neutral-900 dark:text-white">
                                SyncOrbit
                            </span>
                        </Link>
                        <div className="hidden lg:flex items-center gap-8">
                            <ul className="flex gap-6">
                                {
                                    menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                onClick={(e) => handleLinkClick(item.href, e)}
                                                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"
                                            >
                                                <span className="text-[10px] font-mono opacity-50">0{index + 1}</span>
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="hidden lg:flex items-center gap-4">
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                            >
                                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>

                            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
                            {
                                !session ? (
                                    <>
                                        <Link href="/signin" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">
                                            Login
                                        </Link>
                                        <Link href="/signup">
                                            <Button size="sm" className="bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-md font-bold text-xs uppercase tracking-wider">
                                                Initialize <ArrowRight className="ml-1 h-3 w-3" />
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-neutral-200 dark:border-neutral-800">
                                                <User className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800" align="end">
                                            <div className="flex items-center justify-start gap-2 p-2">
                                                <div className="flex flex-col space-y-1 leading-none">
                                                    {session.user?.name && <p className="font-medium">{session.user.name}</p>}
                                                    {session.user?.email && <p className="w-[200px] truncate text-xs text-neutral-500">{session.user.email}</p>}
                                                </div>
                                            </div>
                                            <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-800" />
                                            <DropdownMenuItem asChild className="focus:bg-neutral-100 dark:focus:bg-neutral-900">
                                                <Link href="/dashboard" className="cursor-pointer">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer">
                                                <LogOut className="mr-2 h-4 w-4" /> Disconnect
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )
                            }
                        </div>
                        <button
                            onClick={() => setMenuState(!menuState)}
                            className="lg:hidden p-2 text-neutral-900 dark:text-white"
                        >
                            {menuState ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
                {
                    menuState && (
                        <div className="absolute top-full left-0 w-full h-[calc(100vh-60px)] bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 p-6 flex flex-col animate-in slide-in-from-top-5 duration-200">
                            <ul className="flex flex-col gap-6 text-lg">
                                {
                                    menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                onClick={(e) => handleLinkClick(item.href, e)}
                                                className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white block font-medium"
                                            >
                                                <span className="text-xs font-mono text-neutral-400 mr-2">0{index + 1}</span>
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                            <div className="mt-auto border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-4">
                                {
                                    !session ? (
                                        <>
                                            <Link href="/signin" className="block w-full">
                                                <Button variant="outline" className="w-full justify-center border-neutral-200 dark:border-neutral-800">
                                                    Login
                                                </Button>
                                            </Link>
                                            <Link href="/signup" className="block w-full">
                                                <Button className="w-full justify-center bg-neutral-900 dark:bg-white text-white dark:text-black">
                                                    Get Started
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <Button onClick={() => signOut()} variant="destructive" className="w-full">
                                            Sign Out
                                        </Button>
                                    )
                                }
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="flex items-center gap-2 text-neutral-500 w-full justify-center py-2"
                                >
                                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>
                            </div>
                        </div>
                    )
                }
            </nav>
        </header>
    )
}

export default Navbar;