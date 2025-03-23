"use client"

import type React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Code, Laptop, Palette, Bot, Zap, Globe, BarChart, Upload, Award } from "lucide-react";

interface FeaturesType {
    icon: React.ReactNode;
    text: string;
}
interface PricingTier {
    name: string;
    monthly: {
        inr: number;
        usd: number;
    };
    yearly: {
        inr: number;
        usd: number;
    };
    features: FeaturesType[];
}
export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false)
    const [isUSD, setIsUSD] = useState(false)

    const pricingData: Record<string, PricingTier> = {
        tier1: {
            name: "Basic Byte",
            monthly: {
                inr: 2999,
                usd: 39,
            },
            yearly: {
                inr: 29990,
                usd: 390,
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
            monthly: {
                inr: 5999,
                usd: 79,
            },
            yearly: {
                inr: 59990,
                usd: 790,
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
            monthly: {
                inr: 11999,
                usd: 149,
            },
            yearly: {
                inr: 119990,
                usd: 1490,
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
            monthly: {
                inr: 24999,
                usd: 299,
            },
            yearly: {
                inr: 249990,
                usd: 2990,
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

    // const formatCurrency = (amount: number, currency: boolean) => {
    //     return currency ? `$${amount}` : `₹${amount.toLocaleString("en-IN")}`
    // }

    const discountPercentage = 20

    return (
        <div id="pricingsection" className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
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
                    <div className="flex flex-col md:flex-row items-center justify-center mb-10 space-y-4 md:space-y-0">
                        <div className="flex items-center justify-center space-x-4 mr-0 md:mr-8">
                            <Label htmlFor="billing-toggle" className="text-zinc-400">
                                Monthly
                            </Label>
                            <Switch
                                id="billing-toggle"
                                checked={isYearly}
                                onCheckedChange={setIsYearly}
                                className="data-[state=checked]:bg-white data-[state=checked]:text-black"
                            />
                            <Label htmlFor="billing-toggle" className="flex items-center">
                                <span className="text-zinc-400">Yearly</span>
                                <span className="ml-2 text-xs px-2 py-0.5 bg-white/10 rounded-full text-white">
                                    Save {discountPercentage}%
                                </span>
                            </Label>
                        </div>
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
                    <Tabs defaultValue="tier1" className="w-full">
                        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8 bg-zinc-900/50 backdrop-blur-sm border border-white/10 p-1 rounded-xl">
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
                        <TabsContent value="tier1" className="mt-0">
                            <PricingCard
                                tierData={pricingData.tier1}
                                isYearly={isYearly}
                                isUSD={isUSD}
                                discountPercentage={discountPercentage}
                            />
                        </TabsContent>
                        <TabsContent value="tier2" className="mt-0">
                            <PricingCard
                                tierData={pricingData.tier2}
                                isYearly={isYearly}
                                isUSD={isUSD}
                                discountPercentage={discountPercentage}
                            />
                        </TabsContent>
                        <TabsContent value="tier3" className="mt-0">
                            <PricingCard
                                tierData={pricingData.tier3}
                                isYearly={isYearly}
                                isUSD={isUSD}
                                discountPercentage={discountPercentage}
                            />
                        </TabsContent>
                        <TabsContent value="tier4" className="mt-0">
                            <PricingCard
                                tierData={pricingData.tier4}
                                isYearly={isYearly}
                                isUSD={isUSD}
                                discountPercentage={discountPercentage}
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="text-center mt-16 text-zinc-500 text-sm">
                    <p>© {new Date().getFullYear()} Shunya Tech - We make websites that work 60% of the time, every time.</p>
                    <p className="mt-2">* All prices subject to change based on how much coffee we need that month.</p>
                </div>
            </div>
        </div>
    )
}

function PricingCard({
    tierData,
    isYearly,
    isUSD,
    discountPercentage,
}: {
    tierData: PricingTier
    isYearly: boolean
    isUSD: boolean
    discountPercentage: number
}) {
    const price = isYearly ? tierData.yearly[isUSD ? "usd" : "inr"] : tierData.monthly[isUSD ? "usd" : "inr"]
    const formattedPrice = isUSD ? `$${price}` : `₹${price.toLocaleString("en-IN")}`
    const monthlyEquivalent = isYearly ? tierData.yearly[isUSD ? "usd" : "inr"] / 12 : null

    const formattedMonthlyEquivalent = monthlyEquivalent
        ? isUSD
            ? `$${Math.round(monthlyEquivalent)}`
            : `₹${Math.round(monthlyEquivalent).toLocaleString("en-IN")}`
        : null

    return (
        <div className="bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="space-y-8">
                <div className="text-center pb-6 border-b border-white/10">
                    <h3 className="text-xl font-medium mb-2">{tierData.name}</h3>
                    <div className="flex items-center justify-center">
                        <span className="text-5xl font-bold">{formattedPrice}</span>
                        <span className="text-zinc-400 ml-2">{isYearly ? "per year" : "per month"}</span>
                    </div>
                    {
                        isYearly && (
                            <p className="text-zinc-500 text-sm mt-2">
                                That&apos;s about {formattedMonthlyEquivalent} per month ({discountPercentage}% savings)
                            </p>
                        )
                    }
                    <p className="text-zinc-500 text-sm mt-2">{isYearly ? "billed annually" : "billed monthly"}</p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-sm uppercase tracking-wider text-zinc-500">Features</h4>
                    <ul className="space-y-4 grid grid-cols-1 md:grid-cols-2">
                        {
                            tierData.features.map((feature: FeaturesType, index: number) => (
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

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <li className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-white">{icon}</div>
            <span className="text-zinc-200">{text}</span>
        </li>
    )
}