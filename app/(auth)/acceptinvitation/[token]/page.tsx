import { auth } from "@/auth"
import { getInvitationByToken } from "@/actions/invitations.action"
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar"
import {
    Building2, Users, Crown, CheckCircle, XCircle, Code, Megaphone,
    ShoppingCart, Palette, Briefcase, Settings, ShieldCheck, Terminal
} from "lucide-react"
import { TeamType, InvitationStatus } from "@prisma/client"
import { redirect } from "next/navigation"
import { AcceptInvitationForm } from "@/components/invitations/AcceptInvitationForm"

// Team type icon mapping
const TEAM_ICONS = {
    [TeamType.TECHNICAL]: Code,
    [TeamType.MARKETING]: Megaphone,
    [TeamType.SALES]: ShoppingCart,
    [TeamType.DESIGN]: Palette,
    [TeamType.OPERATIONS]: Settings,
    [TeamType.FINANCE]: Briefcase,
    [TeamType.CUSTOM]: Users,
}

interface AcceptInvitationPageProps {
    params: Promise<{ token: string }>
}

export default async function AcceptInvitationPage({ params }: AcceptInvitationPageProps) {
    const session = await auth()
    const { token } = await params;

    // Get invitation details
    const invitationResult = await getInvitationByToken(token)

    if (!invitationResult.success || !invitationResult.invitation) {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center p-4 font-sans">
                <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 text-center shadow-xl">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-md flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
                    </div>
                    <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">Invalid Protocol</h1>
                    <p className="text-neutral-500 text-sm font-mono">{invitationResult.error || "Token_Expired_Or_Invalid"}</p>
                </div>
            </div>
        )
    }

    const { invitation } = invitationResult
    const IconComponent = (invitation.team?.teamType && TEAM_ICONS[invitation.team.teamType]) || Users

    // Check if invitation is already accepted or expired
    if (invitation.status === InvitationStatus.ACCEPTED) {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center p-4 font-sans">
                <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 text-center shadow-xl">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-md flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />
                    </div>
                    <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">Access Granted</h1>
                    <p className="text-neutral-500 text-sm mb-6">This node has already been initialized.</p>
                    <form action={async () => { 'use server'; redirect(session?.user ? '/dashboard' : '/signin') }}>
                        <Button className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-mono text-xs uppercase tracking-widest">
                            {session?.user ? "Enter_Dashboard" : "Authenticate"}
                        </Button>
                    </form>
                </div>
            </div>
        )
    }

    if (invitation.status === InvitationStatus.DECLINED || invitation.expiresAt < new Date()) {
        return (
            <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center p-4 font-sans">
                <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 text-center shadow-xl">
                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-md flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-6 h-6 text-neutral-500" />
                    </div>
                    <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
                        {invitation.status === InvitationStatus.DECLINED ? "Protocol Declined" : "Token Expired"}
                    </h1>
                    <p className="text-neutral-500 text-sm">
                        Please request a new initialization sequence from the administrator.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col items-center justify-center p-4 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>
            <div className="w-full max-w-lg relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 mb-4">
                        <Terminal className="w-3 h-3 text-neutral-900 dark:text-white" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Incoming_Transmission</span>
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tighter">Team Invitation</h1>
                </div>
                <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-2xl">
                    <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
                        <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-neutral-500">
                            <ShieldCheck className="w-4 h-4" />
                            Invitation_Manifest
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-lg">
                            <div className="w-10 h-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-neutral-900 dark:text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-neutral-900 dark:text-white">{invitation.company?.name}</p>
                                <p className="text-xs font-mono text-neutral-500 uppercase">Organization_Node</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 border border-neutral-100 dark:border-neutral-800 rounded-lg">
                                <div className="flex items-center gap-2 mb-2 text-neutral-500">
                                    <IconComponent className="w-4 h-4" />
                                    <span className="text-[10px] font-mono uppercase">Target_Team</span>
                                </div>
                                <p className="font-medium text-sm">{invitation.team?.displayName}</p>
                            </div>
                            <div className="p-3 border border-neutral-100 dark:border-neutral-800 rounded-lg">
                                <div className="flex items-center gap-2 mb-2 text-neutral-500">
                                    {invitation.type === 'TEAM_HEAD' ? <Crown className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                    <span className="text-[10px] font-mono uppercase">Assigned_Role</span>
                                </div>
                                <p className="font-medium text-sm">{invitation.roleTitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <Avatar className="w-8 h-8 border border-neutral-200 dark:border-neutral-800">
                                <AvatarImage src={invitation.sender?.image || undefined} />
                                <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-xs font-mono">
                                    {invitation.sender?.name?.[0] || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                    Initialized by <span className="font-bold">{invitation.sender?.name}</span>
                                </p>
                                <p className="text-[10px] font-mono text-neutral-400">
                                    {new Date(invitation.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {
                            invitation.message && (
                                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border-l-2 border-neutral-900 dark:border-white text-sm text-neutral-600 dark:text-neutral-400 font-mono">
                                    "{invitation.message}"
                                </div>
                            )
                        }

                        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <AcceptInvitationForm
                                invitation={{ ...invitation, token }}
                                isAuthenticated={!!session?.user}
                                currentUserEmail={session?.user?.email}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}