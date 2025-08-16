'use client'

import Link from 'next/link'
import { Equal, Moon, Sun, LogOut } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/liquid-glass-button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useSession, signOut } from 'next-auth/react'

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
]

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const { data: session, status } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    const handleLinkClick = (href: string) => {
        if (href.startsWith('#')) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const renderAuthButtons = () => {
        if (status === 'loading') {
            return (
                <div className="hidden lg:flex items-center gap-4">
                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
            );
        }

        if (session?.user) {
            return (
                <div className="hidden lg:flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                                        {session.user.name?.split(" ").map((n: string) => n[0]).join("") || session.user.email?.[0].toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <div className="flex items-center justify-start gap-2 p-2">
                                <div className="flex flex-col space-y-1 leading-none">
                                    {session.user.name && <p className="font-medium">{session.user.name}</p>}
                                    {session.user.email && (
                                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/projects">Projects</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        }

        return (
            <div className="hidden lg:flex items-center gap-4">
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className={cn(isScrolled && 'lg:hidden', 'rounded-xl border-2 hover:scale-105 transition-all duration-300')}>  
                    <Link href="/signin">
                        <span>Login</span>
                    </Link>
                </Button>
                <Button
                    asChild
                    size="sm"
                    className={cn(isScrolled && 'lg:hidden', 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300')}>
                    <Link href="/signup">
                        <span>Sign Up</span>
                    </Link>
                </Button>
                <Button
                    asChild
                    size="sm"
                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden', 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300')}>
                    <Link href="/signup">
                        <span>Get Started</span>
                    </Link>
                </Button>
            </div>
        );
    };

    const renderMobileAuthButtons = () => {
        if (session?.user) {
            return (
                <div className="flex flex-col gap-4 pt-4 border-t">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                {session.user.name?.split(" ").map((n: string) => n[0]).join("") || session.user.email?.[0].toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="font-medium text-sm">{session.user.name}</p>
                            <p className="text-xs text-muted-foreground">{session.user.email}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <SheetClose asChild>
                            <Button asChild variant="outline" size="sm" className="w-full justify-start rounded-xl hover:scale-105 transition-all duration-300">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        </SheetClose>
                        <SheetClose asChild>
                            <Button asChild variant="outline" size="sm" className="w-full justify-start rounded-xl hover:scale-105 transition-all duration-300">
                                <Link href="/profile">Profile</Link>
                            </Button>
                        </SheetClose>
                        <SheetClose asChild>
                            <Button asChild variant="outline" size="sm" className="w-full justify-start rounded-xl hover:scale-105 transition-all duration-300">
                                <Link href="/projects">Projects</Link>
                            </Button>
                        </SheetClose>
                        <Button 
                            onClick={handleSignOut} 
                            variant="outline" 
                            size="sm" 
                            className="w-full justify-start text-red-600 hover:text-red-700 rounded-xl hover:scale-105 transition-all duration-300"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex gap-4 pt-4 border-t">
                <SheetClose asChild>
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl border-2 hover:scale-105 transition-all duration-300"
                    >
                        <Link href="/signin">
                            Login
                        </Link>
                    </Button>
                </SheetClose>
                <SheetClose asChild>
                    <Button
                        asChild
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        <Link href="/signup">
                            Get Started
                        </Link>
                    </Button>
                </SheetClose>
            </div>
        );
    };

    return (
        <header>
            <nav className="fixed left-0 w-full z-20 px-2">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 lg:gap-0 py-2">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex gap-2 items-center"
                            >
                                <Image
                                    src="/shunyatech.png"
                                    alt="ProjectCentral"
                                    width={32}
                                    height={32}
                                    className='w-10 h-10 rounded-full scale-110 bg-black'
                                />
                                <p className='font-semibold text-xl tracking-tighter text-black dark:text-white'>ProjectCentral</p>
                            </Link>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="lg:hidden p-2"
                                    >
                                        <Equal className="size-6" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="top" className="w-full h-[50vh]">
                                    <SheetHeader>
                                        <SheetTitle className="text-left">Menu</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col space-y-6 mt-8">
                                        {
                                            menuItems.map((item, index) => (
                                                <SheetClose asChild key={index}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => handleLinkClick(item.href)}
                                                        className="text-lg font-medium text-muted-foreground hover:text-accent-foreground transition-colors"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </SheetClose>
                                            ))
                                        }
                                        <div className="flex items-center gap-2 pt-4 border-t">
                                            <span className="text-sm text-muted-foreground">Theme:</span>
                                            <div className="flex items-center bg-gradient-to-r from-slate-100/80 to-slate-200/80 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm rounded-2xl p-1.5 border border-slate-300/30 dark:border-slate-600/30 shadow-lg">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`h-8 w-8 p-0 rounded-xl transition-all cursor-pointer duration-300 hover:scale-110 ${theme === 'light' ? 'bg-gradient-to-br from-white to-amber-50 shadow-md border border-amber-200/50' : 'hover:bg-slate-600/50'}`}
                                                    onClick={() => setTheme('light')}
                                                >
                                                    <Sun className="h-4 w-4 text-amber-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`h-8 w-8 p-0 rounded-xl transition-all cursor-pointer duration-300 hover:scale-110 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-700 to-slate-800 shadow-md border border-blue-400/30' : 'hover:bg-slate-100/50'}`}
                                                    onClick={() => setTheme('dark')}
                                                >
                                                    <Moon className="h-4 w-4 text-blue-500" />
                                                </Button>
                                            </div>
                                        </div>
                                        {renderMobileAuthButtons()}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {
                                    menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                onClick={() => handleLinkClick(item.href)}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="flex items-center bg-gradient-to-r from-slate-100/80 to-slate-200/80 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm rounded-2xl p-1.5 border border-slate-300/30 dark:border-slate-600/30 shadow-lg">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 w-8 p-0 rounded-xl transition-all cursor-pointer duration-300 hover:scale-110 ${theme === 'light' ? 'bg-gradient-to-br from-white to-amber-50 shadow-md border border-amber-200/50' : 'hover:bg-slate-600/50'}`}
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun className="h-4 w-4 text-amber-500" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 w-8 p-0 rounded-xl transition-all cursor-pointer duration-300 hover:scale-110 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-700 to-slate-800 shadow-md border border-blue-400/30' : 'hover:bg-slate-100/50'}`}
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon className="h-4 w-4 text-blue-500" />
                                </Button>
                            </div>
                            {renderAuthButtons()}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

// Export as default to maintain compatibility
export default Header;
