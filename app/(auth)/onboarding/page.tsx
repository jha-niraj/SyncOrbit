"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { 
    User, Building, Mail, Users, ChevronRight, ChevronLeft, 
    Code, Megaphone, ShoppingCart, Palette, Settings, Plus,
    Check, Star, Briefcase, Globe
} from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { completeCompanyOnboarding, completeInvitationOnboarding, completeClientOnboarding } from "@/actions/auth/onboarding.action"
import { TeamType } from "@prisma/client"

// Team templates with predefined configurations
const TEAM_TEMPLATES = {
    [TeamType.TECHNICAL]: {
        name: "Technical Team",
        displayName: "Development",
        icon: Code,
        color: "#3b82f6",
        description: "Handles development, engineering, and technical tasks",
        defaultHeadTitle: "Chief Technology Officer",
        commonRoles: ["CTO", "Tech Lead", "Engineering Manager"]
    },
    [TeamType.MARKETING]: {
        name: "Marketing Team",
        displayName: "Marketing",
        icon: Megaphone,
        color: "#ec4899",
        description: "Manages marketing, social media, and content strategy",
        defaultHeadTitle: "Chief Marketing Officer",
        commonRoles: ["CMO", "Marketing Director", "Marketing Manager"]
    },
    [TeamType.SALES]: {
        name: "Sales Team",
        displayName: "Sales",
        icon: ShoppingCart,
        color: "#10b981",
        description: "Handles sales, business development, and client acquisition",
        defaultHeadTitle: "Sales Director",
        commonRoles: ["Sales Director", "Sales Manager", "Head of Sales"]
    },
    [TeamType.DESIGN]: {
        name: "Design Team",
        displayName: "Design",
        icon: Palette,
        color: "#f59e0b",
        description: "Creates UI/UX designs, graphics, and visual content",
        defaultHeadTitle: "Creative Director",
        commonRoles: ["Creative Director", "Design Lead", "Head of Design"]
    },
    [TeamType.OPERATIONS]: {
        name: "Operations Team",
        displayName: "Operations",
        icon: Settings,
        color: "#6366f1",
        description: "Manages operations, project management, and processes",
        defaultHeadTitle: "Operations Manager",
        commonRoles: ["Operations Manager", "COO", "Project Director"]
    },
    [TeamType.FINANCE]: {
        name: "Finance Team",
        displayName: "Finance",
        icon: Briefcase,
        color: "#8b5cf6",
        description: "Handles finances, accounting, and budget management",
        defaultHeadTitle: "Chief Financial Officer",
        commonRoles: ["CFO", "Finance Director", "Finance Manager"]
    },
    [TeamType.CUSTOM]: {
        name: "Custom Team",
        displayName: "Custom",
        icon: Users,
        color: "#6b7280",
        description: "A custom team for your specific needs",
        defaultHeadTitle: "Team Lead",
        commonRoles: ["Team Lead", "Manager", "Director"]
    }
}

type OnboardingStep = 'role-selection' | 'company-info' | 'team-setup' | 'team-details'

interface SelectedTeam {
    type: TeamType
    name: string
    displayName: string
    headRoleTitle: string
    description?: string
    color?: string
}

