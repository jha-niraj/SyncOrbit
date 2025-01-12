"use client";

import { Button } from "../ui/button";
import Link from "next/link";
// import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "../ui/sheet";
import Image from "next/image";
import mainLogo from "@/components/_images/nexuslogo.png";
import { Menu } from "lucide-react";

export default function Navbar() {
    const [sheetOpen, setSheetOpen] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 text-white transition-all duration-300 ${scrolled
            ? 'bg-black/30 backdrop-blur-md'
            : 'bg-transparent'
            }`}>
            <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src={mainLogo}
                        alt="MainLogo"
                        height={40}
                        width={40}
                        className="rounded-sm"
                    />
                    <h1 className="text-xl font-semibold">Nexus</h1>
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="#whyus" className="text-sm hover:scale-110 transition-all duration-300">
                        WhyUs
                    </Link>
                    <Link href="#projects" className="text-sm hover:scale-110 transition-all duration-300">
                        Projects
                    </Link>
                    <Link href="#approach" className="text-sm hover:scale-110 transition-all duration-300">
                        Approach
                    </Link>
                    <Link href="#faqs" className="text-sm hover:scale-110 transition-all duration-300">
                        Faq&apos;s
                    </Link>
                    <Link href="#pricing" className="text-sm hover:scale-110 transition-all duration-300">
                        Pricing
                    </Link>
                    <Link href="#" className="text-sm hover:scale-110 transition-all duration-300">
                        Blog
                    </Link>
                </div>
                <div className="flex items-center justify-center space-x-4">
                    {/* <div className="flex items-center justify-center">
                        {
                            theme === "light" ? (
                                <Button onClick={() => setTheme("dark")} variant="outline" size="icon">
                                    <Sun className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`} />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            ) : (
                                <Button onClick={() => setTheme("light")} variant="outline" size="icon">
                                    <Moon className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`} />
                                </Button>
                            )
                        }
                    </div> */}
                    <Link href="https://cal.com/nexusofficial/15min" target="_blank">
                        <Button variant="outline" className="w-full hidden md:flex rounded-2xl px-4 py-4 text-md bg-white hover:bg-white text-black hover:shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] shadow-none hover:translate-y-1 transition-all duration-200">
                            Book a 15 min call
                        </Button>
                    </Link>
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
                        <Link href="project-section" className="text-lg hover:text-gray-600 transition-colors">
                            Projects
                        </Link>
                        <Link href="#" className="text-lg hover:text-gray-600 transition-colors">
                            About us
                        </Link>
                        <Link href="#" className="text-lg hover:text-gray-600 transition-colors">
                            Blog
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
        </nav>
    );
}