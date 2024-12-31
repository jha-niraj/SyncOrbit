import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import mainWebLogo from "@/components/_images/WhatsApp Image 2024-10-09 at 19.48.26.jpeg";
import { RainbowButton } from "../ui/rainbow-button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react";

export default function Navbar() {
    return (
        // <header className="max-w-7xl sticky top-0 z-50 w-full border-b bg-white">
        //     <div className="flex h-16 items-center justify-between">
        //         <Link href="/" className="flex gap-2 items-center justify-center">
        //             <Image
        //                 src={mainWebLogo}
        //                 alt="Main Web Logo"
        //                 height={40}
        //                 width={40}
        //                 className="rounded-full scale-120"
        //             />
        //             <h1 className="text-xl font-semibold">thecoder&apos;z</h1>
        //         </Link>
        //         <nav className="hidden md:flex items-center space-x-6">
        //             {/* <Link href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">
        //                 About Us
        //             </Link>
        //             <Link href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">
        //                 Our Work
        //             </Link>
        //             <Link href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">
        //                 Our Team
        //             </Link> */}
        //             <RainbowButton className="">
        //                 Book a call now
        //             </RainbowButton>
        //         </nav>
        //     </div>
        // </header>
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container flex h-16 items-center justify-between">
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

                <div className="hidden md:flex items-center space-x-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" className="flex items-center space-x-2 text-base">
                                <Menu className="h-5 w-5" />
                                <span>explore</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <nav className="flex flex-col gap-4">
                                <Link href="#" className="text-lg hover:text-gray-600 transition-colors">
                                    Explore Menu Item 1
                                </Link>
                                <Link href="#" className="text-lg hover:text-gray-600 transition-colors">
                                    Explore Menu Item 2
                                </Link>
                                <Link href="#" className="text-lg hover:text-gray-600 transition-colors">
                                    Explore Menu Item 3
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="#" className="text-sm hover:text-gray-600 transition-colors">
                        Home
                    </Link>
                    <Link href="#" className="text-sm hover:text-gray-600 transition-colors">
                        Projects
                    </Link>
                    <Link href="#" className="text-sm hover:text-gray-600 transition-colors">
                        About us
                    </Link>
                    <Link href="#" className="text-sm hover:text-gray-600 transition-colors">
                        Blog
                    </Link>
                    <RainbowButton className="rounded-full">
                        Book a call now
                    </RainbowButton>
                </nav>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
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
            </div>
        </header>
    )
}

