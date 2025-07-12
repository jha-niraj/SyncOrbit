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
            name: "MVP Launch",
            oneTime: {
                inr: 14999,
                usd: 199,
            },
            longTerm: {
                inr: 9999,
                usd: 139,
            },
            features: [
                { icon: <Rocket className="w-5 h-5" />, text: "Rapid development for quick market entry" },
                { icon: <Code className="w-5 h-5" />, text: "Essential features and core functionality" },
                { icon: <Laptop className="w-5 h-5" />, text: "2 rounds of revisions and refinements" },
                { icon: <Palette className="w-5 h-5" />, text: "Clean, modern UI design" },
                { icon: <Bot className="w-5 h-5" />, text: "Basic automation and integrations" },
                { icon: <Zap className="w-5 h-5" />, text: "Performance optimization" },
                { icon: <Globe className="w-5 h-5" />, text: "Standard hosting setup" },
                { icon: <BarChart className="w-5 h-5" />, text: "Basic analytics implementation" },
                { icon: <Upload className="w-5 h-5" />, text: "Development environment setup" },
                { icon: <Award className="w-5 h-5" />, text: "Quality assurance testing" },
            ],
        },
        tier1: {
            name: "Startup Success",
            price: {
                inr: 29999,
                usd: 399,
            },
            features: [
                { icon: <User className="w-5 h-5" />, text: "Dedicated developer for your project" },
                { icon: <Code className="w-5 h-5" />, text: "Modern tech stack implementation" },
                { icon: <Laptop className="w-5 h-5" />, text: "3 rounds of comprehensive revisions" },
                { icon: <Palette className="w-5 h-5" />, text: "Professional UI/UX design" },
                { icon: <Bot className="w-5 h-5" />, text: "Interactive features and automations" },
                { icon: <Zap className="w-5 h-5" />, text: "Enhanced performance optimization" },
                { icon: <Globe className="w-5 h-5" />, text: "Domain and hosting configuration" },
                { icon: <BarChart className="w-5 h-5" />, text: "SEO optimization package" },
                { icon: <Upload className="w-5 h-5" />, text: "Continuous development support" },
                { icon: <Award className="w-5 h-5" />, text: "Quality assurance and testing" },
            ],
        },
        tier2: {
            name: "Growth Plus",
            price: {
                inr: 59999,
                usd: 799,
            },
            features: [
                { icon: <User className="w-5 h-5" />, text: "3-developer team collaboration" },
                { icon: <Code className="w-5 h-5" />, text: "Full-stack development expertise" },
                { icon: <Laptop className="w-5 h-5" />, text: "6 rounds of detailed revisions" },
                { icon: <Palette className="w-5 h-5" />, text: "Advanced UI/UX with animations" },
                { icon: <Bot className="w-5 h-5" />, text: "AI-powered features integration" },
                { icon: <Zap className="w-5 h-5" />, text: "Advanced performance optimization" },
                { icon: <Globe className="w-5 h-5" />, text: "Premium hosting and security" },
                { icon: <BarChart className="w-5 h-5" />, text: "Advanced SEO implementation" },
                { icon: <Upload className="w-5 h-5" />, text: "Priority support and updates" },
                { icon: <Award className="w-5 h-5" />, text: "Comprehensive testing suite" },
            ],
        },
        tier3: {
            name: "Business Pro",
            price: {
                inr: 99999,
                usd: 1399,
            },
            features: [
                { icon: <User className="w-5 h-5" />, text: "Dedicated development team" },
                { icon: <Code className="w-5 h-5" />, text: "Enterprise-grade architecture" },
                { icon: <Laptop className="w-5 h-5" />, text: "Unlimited revision cycles" },
                { icon: <Palette className="w-5 h-5" />, text: "Premium design customization" },
                { icon: <Bot className="w-5 h-5" />, text: "Advanced AI/ML integration" },
                { icon: <Zap className="w-5 h-5" />, text: "Enterprise performance solutions" },
                { icon: <Globe className="w-5 h-5" />, text: "Multi-language support" },
                { icon: <BarChart className="w-5 h-5" />, text: "Complete SEO mastery package" },
                { icon: <Upload className="w-5 h-5" />, text: "24/7 priority support" },
                { icon: <Award className="w-5 h-5" />, text: "Comprehensive security audit" },
            ],
        },
        tier4: {
            name: "Enterprise Elite",
            price: {
                inr: 199999,
                usd: 2699,
            },
            features: [
                { icon: <User className="w-5 h-5" />, text: "Full-scale development team" },
                { icon: <Code className="w-5 h-5" />, text: "Custom technology solutions" },
                { icon: <Laptop className="w-5 h-5" />, text: "Dedicated project management" },
                { icon: <Palette className="w-5 h-5" />, text: "Enterprise design system" },
                { icon: <Bot className="w-5 h-5" />, text: "Custom AI solution development" },
                { icon: <Zap className="w-5 h-5" />, text: "Global CDN implementation" },
                { icon: <Globe className="w-5 h-5" />, text: "Enterprise infrastructure" },
                { icon: <BarChart className="w-5 h-5" />, text: "Advanced analytics suite" },
                { icon: <Upload className="w-5 h-5" />, text: "Dedicated support team" },
                { icon: <Award className="w-5 h-5" />, text: "Enterprise compliance & security" },
            ],
        },
    }

    return (
        <div id="pricing" className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-4">
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase border border-white/20 rounded-full bg-white/5 backdrop-blur-sm">
                        <span className="text-white/80">TAILORED SOLUTIONS</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-wide mb-4">Choose Your Development Package</h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Select the perfect package that aligns with your business goals and requirements. Each tier is designed to deliver maximum value and results.
                    </p>
                </div>
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center justify-center space-x-4">
                            <Label htmlFor="currency-toggle" className="text-zinc-400">
                                INR
                            </Label>
                            <Switch
                                id="currency-toggle"
                                checked={isUSD}
                                onCheckedChange={setIsUSD}
                                className="
                                    data-[state=checked]:bg-white
                                    data-[state=unchecked]:bg-gray-600
                                    dark:data-[state=checked]:bg-white
                                    dark:data-[state=unchecked]:bg-gray-500
                                    data-[state=checked]:text-black
                                    data-[state=unchecked]:text-white
                                    border
                                    border-gray-300
                                    dark:border-gray-600
                                    rounded-full
                                    transition-colors
                                "
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
                                                        One-time MVP Development
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="longTerm" id="longTerm" />
                                                    <Label htmlFor="longTerm" className="text-sm">
                                                        Long-term Development Partnership
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
                                                    ? "One-time payment for initial development"
                                                    : "Initial development plus ongoing support"
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
                                        {mvpOption === "oneTime" ? "Start Your MVP" : "Begin Partnership"}
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
                    <p>© {new Date().getFullYear()} ShunyaTech - Transforming Ideas into Digital Reality</p>
                    <p className="mt-2">* All packages can be customized to meet your specific requirements</p>
                    <p className="mt-1">* MVP stands for Minimum Viable Product - Perfect for quick market validation</p>
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
                    <ul className="space-y-4 grid grid-cols-2 md:grid-cols-2">
                        {
                            tierData.features.map((feature, index) => (
                                <FeatureItem key={index} icon={feature.icon} text={feature.text} />
                            ))
                        }
                    </ul>
                </div>
                <Button className="w-full py-6 text-black bg-white hover:bg-white/90 hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {tierData.name === "Enterprise Elite" ? "Contact Our Team" : "Get Started"}
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