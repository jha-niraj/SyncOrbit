"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { User, Building, Mail, Key } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { completeOnboarding } from "@/actions/auth/onboarding.action"

export default function OnboardingPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(false)
    
    // Form state
    const [formData, setFormData] = useState({
        role: "CLIENT" as "CLIENT" | "DEVELOPER" | "PRODUCTMANAGER",
        referralCode: "",
        companyName: "",
        companyEmail: ""
    })

    useEffect(() => {
        // Wait for session to load
        if (status === "loading") return
        
        // If no session, redirect to signin
        if (status === "unauthenticated") {
            router.push('/signin')
            return
        }

        // Get referral code from URL params
        const ref = searchParams.get('ref')
        if (ref) {
            setFormData(prev => ({ ...prev, referralCode: ref }))
            
            // Extract role from referral code
            if (ref.includes('dev')) {
                setFormData(prev => ({ ...prev, role: 'DEVELOPER' }))
            } else if (ref.includes('client')) {
                setFormData(prev => ({ ...prev, role: 'CLIENT' }))
            } else if (ref.includes('pm')) {
                setFormData(prev => ({ ...prev, role: 'PRODUCTMANAGER' }))
            }
        }

        // Check if user already has a role (existing user)
        if (session?.user?.role) {
            // User already has a role, redirect to dashboard
            router.push('/dashboard')
        }
    }, [session, status, searchParams, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (!session?.user) {
                throw new Error("No user session found")
            }

            // Validate required fields for PM
            if (formData.role === "PRODUCTMANAGER" && !formData.companyName.trim()) {
                throw new Error("Company name is required for Product Manager role")
            }

            const result = await completeOnboarding({
                email: session.user.email!,
                name: session.user.name || "",
                image: session.user.image || "",
                role: formData.role,
                referralCode: formData.referralCode || undefined,
                companyName: formData.companyName || undefined,
                companyEmail: formData.companyEmail || undefined
            })

            if (result.success) {
                toast.success("Onboarding completed successfully!")
                router.push('/dashboard')
            } else {
                throw new Error(result.error || "Failed to complete onboarding")
            }
        } catch (error) {
            console.error("Onboarding error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to complete onboarding")
        } finally {
            setLoading(false)
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
                <div className="animate-pulse">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (!session?.user) {
        return null // Will redirect to signin
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-2xl border-border/50 bg-background/80 backdrop-blur-xl">
                    <CardHeader className="text-center pb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <User className="w-8 h-8 text-primary" />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Complete Your Profile
                        </CardTitle>
                        <p className="text-muted-foreground">
                            Welcome {session.user.name || session.user.email}! Let's set up your account.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Role Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="role">Select Your Role</Label>
                                <Select 
                                    value={formData.role} 
                                    onValueChange={(value: "CLIENT" | "DEVELOPER" | "PRODUCTMANAGER") => 
                                        setFormData(prev => ({ ...prev, role: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CLIENT">Client</SelectItem>
                                        <SelectItem value="DEVELOPER">Developer</SelectItem>
                                        <SelectItem value="PRODUCTMANAGER">Product Manager</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Referral Code */}
                            <div className="space-y-2">
                                <Label htmlFor="referralCode">
                                    Referral Code <span className="text-muted-foreground">(Optional)</span>
                                </Label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="referralCode"
                                        type="text"
                                        placeholder="Enter referral code if you have one"
                                        value={formData.referralCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value }))}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* PM-specific fields */}
                            {formData.role === "PRODUCTMANAGER" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    {/* Company Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName">
                                            Company Name <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                            <Input
                                                id="companyName"
                                                type="text"
                                                placeholder="Your company name"
                                                value={formData.companyName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Company Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="companyEmail">
                                            Company Email <span className="text-muted-foreground">(Optional)</span>
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                            <Input
                                                id="companyEmail"
                                                type="email"
                                                placeholder="company@example.com"
                                                value={formData.companyEmail}
                                                onChange={(e) => setFormData(prev => ({ ...prev, companyEmail: e.target.value }))}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Completing Setup...
                                    </div>
                                ) : (
                                    "Complete Setup"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
