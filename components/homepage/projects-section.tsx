import { ArrowRight, CheckCircle } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import thecoderz from "@/components/_images/thecoderz.png";
import logistics from "@/components/_images/logistics.png";

export default function ProjectSection() {
    return (
        <section id="projects" className="py-12 bg-gradient-90deg-black-to-gray w-full">
            <section id="products" className="w-full py-12 md:py-24 relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2 max-w-3xl">
                            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                                Our Products
                            </div>
                            <h2 className="text-3xl text-white font-bold tracking-tighter md:text-4xl/tight">
                                Innovative Solutions We&apos;ve Built
                            </h2>
                            <p className="text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Beyond our client services, we create our own products that solve real-world problems.
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto grid max-w-6xl items-center gap-12 py-12 lg:grid-cols-2">
                        <Card className="relative overflow-hidden rounded-xl border bg-background shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent z-0"></div>
                            <div className="relative">
                                <Image
                                    src={thecoderz}
                                    width={600}
                                    height={300}
                                    alt="The Coder'z Platform"
                                    className="w-full aspect-[2/1] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                    <div className="p-6">
                                        <div className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs text-primary-foreground mb-2">
                                            E-Learning Platform
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-1">The Coder&apos;z</h3>
                                        <p className="text-white/80 text-sm">Interactive coding education for all skill levels</p>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6 pt-6 relative z-10">
                                <p className="text-muted-foreground mb-4">
                                    The Coder&apos;z is an interactive learning platform designed to help beginners and intermediate
                                    developers master coding skills through structured courses, hands-on projects, and mentorship.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Interactive Lessons</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Project-Based Learning</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Expert Mentorship</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Community Support</span>
                                    </div>
                                </div>
                                <div className="w-full flex gap-4">
                                    <Button asChild className="w-full group">
                                        <Link href="https://www.thecoderz.in.net/" target="_blank">
                                            Explore Platform
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full group">
                                        <Link href="/products/thecoderz">
                                            Case Study
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative overflow-hidden rounded-xl border bg-background shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent z-0"></div>
                            <div className="relative">
                                <Image
                                    src="/eventeye.png"
                                    width={600}
                                    height={300}
                                    alt="EventEye Platform"
                                    className="w-full aspect-[2/1] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                    <div className="p-6">
                                        <div className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs text-primary-foreground mb-2">
                                            Event Management Platform
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-1">EventEye</h3>
                                        <p className="text-white/80 text-sm">Streamlined event planning and management</p>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6 pt-6 relative z-10">
                                <p className="text-muted-foreground mb-4">
                                    EventEye simplifies event planning and management with features like registration, ticketing,
                                    and analytics, making it easier for organizers to create successful events.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Registration & Ticketing</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Attendee Management</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Event Analytics</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Marketing Tools</span>
                                    </div>
                                </div>
                                <div className="w-full flex gap-4">
                                    <Button asChild className="w-full group">
                                        <Link href="https://www.eventeye.in/" target="_blank">
                                            Explore Platform
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full group">
                                        <Link href="/eventeye">
                                            Case Study
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Link href="/products" className="w-fit mx-auto flex items-center rounded-lg px-4 py-2 text-md border-2 border-black bg-white hover:bg-white text-black hover:text-black shadow-[0px_6px_0px_0px_rgba(1,1,1,1)] hover:shadow-none hover:translate-y-2 transition-all duration-200">
                    View more Products
                </Link>
            </section>

            <section id="client-projects" className="w-full py-12 md:py-24 lg:py-32 bg-background">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2 max-w-3xl">
                            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                                Client Projects
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                                Successful Solutions We&apos;ve Delivered
                            </h2>
                            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Take a look at some of the impactful projects we&apos;ve completed for our clients.
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto grid max-w-6xl items-center gap-12 py-12 lg:grid-cols-2">
                        <Card className="relative overflow-hidden rounded-xl border bg-background shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent z-0"></div>
                            <div className="relative">
                                <Image
                                    src={logistics}
                                    width={600}
                                    height={300}
                                    alt="Logistics Website"
                                    className="w-full aspect-[2/1] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                    <div className="p-6">
                                        <div className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs text-primary-foreground mb-2">
                                            Web Development
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-1">Logistics Website</h3>
                                        <p className="text-white/80 text-sm">Streamlined shipping and tracking platform</p>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6 pt-6 relative z-10">
                                <p className="text-muted-foreground mb-4">
                                    We developed a comprehensive logistics website that revolutionized the client&apos;s shipping and
                                    tracking processes, improving efficiency and customer satisfaction.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Real-time Tracking</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Automated Notifications</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Route Optimization</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Analytics Dashboard</span>
                                    </div>
                                </div>
                                <div className="w-full flex gap-4">
                                    <Button asChild className="w-full group">
                                        <Link href="https://logistics-website-atju.onrender.com/" target="_blank">
                                            Explore Platform
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full group">
                                        <Link href="/eventeye">
                                            Case Study
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative overflow-hidden rounded-xl border bg-background shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent z-0"></div>
                            <div className="relative">
                                <Image
                                    src="/mpsolutions.png"
                                    width={600}
                                    height={300}
                                    alt="MP Solutions"
                                    className="w-full aspect-[2/1] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                    <div className="p-6">
                                        <div className="inline-block rounded-full bg-primary/90 px-3 py-1 text-xs text-primary-foreground mb-2">
                                            Inventory Management
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-1">MP Solutions</h3>
                                        <p className="text-white/80 text-sm">Medicine inventory management system</p>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6 pt-6 relative z-10">
                                <p className="text-muted-foreground mb-4">
                                    We created a robust medicine inventory management system for MP Solutions, optimizing their stock
                                    control and improving overall operational efficiency.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Automated Reordering</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Expiry Tracking</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Batch Management</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                        <span className="text-sm">Reporting & Analytics</span>
                                    </div>
                                </div>
                                <div className="w-full flex gap-4">
                                    <Button asChild className="w-full group">
                                        <Link href="https://mpsolutions.vercel.app/" target="_blank">
                                            Explore Platform
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full group">
                                        <Link href="/eventeye">
                                            Case Study
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Link href="/clientprojects" className="w-fit mx-auto flex items-center rounded-lg px-4 py-2 text-md border-2 border-black bg-white hover:bg-white text-black hover:text-black shadow-[0px_6px_0px_0px_rgba(1,1,1,1)] hover:shadow-none hover:translate-y-2 transition-all duration-200">
                    View more projects
                </Link>
            </section>
        </section>
    );
}
