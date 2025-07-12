"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, DollarSign, Clock, PieChart, BarChart3, Zap, Check, ChevronDown, Shield, Globe, Sparkles } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const PROJECT_TYPES = [
    "Web Development",
    "Mobile App",
    "E-commerce",
    "Enterprise Software",
    "UI/UX Design",
    "Digital Marketing",
    "Branding",
    "Content Creation",
    "Video Editing",
]

export default function LandingPage() {
    const [projectType, setProjectType] = useState<string>("")
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (projectType) {
            router.push(`/budgetestimator/details?type=${encodeURIComponent(projectType)}`)
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <section className="relative min-h-screen flex items-center bg-black">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/90 -z-10" />
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] opacity-5 -z-20" />

                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                            Estimate Your Project Budget <span className="text-blue-400">in Minutes</span>
                        </h1>
                        <p className="text-lg md:text-xl font-medium text-gray-300 mb-12 max-w-3xl mx-auto">
                            Get accurate cost projections for Web Development, Mobile Apps, E-commerce, and more. Start your project
                            with confidence and clarity.
                        </p>
                        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-16">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-grow">
                                        <Select value={projectType} onValueChange={setProjectType}>
                                            <SelectTrigger className="w-full h-12 bg-white/10 border-white/20 text-white">
                                                <SelectValue placeholder="Select project type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-900 border-white/20">
                                                {
                                                    PROJECT_TYPES.map((type) => (
                                                        <SelectItem key={type} value={type} className="text-white hover:bg-white/10">
                                                            {type}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="h-12 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all duration-300 hover:scale-105"
                                        disabled={!projectType}
                                    >
                                        Generate Budget <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </form>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <div className="flex flex-col items-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                <DollarSign className="h-10 w-10 text-blue-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-white">Accurate Pricing</h3>
                                <p className="text-gray-400 text-center">
                                    Get precise estimates based on real market rates and project requirements
                                </p>
                            </div>
                            <div className="flex flex-col items-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                <Clock className="h-10 w-10 text-blue-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-white">Quick Turnaround</h3>
                                <p className="text-gray-400 text-center">Receive your detailed budget breakdown in minutes, not days</p>
                            </div>
                            <div className="flex flex-col items-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                <PieChart className="h-10 w-10 text-blue-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-white">Detailed Breakdown</h3>
                                <p className="text-gray-400 text-center">
                                    See exactly where your budget is allocated with itemized cost analysis
                                </p>
                            </div>
                        </div>
                        <div className="mt-16 flex justify-center">
                            <Link
                                href="#how-it-works"
                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Learn how it works
                                <ChevronDown className="h-5 w-5 animate-bounce" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <section id="how-it-works" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get your project estimate in four simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {
                            [
                                {
                                    step: "01",
                                    title: "Select project type",
                                    description:
                                        "Choose from our comprehensive list of project categories including Web Development, Mobile Apps, E-commerce, and more.",
                                    icon: <Globe className="h-8 w-8 text-blue-500" />,
                                },
                                {
                                    step: "02",
                                    title: "Provide project details",
                                    description:
                                        "Tell us about your specific requirements, timeline, and complexity to get a tailored estimate.",
                                    icon: <Sparkles className="h-8 w-8 text-blue-500" />,
                                },
                                {
                                    step: "03",
                                    title: "Choose AI or In-house",
                                    description:
                                        "Select between our AI-powered estimator or our traditional in-house estimation based on historical data.",
                                    icon: <Zap className="h-8 w-8 text-blue-500" />,
                                },
                                {
                                    step: "04",
                                    title: "Get detailed breakdown",
                                    description: "Receive a comprehensive cost analysis with visual charts and exportable reports.",
                                    icon: <PieChart className="h-8 w-8 text-blue-500" />,
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="relative bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center">
                                            <span className="text-sm font-bold">{item.step}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex flex-col items-center">
                                        <div className="mb-4">{item.icon}</div>
                                        <h3 className="text-xl font-semibold text-center mb-4 text-gray-900">{item.title}</h3>
                                        <p className="text-gray-600 text-center">{item.description}</p>
                                    </div>
                                    {
                                        i < 3 && (
                                            <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-blue-200 -z-10 transform -translate-x-4">
                                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-blue-500"></div>
                                            </div>
                                        )
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Powerful Features</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Our budget estimator comes packed with features to make your project planning seamless
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {
                            [
                                {
                                    icon: <Zap className="h-10 w-10 text-blue-500" />,
                                    title: "AI-Powered Estimates",
                                    description:
                                        "Leverage cutting-edge AI to analyze your project requirements and generate accurate cost projections based on current market rates.",
                                },
                                {
                                    icon: <BarChart3 className="h-10 w-10 text-blue-500" />,
                                    title: "Visual Breakdowns",
                                    description:
                                        "See your budget allocation with interactive charts and graphs that make understanding costs intuitive and clear.",
                                },
                                {
                                    icon: <DollarSign className="h-10 w-10 text-blue-500" />,
                                    title: "Cost Optimization",
                                    description:
                                        "Get suggestions for optimizing your budget without compromising on quality or essential features.",
                                },
                                {
                                    icon: <Clock className="h-10 w-10 text-blue-500" />,
                                    title: "Timeline Projections",
                                    description:
                                        "Understand how different timelines affect your budget with dynamic cost adjustments based on project duration.",
                                },
                                {
                                    icon: <PieChart className="h-10 w-10 text-blue-500" />,
                                    title: "Detailed Reports",
                                    description:
                                        "Export comprehensive PDF reports with itemized costs that you can share with stakeholders or use for planning.",
                                },
                                {
                                    icon: <Shield className="h-10 w-10 text-blue-500" />,
                                    title: "Industry Benchmarks",
                                    description:
                                        "Compare your estimate with industry standards to ensure you're getting competitive and realistic pricing.",
                                },
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl p-8 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="mb-6">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">What Our Users Say</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Hear from businesses that have used our budget estimator to plan their projects
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {
                            [
                                {
                                    quote:
                                        "The AI-powered estimator gave us a budget breakdown that was within 5% of our final project cost. Incredibly accurate and saved us weeks of planning.",
                                    name: "Sarah Johnson",
                                    role: "CTO, TechStart Inc.",
                                    image: "/placeholder.svg?height=80&width=80",
                                },
                                {
                                    quote:
                                        "Being able to toggle between AI and in-house estimates gave us confidence in our budget planning. This tool has become essential for all our new projects.",
                                    name: "Michael Chen",
                                    role: "Project Manager, Innovate Solutions",
                                    image: "/placeholder.svg?height=80&width=80",
                                },
                                {
                                    quote:
                                        "As a design agency, accurate budgeting is crucial. This tool helped us provide transparent quotes to clients and improved our closing rate by 35%.",
                                    name: "Emily Rodriguez",
                                    role: "Founder, Digital Craft Agency",
                                    image: "/placeholder.svg?height=80&width=80",
                                },
                            ].map((testimonial, i) => (
                                <div key={i} className="bg-white rounded-xl p-8 border border-gray-200 shadow-md">
                                    <div className="mb-6">
                                        <svg className="h-8 w-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 mb-6 italic">{testimonial.quote}</p>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-blue-100">
                                            <Image
                                                src={testimonial.image || "/placeholder.svg"}
                                                alt={testimonial.name}
                                                className="w-full h-full object-cover"
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                            <p className="text-gray-500 text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
            <section className="py-24 bg-blue-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
                    <p className="text-xl mb-12 max-w-3xl mx-auto text-gray-700">
                        Join thousands of businesses that use our budget estimator to plan their projects with confidence.
                    </p>
                    <Button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        size="lg"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-6 text-lg rounded-lg"
                    >
                        Create Your Estimate
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <div className="flex flex-wrap justify-center mt-12 gap-8">
                        <div className="flex items-center">
                            <Check className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-gray-700">Secure & Reliable</span>
                        </div>
                        <div className="flex items-center">
                            <Check className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-gray-700">No Credit Card Required</span>
                        </div>
                        <div className="flex items-center">
                            <Check className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-gray-700">Instant Results</span>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="bg-white py-12 border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <BarChart3 className="h-6 w-6 text-blue-500" />
                            <span className="font-bold text-xl text-gray-900">BudgetPro</span>
                        </div>
                        <div className="text-sm text-gray-500">© {new Date().getFullYear()} BudgetPro. All rights reserved.</div>
                    </div>
                </div>
            </footer>
        </div>
    )
}