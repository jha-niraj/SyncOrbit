import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Code } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TheCoderzPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-4 lg:px-6 h-14 flex items-center">
                <Link className="flex items-center justify-center" href="/">
                    <Code className="h-6 w-6" />
                    <span className="sr-only">ShunyaTech</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
                        Home
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
                        Features
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
                        Pricing
                    </Link>
                </nav>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        The Coder&apos;z: Learn to Code, Build the Future
                                    </h1>
                                    <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                                        An interactive learning platform designed to help aspiring developers master coding skills through
                                        hands-on projects and expert mentorship.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Button asChild size="lg">
                                        <Link href="#get-started">Get Started</Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg">
                                        <Link href="#learn-more">Learn More</Link>
                                    </Button>
                                </div>
                            </div>
                            <Image
                                alt="The Coder'z Platform"
                                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                                height="550"
                                src="/placeholder.svg"
                                width="550"
                            />
                        </div>
                    </div>
                </section>
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-12 text-center">Key Features</h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center text-center">
                                <Code className="h-12 w-12 mb-4 text-primary" />
                                <h3 className="text-xl font-bold mb-2">Interactive Coding Lessons</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Learn by doing with our hands-on, interactive coding exercises.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <CheckCircle className="h-12 w-12 mb-4 text-primary" />
                                <h3 className="text-xl font-bold mb-2">Project-Based Learning</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Build real-world projects to apply your skills and grow your portfolio.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <ArrowRight className="h-12 w-12 mb-4 text-primary" />
                                <h3 className="text-xl font-bold mb-2">Expert Mentorship</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Get guidance and support from experienced developers throughout your learning journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-12 text-center">Pricing Plans</h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col p-6 bg-white dark:bg-gray-850 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold mb-4">Basic</h3>
                                <p className="text-4xl font-bold mb-6">
                                    $19<span className="text-base font-normal">/month</span>
                                </p>
                                <ul className="mb-6 space-y-2">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                        Access to all basic courses
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                        Community forum access
                                    </li>
                                </ul>
                                <Button className="mt-auto">Choose Plan</Button>
                            </div>
                            <div className="flex flex-col p-6 bg-white dark:bg-gray-850 rounded-lg shadow-lg border-2 border-primary">
                                <h3 className="text-2xl font-bold mb-4">Pro</h3>
                                <p className="text-4xl font-bold mb-6">
                                    $39<span className="text-base font-normal">/month</span>
                                </p>
                                <ul className="mb-6 space-y-2">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                        Access to all pro courses
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                        1-on-1 mentorship sessions
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                        Certification upon completion
                                    </li>
                                </ul>
                                <Button className="mt-auto">Choose Plan</Button>
                            </div>
                            <div className="flex flex-col p-6 bg-white dark:bg-gray-850 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                                <p className="text-4xl font-bold mb-6">Custom</p>
                                <ul className="mb-6 space-y-2">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                        Custom curriculum
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                        Dedicated support team
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                        Advanced analytics
                                    </li>
                                </ul>
                                <Button className="mt-auto">Contact Sales</Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 ShunyaTech. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    )
}