function Onboarding() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('role-selection')
    const [onboardingType, setOnboardingType] = useState<'company' | 'invitation' | 'client'>('company')
    const [invitationId, setInvitationId] = useState<string | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        // Company information
        companyName: "",
        companyDescription: "",
        website: "",
        
        // Selected teams
        selectedTeams: [] as SelectedTeam[],
    })

    useEffect(() => {
        // Wait for session to load
        if (status === "loading") return

        // If no session, redirect to signin
        if (status === "unauthenticated") {
            router.push('/signin')
            return
        }

        // Check for invitation ID in URL
        const inviteId = searchParams.get('invite')
        if (inviteId) {
            setInvitationId(inviteId)
            setOnboardingType('invitation')
            setCurrentStep('role-selection') // Will handle invitation acceptance
        }

        // Check if user already has a role (existing user)
        if (session?.user?.role && session.user.role !== 'CLIENT') {
            // User already has a role, redirect to dashboard
            router.push('/dashboard')
        }
    }, [session, status, searchParams, router])

    // Add or remove a team from selection
    const toggleTeam = (teamType: TeamType) => {
        const template = TEAM_TEMPLATES[teamType]
        const isSelected = formData.selectedTeams.some(t => t.type === teamType)
        
        if (isSelected) {
            setFormData(prev => ({
                ...prev,
                selectedTeams: prev.selectedTeams.filter(t => t.type !== teamType)
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                selectedTeams: [...prev.selectedTeams, {
                    type: teamType,
                    name: template.name,
                    displayName: template.displayName,
                    headRoleTitle: template.defaultHeadTitle,
                    description: template.description,
                    color: template.color
                }]
            }))
        }
    }

    // Update team details
    const updateTeamDetails = (index: number, updates: Partial<SelectedTeam>) => {
        setFormData(prev => ({
            ...prev,
            selectedTeams: prev.selectedTeams.map((team, i) => 
                i === index ? { ...team, ...updates } : team
            )
        }))
    }

    // Handle form submission
    const handleSubmit = async () => {
        setLoading(true)
        try {
            if (!session?.user) {
                throw new Error("No user session found")
            }

            let result

            if (onboardingType === 'company') {
                // Company onboarding
                if (!formData.companyName.trim()) {
                    throw new Error("Company name is required")
                }
                if (formData.selectedTeams.length === 0) {
                    throw new Error("At least one team is required")
                }

                result = await completeCompanyOnboarding({
                    email: session.user.email!,
                    name: session.user.name || "",
                    image: session.user.image || undefined,
                    companyName: formData.companyName,
                    companyDescription: formData.companyDescription || undefined,
                    website: formData.website || undefined,
                    selectedTeams: formData.selectedTeams
                })
            } else if (onboardingType === 'invitation' && invitationId) {
                // Invitation acceptance
                result = await completeInvitationOnboarding({
                    email: session.user.email!,
                    name: session.user.name || "",
                    image: session.user.image || undefined,
                    invitationId
                })
            } else {
                // Client onboarding
                result = await completeClientOnboarding({
                    email: session.user.email!,
                    name: session.user.name || "",
                    image: session.user.image || undefined,
                })
            }

            if (result.success) {
                toast.success(result.message || "Onboarding completed successfully!")
                // Force session update to include new role data
                window.location.href = '/dashboard'
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

    // Navigate between steps
    const nextStep = () => {
        if (currentStep === 'role-selection') {
            if (onboardingType === 'company') {
                setCurrentStep('company-info')
            } else {
                handleSubmit() // Direct submission for invitation/client
            }
        } else if (currentStep === 'company-info') {
            setCurrentStep('team-setup')
        } else if (currentStep === 'team-setup') {
            if (formData.selectedTeams.length === 0) {
                toast.error("Please select at least one team")
                return
            }
            setCurrentStep('team-details')
        } else if (currentStep === 'team-details') {
            handleSubmit()
        }
    }

    const prevStep = () => {
        if (currentStep === 'company-info') {
            setCurrentStep('role-selection')
        } else if (currentStep === 'team-setup') {
            setCurrentStep('company-info')
        } else if (currentStep === 'team-details') {
            setCurrentStep('team-setup')
        }
    }

    // Loading state
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
                <div className="animate-pulse">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
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

    // Step content components
    const renderStepContent = () => {
        switch (currentStep) {
            case 'role-selection':
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Welcome to ProjectCentral</h2>
                            <p className="text-muted-foreground">Let&apos;s get you set up. What would you like to do?</p>
                        </div>
                        <div className="grid gap-4">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                                    onboardingType === 'company' 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-border hover:border-primary/50'
                                }`}
                                onClick={() => setOnboardingType('company')}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Building className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">Start a New Company</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Create your company, set up teams, and invite team heads to get started.
                                        </p>
                                    </div>
                                    {onboardingType === 'company' && (
                                        <Check className="w-5 h-5 text-primary" />
                                    )}
                                </div>
                            </motion.div>
                            
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                                    onboardingType === 'client' 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-border hover:border-primary/50'
                                }`}
                                onClick={() => setOnboardingType('client')}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                        <User className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">Join as a Client</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Work with development teams and manage your projects.
                                        </p>
                                    </div>
                                    {onboardingType === 'client' && (
                                        <Check className="w-5 h-5 text-primary" />
                                    )}
                                </div>
                            </motion.div>
                            
                            {invitationId && (
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                                        onboardingType === 'invitation' 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-border hover:border-primary/50'
                                    }`}
                                    onClick={() => setOnboardingType('invitation')}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-green-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-1">Accept Team Invitation</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Join a team you&apos;ve been invited to.
                                            </p>
                                        </div>
                                        {onboardingType === 'invitation' && (
                                            <Check className="w-5 h-5 text-primary" />
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                )
                
            case 'company-info':
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Company Information</h2>
                            <p className="text-muted-foreground">Tell us about your company</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name *</Label>
                                <Input
                                    id="companyName"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                                    placeholder="Enter your company name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyDescription">Company Description</Label>
                                <Textarea
                                    id="companyDescription"
                                    value={formData.companyDescription}
                                    onChange={(e) => setFormData(prev => ({ ...prev, companyDescription: e.target.value }))}
                                    placeholder="Brief description of your company"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website (Optional)</Label>
                                <Input
                                    id="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                                    placeholder="https://yourcompany.com"
                                />
                            </div>
                        </div>
                    </div>
                )
                
            case 'team-setup':
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Select Your Teams</h2>
                            <p className="text-muted-foreground">
                                Choose the teams your company needs. You can add more later.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(TEAM_TEMPLATES).map(([type, template]) => {
                                const isSelected = formData.selectedTeams.some(t => t.type === type as TeamType)
                                const IconComponent = template.icon
                                
                                return (
                                    <motion.div
                                        key={type}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                            isSelected 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                        onClick={() => toggleTeam(type as TeamType)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div 
                                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: `${template.color}15` }}
                                            >
                                                <IconComponent 
                                                    className="w-5 h-5" 
                                                    style={{ color: template.color }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold">{template.name}</h3>
                                                    {isSelected && (
                                                        <Check className="w-4 h-4 text-primary" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {template.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                        {formData.selectedTeams.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-semibold mb-3">Selected Teams ({formData.selectedTeams.length})</h3>
                                <div className="flex flex-wrap gap-2">
                                    {formData.selectedTeams.map((team) => {
                                        const template = TEAM_TEMPLATES[team.type]
                                        const IconComponent = template.icon
                                        return (
                                            <Badge 
                                                key={team.type} 
                                                variant="secondary" 
                                                className="px-3 py-1 gap-2"
                                            >
                                                <IconComponent className="w-3 h-3" />
                                                {team.displayName}
                                            </Badge>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )
                
            case 'team-details':
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Team Details</h2>
                            <p className="text-muted-foreground">
                                Customize your team names and head role titles
                            </p>
                        </div>
                        <div className="space-y-6">
                            {formData.selectedTeams.map((team, index) => {
                                const template = TEAM_TEMPLATES[team.type]
                                const IconComponent = template.icon
                                
                                return (
                                    <Card key={team.type} className="p-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div 
                                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: `${template.color}15` }}
                                            >
                                                <IconComponent 
                                                    className="w-5 h-5" 
                                                    style={{ color: template.color }}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{template.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {template.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Team Display Name</Label>
                                                <Input
                                                    value={team.displayName}
                                                    onChange={(e) => updateTeamDetails(index, { displayName: e.target.value })}
                                                    placeholder={template.displayName}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Head Role Title</Label>
                                                <Select
                                                    value={team.headRoleTitle}
                                                    onValueChange={(value) => updateTeamDetails(index, { headRoleTitle: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {template.commonRoles.map(role => (
                                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                )
                
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl"
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
                        <div className="flex items-center justify-center gap-4 mb-4">
                            {['role-selection', 'company-info', 'team-setup', 'team-details'].map((step, index) => {
                                const stepNames = {
                                    'role-selection': 'Setup',
                                    'company-info': 'Company',
                                    'team-setup': 'Teams',
                                    'team-details': 'Details'
                                }
                                const isActive = currentStep === step
                                const isCompleted = (['role-selection', 'company-info', 'team-setup', 'team-details'].indexOf(currentStep) > index)
                                const shouldShow = onboardingType === 'company' || step === 'role-selection'
                                
                                if (!shouldShow) return null
                                
                                return (
                                    <div key={step} className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                            isCompleted ? 'bg-primary text-primary-foreground' :
                                            isActive ? 'bg-primary/20 text-primary border-2 border-primary' :
                                            'bg-muted text-muted-foreground'
                                        }`}>
                                            {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                                        </div>
                                        <span className={`text-sm ${
                                            isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                                        }`}>
                                            {stepNames[step as keyof typeof stepNames]}
                                        </span>
                                        {index < 3 && shouldShow && onboardingType === 'company' && (
                                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        <p className="text-muted-foreground">
                            Welcome {session?.user?.name || session?.user?.email}!
                        </p>
                    </CardHeader>
                    <CardContent className="pb-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderStepContent()}
                            </motion.div>
                        </AnimatePresence>
                        
                        <div className="flex justify-between items-center mt-8 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 'role-selection' || loading}
                                className="gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </Button>
                            
                            <div className="flex items-center gap-2">
                                {onboardingType === 'company' && (
                                    <div className="text-sm text-muted-foreground">
                                        {currentStep === 'role-selection' && 'Step 1 of 4'}
                                        {currentStep === 'company-info' && 'Step 2 of 4'}
                                        {currentStep === 'team-setup' && 'Step 3 of 4'}
                                        {currentStep === 'team-details' && 'Step 4 of 4'}
                                    </div>
                                )}
                            </div>
                            
                            <Button
                                onClick={nextStep}
                                disabled={loading || (
                                    currentStep === 'company-info' && !formData.companyName.trim()
                                )}
                                className="gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        {currentStep === 'team-details' || (onboardingType !== 'company' && currentStep === 'role-selection') 
                                            ? 'Completing...' : 'Processing...'}
                                    </>
                                ) : (
                                    <>
                                        {currentStep === 'team-details' || (onboardingType !== 'company' && currentStep === 'role-selection') 
                                            ? 'Complete Setup' : 'Continue'}
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Onboarding />
        </Suspense>
    )
}