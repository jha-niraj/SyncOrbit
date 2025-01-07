"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "../ui/sheet";
import Image from "next/image";
import mainWebLogo from "@/components/_images/WhatsApp Image 2024-10-09 at 19.48.26.jpeg";
import { Menu, Moon, Sun } from "lucide-react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [ sheetOpen, setSheetOpen ] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav
            className={`sticky top-0 z-10 transition-all duration-300 w-full mx-auto pl-4 pr-4 ${isScrolled
                ? "bg-black dark:bg-white/100 bg-opacity-100 dark:text-black text-white rounded-bl-2xl rounded-br-2xl backdrop-blur-3xl"
                : "bg-transparent border-b border-white/10 text-black dark:text-white"
                }`}
        >
            <div className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src={mainWebLogo}
                        alt="MainLogo"
                        height={40}
                        width={40}
                        className="rounded-sm"
                    />
                    <h1 className="text-xl font-semibold">thecoder&apos;z</h1>
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="#features" className="text-sm hover:scale-110 transition-all duration-300">
                        About Us
                    </Link>
                    <Link href="#pricing" className="text-sm hover:scale-110 transition-all duration-300">
                        Projects
                    </Link>
                    <Link href="#about" className="text-sm hover:scale-110 transition-all duration-300">
                        Blog
                    </Link>
                </div>
                <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center justify-center">
                        {
                            theme === "light" ? (
                                <Button onClick={() => setTheme("dark")} variant="outline" size="icon">
                                    <Sun className={`${isScrolled ? "text-black" : ""} h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`} />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            ) : (
                                <Button onClick={() => setTheme("light")} variant="outline" size="icon">
                                    <Moon className={`${isScrolled ? "dark:text-white" : ""} absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`} />
                                </Button>
                            )
                        }
                    </div>
                    <Button variant="outline" className="w-full hidden md:flex rounded-2xl px-4 py-4 text-md bg-white hover:bg-white text-black hover:shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] shadow-none hover:translate-y-1 transition-all duration-200">
                        Get Started
                    </Button>
                    <Button onClick={() => setSheetOpen(true)} variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>
            <Sheet open={sheetOpen} onOpenChange={() => setSheetOpen(false)}>
                <SheetContent>
                    <nav className="flex flex-col gap-4">
                        <Link href="#" className="text-lg hover:text-gray-600 transition-colors">
                            Home
                        </Link>
                        <Link href="#" className="text-lg hover:text-gray-600 transition-colors">
                            Projects
                        </Link>
                        <Link href="#" className="text-lg hover:text-gray-600 transition-colors">
                            About us
                        </Link>
                        <Link href="#" className="text-lg hover:text-gray-600 transition-colors">
                            Blog
                        </Link>
                        <Button variant="outline" className="rounded-full w-full">
                            Contact us
                        </Button>
                    </nav>
                </SheetContent>
            </Sheet>
        </nav>
    );
}