import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6 text-blue-600"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <span className="ml-2 text-xl font-bold">Sisyphus</span>
                    </div>
                </Link>
                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">
                        About Us
                    </Link>
                    <Link href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">
                        Our Work
                    </Link>
                    <Link href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">
                        Our Team
                    </Link>
                    <Button>Get Started</Button>
                </nav>
            </div>
        </header>
    )
}

