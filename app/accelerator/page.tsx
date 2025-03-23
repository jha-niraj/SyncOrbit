import Link from "next/link"
import Image from "next/image"
import {
    ArrowRight,
    CheckCircle,
    Users,
    Award,
    BookOpen,
    Calendar,
    Rocket,
    Target,
    Lightbulb,
    Code,
    TrendingUp,
    MessageSquare,
    Briefcase,
    GraduationCap,
    Clock,
    PenToolIcon as Tool,
    Compass,
    Sparkles,
    X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Background */}
            <section className="relative bg-gradient-to-br from-cyan-900 via-teal-800 to-emerald-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center"></div>
                </div>
                <div className="container max-w-6xl mx-auto px-4 py-24 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-4">
                                    <GraduationCap className="h-4 w-4 mr-2" />
                                    <span>A New Kind of Student Accelerator</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                                    Build Your Startup, Your Way
                                </h1>
                                <p className="text-xl text-white/80 max-w-xl">
                                    ShunyaTech Accelerator empowers student founders with practical support, technical expertise, and
                                    real-world guidance—without the excessive costs.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/submit">
                                    <Button size="lg" className="group bg-white text-teal-900 hover:bg-white/90">
                                        Apply Now
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                                <Link href="#program-details">
                                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>Next Cohort: August 15, 2023</span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    <span>20 Startups Per Batch</span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block relative">
                            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-2xl">
                                <Image
                                    src="/placeholder.svg?height=400&width=600"
                                    alt="Students working on startup ideas"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl">
                                <div className="flex items-center space-x-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                                                <Image
                                                    src={`/placeholder.svg?height=40&width=40&text=${i}`}
                                                    alt="Team Member"
                                                    width={40}
                                                    height={40}
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Our expert team of</p>
                                        <p className="text-sm font-bold text-gray-900">Developers, Marketers & Mentors</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            <div className="container max-w-6xl mx-auto px-4 py-12">
                {/* Trusted By Section */}
                <section className="mb-20">
                    <div className="text-center mb-8">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Our Products & Clients</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-12 w-24 relative grayscale hover:grayscale-0 transition-all duration-300">
                                <Image
                                    src={`/placeholder.svg?height=48&width=96&text=Partner${i}`}
                                    alt={`Partner ${i}`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Program Overview Section */}
                <section id="program-details" className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">A Different Approach to Acceleration</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We believe student entrepreneurs need practical support, not expensive handholding
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="p-8">
                                <div className="rounded-full bg-teal-100 w-12 h-12 flex items-center justify-center mb-6">
                                    <Tool className="h-6 w-6 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Practical Support</h3>
                                <p className="text-gray-600">
                                    Get hands-on technical help building your MVP, marketing guidance, and pitch preparation—exactly what
                                    you need, when you need it.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="p-8">
                                <div className="rounded-full bg-teal-100 w-12 h-12 flex items-center justify-center mb-6">
                                    <Compass className="h-6 w-6 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Self-Directed Learning</h3>
                                <p className="text-gray-600">
                                    We guide, you execute. Develop real-world skills by doing the fieldwork yourself with expert direction
                                    when needed.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="p-8">
                                <div className="rounded-full bg-teal-100 w-12 h-12 flex items-center justify-center mb-6">
                                    <Sparkles className="h-6 w-6 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Affordable Access</h3>
                                <p className="text-gray-600">
                                    Minimal fees for guidance, optional equity only if you need significant resources. We believe in
                                    making entrepreneurship accessible.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* About the Accelerator */}
                <section className="mb-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <Image
                                src="/placeholder.svg?height=500&width=600"
                                alt="Accelerator workspace"
                                width={600}
                                height={500}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                        <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-medium mb-4">
                                About ShunyaTech Accelerator
                            </div>
                            <h2 className="text-3xl font-bold mb-6">Why We&apos;re Different</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    ShunyaTech Accelerator was born from a simple observation: traditional accelerators are often too
                                    expensive for students and don&apos;t provide the practical, hands-on experience founders need.
                                </p>
                                <p>
                                    As a company that builds and manages our own products while serving clients, we have the expertise and
                                    connections to help student entrepreneurs succeed—without charging exorbitant fees or taking
                                    significant equity.
                                </p>
                                <p>
                                    Our approach is simple: we provide technical expertise, marketing guidance, and pitch preparation
                                    while you do the real-world work of building your business. This creates founders who truly understand
                                    their product and market.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-8">
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-full bg-teal-100 w-10 h-10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-teal-800 font-bold">10+</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Products Built</p>
                                        <p className="text-sm text-gray-500">By our team</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-full bg-teal-100 w-10 h-10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-teal-800 font-bold">50+</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Client Projects</p>
                                        <p className="text-sm text-gray-500">Successfully delivered</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-full bg-teal-100 w-10 h-10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-teal-800 font-bold">20+</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Expert Team</p>
                                        <p className="text-sm text-gray-500">Developers & marketers</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="rounded-full bg-teal-100 w-10 h-10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-teal-800 font-bold">15+</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Investor Connections</p>
                                        <p className="text-sm text-gray-500">For funding opportunities</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Traditional vs ShunyaTech Section */}
                <section className="mb-20 bg-gray-50 rounded-2xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Traditional Accelerators vs. ShunyaTech</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Why our approach creates more capable, independent founders
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl p-6 shadow-md">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-gray-400">Traditional Accelerators</h3>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <X className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">
                                        High fees or significant equity (5-10%), creating financial burden on student founders
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <X className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">
                                        Excessive handholding that doesn&apos;t prepare founders for real-world challenges
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <X className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">
                                        One-size-fits-all programs that don&apos;t address your specific technical or marketing needs
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <X className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">
                                        Focus on pitch decks and fundraising over building sustainable businesses
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <X className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">
                                        Limited technical support for non-technical founders who need help building their MVP
                                    </p>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-teal-100">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-teal-600">ShunyaTech Approach</h3>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-teal-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">
                                        Minimal fees for guidance, equity (2-3%) only if you need significant development resources
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-teal-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">
                                        Guided independence—we advise, you execute, building real-world skills and resilience
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-teal-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">
                                        Tailored technical and marketing support based on your specific startup needs
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-teal-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">
                                        Focus on building sustainable businesses first, with fundraising as a tool, not the goal
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-teal-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">
                                        Expert technical team that can help build your MVP if you lack technical co-founders
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* How We Help Section */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">How We Help Student Founders</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Practical support in the areas that matter most to early-stage startups
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Code className="h-10 w-10 text-teal-600" />,
                                title: "Technical Development",
                                description:
                                    "Our expert development team can help build your MVP, whether you need guidance or hands-on development support.",
                            },
                            {
                                icon: <TrendingUp className="h-10 w-10 text-teal-600" />,
                                title: "Marketing Strategy",
                                description:
                                    "Learn how to identify your target market, create compelling messaging, and develop effective go-to-market strategies.",
                            },
                            {
                                icon: <MessageSquare className="h-10 w-10 text-teal-600" />,
                                title: "Pitch Preparation",
                                description:
                                    "Our PR team will help you craft and deliver compelling pitches that resonate with investors and partners.",
                            },
                            {
                                icon: <Users className="h-10 w-10 text-teal-600" />,
                                title: "Investor Connections",
                                description:
                                    "Access our network of investors and funding opportunities when your startup is ready for investment.",
                            },
                            {
                                icon: <Rocket className="h-10 w-10 text-teal-600" />,
                                title: "Product Strategy",
                                description:
                                    "Get guidance on product roadmapping, feature prioritization, and building for product-market fit.",
                            },
                            {
                                icon: <Lightbulb className="h-10 w-10 text-teal-600" />,
                                title: "Idea Validation",
                                description:
                                    "Test and refine your concept with structured methodologies before investing significant time and resources.",
                            },
                            {
                                icon: <Target className="h-10 w-10 text-teal-600" />,
                                title: "Growth Hacking",
                                description:
                                    "Learn practical, low-cost strategies to acquire users and grow your startup on a student budget.",
                            },
                            {
                                icon: <BookOpen className="h-10 w-10 text-teal-600" />,
                                title: "Business Fundamentals",
                                description:
                                    "Master the essentials of business operations, legal considerations, and financial planning.",
                            },
                            {
                                icon: <Award className="h-10 w-10 text-teal-600" />,
                                title: "Founder Mentality",
                                description:
                                    "Develop the mindset and resilience needed to navigate the challenges of entrepreneurship.",
                            },
                        ].map((feature, index) => (
                            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex flex-col h-full">
                                        <div className="mb-4">{feature.icon}</div>
                                        <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                                        <p className="text-gray-600 flex-grow">{feature.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Our Process */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Our Process</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            How we work with student entrepreneurs to bring their ideas to life
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-teal-100"></div>

                        <div className="grid grid-cols-1 gap-12">
                            {[
                                {
                                    week: "Step 1",
                                    title: "Initial Consultation",
                                    description:
                                        "We meet to understand your idea, vision, and specific needs to determine how we can best support you.",
                                    icon: <Lightbulb className="h-6 w-6 text-white" />,
                                },
                                {
                                    week: "Step 2",
                                    title: "Needs Assessment",
                                    description:
                                        "We identify which areas you need the most help with—technical development, marketing, pitch preparation, etc.",
                                    icon: <Target className="h-6 w-6 text-white" />,
                                },
                                {
                                    week: "Step 3",
                                    title: "Custom Support Plan",
                                    description:
                                        "We create a tailored plan that outlines exactly how we'll support you and what you'll be responsible for.",
                                    icon: <Compass className="h-6 w-6 text-white" />,
                                },
                                {
                                    week: "Step 4",
                                    title: "Guided Execution",
                                    description: "You build your business with our guidance and support in the areas you need it most.",
                                    icon: <Code className="h-6 w-6 text-white" />,
                                },
                                {
                                    week: "Step 5",
                                    title: "Growth & Connections",
                                    description:
                                        "As you gain traction, we help connect you with investors and partners to take your startup to the next level.",
                                    icon: <TrendingUp className="h-6 w-6 text-white" />,
                                },
                            ].map((phase, index) => (
                                <div
                                    key={index}
                                    className={`relative ${index % 2 === 0 ? "md:ml-auto md:mr-[50%] md:pr-12" : "md:mr-auto md:ml-[50%] md:pl-12"} md:w-[45%]`}
                                >
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 md:left-auto md:right-0 md:translate-x-1/2 w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center z-10">
                                        {phase.icon}
                                    </div>
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <CardContent className="p-6">
                                            <div className="text-sm font-semibold text-teal-600 mb-2">{phase.week}</div>
                                            <h3 className="text-xl font-bold mb-3">{phase.title}</h3>
                                            <p className="text-gray-600">{phase.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Meet Our Expert Team</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            The professionals who will help bring your startup vision to life
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            {
                                name: "Rajesh Kumar",
                                role: "Lead Developer",
                                expertise: "Full-stack, Mobile Apps",
                                image: "/placeholder.svg?height=200&width=200",
                            },
                            {
                                name: "Priya Sharma",
                                role: "Marketing Director",
                                expertise: "Growth, Digital Marketing",
                                image: "/placeholder.svg?height=200&width=200",
                            },
                            {
                                name: "Vikram Singh",
                                role: "Product Strategist",
                                expertise: "UX/UI, Product Management",
                                image: "/placeholder.svg?height=200&width=200",
                            },
                            {
                                name: "Ananya Patel",
                                role: "PR Specialist",
                                expertise: "Pitch Coaching, Media Relations",
                                image: "/placeholder.svg?height=200&width=200",
                            },
                        ].map((member, index) => (
                            <div key={index} className="text-center">
                                <div className="relative h-48 w-48 mx-auto mb-4 rounded-lg overflow-hidden">
                                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                                </div>
                                <h3 className="font-bold text-lg">{member.name}</h3>
                                <p className="text-teal-600">{member.role}</p>
                                <p className="text-sm text-gray-500">{member.expertise}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/team">
                            <Button variant="outline">View Full Team</Button>
                        </Link>
                    </div>
                </section>

                {/* Success Stories Section */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Student entrepreneurs who built successful startups with our guidance
                        </p>
                    </div>

                    <Tabs defaultValue="all" className="mb-8">
                        <TabsList className="mx-auto flex justify-center">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="tech">Tech</TabsTrigger>
                            <TabsTrigger value="health">Health</TabsTrigger>
                            <TabsTrigger value="edu">Education</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        name: "EcoTech Solutions",
                                        story:
                                            "Two engineering students with an idea but no technical skills. We helped them build their MVP and develop their marketing strategy. Now operating in 5 cities with minimal outside investment.",
                                        image: "/placeholder.svg?height=80&width=80",
                                        founder: "Arjun Mehta, Founder & CEO",
                                        id: "ecotech",
                                        category: "tech",
                                    },
                                    {
                                        name: "HealthBridge",
                                        story:
                                            "Medical students with deep domain knowledge but no business experience. Our team guided their go-to-market strategy while they handled the medical aspects. Recently expanded to 5 countries.",
                                        image: "/placeholder.svg?height=80&width=80",
                                        founder: "Dr. Priya Sharma, Co-founder",
                                        id: "healthbridge",
                                        category: "health",
                                    },
                                    {
                                        name: "EduSpark",
                                        story:
                                            "Education students who built their platform with our technical guidance. They did the fieldwork and market research themselves, creating a deeply customer-focused product that was acquired for ₹45 Cr.",
                                        image: "/placeholder.svg?height=80&width=80",
                                        founder: "Vikram Singh, Founder",
                                        id: "eduspark",
                                        category: "edu",
                                    },
                                ].map((startup, index) => (
                                    <Card
                                        key={index}
                                        className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="h-48 relative">
                                            <Image
                                                src="/placeholder.svg?height=200&width=400"
                                                alt={startup.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center mb-4">
                                                    <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                                                        <Image
                                                            src={startup.image || "/placeholder.svg"}
                                                            alt={startup.name}
                                                            width={48}
                                                            height={48}
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">{startup.name}</h3>
                                                        <p className="text-sm text-gray-500">{startup.founder}</p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 mb-4">{startup.story}</p>
                                                <Link href={`/startups/${startup.id}`} className="mt-auto">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        Read Full Story
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="tech" className="mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Tech startups would be filtered here */}
                                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="h-48 relative">
                                        <Image
                                            src="/placeholder.svg?height=200&width=400"
                                            alt="EcoTech Solutions"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center mb-4">
                                                <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                                                    <Image
                                                        src="/placeholder.svg?height=80&width=80"
                                                        alt="EcoTech Solutions"
                                                        width={48}
                                                        height={48}
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">EcoTech Solutions</h3>
                                                    <p className="text-sm text-gray-500">Arjun Mehta, Founder & CEO</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                Two engineering students with an idea but no technical skills. We helped them build their MVP
                                                and develop their marketing strategy. Now operating in 5 cities with minimal outside investment.
                                            </p>
                                            <Link href="/startups/ecotech" className="mt-auto">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    Read Full Story
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Other tabs would have similar content */}
                    </Tabs>
                    <div className="text-center">
                        <Link href="/discover">
                            <Button variant="outline" size="lg">
                                Discover More Startups
                            </Button>
                        </Link>
                    </div>
                </section>
                <section className="mb-20 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">What Our Founders Say</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Hear directly from the student entrepreneurs who built with our guidance
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {
                        [
                            {
                                quote:
                                    "ShunyaTech didn't just hand me solutions—they taught me how to solve problems myself. The technical guidance was invaluable for a non-technical founder like me.",
                                author: "Rahul Gupta",
                                role: "Computer Science Student",
                                company: "Founder, DataSense AI",
                                image: "/placeholder.svg?height=60&width=60",
                            },
                            {
                                quote:
                                    "What I love about ShunyaTech is that they let me do the real work while providing guidance when I needed it. I learned so much more than I would have with a traditional accelerator.",
                                author: "Neha Sharma",
                                role: "Engineering Student",
                                company: "Co-founder, GreenEnergy",
                                image: "/placeholder.svg?height=60&width=60",
                            },
                            {
                                quote:
                                    "Their approach is perfect for students. Affordable, practical, and focused on teaching you how to build a real business—not just how to pitch for funding.",
                                author: "Aditya Patel",
                                role: "Business Student",
                                company: "CEO, MarketPulse",
                                image: "/placeholder.svg?height=60&width=60",
                            },
                        ].map((testimonial, index) => (
                            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex flex-col h-full">
                                        <div className="mb-4 text-teal-600">
                                            <svg width="45" height="36" className="fill-current">
                                                <path d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.536L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.536L38.183.001z"></path>
                                            </svg>
                                        </div>
                                        <p className="text-gray-600 italic mb-6 flex-grow">{testimonial.quote}</p>
                                        <div className="flex items-center mt-auto">
                                            <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                                                <Image
                                                    src={testimonial.image || "/placeholder.svg"}
                                                    alt={testimonial.author}
                                                    width={48}
                                                    height={48}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold">{testimonial.author}</p>
                                                <p className="text-sm text-gray-500">{testimonial.role}</p>
                                                <p className="text-sm text-teal-600">{testimonial.company}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                        }
                    </div>
                </section>
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">How to Apply</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            A simple process to get the support you need for your startup
                        </p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                        {
                        [
                            {
                                step: "1",
                                title: "Submit Your Idea",
                                description: "Tell us about your startup idea and what specific areas you need help with.",
                                icon: <Briefcase className="h-6 w-6 text-white" />,
                            },
                            {
                                step: "2",
                                title: "Initial Consultation",
                                description: "We'll meet to discuss your vision and how our team can best support your specific needs.",
                                icon: <MessageSquare className="h-6 w-6 text-white" />,
                            },
                            {
                                step: "3",
                                title: "Custom Plan",
                                description: "We'll create a tailored support plan that outlines exactly how we'll work together.",
                                icon: <Target className="h-6 w-6 text-white" />,
                            },
                            {
                                step: "4",
                                title: "Start Building",
                                description: "Begin working with our team to bring your startup vision to life.",
                                icon: <Rocket className="h-6 w-6 text-white" />,
                            },
                        ].map((step, index) => (
                            <div key={index} className="relative">
                                {index < 3 && (
                                    <div
                                        className="absolute top-10 left-full w-full h-0.5 bg-teal-100 -z-10 hidden md:block"
                                        style={{ width: "calc(100% - 3rem)", left: "calc(50% + 1.5rem)" }}
                                    ></div>
                                )}
                                <div className="flex flex-col items-center text-center">
                                    <div className="rounded-full bg-teal-600 w-12 h-12 flex items-center justify-center mb-4">
                                        {step.icon}
                                    </div>
                                    <div className="rounded-full bg-teal-100 w-8 h-8 flex items-center justify-center absolute top-2 right-2 md:relative md:top-0 md:right-0 md:-mt-16 md:ml-16">
                                        <span className="font-bold text-teal-800">{step.step}</span>
                                    </div>
                                    <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                    <div className="text-center mt-12">
                        <Link href="/submit">
                            <Button size="lg" className="group bg-teal-600 hover:bg-teal-700 text-white">
                                Apply Now
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Get answers to common questions about our approach
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                question: "How much does it cost to join the program?",
                                answer:
                                    "We keep our fees minimal—significantly lower than traditional accelerators. The exact amount depends on the level of support you need. For guidance only, fees are very affordable. If you need technical development or other resource-intensive support, we may discuss a small equity share (2-3%).",
                            },
                            {
                                question: "Do I need to have technical skills?",
                                answer:
                                    "Not at all. Our technical team can help build your MVP if you don't have technical co-founders. We can either guide you through the development process or handle it directly, depending on your needs and arrangement.",
                            },
                            {
                                question: "How is this different from other accelerators?",
                                answer:
                                    "Traditional accelerators often charge high fees or take significant equity while providing a standardized program. We offer tailored support at minimal cost, focusing on practical skills and guided independence rather than excessive handholding.",
                            },
                            {
                                question: "How much time commitment is required?",
                                answer:
                                    "Since you'll be doing much of the fieldwork yourself with our guidance, the time commitment is flexible and can work around your academic schedule. We believe in quality over quantity when it comes to our interactions.",
                            },
                            {
                                question: "Can you help with funding?",
                                answer:
                                    "Yes, we have connections with investors and can make introductions when your startup is ready. However, we focus first on helping you build a sustainable business that may not need significant outside funding to get started.",
                            },
                            {
                                question: "Do I need to have a team already?",
                                answer:
                                    "No, solo founders are welcome. We can provide guidance on building a team or connecting with potential co-founders if needed.",
                            },
                        ].map((faq, index) => (
                            <div key={index} className="border-b border-gray-200 pb-4">
                                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/faq">
                            <Button variant="outline">View All FAQs</Button>
                        </Link>
                    </div>
                </section>

                {/* Disclaimer Section */}
                <section className="mb-20 bg-white rounded-xl shadow-sm p-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-4">Our Commitment to Founders</h2>
                            <div className="space-y-3 text-gray-600">
                                <p>ShunyaTech Accelerator Program is committed to founder success and ethical business practices.</p>
                                <p>
                                    We do not claim any ownership of the ideas submitted on this platform. Any equity arrangement would be
                                    explicitly agreed upon and only in cases where significant resources are provided.
                                </p>
                                <p>
                                    Our mission is to make entrepreneurship accessible to students by providing practical support without
                                    the financial barriers of traditional accelerators.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 mb-6">
                            <Checkbox id="terms" className="mt-1" />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I understand that ShunyaTech Accelerator Program is an advisory service and does not claim ownership of
                                my idea unless explicitly agreed upon through a separate equity agreement.
                            </label>
                        </div>

                        <div className="text-center">
                            <Link href="/submit">
                                <Button size="lg" className="group bg-teal-600 hover:bg-teal-700 text-white">
                                    Submit Your Application
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mb-12 bg-gradient-to-br from-teal-900 to-emerald-900 text-white rounded-2xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Ready to Build Your Startup?</h2>
                            <p className="text-xl text-white/80 mb-8">
                                Get the practical support you need without breaking the bank or giving away your company.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/submit">
                                    <Button size="lg" className="group bg-white text-teal-900 hover:bg-white/90">
                                        Apply Now
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                        Contact Us
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative hidden md:block">
                            <Image
                                src="/placeholder.svg?height=300&width=500"
                                alt="Students working on startup"
                                width={500}
                                height={300}
                                className="rounded-lg shadow-lg"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl text-black">
                                <div className="flex items-center space-x-2">
                                    <div className="rounded-full bg-teal-100 w-10 h-10 flex items-center justify-center flex-shrink-0">
                                        <Calendar className="h-5 w-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Next Cohort Starts</p>
                                        <p className="text-sm text-teal-600 font-bold">August 15, 2023</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final Info Section */}
                <section className="text-center max-w-3xl mx-auto mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-medium">Applications Open Year-Round</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-medium">Next Cohort: August 15, 2023</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-medium">Limited to 20 Startups Per Cohort</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

