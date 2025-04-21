"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "../ui/sheet";
import Image from "next/image";
import { ArrowRight, FileText, LogOut, Menu, Moon, Route, Sun, User } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface ResourceItem {
    icon: React.ElementType
    title: string
    description: string
    href: string
}
const tools: ResourceItem[] = [
    {
        icon: FileText,
        title: "Budget Estimator",
        description: "Estimate budget of your products",
        href: "/budgetestimator"
    },
    {
        icon: Route,
        title: "NexInvoice",
        description: "NextGen Invoice",
        href: "/nexinvoice"
    }
]
const resources: ResourceItem[] = [
    {
        icon: FileText,
        title: "Products",
        description: "Our own products",
        href: "/products"
    },
    {
        icon: Route,
        title: "Client Projects",
        description: "Projects that we built for clients",
        href: "/clientprojects"
    }
]
export default function Navbar() {
    const { data: session, status } = useSession();
    const { theme, setTheme } = useTheme();
    const [sheetOpen, setSheetOpen] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownActive, setDropdownActive] = useState<boolean>(false);
    const [toolsDropdownActive, setToolsDropdownActive] = useState<boolean>(false);
    const [userDropdownActive, setUserDropdownActive] = useState<boolean>(false);

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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }
    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    }

    const handleLinkClick = () => {
        setSheetOpen(false);
    };

    const handleLogout = () => {
        toast("Logging out...")
        setSheetOpen(false);
        signOut();
    };

    return (
        <nav className={`fixed top-0 w-full pl-3 pr-3 z-50 transition-all duration-300 ${scrolled
            ? 'bg-black/20 backdrop-blur-md text-black dark:text-white'
            : 'bg-transparent text-black dark:text-white'
            }`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/shunyatech.png"
                        alt="MainLogo"
                        height={60}
                        width={60}
                        className="rounded-sm"
                    />
                    <h1 className="text-xl font-semibold">Shunya Tech</h1>
                </Link>
                <div className="hidden lg:flex items-center space-x-8">
                    <div
                        className="relative"
                        onMouseEnter={() => setDropdownActive(true)}
                        onMouseLeave={() => setDropdownActive(false)}
                    >
                        <button
                            className="flex items-center justify-center gap-3 rounded-md text-md font-medium transition duration-200"
                        >
                            Products
                        </button>
                        {
                            dropdownActive && (
                                <motion.div
                                    onMouseEnter={() => setDropdownActive(true)}
                                    onMouseLeave={() => setDropdownActive(false)}
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="absolute top-full left-0 w-[420px] min-w-max z-50 shadow-lg rounded-lg z-100"
                                >
                                    <div className="absolute top-full left-0 w-full max-w-md pt-2 space-y-1 z-50">
                                        {
                                            resources.map((resource, index) => (
                                                <motion.div
                                                    key={index}
                                                    variants={item}
                                                    className="w-full bg-black dark:bg-white rounded-2xl"
                                                    onClick={() => setDropdownActive(false)}
                                                >
                                                    <Link
                                                        href={resource.href}
                                                        target={`${resource.title === "Sessions" || resource.title === "VicharSpace" ? "_blank" : ""}`}
                                                        className="group relative overflow-hidden cursor-pointer border-none shadow-sm transition-all hover:shadow-md h-full"
                                                    >
                                                        <Card className="flex text-black dark:text-white flex-row items-center justify-center gap-4 p-4 h-full">
                                                            <div className="rounded-lg">
                                                                <resource.icon className="h-5 w-5" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold">
                                                                    {resource.title}
                                                                </h3>
                                                                <p className="text-xs">
                                                                    {resource.description}
                                                                </p>
                                                            </div>
                                                            <ArrowRight className="h-5 w-5 transform opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                                                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                                        </Card>
                                                    </Link>
                                                </motion.div>
                                            ))
                                        }
                                    </div>
                                </motion.div>
                            )
                        }
                    </div>
                    <div
                        className="relative"
                        onMouseEnter={() => setToolsDropdownActive(true)}
                        onMouseLeave={() => setToolsDropdownActive(false)}
                    >
                        <button
                            className="flex items-center justify-center gap-3 rounded-md text-md font-medium transition duration-200"
                        >
                            Tools
                        </button>
                        {
                            toolsDropdownActive && (
                                <motion.div
                                    onMouseEnter={() => setToolsDropdownActive(true)}
                                    onMouseLeave={() => setToolsDropdownActive(false)}
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="absolute top-full left-0 w-[420px] min-w-max z-50 shadow-lg rounded-lg z-100"
                                >
                                    <div className="absolute top-full left-0 w-full max-w-md pt-2 space-y-1 z-50">
                                        {
                                            tools.map((tool, index) => (
                                                <motion.div
                                                    key={index}
                                                    variants={item}
                                                    className="w-full bg-black dark:bg-white rounded-2xl"
                                                    onClick={() => setToolsDropdownActive(false)}
                                                >
                                                    <Link
                                                        href={tool.href}
                                                        target={`${tool.title === "Sessions" || tool.title === "VicharSpace" ? "_blank" : ""}`}
                                                        className="group relative overflow-hidden cursor-pointer border-none shadow-sm transition-all hover:shadow-md h-full"
                                                    >
                                                        <Card className="flex text-black dark:text-white flex-row items-center justify-center gap-4 p-4 h-full">
                                                            <div className="rounded-lg">
                                                                <tool.icon className="h-5 w-5" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold">
                                                                    {tool.title}
                                                                </h3>
                                                                <p className="text-xs">
                                                                    {tool.description}
                                                                </p>
                                                            </div>
                                                            <ArrowRight className="h-5 w-5 transform opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                                                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                                        </Card>
                                                    </Link>
                                                </motion.div>
                                            ))
                                        }
                                    </div>
                                </motion.div>
                            )
                        }
                    </div>
                    <Link href="#whyus" className="text-md font-medium hover:scale-110 transition-all duration-300">
                        WhyUs
                    </Link>
                    <Link href="#approach" className="text-md font-medium hover:scale-110 transition-all duration-300">
                        Approach
                    </Link>
                    <Link href="#faqs" className="text-md font-medium hover:scale-110 transition-all duration-300">
                        Faq&apos;s
                    </Link>
                    <Link href="#pricingsection" className="text-md font-medium hover:scale-110 transition-all duration-300">
                        Pricing
                    </Link>
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        variant="outline"
                        size="icon"
                    >
                        <Sun className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all ${theme === "dark" ? "hidden" : "block"}`} />
                        <Moon className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all ${theme === "dark" ? "block" : "hidden"}`} />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <Link href="https://cal.com/shunyatech/15min" target="_blank">
                        <Button variant="outline" className="w-full hidden md:flex rounded-lg px-4 py-4 text-md text-black dark:text-white transition-all duration-200">
                            Book a 15 min call
                        </Button>
                    </Link>
                    {
                        status === "unauthenticated" ? (
                            <Link href="/signin" className="inline-flex -space-x-px divide-x divide-primary-foreground/30 rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse">
                                <Button className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10">
                                    Sign in
                                </Button>
                            </Link>
                        ) : (
                            <div className="relative hidden md:block">
                                <div
                                    className="relative cursor-pointer"
                                    onMouseEnter={() => setUserDropdownActive(true)}
                                    onMouseLeave={() => setUserDropdownActive(false)}
                                >
                                    {
                                        session?.user?.image && session?.user?.image ?
                                            <Image
                                                src={session?.user?.image}
                                                alt="User Image"
                                                className=""
                                                height={30}
                                                width={30}
                                            />
                                            :
                                            <Button
                                                variant="outline"
                                                className="rounded-full w-10 h-10 p-0 bg-primary/10 text-black hover:text-white border-2 border-white"
                                            >
                                                <User className="h-5 w-5 text-black dark:text-white" />
                                                <span className="sr-only">User menu</span>
                                            </Button>
                                    }
                                    {
                                        userDropdownActive && (
                                            <motion.div
                                                variants={container}
                                                initial="hidden"
                                                animate="show"
                                                className="absolute top-full right-0 w-32 z-50 shadow-lg rounded-lg overflow-hidden"
                                            >
                                                <div className="bg-black dark:bg-white rounded-lg py-1">
                                                    <motion.div variants={item}>
                                                        <Link
                                                            href="/profile"
                                                            className="block px-4 py-2 text-sm text-white dark:text-black hover:bg-white/10 dark:hover:bg-black/10"
                                                            onClick={() => setUserDropdownActive(false)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4" />
                                                                Profile
                                                            </div>
                                                        </Link>
                                                    </motion.div>
                                                    <motion.div variants={item}>
                                                        <button
                                                            onClick={() => signOut()}
                                                            className="block w-full text-left px-4 py-2 text-sm text-white dark:text-black hover:bg-white/10 dark:hover:bg-black/10"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <LogOut className="h-4 w-4" />
                                                                Sign out
                                                            </div>
                                                        </button>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                    <Button onClick={() => setSheetOpen(true)} variant="ghost" className="md:hidden">
                        <Menu size={40} />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent>
                    <nav className="flex flex-col gap-6">
                        {
                            status === "authenticated" && (
                                <div className="mb-4 pb-4 border-b">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-primary/10 rounded-full p-2">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-medium">User Account</p>
                                            <p className="text-sm text-gray-500">user@example.com</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="flex-1"
                                            onClick={handleLinkClick}
                                        >
                                            <Link href="/profile">
                                                <User className="h-4 w-4 mr-2" />
                                                Profile
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 text-red-500 hover:text-red-600"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sign out
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                        <Link href="/" className="text-xl font-semibold hover:text-gray-600 transition-colors" onClick={handleLinkClick}>
                            Home
                        </Link>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="products">
                                <AccordionTrigger>Products</AccordionTrigger>
                                <AccordionContent>
                                    {
                                        resources.map((resource, index) => (
                                            <Link key={index} href={resource.href} className="block py-2 text-md hover:text-gray-600 transition-colors" onClick={handleLinkClick}>
                                                {resource.title}
                                            </Link>
                                        ))
                                    }
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="tools">
                                <AccordionTrigger>Tools</AccordionTrigger>
                                <AccordionContent>
                                    {
                                        tools.map((tool, index) => (
                                            <Link key={index} href={tool.href} className="block py-2 text-md hover:text-gray-600 transition-colors" onClick={handleLinkClick}>
                                                {tool.title}
                                            </Link>
                                        ))
                                    }
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <Link href="#whyus" className="text-xl hover:text-gray-600 transition-colors" onClick={handleLinkClick}>
                            Why Us
                        </Link>
                        <Link href="#approach" className="text-xl hover:text-gray-600 transition-colors" onClick={handleLinkClick}>
                            Approach
                        </Link>
                        <Link href="#faqs" className="text-xl hover:text-gray-600 transition-colors" onClick={handleLinkClick}>
                            FAQ&apos;s
                        </Link>
                        <Link href="#pricingsection" className="text-xl hover:text-gray-600 transition-colors" onClick={handleLinkClick}>
                            Pricing
                        </Link>
                        <Link href="#" className="text-xl hover:text-gray-600 transition-colors" onClick={handleLinkClick}>
                            Blog
                        </Link>
                        <div className="space-y-4 mt-4">
                            {
                                status === "unauthenticated" && (
                                    <Button
                                        asChild
                                        variant="default"
                                        className="w-full"
                                        onClick={handleLinkClick}
                                    >
                                        <Link href="/signin">
                                            Sign in
                                        </Link>
                                    </Button>
                                )
                            }
                            <Button asChild variant="default" className="w-full" onClick={handleLinkClick}>
                                <Link href="https://cal.com/shunyatech/15min" target="_blank">
                                    Book a 15 min call
                                </Link>
                            </Button>
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>
        </nav>
    );
}