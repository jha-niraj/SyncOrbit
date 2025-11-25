'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { 
    Menu, X, Moon, Sun, ArrowRight, User, LayoutDashboard, LogOut 
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from './ui/dropdown-menu'


const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'WorkFlow', href: '#workflow' },
    { name: 'How It Works', href: '#howitworks' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'AboutUs', href: '#about' },
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
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLinkClick = (href: string, e?: React.MouseEvent) => {
        if (href.startsWith('#')) {
            e?.preventDefault();
            setMenuState(false);

            // If we're not on the homepage, navigate to homepage first
            if (pathname !== '/') {
                router.push(`/${href}`);
                return;
            }

            // If we're on homepage, scroll to the section
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-50 w-full px-2 group">
                <div className={cn(
                    'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
                    isScrolled && 'bg-background/80 max-w-4xl rounded-2xl backdrop-blur-lg lg:px-5'
                )}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Image
                                    src="/syncorbit.png"
                                    alt="SyncOrbit Main Logo"
                                    height={30}
                                    width={30}
                                />
                                <h1>SyncOrbit</h1>
                            </Link>
                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>
                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {
                                    menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                onClick={(e) => handleLinkClick(item.href, e)}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {
                                        menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    onClick={(e) => handleLinkClick(item.href, e)}
                                                    className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))
                                    }
                                </ul>
                                <div className="mt-6 pt-6 border-t border-border/20">
                                    <button
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                        className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground duration-150"
                                    >
                                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:items-center">
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg border border-border/50 hover:border-border transition-colors"
                                >
                                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                </button>
                                {!session ? (
                                    <>
                                        <Button
                                            asChild
                                            size="sm"
                                            className={cn(isScrolled && 'lg:hidden')}>
                                            <Link href="/signin">
                                                <span>Sign In</span>
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                            <Link href="/signup">
                                                <span>Get Started</span>
                                                <ArrowRight className="ml-1 h-3 w-3" />
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                                <User className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end" forceMount>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="flex items-center">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    <span>Dashboard</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/profile" className="flex items-center">
                                                    <User className="mr-2 h-4 w-4" />
                                                    <span>Profile</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => signOut()}
                                                className="flex items-center text-red-600 focus:text-red-600"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Logout</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar;