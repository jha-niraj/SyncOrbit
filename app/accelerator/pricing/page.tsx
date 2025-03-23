import Link from "next/link"
import Image from "next/image"
import {
    Check,
    ArrowRight,
    X,
    Shield,
    Users,
    PenToolIcon as Tool,
    Code,
    MessageSquare,
    CheckCircle,
    TrendingUp,
    HelpCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 text-white py-20">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1600')] bg-cover bg-center"></div>
                </div>
                <div className="container max-w-6xl mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Affordable Support for Student Entrepreneurs</h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                            Get the guidance and technical help you need without the excessive costs of traditional accelerators
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="#pricing-options">
                                <Button size="lg" className="group bg-white text-teal-900 hover:bg-white/90">
                                    View Pricing Options
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                    Contact for Custom Plans
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            <div className="container max-w-6xl mx-auto px-4 py-12">
                {/* Value Proposition */}
                <section className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Why Our Approach Is Different</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We believe student entrepreneurs shouldn&apos;t have to break the bank to get started
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Shield className="h-10 w-10 text-teal-600" />,
                                title: "Minimal Costs",
                                description:
                                    "Pay only for the guidance you need, not for excessive handholding or standardized programs.",
                            },
                            {
                                icon: <Tool className="h-10 w-10 text-teal-600" />,
                                title: "Practical Support",
                                description: "Get hands-on technical help and marketing guidance tailored to your specific needs.",
                            },
                            {
                                icon: <Code className="h-10 w-10 text-teal-600" />,
                                title: "Technical Expertise",
                                description: "Access our development team to help build your MVP if you lack technical co-founders.",
                            },
                            {
                                icon: <Users className="h-10 w-10 text-teal-600" />,
                                title: "Real-World Learning",
                                description: "Do the fieldwork yourself with expert guidance, building skills that last a lifetime.",
                            },
                        ].map((feature, index) => (
                            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center text-center h-full">
                                        <div className="mb-4">{feature.icon}</div>
                                        <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Traditional vs ShunyaTech Pricing */}
                <section className="mb-16 bg-gray-50 rounded-2xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Traditional Accelerators vs. ShunyaTech</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            See how our pricing approach differs from traditional accelerator models
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
                                        High monthly fees (₹25,000-50,000) regardless of actual support needed
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <X className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">Significant equity requirements (5-10%) even for early-stage startups</p>
                                </li>
                                <li className="flex items-start">
                                    <X className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">One-size-fits-all pricing that doesn&apos;t account for varying needs</p>
                                </li>
                                <li className="flex items-start">
                                    <X className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">Long-term commitments with minimum 3-6 month contracts</p>
                                </li>
                                <li className="flex items-start">
                                    <X className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">Hidden fees for additional services or resources</p>
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
                                    <p className="text-gray-600">Minimal guidance fees that are affordable for student entrepreneurs</p>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-teal-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">
                                        Small equity share (2-3%) only if significant development resources are needed
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-teal-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">
                                        Customized pricing based on your specific needs and resource requirements
                                    </p>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-teal-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">Flexible arrangements with no long-term commitments required</p>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-teal-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-gray-600">Complete transparency with no hidden costs or surprise fees</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing-options" className="mb-16 scroll-mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Flexible Support Options</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Choose the level of support that fits your needs and budget
                        </p>
                    </div>

                    <Tabs defaultValue="guidance" className="max-w-5xl mx-auto">
                        <div className="flex justify-center mb-8">
                            <TabsList className="grid w-[400px] grid-cols-2">
                                <TabsTrigger value="guidance">Guidance Only</TabsTrigger>
                                <TabsTrigger value="development">Technical Development</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="guidance">
                            <div className="grid md:grid-cols-2 gap-8">
                                <Card className="border-2 relative overflow-hidden">
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Basic Guidance</CardTitle>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold">₹5,000</span>
                                            <span className="text-muted-foreground">/month</span>
                                        </div>
                                        <CardDescription className="text-base">For students who need strategic direction</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-600 mb-4">
                                                Perfect for student entrepreneurs who need expert advice but will handle execution themselves.
                                            </p>
                                            <div className="flex items-center space-x-2 text-sm text-teal-600 font-medium">
                                                <Check className="h-4 w-4" />
                                                <span>No equity required</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">What&apos;s Included</h4>
                                            <ul className="space-y-3">
                                                {[
                                                    "Bi-weekly 1:1 mentorship sessions",
                                                    "Business model refinement",
                                                    "Market research guidance",
                                                    "Pitch deck review & feedback",
                                                    "Basic marketing strategy",
                                                    "Access to resource library",
                                                    "Email support",
                                                ].map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col">
                                        <Button className="w-full mb-4 bg-teal-600 hover:bg-teal-700">Get Started</Button>
                                        <p className="text-xs text-center text-gray-500">No long-term contracts. Pay month-to-month.</p>
                                    </CardFooter>
                                </Card>

                                <Card className="border-2 border-teal-200 bg-teal-50/50 relative overflow-hidden">
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-teal-600">RECOMMENDED</Badge>
                                    </div>
                                    <CardHeader className="pt-12">
                                        <CardTitle className="text-2xl">Advanced Guidance</CardTitle>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold">₹8,500</span>
                                            <span className="text-muted-foreground">/month</span>
                                        </div>
                                        <CardDescription className="text-base">For startups needing comprehensive support</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-600 mb-4">
                                                Ideal for student entrepreneurs who need more intensive guidance and strategic support.
                                            </p>
                                            <div className="flex items-center space-x-2 text-sm text-teal-600 font-medium">
                                                <Check className="h-4 w-4" />
                                                <span>No equity required</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">What&apos;s Included</h4>
                                            <ul className="space-y-3">
                                                {[
                                                    "Weekly 1:1 mentorship sessions",
                                                    "All Basic Guidance features",
                                                    "Detailed business model development",
                                                    "Comprehensive marketing strategy",
                                                    "Financial planning & projections",
                                                    "Investor pitch preparation",
                                                    "Networking introductions",
                                                    "Priority email & phone support",
                                                    "Monthly progress reviews",
                                                ].map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col">
                                        <Button className="w-full mb-4 bg-teal-600 hover:bg-teal-700">Get Started</Button>
                                        <p className="text-xs text-center text-gray-500">No long-term contracts. Pay month-to-month.</p>
                                    </CardFooter>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="development">
                            <div className="grid md:grid-cols-2 gap-8">
                                <Card className="border-2 relative overflow-hidden">
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Technical Consultation</CardTitle>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold">₹12,000</span>
                                            <span className="text-muted-foreground">/month</span>
                                        </div>
                                        <CardDescription className="text-base">Technical guidance without equity</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-600 mb-4">
                                                For student founders who need technical guidance but will handle development themselves or with
                                                their team.
                                            </p>
                                            <div className="flex items-center space-x-2 text-sm text-teal-600 font-medium">
                                                <Check className="h-4 w-4" />
                                                <span>No equity required</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">What&apos;s Included</h4>
                                            <ul className="space-y-3">
                                                {[
                                                    "Weekly technical consultation",
                                                    "Architecture planning",
                                                    "Technology stack recommendations",
                                                    "Code reviews",
                                                    "Technical roadmap development",
                                                    "Basic guidance features",
                                                    "Development best practices",
                                                    "Technical documentation support",
                                                ].map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col">
                                        <Button className="w-full mb-4 bg-teal-600 hover:bg-teal-700">Get Started</Button>
                                        <p className="text-xs text-center text-gray-500">No long-term contracts. Pay month-to-month.</p>
                                    </CardFooter>
                                </Card>

                                <Card className="border-2 border-teal-200 bg-teal-50/50 relative overflow-hidden">
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-teal-600">EQUITY OPTION</Badge>
                                    </div>
                                    <CardHeader className="pt-12">
                                        <CardTitle className="text-2xl">Full Development Support</CardTitle>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold">2-3%</span>
                                            <span className="text-muted-foreground">equity</span>
                                        </div>
                                        <CardDescription className="text-base">
                                            For non-technical founders needing MVP development
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-600 mb-4">
                                                Our development team will help build your MVP from scratch, with minimal equity instead of high
                                                upfront costs.
                                            </p>
                                            <div className="flex items-center space-x-2 text-sm text-teal-600 font-medium">
                                                <Check className="h-4 w-4" />
                                                <span>No monthly fees</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">What&apos;s Included</h4>
                                            <ul className="space-y-3">
                                                {[
                                                    "Full MVP development",
                                                    "UI/UX design",
                                                    "Product management",
                                                    "Quality assurance testing",
                                                    "Deployment & hosting setup",
                                                    "Technical documentation",
                                                    "Post-launch support (3 months)",
                                                    "All guidance features",
                                                    "Marketing & PR support",
                                                    "Investor pitch preparation",
                                                ].map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col">
                                        <Button className="w-full mb-4 bg-teal-600 hover:bg-teal-700">Apply Now</Button>
                                        <p className="text-xs text-center text-gray-500">
                                            Application and project scoping required. Equity percentage based on project complexity.
                                        </p>
                                    </CardFooter>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </section>

                {/* Comparison Table */}
                <section className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Detailed Plan Comparison</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Compare our plans to find the perfect fit for your startup&apos;s needs
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-teal-50">
                                    <th className="p-4 text-left font-medium text-gray-500 w-1/4">Features</th>
                                    <th className="p-4 text-center font-medium text-gray-500">Basic Guidance</th>
                                    <th className="p-4 text-center font-medium text-gray-500">Advanced Guidance</th>
                                    <th className="p-4 text-center font-medium text-gray-500">Technical Consultation</th>
                                    <th className="p-4 text-center font-medium text-gray-500">Full Development</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {[
                                    {
                                        feature: "Monthly Cost",
                                        basic: "₹5,000",
                                        advanced: "₹8,500",
                                        tech: "₹12,000",
                                        full: "Equity Only (2-3%)",
                                    },
                                    {
                                        feature: "Mentorship Sessions",
                                        basic: "Bi-weekly",
                                        advanced: "Weekly",
                                        tech: "Weekly",
                                        full: "Weekly",
                                    },
                                    {
                                        feature: "Business Strategy",
                                        basic: "Basic",
                                        advanced: "Comprehensive",
                                        tech: "Basic",
                                        full: "Comprehensive",
                                    },
                                    {
                                        feature: "Technical Support",
                                        basic: <X className="h-5 w-5 text-red-500 mx-auto" />,
                                        advanced: "Limited",
                                        tech: "Consultation Only",
                                        full: "Full Development",
                                    },
                                    {
                                        feature: "Marketing Support",
                                        basic: "Basic Strategy",
                                        advanced: "Comprehensive",
                                        tech: "Basic Strategy",
                                        full: "Comprehensive",
                                    },
                                    {
                                        feature: "Investor Connections",
                                        basic: <X className="h-5 w-5 text-red-500 mx-auto" />,
                                        advanced: "Limited",
                                        tech: <X className="h-5 w-5 text-red-500 mx-auto" />,
                                        full: "Yes",
                                    },
                                    {
                                        feature: "Pitch Preparation",
                                        basic: "Basic Feedback",
                                        advanced: "Full Preparation",
                                        tech: "Basic Feedback",
                                        full: "Full Preparation",
                                    },
                                    {
                                        feature: "MVP Development",
                                        basic: <X className="h-5 w-5 text-red-500 mx-auto" />,
                                        advanced: <X className="h-5 w-5 text-red-500 mx-auto" />,
                                        tech: <X className="h-5 w-5 text-red-500 mx-auto" />,
                                        full: <Check className="h-5 w-5 text-green-500 mx-auto" />,
                                    },
                                    {
                                        feature: "Equity Required",
                                        basic: "None",
                                        advanced: "None",
                                        tech: "None",
                                        full: "2-3%",
                                    },
                                ].map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium">
                                            {row.feature}
                                            {index === 8 && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <HelpCircle className="h-4 w-4 text-gray-400 inline ml-1" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="w-60 text-sm">
                                                                Equity is only required for the Full Development option where we commit significant
                                                                resources to build your MVP.
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">{row.basic}</td>
                                        <td className="p-4 text-center">{row.advanced}</td>
                                        <td className="p-4 text-center">{row.tech}</td>
                                        <td className="p-4 text-center">{row.full}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Custom Solutions */}
                <section className="mb-16 bg-teal-50 rounded-2xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Need a Custom Solution?</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                We understand that every startup is unique. If our standard plans don&apos;t fit your specific needs, we&apos;re
                                happy to create a custom package tailored to your requirements and budget.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="mt-1 rounded-full bg-green-100 p-1">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">Mix and Match Services</h4>
                                        <p className="text-gray-600">
                                            Combine different aspects of our plans to create your ideal support package
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="mt-1 rounded-full bg-green-100 p-1">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">Flexible Payment Options</h4>
                                        <p className="text-gray-600">
                                            We can work with your budget constraints to find a solution that works
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="mt-1 rounded-full bg-green-100 p-1">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">Hybrid Models</h4>
                                        <p className="text-gray-600">
                                            Combine fee-based and equity-based approaches for the perfect balance
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Link href="/contact">
                                    <Button variant="outline" className="group bg-teal-600 text-white hover:bg-teal-700">
                                        Schedule a Consultation
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <Image
                                src="/placeholder.svg?height=400&width=600"
                                alt="Custom solutions"
                                width={600}
                                height={400}
                                className="rounded-lg shadow-lg"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-xl max-w-xs">
                                <div className="flex items-start space-x-3">
                                    <div className="mt-1">
                                        <MessageSquare className="h-6 w-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            &quot;They created a custom plan that perfectly fit my needs and budget as a student entrepreneur.&quot;
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">— Rahul M., Engineering Student</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Get answers to common questions about our pricing and support options
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                question: "Why is your pricing so much lower than traditional accelerators?",
                                answer:
                                    "Traditional accelerators often provide standardized programs with significant overhead costs. Our approach is more focused and efficient—we provide only what you need, when you need it, without the excessive handholding or infrastructure costs.",
                            },
                            {
                                question: "How does the equity arrangement work?",
                                answer:
                                    "We only take equity (2-3%) when we provide significant development resources to build your MVP. The exact percentage depends on the complexity of your project. This equity is formalized through standard agreements that protect both parties.",
                            },
                            {
                                question: "Can I upgrade or downgrade my plan?",
                                answer:
                                    "Absolutely. As your needs change, you can easily move between our different support tiers. There's no penalty for changing plans, and we'll help you transition smoothly.",
                            },
                            {
                                question: "Do you offer any discounts for students?",
                                answer:
                                    "Our pricing is already designed to be accessible for student entrepreneurs. However, we may offer additional discounts for teams with exceptional ideas but very limited resources. Contact us to discuss your situation.",
                            },
                            {
                                question: "What happens if I'm not satisfied with the support?",
                                answer:
                                    "We believe in earning your business every month. If you're not satisfied, you can cancel your monthly plan at any time. For equity arrangements, we establish clear deliverables and milestones before beginning work.",
                            },
                            {
                                question: "How long does MVP development typically take?",
                                answer:
                                    "The timeline varies based on the complexity of your product, but most MVPs take 2-4 months to develop. We'll provide a more specific estimate after understanding your requirements during the initial consultation.",
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

                {/* Testimonials */}
                <section className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">What Our Founders Say About Our Approach</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Hear from student entrepreneurs who have experienced our affordable support model
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                quote:
                                    "As a student with limited funds, traditional accelerators were out of reach. ShunyaTech's affordable guidance helped me launch my startup without breaking the bank.",
                                author: "Ankit Patel",
                                role: "Engineering Student",
                                company: "Founder, RoboAssist",
                                image: "/placeholder.svg?height=60&width=60",
                            },
                            {
                                quote:
                                    "The equity arrangement for MVP development was perfect for me as a non-technical founder. I got a high-quality product without the massive upfront costs.",
                                author: "Meera Shah",
                                role: "Business Student",
                                company: "CEO, FinEase",
                                image: "/placeholder.svg?height=60&width=60",
                            },
                            {
                                quote:
                                    "Their approach is refreshingly different. I paid only for the guidance I needed, did the fieldwork myself, and learned invaluable skills in the process.",
                                author: "Li Wei",
                                role: "Computer Science Student",
                                company: "Co-founder, DataSync",
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
                        ))}
                    </div>
                </section>

                {/* Transparency Guarantee */}
                <section className="mb-16 bg-white rounded-xl border border-gray-200 p-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                            <Shield className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Our Transparency Guarantee</h2>
                        <p className="text-lg text-gray-600 mb-6">
                            We believe in complete transparency in our pricing and agreements. There are no hidden fees, no surprise
                            costs, and no pressure to give up equity unless it makes sense for your specific situation.
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>All terms and expectations are clearly documented before we begin working together.</span>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mb-12 bg-gradient-to-br from-teal-900 to-emerald-900 text-white rounded-2xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Ready to Build Your Startup?</h2>
                            <p className="text-xl text-white/80 mb-8">
                                Get the support you need without the excessive costs of traditional accelerators.
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
                                        Schedule a Consultation
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
                            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-xl text-black">
                                <div className="flex items-center space-x-2">
                                    <div className="rounded-full bg-teal-100 w-10 h-10 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="h-5 w-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Start Building Today</p>
                                        <p className="text-sm text-teal-600 font-bold">Affordable Support</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

