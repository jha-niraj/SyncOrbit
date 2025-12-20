"use client"

import { useState } from "react"
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
    CheckCircle, XCircle, Mail, AlertCircle, Loader2, ExternalLink,
    Terminal, ShieldCheck
} from "lucide-react"
import { acceptInvitationByToken } from "@/actions/invitations.action"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Invitation {
    token: string
    email: string
    roleTitle: string | null
    company?: {
        name: string | null
    } | null
    team?: {
        displayName: string | null
    } | null
    sender?: {
        name: string | null
    } | null
}

interface AcceptInvitationFormProps {
    invitation: Invitation
    isAuthenticated: boolean
    currentUserEmail?: string | null
}

export function AcceptInvitationForm({
    invitation,
    isAuthenticated,
    currentUserEmail
}: AcceptInvitationFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>("")
    const [success, setSuccess] = useState(false)

    // Check if user is authenticated with different email
    const isWrongUser = isAuthenticated && currentUserEmail !== invitation.email

    const handleAccept = async () => {
        setIsLoading(true)
        setError("")

        try {
            const result = await acceptInvitationByToken(invitation.token)

            if (result.success) {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/dashboard')
                }, 2000)
            } else {
                setError(result.error || "Protocol Handshake Failed")
            }
        } catch (err: unknown) {
            console.log("Error occurred while accepting the invitation: " + err);
            setError("System Error: Handshake Interrupted")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDecline = async () => {
        setIsLoading(true)
        setError("")
        try {
            router.push('/')
        } catch (err: unknown) {
            setError("System Error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignInWithCorrectAccount = () => {
        signIn("google", {
            callbackUrl: `/accept-invitation/${invitation.token}`,
            prompt: "select_account"
        })
    }

    const handleCreateAccount = () => {
        signIn("google", {
            callbackUrl: `/accept-invitation/${invitation.token}`
        })
    }

    if (success) {
        return (
            <Card className="text-center bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-xl">
                <CardContent className="py-12">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">Access Granted</h2>
                    <p className="text-neutral-500 mb-6 text-sm">
                        Initializing workspace for <span className="font-bold text-neutral-900 dark:text-white">{invitation.company?.name}</span>...
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded text-xs font-mono text-neutral-600 dark:text-neutral-400 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        REDIRECTING_TO_DASHBOARD...
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-4 bg-neutral-50/50 dark:bg-neutral-900/50">
                <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-neutral-500">
                    <Terminal className="w-4 h-4" />
                    Access_Protocol_v2
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
                {
                    error && (
                        <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="font-mono text-xs">{error}</AlertDescription>
                        </Alert>
                    )
                }
                {
                    isWrongUser && (
                        <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900">
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                            <AlertDescription className="text-amber-800 dark:text-amber-200 text-xs">
                                Identity Mismatch: Active session <strong>{currentUserEmail}</strong> does not match target <strong>{invitation.email}</strong>.
                            </AlertDescription>
                        </Alert>
                    )
                }
                <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg">
                    <p className="text-[10px] font-mono uppercase text-neutral-500 mb-3 tracking-widest">Protocol_Target</p>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm border-b border-neutral-200 dark:border-neutral-800 pb-2">
                            <span className="text-neutral-500">Organization</span>
                            <span className="font-bold text-neutral-900 dark:text-white">{invitation.company?.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-neutral-200 dark:border-neutral-800 pb-2">
                            <span className="text-neutral-500">Role Designation</span>
                            <span className="font-mono text-neutral-900 dark:text-white">{invitation.roleTitle}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-500">Unit Assignment</span>
                            <span className="font-mono text-neutral-900 dark:text-white">{invitation.team?.displayName}</span>
                        </div>
                    </div>
                </div>
                {
                    !isAuthenticated && (
                        <div className="space-y-6 text-center">
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Authentication Required</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Verify identity as <span className="font-mono text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{invitation.email}</span> to proceed.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <Button
                                    onClick={handleCreateAccount}
                                    className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold uppercase tracking-widest text-xs h-11"
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Initialize via Google
                                </Button>

                                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">
                                    Secure Connection Established
                                </p>
                            </div>
                        </div>
                    )
                }
                {
                    isWrongUser && (
                        <div className="space-y-6 text-center">
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Switch Identity</h3>
                                <p className="text-sm text-neutral-500">
                                    Please authenticate with the invited credentials.
                                </p>
                            </div>

                            <Button
                                onClick={handleSignInWithCorrectAccount}
                                className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-bold uppercase tracking-widest text-xs h-11"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Auth as {invitation.email}
                            </Button>
                        </div>
                    )
                }
                {
                    isAuthenticated && !isWrongUser && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium border border-green-200 dark:border-green-800 mb-4">
                                    <ShieldCheck className="w-3 h-3" /> Identity Verified
                                </div>
                                <p className="text-sm text-neutral-500">
                                    Ready to initialize workspace uplink?
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    onClick={handleDecline}
                                    variant="outline"
                                    className="flex-1 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-bold uppercase tracking-widest h-11"
                                    disabled={isLoading}
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Abort
                                </Button>
                                <Button
                                    onClick={handleAccept}
                                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-bold uppercase tracking-widest h-11"
                                    disabled={isLoading}
                                >
                                    {
                                        isLoading ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                        )
                                    }
                                    Confirm Access
                                </Button>
                            </div>
                        </div>
                    )
                }

                <Separator className="bg-neutral-100 dark:bg-neutral-800" />

                <div className="text-center pb-2">
                    <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-wide">
                        Administrator: <span className="text-neutral-600 dark:text-neutral-300 font-bold">{invitation.sender?.name}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}