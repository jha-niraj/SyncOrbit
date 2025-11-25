"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import axios from "axios"

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error("Please enter your email address")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await axios.post('/api/forgot-password', { email })

            if (response.status === 200) {
                setIsSubmitted(true)
                toast.success('Password reset instructions sent to your email')
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || 'Failed to send reset email'
                toast.error(errorMessage)
            } else {
                toast.error("Failed to send reset email")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen w-full bg-white dark:bg-neutral-950 flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <svg
                        className="w-full h-full text-neutral-950 dark:text-white opacity-[0.02]"
                        viewBox="0 0 696 316"
                        fill="none"
                    >
                        <path
                            d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875"
                            stroke="currentColor"
                            strokeWidth="0.5"
                        />
                        <path
                            d="M-375 -183C-375 -183 -307 222 157 349C621 476 689 881 689 881"
                            stroke="currentColor"
                            strokeWidth="0.6"
                        />
                        <path
                            d="M-370 -177C-370 -177 -302 228 162 355C626 482 694 887 694 887"
                            stroke="currentColor"
                            strokeWidth="0.7"
                        />
                    </svg>
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-md relative z-10">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300">
                                SyncOrbit
                            </h1>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 mx-auto"></div>
                        </div>
                        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-neutral-200/20 dark:border-neutral-800/20 p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Check Your Email</h2>
                                <p className="text-neutral-600 dark:text-neutral-400 mt-2">We&apos;ve sent password reset instructions to {email}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center py-8 space-y-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                                    <CheckCircle className="w-10 h-10 text-white" />
                                </div>
                                <div className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-start space-x-3">
                                        <Mail className="w-5 h-5 text-neutral-600 dark:text-neutral-400 mt-0.5" />
                                        <div className="text-sm text-neutral-700 dark:text-neutral-300">
                                            <p className="font-medium mb-1">Check your email</p>
                                            <p>If an account with that email exists, you&apos;ll receive a password reset link within a few minutes.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center space-y-4">
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Didn&apos;t receive an email? Check your spam folder or{" "}
                                        <button
                                            onClick={() => {
                                                setIsSubmitted(false)
                                                setEmail("")
                                            }}
                                            className="font-medium text-neutral-900 dark:text-white hover:underline"
                                        >
                                            try again
                                        </button>
                                    </p>
                                    <Link
                                        href="/signin"
                                        className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                    >
                                        ← Back to sign in
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-white dark:bg-neutral-950 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <svg
                    className="w-full h-full text-neutral-950 dark:text-white opacity-[0.02]"
                    viewBox="0 0 696 316"
                    fill="none"
                >
                    <path
                        d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875"
                        stroke="currentColor"
                        strokeWidth="0.5"
                    />
                    <path
                        d="M-375 -183C-375 -183 -307 222 157 349C621 476 689 881 689 881"
                        stroke="currentColor"
                        strokeWidth="0.6"
                    />
                    <path
                        d="M-370 -177C-370 -177 -302 228 162 355C626 482 694 887 694 887"
                        stroke="currentColor"
                        strokeWidth="0.7"
                    />
                </svg>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300">
                            SyncOrbit
                        </h1>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 mx-auto"></div>
                    </div>
                    <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-neutral-200/20 dark:border-neutral-800/20 p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Reset your password</h2>
                            <p className="text-neutral-600 dark:text-neutral-400 mt-2">Enter your email address and we&apos;ll send you a link to reset your password</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-300 font-medium">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    className="h-12 rounded-2xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-0 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-2xl font-semibold transition-all duration-200 hover:shadow-lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Sending..." : "Send reset link"}
                            </Button>
                            <div className="text-center">
                                <Link
                                    href="/signin"
                                    className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                >
                                    ← Back to sign in
                                </Link>
                            </div>
                        </form>
                    </div>
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