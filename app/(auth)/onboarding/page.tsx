"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Building, Mail, User, ChevronRight, ChevronLeft, Code, Megaphone,
    ShoppingCart, Palette, Settings, Check, Briefcase, Users, Terminal,
    ShieldCheck, Network, Database, Globe, Loader2
} from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import {
    completeCompanyOnboarding, completeInvitationOnboarding, completeClientOnboarding
} from "@/actions/auth/onboarding.action"
import { TeamType } from "@prisma/client"
import { cn } from "@/lib/utils"

// --- Configuration Data ---
const TEAM_TEMPLATES = {
    [TeamType.TECHNICAL]: {
        name: "Engineering",
        icon: Code,
        desc: "DevOps, Frontend, Backend",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    [TeamType.MARKETING]: {
        name: "Growth",
        icon: Megaphone,
        desc: "Content, Social, SEO",
        color: "text-pink-500",
        bg: "bg-pink-500/10",
        border: "border-pink-500/20"
    },
    [TeamType.SALES]: {
        name: "Revenue",
        icon: ShoppingCart,
        desc: "Pipeline, CRM, Closers",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    [TeamType.DESIGN]: {
        name: "Creative",
        icon: Palette,
        desc: "UI/UX, Brand Identity",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
    [TeamType.OPERATIONS]: {
        name: "Systems",
        icon: Settings,
        desc: "Process, HR, Admin",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20"
    },
    [TeamType.FINANCE]: {
        name: "Treasury",
        icon: Briefcase,
        desc: "Ledger, Payroll, Audit",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20"
    },
    [TeamType.CUSTOM]: {
        name: "Special Ops",
        icon: Users,
        desc: "Custom Unit Structure",
        color: "text-neutral-500",
        bg: "bg-neutral-500/10",
        border: "border-neutral-500/20"
    }
}

type OnboardingStep = 'role-selection' | 'company-info' | 'team-setup' | 'team-details'

interface SelectedTeam {
    type: TeamType
    name: string
    displayName: string
    headRoleTitle: string
}

// --- Visual Component: Left Panel ---
const OnboardingMonitor = ({ step }: { step: number }) => {
    return (
        <div className="relative h-full w-full bg-neutral-950 flex flex-col justify-between p-12 overflow-hidden border-r border-neutral-800">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-neutral-800 bg-neutral-900/50 backdrop-blur-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Setup_Wizard.exe</span>
                    </div>
                    <div className="text-neutral-600 font-mono text-xs">V2.4.0</div>
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tighter mb-4">
                    Workspace <br /> Provisioning.
                </h1>
                <p className="text-neutral-500 text-sm font-light max-w-xs mb-8">
                    Configure your operating environment. Define nodes, allocate resources, and establish protocols.
                </p>
                <div className="space-y-6 font-mono text-xs border-l border-neutral-800 pl-6 relative">
                    {
                        [
                            { label: "IDENTITY_VERIFICATION", status: "COMPLETE" },
                            { label: "ENTITY_REGISTRATION", status: step >= 2 ? "ACTIVE" : "PENDING" },
                            { label: "MODULE_ALLOCATION", status: step >= 3 ? "ACTIVE" : "PENDING" },
                            { label: "SYSTEM_FINALIZATION", status: step >= 4 ? "ACTIVE" : "PENDING" }
                        ].map((item, idx) => (
                            <div key={idx} className="relative">
                                <span className={cn(
                                    "absolute -left-[29px] top-0 w-1.5 h-1.5 rounded-full border border-neutral-950",
                                    (idx + 1) < step ? "bg-blue-500" : (idx + 1) === step ? "bg-white animate-pulse" : "bg-neutral-800"
                                )}></span>
                                <div className={cn("flex justify-between", (idx + 1) === step ? "text-white" : "text-neutral-600")}>
                                    <span>{item.label}</span>
                                    <span>[{item.status}]</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="relative z-10 mt-auto">
                <div className="text-[10px] font-mono uppercase text-neutral-500 mb-2 tracking-widest">Resource_Allocation</div>
                <div className="grid grid-cols-2 gap-px bg-neutral-800 border border-neutral-800 rounded-lg overflow-hidden">
                    <div className="bg-neutral-900/80 p-4 backdrop-blur-sm">
                        <Database className="w-4 h-4 text-neutral-400 mb-2" />
                        <div className="text-xs text-neutral-500">Storage</div>
                        <div className="text-sm text-white font-mono">Unallocated</div>
                    </div>
                    <div className="bg-neutral-900/80 p-4 backdrop-blur-sm">
                        <Network className="w-4 h-4 text-neutral-400 mb-2" />
                        <div className="text-xs text-neutral-500">Nodes</div>
                        <div className="text-sm text-white font-mono">0 Active</div>
                    </div>
                    <div className="bg-neutral-900/80 p-4 backdrop-blur-sm">
                        <ShieldCheck className="w-4 h-4 text-neutral-400 mb-2" />
                        <div className="text-xs text-neutral-500">Encryption</div>
                        <div className="text-sm text-white font-mono">AES-256</div>
                    </div>
                    <div className="bg-neutral-900/80 p-4 backdrop-blur-sm">
                        <Globe className="w-4 h-4 text-neutral-400 mb-2" />
                        <div className="text-xs text-neutral-500">Region</div>
                        <div className="text-sm text-white font-mono">Global</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function OnboardingContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('role-selection')
    const [onboardingType, setOnboardingType] = useState<'company' | 'invitation' | 'client'>('company')
    const [invitationId, setInvitationId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        companyName: "", companyDescription: "", website: "",
        selectedTeams: [] as SelectedTeam[],
    })

    useEffect(() => {
        // if (status === "unauthenticated") router.push('/signin')
        const inviteId = searchParams.get('invite')
        if (inviteId) {
            setInvitationId(inviteId)
            setOnboardingType('invitation')
        }
        if (session?.user?.role && session.user.role !== 'CLIENT') router.push('/dashboard')
    }, [session, status, searchParams, router])

    const getStepNumber = () => {
        if (currentStep === 'role-selection') return 1;
        if (currentStep === 'company-info') return 2;
        if (currentStep === 'team-setup') return 3;
        return 4;
    }

    const toggleTeam = (teamType: TeamType) => {
        const template = TEAM_TEMPLATES[teamType]
        const isSelected = formData.selectedTeams.some(t => t.type === teamType)

        if (isSelected) {
            setFormData(prev => ({ ...prev, selectedTeams: prev.selectedTeams.filter(t => t.type !== teamType) }))
        } else {
            setFormData(prev => ({
                ...prev,
                selectedTeams: [...prev.selectedTeams, {
                    type: teamType, name: template.name, displayName: template.name, headRoleTitle: "Team Lead"
                }]
            }))
        }
    }

    const updateTeamDetails = (index: number, updates: Partial<SelectedTeam>) => {
        setFormData(prev => ({
            ...prev,
            selectedTeams: prev.selectedTeams.map((team, i) => i === index ? { ...team, ...updates } : team)
        }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            if (!session?.user) throw new Error("Session Invalid")
            let result

            if (onboardingType === 'company') {
                if (!formData.companyName.trim()) throw new Error("Organization ID Required")
                if (formData.selectedTeams.length === 0) throw new Error("Minimum 1 Unit Required")
                result = await completeCompanyOnboarding({
                    email: session.user.email!, name: session.user.name || "", image: session.user.image || undefined,
                    companyName: formData.companyName, companyDescription: formData.companyDescription || undefined,
                    website: formData.website || undefined, selectedTeams: formData.selectedTeams
                })
            } else if (onboardingType === 'invitation' && invitationId) {
                result = await completeInvitationOnboarding({
                    email: session.user.email!, name: session.user.name || "", image: session.user.image || undefined, invitationId
                })
            } else {
                result = await completeClientOnboarding({
                    email: session.user.email!, name: session.user.name || "", image: session.user.image || undefined,
                })
            }

            if (result.success) {
                toast.success("System Initialized")
                window.location.href = '/dashboard'
            } else {
                throw new Error(result.error)
            }
        } catch (error: any) {
            console.log("Error occurred while onboarding", error)
            toast.error(error?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const nextStep = () => {
        if (currentStep === 'role-selection') {
            if (onboardingType === 'company') {
                setCurrentStep('company-info')
            } else {
                handleSubmit()
            }
        }
        else if (currentStep === 'company-info') setCurrentStep('team-setup')
        else if (currentStep === 'team-setup') {
            if (formData.selectedTeams.length === 0) { toast.error("Allocate at least one module"); return }
            setCurrentStep('team-details')
        } else if (currentStep === 'team-details') handleSubmit()
    }

    const prevStep = () => {
        if (currentStep === 'company-info') setCurrentStep('role-selection')
        else if (currentStep === 'team-setup') setCurrentStep('company-info')
        else if (currentStep === 'team-details') setCurrentStep('team-setup')
    }

    // Step Rendering Logic
    const renderStep = () => {
        switch (currentStep) {
            case 'role-selection':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid gap-4">
                            {
                                [
                                    { id: 'company', title: "Deploy Organization", desc: "Initialize new workspace entity.", icon: Building },
                                    { id: 'client', title: "Client Terminal", desc: "Access as external stakeholder.", icon: User },
                                    ...(invitationId ? [{ id: 'invitation', title: "Join Protocol", desc: "Accept incoming node request.", icon: Mail }] : [])
                                ].map((option) => (
                                    <div
                                        key={option.id}
                                        onClick={() => setOnboardingType(option.id as any)}
                                        className={cn(
                                            "group p-6 rounded-lg border cursor-pointer transition-all flex items-center gap-4 relative overflow-hidden",
                                            onboardingType === option.id
                                                ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white"
                                                : "bg-white text-neutral-900 border-neutral-200 hover:border-neutral-400 dark:bg-neutral-950 dark:text-white dark:border-neutral-800 dark:hover:border-neutral-600"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded flex items-center justify-center border",
                                            onboardingType === option.id
                                                ? "border-white/20 bg-white/10 dark:border-black/20 dark:bg-black/10"
                                                : "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
                                        )}>
                                            <option.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm uppercase tracking-wide">{option.title}</h3>
                                            <p className={cn("text-xs mt-1", onboardingType === option.id ? "text-white/70 dark:text-black/70" : "text-neutral-500")}>
                                                {option.desc}
                                            </p>
                                        </div>
                                        {onboardingType === option.id && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                );
            case 'company-info':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Network_ID (Name)</Label>
                                <Input
                                    value={formData.companyName}
                                    onChange={(e) => setFormData(p => ({ ...p, companyName: e.target.value }))}
                                    className="h-11 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white font-mono text-sm"
                                    placeholder="ACME_SYSTEMS"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Mission_Parameters</Label>
                                <Textarea
                                    value={formData.companyDescription}
                                    onChange={(e) => setFormData(p => ({ ...p, companyDescription: e.target.value }))}
                                    className="min-h-[100px] bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white resize-none text-sm"
                                    placeholder="Operational objectives..."
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Network_Uplink</Label>
                                <Input
                                    value={formData.website}
                                    onChange={(e) => setFormData(p => ({ ...p, website: e.target.value }))}
                                    className="h-11 bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white font-mono text-sm"
                                    placeholder="https://uplink.io"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'team-setup':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-2 gap-3">
                            {
                                Object.entries(TEAM_TEMPLATES).map(([type, template]) => {
                                    const isSelected = formData.selectedTeams.some(t => t.type === type)
                                    const Icon = template.icon
                                    return (
                                        <div
                                            key={type}
                                            onClick={() => toggleTeam(type as TeamType)}
                                            className={cn(
                                                "p-4 rounded border cursor-pointer transition-all",
                                                isSelected
                                                    ? "bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
                                                    : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                                            )}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded flex items-center justify-center transition-colors",
                                                    // Apply dynamic colors only when not selected, or always if you prefer
                                                    template.bg
                                                )}>
                                                    <Icon className={cn("w-4 h-4", template.color)} />
                                                </div>
                                                {
                                                    isSelected && (
                                                        <div className="w-4 h-4 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center">
                                                            <Check className="w-2.5 h-2.5 text-white dark:text-black" />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className="font-bold text-sm text-neutral-900 dark:text-white uppercase tracking-tight">{template.name}</div>
                                            <div className="text-[10px] text-neutral-500 uppercase tracking-wide mt-1">{template.desc}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                );
            case 'team-details':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        {
                            formData.selectedTeams.map((team, index) => (
                                <div key={team.type} className="p-5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-900">
                                        <div className={cn(
                                            "w-6 h-6 rounded flex items-center justify-center",
                                            TEAM_TEMPLATES[team.type].bg
                                        )}>
                                            <Terminal className={cn("w-3 h-3", TEAM_TEMPLATES[team.type].color)} />
                                        </div>
                                        <span className="font-bold text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                                            {TEAM_TEMPLATES[team.type].name}_CONFIG
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] uppercase font-mono text-neutral-500">Unit_Designation</Label>
                                            <Input
                                                value={team.displayName}
                                                onChange={(e) => updateTeamDetails(index, { displayName: e.target.value })}
                                                className="h-10 text-xs font-mono bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] uppercase font-mono text-neutral-500">Lead_Title</Label>
                                            <Input
                                                value={team.headRoleTitle}
                                                onChange={(e) => updateTeamDetails(index, { headRoleTitle: e.target.value })}
                                                className="h-10 text-xs font-mono bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                );
        }
    }

    return (
        <div className="min-h-screen w-full flex bg-neutral-100 dark:bg-black font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black items-center justify-center p-4">
            <div className="w-full max-w-7xl bg-white dark:bg-neutral-950 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden grid lg:grid-cols-2 min-h-[800px]">
                <div className="hidden lg:block relative">
                    <OnboardingMonitor step={getStepNumber()} />
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-24 overflow-y-auto">
                    <div className="w-full max-w-md mx-auto">
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold tracking-tighter mb-2 text-neutral-900 dark:text-white">
                                {currentStep === 'role-selection' && "Identity Protocol"}
                                {currentStep === 'company-info' && "Entity Metadata"}
                                {currentStep === 'team-setup' && "Unit Allocation"}
                                {currentStep === 'team-details' && "Configure Parameters"}
                            </h2>
                            <p className="text-sm text-neutral-500 font-mono">
                                Sequence {getStepNumber()}/4
                            </p>
                        </div>
                        <div className="min-h-[400px]">
                            {renderStep()}
                        </div>
                        <div className="flex justify-between items-center mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-900">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={currentStep === 'role-selection' || loading}
                                className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Return
                            </Button>
                            <Button
                                onClick={nextStep}
                                disabled={loading}
                                className="bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold uppercase tracking-widest px-8 h-11 rounded-md"
                            >
                                {
                                    loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                        <>
                                            {currentStep === 'team-details' || (onboardingType !== 'company' && currentStep === 'role-selection') ? 'Initialize System' : 'Proceed'}
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </>
                                    )
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function OnboardingPage() {
    return <Suspense fallback={<div>Loading...</div>}><OnboardingContent /></Suspense>
}