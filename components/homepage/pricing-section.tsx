"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User, Code, Laptop, Palette, Bot, Zap, Globe, BarChart, Upload, Award, Rocket, ArrowRight } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FeaturesType {
    icon: React.ReactNode;
    text: string;
}
interface StandardPricingTier {
    name: string;
    price: {
        inr: number;
        usd: number;
    };
    features: FeaturesType[];
}
interface MVPPricingTier {
    name: string;
    oneTime: {
        inr: number;
        usd: number;
    };
    longTerm: {
        inr: number;
        usd: number;
    };
    features: FeaturesType[];
}
interface PricingData {
    mvp: MVPPricingTier;
    tier1: StandardPricingTier;
    tier2: StandardPricingTier;
    tier3: StandardPricingTier;
    tier4: StandardPricingTier;
}
export default function PricingPage() {
    const [isUSD, setIsUSD] = useState(false)
    const [mvpOption, setMvpOption] = useState("oneTime")

    const pricingData: PricingData = {
        mvp: {
            name: "MVP Miracle",
            oneTime: {
                inr: 14999,
                usd: 199,
            },
            longTerm: {
                inr: 9999,
                usd: 139,
            },
            features: [
                { icon: <Rocket className="w-5 h-5" />, text: "Just enough code to impress investors" },
                { icon: <Code className="w-5 h-5" />, text: "Duct-tape & bubble gum architecture" },
                { icon: <Laptop className="w-5 h-5" />, text: "2 revisions (or until we both give up)" },
                { icon: <Palette className="w-5 h-5" />, text: "UI designed by our intern's pet hamster" },
                { icon: <Bot className="w-5 h-5" />, text: "AI that's basically a bunch of if/else statements" },
                { icon: <Zap className="w-5 h-5" />, text: "Works 60% of the time, every time" },
                { icon: <Globe className="w-5 h-5" />, text: "Runs on your cousin's shared hosting" },
                { icon: <BarChart className="w-5 h-5" />, text: "Analytics via console.log statements" },
                { icon: <Upload className="w-5 h-5" />, text: "Demo that only works on our machine" },
                { icon: <Award className="w-5 h-5" />, text: "'Ship now, fix later' philosophy" },
            ],
        },
        tier1: {
            name: "Basic Byte",
            price: {
                inr: 29999,
                usd: 399,
            },
            features: [
                { icon: <User className="w-5 h-5" />, text: "1 Developer (who works 25 hours a day)" },
                { icon: <Code className="w-5 h-5" />, text: "HTML & CSS (we promise not to use tables)" },
                { icon: <Laptop className="w-5 h-5" />, text: "3 revisions (before we start crying)" },
                { icon: <Palette className="w-5 h-5" />, text: "Basic design (MS Paint is our passion)" },
                { icon: <Bot className="w-5 h-5" />, text: "Chatbot that only says 'Please contact support'" },
                { icon: <Zap className="w-5 h-5" />, text: "Lightning fast* (*terms and conditions apply)" },
                { icon: <Globe className="w-5 h-5" />, text: "Domain setup (we'll try our best)" },
                { icon: <BarChart className="w-5 h-5" />, text: "SEO that might work (no promises)" },
                { icon: <Upload className="w-5 h-5" />, text: "Unlimited coffee-fueled coding sessions" },
                { icon: <Award className="w-5 h-5" />, text: "'It works on my machine' guarantee" },
            ],
        },
        tier2: {
            name: "Pro Pixel",
            price: {
                inr: 59999,
                usd: 799,
            },
            features: [
                { icon: <User className="w-5 h-5" />, text: "3 Developers (one codes, two debug)" },
                { icon: <Code className="w-5 h-5" />, text: "HTML, CSS & JavaScript (we'll try not to break it)" },
                { icon: <Laptop className="w-5 h-5" />, text: "6 revisions (we'll only sigh audibly after 4)" },
                { icon: <Palette className="w-5 h-5" />, text: "Advanced design (we discovered Figma last week)" },
                { icon: <Bot className="w-5 h-5" />, text: "AI chatbot that knows 3 different responses" },
                { icon: <Zap className="w-5 h-5" />, text: "Website faster than our excuses for delays" },
                { icon: <Globe className="w-5 h-5" />, text: "Domain & hosting (we'll remember the passwords)" },
                { icon: <BarChart className="w-5 h-5" />, text: "SEO that Google might notice" },
                { icon: <Upload className="w-5 h-5" />, text: "Unlimited 'urgent' weekend calls" },
                { icon: <Award className="w-5 h-5" />, text: "'It works in Chrome at least' certificate" },
            ],
        },
        tier3: {
            name: "Business Bit",
            price: {
                inr: 99999,
                usd: 1399,
            },
            features: [
                { icon: <User className="w-5 h-5" />, text: "10 Developers (5 actually working, 5 in meetings)" },
                { icon: <Code className="w-5 h-5" />, text: "Full-stack development (we know what that means now)" },
                { icon: <Laptop className="w-5 h-5" />, text: "12 revisions (we've accepted our fate)" },
                { icon: <Palette className="w-5 h-5" />, text: "Premium design (we hired someone who can draw)" },
                { icon: <Bot className="w-5 h-5" />, text: "AI that pretends to understand your business" },
                { icon: <Zap className="w-5 h-5" />, text: "Speed that will make your competitors jealous" },
                { icon: <Globe className="w-5 h-5" />, text: "Multi-language support (Google Translate API)" },
                { icon: <BarChart className="w-5 h-5" />, text: "SEO that actually works (we read a blog about it)" },
                { icon: <Upload className="w-5 h-5" />, text: "Unlimited 'emergency' feature requests" },
                { icon: <Award className="w-5 h-5" />, text: "'We'll fix it in production' promise" },
            ],
        },
        tier4: {
            name: "Enterprise Error",
            price: {
                inr: 199999,
                usd: 2699,
            },
            features: [
                { icon: <User className="w-5 h-5" />, text: "Unlimited Developers (most watching cat videos)" },
                { icon: <Code className="w-5 h-5" />, text: "Any tech stack (even the ones we have to Google)" },
                { icon: <Laptop className="w-5 h-5" />, text: "Infinite revisions (our therapists are on standby)" },
                { icon: <Palette className="w-5 h-5" />, text: "Design so good it might win awards (participation ones)" },
                { icon: <Bot className="w-5 h-5" />, text: "AI that's smarter than our project manager" },
                { icon: <Zap className="w-5 h-5" />, text: "Website faster than our CEO's sports car" },
                { icon: <Globe className="w-5 h-5" />, text: "Global CDN (we finally learned what that means)" },
                { icon: <BarChart className="w-5 h-5" />, text: "SEO that will make Google notice you exist" },
                { icon: <Upload className="w-5 h-5" />, text: "24/7 support (we sleep with phones under pillows)" },
                { icon: <Award className="w-5 h-5" />, text: "'It will definitely be done by Friday' guarantee" },
            ],
        },
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase border border-white/20 rounded-full bg-white/5 backdrop-blur-sm">
                        <span className="text-white/80">PROBABLY A GOOD CHOICE</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-wide mb-4">Choose your website development package</h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Select how much you want to pay us to turn your ideas into a website that might work. No refunds, but we
                        accept bribes in the form of pizza.
                    </p>
                </div>
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-center mb-10">
                        <div className="flex items-center justify-center space-x-4">
                            <Label htmlFor="currency-toggle" className="text-zinc-400">
                                INR
                            </Label>
                            <Switch
                                id="currency-toggle"
                                checked={isUSD}
                                onCheckedChange={setIsUSD}
                                className="data-[state=checked]:bg-white data-[state=checked]:text-black"
                            />
                            <Label htmlFor="currency-toggle" className="text-zinc-400">
                                USD
                            </Label>
                        </div>
                    </div>
                    <Tabs defaultValue="mvp" className="w-full">
                        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-1 rounded-xl">
                            <TabsTrigger
                                value="mvp"
                                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all"
                            >
                                MVP MIRACLE
                            </TabsTrigger>
                            <TabsTrigger
                                value="tier1"
                                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all"
                            >
                                BASIC BYTE
                            </TabsTrigger>
                            <TabsTrigger
                                value="tier2"
                                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all"
                            >
                                PRO PIXEL
                            </TabsTrigger>
                            <TabsTrigger
                                value="tier3"
                                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all"
                            >
                                BUSINESS BIT
                            </TabsTrigger>
                            <TabsTrigger
                                value="tier4"
                                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all"
                            >
                                ENTERPRISE ERROR
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="mvp" className="mt-0">
                            <div className="bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden">
                                <div className="absolute -right-12 top-6 rotate-45 bg-white/20 text-white px-12 py-1 text-sm font-semibold">
                                    New!
                                </div>
                                <div className="space-y-8">
                                    <div className="text-center pb-6 border-b border-white/10">
                                        <h3 className="text-xl font-medium mb-2">{pricingData.mvp.name}</h3>
                                        <div className="mb-4">
                                            <RadioGroup value={mvpOption} onValueChange={setMvpOption} className="flex flex-col space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="oneTime" id="oneTime" />
                                                    <Label htmlFor="oneTime" className="text-sm">
                                                        One-time MVP (abandon ship after launch)
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="longTerm" id="longTerm" />
                                                    <Label htmlFor="longTerm" className="text-sm">
                                                        Long-term partnership (we&apos;ll stick around for the chaos)
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <span className="text-5xl font-bold">
                                                {
                                                    isUSD
                                                        ? `$${mvpOption === "oneTime" ? pricingData.mvp.oneTime.usd : pricingData.mvp.longTerm.usd}`
                                                        : `₹${(mvpOption === "oneTime" ? pricingData.mvp.oneTime.inr : pricingData.mvp.longTerm.inr).toLocaleString("en-IN")}`
                                                }
                                            </span>
                                        </div>
                                        <p className="text-zinc-500 text-sm mt-2">
                                            {
                                                mvpOption === "oneTime"
                                                    ? "One-time payment (no takebacks)"
                                                    : "Initial payment + ongoing therapy sessions"
                                            }
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-sm uppercase tracking-wider text-zinc-500">Features</h4>
                                        <ul className="space-y-4 grid grid-cols-2 md:grid-cols-2">
                                            {
                                                pricingData.mvp.features.map((feature, index) => (
                                                    <FeatureItem key={index} icon={feature.icon} text={feature.text} />
                                                ))
                                            }
                                        </ul>
                                        {
                                            mvpOption === "longTerm" && (
                                                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                                                    <h5 className="font-medium mb-2 flex items-center">
                                                        <ArrowRight className="w-4 h-4 mr-2" />
                                                        Long-term partnership &quot;benefits&quot;:
                                                    </h5>
                                                    <ul className="space-y-2 text-sm text-zinc-300">
                                                        <li>• Priority access to our excuses department</li>
                                                        <li>• Discounted rates (we&apos;ll only charge 80% extra)</li>
                                                        <li>• Dedicated project manager (who&apos;s always &quot;in a meeting&quot;)</li>
                                                        <li>
                                                            • 3 months of post-launch support (mostly &quot;have you tried turning it off and on again?&quot;)
                                                        </li>
                                                    </ul>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <Button className="w-full py-6 text-black bg-white hover:bg-white/90 hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] bg-gradient-to-r from-white to-white/90">
                                        {mvpOption === "oneTime" ? "Launch Fast, Fix Never" : "Start Your Journey of Regret"}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="tier1" className="mt-0">
                            <StandardPricingCard tierData={pricingData.tier1} isUSD={isUSD} />
                        </TabsContent>
                        <TabsContent value="tier2" className="mt-0">
                            <StandardPricingCard tierData={pricingData.tier2} isUSD={isUSD} />
                        </TabsContent>
                        <TabsContent value="tier3" className="mt-0">
                            <StandardPricingCard tierData={pricingData.tier3} isUSD={isUSD} />
                        </TabsContent>
                        <TabsContent value="tier4" className="mt-0">
                            <StandardPricingCard tierData={pricingData.tier4} isUSD={isUSD} />
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="text-center mt-16 text-zinc-500 text-sm">
                    <p>© {new Date().getFullYear()} Shunya Tech - We make websites that work 60% of the time, every time.</p>
                    <p className="mt-2">* All prices subject to change based on how much coffee we need that month.</p>
                    <p className="mt-1">* MVP stands for &quot;Mostly Vague Product&quot; - perfect for pitching to investors!</p>
                </div>
            </div>
        </div>
    )
}

function StandardPricingCard({
    tierData,
    isUSD,
}: {
    tierData: StandardPricingTier
    isUSD: boolean
}) {
    const formattedPrice = isUSD ? `$${tierData.price.usd}` : `₹${tierData.price.inr.toLocaleString("en-IN")}`

    return (
        <div className="bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="space-y-8">
                <div className="text-center pb-6 border-b border-white/10">
                    <h3 className="text-xl font-medium mb-2">{tierData.name}</h3>
                    <div className="flex items-center justify-center">
                        <span className="text-5xl font-bold">{formattedPrice}</span>
                    </div>
                    <p className="text-zinc-500 text-sm mt-2">One-time payment (we hope you&apos;re sitting down)</p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-sm uppercase tracking-wider text-zinc-500">Features</h4>
                    <ul className="space-y-4">
                        {
                            tierData.features.map((feature, index) => (
                                <FeatureItem key={index} icon={feature.icon} text={feature.text} />
                            ))
                        }
                    </ul>
                </div>
                <Button className="w-full py-6 text-black bg-white hover:bg-white/90 hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {tierData.name === "Enterprise Error" ? "Contact Sales (If You Dare)" : "Get Started (At Your Own Risk)"}
                </Button>
            </div>
        </div>
    )
}

function FeatureItem({ icon, text }: FeaturesType) {
    return (
        <li className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-white">{icon}</div>
            <span className="text-zinc-200">{text}</span>
        </li>
    )
}