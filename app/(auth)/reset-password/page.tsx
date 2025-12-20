"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Eye, EyeOff, CheckCircle, AlertCircle, Key
} from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

function ResetPassword() {
    const searchParams = useSearchParams()
    const [token, setToken] = useState<string | null>(null)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        const tokenParam = searchParams.get('token')
        if (tokenParam) {
            setToken(tokenParam)
            validateToken(tokenParam)
        } else {
            setIsValidToken(false)
        }
    }, [searchParams])

    const validateToken = async (tokenValue: string) => {
        try {
            const response = await axios.post('/api/validate-reset-token', { token: tokenValue })
            setIsValidToken(response.status === 200)
        } catch { setIsValidToken(false) }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) { toast.error("Mismatch"); return }
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/reset-password', { token, newPassword })
            if (response.status === 200) { setIsSuccess(true); toast.success('Credentials Updated') }
        } catch { toast.error("Update Failed") } finally { setIsSubmitting(false) }
    }

    if (isValidToken === null) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950 font-mono text-xs">
                - VERIFYING_TOKEN...
            </div>
        )
    }

    if (!isValidToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 font-sans p-4">
                <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-900/30 rounded-lg p-8 text-center shadow-xl">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Token Invalid</h2>
                    <p className="text-sm text-neutral-500 mb-6">The recovery link has expired or is malformed.</p>
                    <Link href="/forgotpassword">
                        <Button variant="outline" className="w-full">Restart Recovery</Button>
                    </Link>
                </div>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 font-sans p-4">
                <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-green-200 dark:border-green-900/30 rounded-lg p-8 text-center shadow-xl">
                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Update Complete</h2>
                    <p className="text-sm text-neutral-500 mb-6">Your access key has been successfully rotated.</p>
                    <Link href="/signin">
                        <Button className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-bold uppercase text-xs tracking-widest">
                            Proceed to Login
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-white dark:bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10 px-4">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Key className="w-5 h-5 text-neutral-900 dark:text-white" />
                        <span className="font-bold text-xl tracking-tighter text-neutral-900 dark:text-white">SyncOrbit</span>
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Set New Key</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Establish new security credentials.</p>
                </div>
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-mono uppercase font-bold text-neutral-500">New_Access_Key</Label>
                            <div className="relative">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="h-11 rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 pr-10 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                                />
                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3.5 text-neutral-400">
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Confirm_Key</Label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="h-11 rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 pr-10 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-neutral-400">
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black rounded-md font-bold uppercase tracking-widest text-xs transition-all"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Updating..." : "Update Credentials"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return <Suspense fallback={<div>Loading...</div>}><ResetPassword /></Suspense>
}