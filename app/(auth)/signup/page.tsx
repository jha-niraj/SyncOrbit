"use client"

import type React from "react"
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    Loader2, Building2, Eye, EyeOff, Check, X,
    Terminal, ShieldCheck, Cpu, Activity, Server, Radio
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { Company, Role } from "@prisma/client";
import { RegistrationData } from "@/types/user";

// --- Visual Component: The System Terminal (Left Panel) ---
const SystemTerminal = () => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        const logs = [
            "> INITIALIZING_ORBITAL_UPLINK...",
            "> ESTABLISHING_SECURE_HANDSHAKE...",
            "> VERIFYING_PROTOCOL_VERSION... [v2.4.0]",
            "> CONNECTING_TO_MAIN_GRID... SUCCESS",
            "> WAITING_FOR_USER_CREDENTIALS..."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                setLines(prev => [...prev, logs[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-full w-full bg-neutral-950 flex flex-col p-12 overflow-hidden border-r border-neutral-800">
            {/* Background Grids */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Top Badge */}
            <div className="relative z-10 flex justify-between items-start mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-neutral-800 bg-neutral-900/50 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">System_Online</span>
                </div>
                <Radio className="w-5 h-5 text-neutral-700 animate-pulse" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 mb-auto">
                <h1 className="text-5xl font-bold text-white tracking-tighter mb-6 leading-[0.95]">
                    Initialize <br /> <span className="text-neutral-500">Workspace.</span>
                </h1>

                {/* Simulated Terminal */}
                <div className="font-mono text-xs text-green-500/80 space-y-2 mb-8 min-h-[100px]">
                    {lines.map((line, idx) => (
                        <p key={idx} className="animate-in fade-in slide-in-from-left-2 duration-300">{line}</p>
                    ))}
                    <span className="inline-block w-2 h-4 bg-green-500/50 animate-pulse align-middle"></span>
                </div>
            </div>

            {/* Bottom Stats Grid (Filling Space) */}
            <div className="relative z-10 grid grid-cols-2 gap-px bg-neutral-800 border border-neutral-800 rounded-lg overflow-hidden mt-12">
                <div className="bg-neutral-900/50 p-6 backdrop-blur-sm group hover:bg-neutral-900 transition-colors">
                    <Cpu className="w-5 h-5 text-neutral-400 mb-3 group-hover:text-white transition-colors" />
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">Architecture</div>
                    <div className="text-sm font-bold text-white">Distributed</div>
                </div>
                <div className="bg-neutral-900/50 p-6 backdrop-blur-sm group hover:bg-neutral-900 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-neutral-400 mb-3 group-hover:text-white transition-colors" />
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">Security</div>
                    <div className="text-sm font-bold text-white">AES-256</div>
                </div>
                <div className="bg-neutral-900/50 p-6 backdrop-blur-sm group hover:bg-neutral-900 transition-colors">
                    <Activity className="w-5 h-5 text-neutral-400 mb-3 group-hover:text-white transition-colors" />
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">Uptime</div>
                    <div className="text-sm font-bold text-white">99.99%</div>
                </div>
                <div className="bg-neutral-900/50 p-6 backdrop-blur-sm group hover:bg-neutral-900 transition-colors">
                    <Server className="w-5 h-5 text-neutral-400 mb-3 group-hover:text-white transition-colors" />
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">Database</div>
                    <div className="text-sm font-bold text-white">Sharded</div>
                </div>
            </div>
        </div>
    );
}

function SignUpForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    // const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [referralCode, setReferralCode] = useState("")
    const [role, setRole] = useState<Role>(Role.COMPANY_OWNER)
    const [companyName, setCompanyName] = useState("")
    const [company, setCompany] = useState<Company | null>(null)
    const [validatingReferral, setValidatingReferral] = useState(false)
    const [referralValidated, setReferralValidated] = useState(false)

    // Password validation states
    const [passwordValidation, setPasswordValidation] = useState({
        hasCapital: false, hasNumber: false, hasSpecial: false, hasMinLength: false
    })

    useEffect(() => {
        setPasswordValidation({
            hasCapital: /[A-Z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasMinLength: password.length >= 8
        })
    }, [password])

    const searchParams = useSearchParams()
    // const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
    const urlReferralCode = searchParams.get("ref")
    const urlRole = searchParams.get("role") as Role | null

    useEffect(() => {
        if (urlReferralCode) {
            setReferralCode(urlReferralCode)
            validateReferralCode(urlReferralCode)
        }
        if (urlRole && ['CLIENT', 'DEVELOPER', 'COMPANY_OWNER'].includes(urlRole)) {
            setRole(urlRole)
        }
    }, [urlReferralCode, urlRole])

    const validateReferralCode = async (code: string) => {
        if (!code.trim()) {
            setCompany(null)
            setReferralValidated(false)
            return
        }
        setValidatingReferral(true)
        try {
            const response = await axios.post('/api/referral-codes/validate', { code })
            if (response.data.success && response.data.referralCode) {
                const referralData = response.data.referralCode
                setCompany(referralData.company)
                setRole(referralData.role)
                setReferralValidated(true)
                toast.success(`Protocol validated: ${referralData.company.name}`)
            }
        } catch (error) {
            setCompany(null)
            setReferralValidated(false)
            console.log("Error occurred while validating referral code", error)
            toast.error("Invalid protocol code")
        } finally {
            setValidatingReferral(false)
        }
    }

    const handleReferralCodeChange = (value: string) => {
        setReferralCode(value)
        setTimeout(() => validateReferralCode(value), 500)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const requestData: RegistrationData = { name, email, password, role }

            if (referralCode && referralValidated && company) {
                requestData.referralCode = referralCode
                requestData.companyId = company.id
                const teamId = searchParams.get("team")
                if (teamId) requestData.teamId = teamId
            }

            if (role === 'COMPANY_OWNER') {
                if (!companyName.trim()) {
                    toast.error("Organization ID required")
                    setIsLoading(false)
                    return
                }
                const generatedSlug = companyName.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '').substring(0, 20)
                requestData.companyName = companyName
                requestData.companyShortName = generatedSlug
            }

            const response = await axios.post('/api/register', requestData)
            if (response.data.success) {
                toast.success('Identity Created. Verify communication channel.')
                router.push(`/verifyemail?email=${encodeURIComponent(email)}`)
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.error) {
                toast.error(error.response.data.error)
            } else {
                toast.error('Initialization Failed')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-neutral-100 dark:bg-neutral-950 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
            <div className="w-full max-w-7xl bg-white dark:bg-neutral-950 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden grid lg:grid-cols-2 min-h-[800px]">
                <div className="hidden lg:block relative">
                    <SystemTerminal />
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-16 overflow-y-auto bg-white dark:bg-neutral-950">
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Terminal className="w-5 h-5 text-neutral-900 dark:text-white" />
                                <span className="text-sm font-mono font-bold uppercase tracking-widest text-neutral-500">New_User_Protocol</span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter text-neutral-900 dark:text-white">Create Identity</h2>
                            <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">Enter credentials to access the grid.</p>
                        </div>
                        {
                            company && referralValidated && (
                                <div className="mb-8 p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="h-4 w-4 text-neutral-900 dark:text-white" />
                                        <div>
                                            <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">Linking To</p>
                                            <p className="font-bold text-sm text-neutral-900 dark:text-white">{company.name}</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                </div>
                            )
                        }
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className={`space-y-1.5 ${role === "COMPANY_OWNER" ? "w-full" : "sm:w-1/2"}`}>
                                    <Label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Role_Type</Label>
                                    <Select value={role} onValueChange={(value: Role) => setRole(value)}>
                                        <SelectTrigger className="h-11 rounded-md border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white font-mono text-xs">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-neutral-900 dark:border-neutral-800">
                                            <SelectItem value={Role.COMPANY_OWNER}>Owner</SelectItem>
                                            <SelectItem value={Role.TEAM_HEAD}>Team Lead</SelectItem>
                                            <SelectItem value={Role.TEAM_MEMBER}>Member</SelectItem>
                                            <SelectItem value={Role.CLIENT}>Client</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {
                                    role !== 'COMPANY_OWNER' && (
                                        <div className="space-y-1.5 sm:w-1/2">
                                            <Label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Ref_Code</Label>
                                            <div className="relative">
                                                <Input
                                                    value={referralCode}
                                                    onChange={(e) => handleReferralCodeChange(e.target.value)}
                                                    disabled={isLoading}
                                                    className="h-11 rounded-md border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 font-mono text-xs pr-8"
                                                    placeholder="Code..."
                                                />
                                                {validatingReferral && <Loader2 className="absolute right-2.5 top-3.5 h-3 w-3 animate-spin text-neutral-400" />}
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            {
                                role === 'COMPANY_OWNER' && (
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Organization_ID</Label>
                                        <Input
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            required
                                            className="h-11 rounded-md border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                                            placeholder="Acme Corp"
                                        />
                                    </div>
                                )
                            }
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-mono uppercase font-bold text-neutral-500">User_Name</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="h-11 rounded-md border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                                        placeholder="J. Doe"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Email_Address</Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-11 rounded-md border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                                        placeholder="name@corp.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Access_Key</Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 rounded-md border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {
                                    password.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 pt-2">
                                            {
                                                [
                                                    { label: "8+ Char", valid: passwordValidation.hasMinLength },
                                                    { label: "Uppercase", valid: passwordValidation.hasCapital },
                                                    { label: "Number", valid: passwordValidation.hasNumber },
                                                    { label: "Special", valid: passwordValidation.hasSpecial },
                                                ].map((req, i) => (
                                                    <div key={i} className="flex items-center gap-1.5">
                                                        {req.valid ? <Check className="w-3 h-3 text-neutral-900 dark:text-white" /> : <X className="w-3 h-3 text-neutral-300 dark:text-neutral-700" />}
                                                        <span className={`text-[10px] uppercase font-mono ${req.valid ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-600"}`}>{req.label}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                            <div className="flex items-start space-x-3 pt-2">
                                <Checkbox id="terms" required className="mt-1 border-neutral-300 dark:border-neutral-700" />
                                <label htmlFor="terms" className="text-xs text-neutral-500 leading-relaxed">
                                    I accept the <Link href="/terms" className="underline hover:text-neutral-900 dark:hover:text-white">Protocol Terms</Link> and <Link href="/privacy" className="underline hover:text-neutral-900 dark:hover:text-white">Privacy Data Policy</Link>.
                                </label>
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold uppercase tracking-widest text-xs rounded-md transition-all"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initialize Identity"}
                            </Button>
                        </form>
                        <div className="mt-8 text-center pt-8 border-t border-neutral-100 dark:border-neutral-900">
                            <p className="text-sm text-neutral-500">
                                Already initialized?{" "}
                                <Link href="/signin" className="text-neutral-900 dark:text-white font-bold hover:underline">
                                    Access Terminal
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-white dark:bg-neutral-950"><Loader2 className="h-6 w-6 animate-spin text-neutral-500" /></div>}>
            <SignUpForm />
        </Suspense>
    )
}