"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
    CheckCircle, XCircle, User, Mail, AlertCircle, 
    Loader2, ExternalLink
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
                // Redirect to dashboard after short delay
                setTimeout(() => {
                    router.push('/dashboard')
                }, 2000)
            } else {
                setError(result.error || "Failed to accept invitation")
            }
        } catch (err: unknown) {
            console.log("Error occurred while accepting the invitation: " + err);
            setError("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDecline = async () => {
        setIsLoading(true)
        setError("")

        try {
            // You may want to create a declineInvitation action
            // For now, just redirect
            router.push('/')
        } catch (err: unknown) {
            console.log("Error occurred while declining the invitation: " + err);
            setError("An unexpected error occurred")
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
            <Card className="text-center">
                <CardContent className="py-8">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-green-700 mb-2">Welcome to the team!</h2>
                    <p className="text-muted-foreground mb-4">
                        You&apos;ve successfully joined {invitation.company?.name} as {invitation.roleTitle}.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Redirecting you to your dashboard...
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Accept Invitation
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Wrong User Warning */}
                {isWrongUser && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            You&apos;re signed in as <strong>{currentUserEmail}</strong>, but this invitation is for{" "}
                            <strong>{invitation.email}</strong>. Please sign in with the correct account.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Invitation Details Summary */}
                <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">You&apos;re being invited to join:</p>
                    <div className="space-y-1">
                        <p className="font-medium">{invitation.company?.name}</p>
                        <p className="text-sm">
                            as <strong>{invitation.roleTitle}</strong> in the <strong>{invitation.team?.displayName}</strong> team
                        </p>
                    </div>
                </div>

                {/* Authentication Required */}
                {!isAuthenticated && (
                    <div className="space-y-4">
                        <div className="text-center">
                            <h3 className="font-semibold mb-2">Sign in to accept this invitation</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                You need to sign in with <strong>{invitation.email}</strong> to accept this invitation.
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <Button 
                                onClick={handleCreateAccount}
                                className="w-full"
                                size="lg"
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Sign in with Google
                            </Button>
                            
                            <p className="text-xs text-center text-muted-foreground">
                                By signing in, you agree to join the team and accept the invitation.
                            </p>
                        </div>
                    </div>
                )}

                {/* Wrong User - Show Sign In Option */}
                {isWrongUser && (
                    <div className="space-y-4">
                        <div className="text-center">
                            <h3 className="font-semibold mb-2">Sign in with the invited account</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Please sign in with <strong>{invitation.email}</strong> to accept this invitation.
                            </p>
                        </div>
                        
                        <Button 
                            onClick={handleSignInWithCorrectAccount}
                            className="w-full"
                            size="lg"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Sign in with {invitation.email}
                        </Button>
                    </div>
                )}

                {/* Correct User - Show Accept/Decline */}
                {isAuthenticated && !isWrongUser && (
                    <div className="space-y-4">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-4">
                                Ready to join the team? Click accept to get started.
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <Button
                                onClick={handleDecline}
                                variant="outline"
                                className="flex-1"
                                disabled={isLoading}
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Decline
                            </Button>
                            <Button
                                onClick={handleAccept}
                                className="flex-1"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                )}
                                Accept Invitation
                            </Button>
                        </div>
                    </div>
                )}

                <Separator />

                {/* Help Text */}
                <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                        Having trouble? Contact{" "}
                        <strong>{invitation.sender?.name}</strong> or your system administrator.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}