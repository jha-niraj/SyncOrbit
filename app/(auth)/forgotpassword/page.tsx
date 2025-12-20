"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Mail, ArrowLeft, Shield
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import axios from "axios"

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) { toast.error("Email required"); return }
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/forgot-password', { email })
            if (response.status === 200) {
                setIsSubmitted(true)
                toast.success('Recovery sequence initiated.')
            }
        } catch (error) {
            toast.error("Sequence Failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center p-4 font-sans">
                <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-8 h-8 text-neutral-900 dark:text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Transmission Sent</h2>
                        <p className="text-sm text-neutral-500">
                            A recovery token has been dispatched to <span className="font-mono text-neutral-900 dark:text-white">{email}</span>.
                        </p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded border border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 mb-6 font-mono">
                        - Check_Inbox<br />
                        - Check_Spam_Filter<br />
                        - Link_Expires_In: 15m
                    </div>
                    <Button
                        onClick={() => { setIsSubmitted(false); setEmail("") }}
                        variant="outline"
                        className="w-full border-neutral-200 dark:border-neutral-800"
                    >
                        Resend Transmission
                    </Button>
                    <div className="mt-6 text-center">
                        <Link href="/signin" className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-white dark:bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="w-full max-w-md relative z-10 px-4">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-neutral-900 dark:text-white" />
                        <span className="font-bold text-xl tracking-tighter text-neutral-900 dark:text-white">SyncOrbit</span>
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Account Recovery</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Initialize password reset protocol.</p>
                </div>
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-mono uppercase font-bold text-neutral-500">
                                Target_Identity (Email)
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@corp.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isSubmitting}
                                className="h-11 rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white font-mono text-sm"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black rounded-md font-bold uppercase tracking-widest text-xs transition-all"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : "Send Reset Token"}
                        </Button>
                    </form>
                </div>
                <div className="mt-8 text-center">
                    <Link href="/signin" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors group">
                        <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Abort Sequence
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function ForgetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ForgotPassword />
        </Suspense>
    )
}