import { auth } from "@/auth"
import { getInvitationByToken, acceptInvitation } from "@/actions/invitations.action"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
    Building2, Users, Crown, CheckCircle, XCircle, Mail,
    Code, Megaphone, ShoppingCart, Palette, Briefcase, Settings
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
            <div className="container mx-auto py-8 max-w-md">
                <Card className="text-center">
                    <CardContent className="py-8">
                        <XCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Invalid Invitation</h1>
                        <p className="text-muted-foreground">
                            {invitationResult.error || "This invitation link is invalid or has expired."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { invitation } = invitationResult
    const IconComponent = (invitation.team?.teamType && TEAM_ICONS[invitation.team.teamType]) || Users

    // Check if invitation is already accepted or expired
    if (invitation.status === InvitationStatus.ACCEPTED) {
        return (
            <div className="container mx-auto py-8 max-w-md">
                <Card className="text-center">
                    <CardContent className="py-8">
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Already Accepted</h1>
                        <p className="text-muted-foreground mb-4">
                            This invitation has already been accepted.
                        </p>
                        {session?.user ? (
                            <Button onClick={() => redirect('/dashboard')}>
                                Go to Dashboard
                            </Button>
                        ) : (
                            <Button onClick={() => redirect('/signin')}>
                                Sign In
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (invitation.status === InvitationStatus.DECLINED || invitation.expiresAt < new Date()) {
        return (
            <div className="container mx-auto py-8 max-w-md">
                <Card className="text-center">
                    <CardContent className="py-8">
                        <XCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
                        <h1 className="text-2xl font-bold mb-2">
                            {invitation.status === InvitationStatus.DECLINED ? "Invitation Declined" : "Invitation Expired"}
                        </h1>
                        <p className="text-muted-foreground">
                            {invitation.status === InvitationStatus.DECLINED 
                                ? "This invitation has been declined."
                                : "This invitation has expired. Please contact your administrator for a new invitation."
                            }
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <Mail className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                    <h1 className="text-3xl font-bold">You&apos;re Invited!</h1>
                    <p className="text-muted-foreground mt-2">
                        Join a team and start collaborating on projects
                    </p>
                </div>

                {/* Invitation Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            Invitation Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Company Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold">{invitation.company?.name}</p>
                                <p className="text-sm text-muted-foreground">Company</p>
                            </div>
                        </div>

                        {/* Team Info */}
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{ 
                                    backgroundColor: invitation.team?.color ? `${invitation.team.color}15` : '#f3f4f6',
                                    color: invitation.team?.color || '#6b7280'
                                }}
                            >
                                <IconComponent className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold">{invitation.team?.displayName}</p>
                                <p className="text-sm text-muted-foreground">
                                    {invitation.team?.teamType ? 
                                        invitation.team.teamType.charAt(0) + invitation.team.teamType.slice(1).toLowerCase() + " Team" :
                                        "Team"
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Role Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                {invitation.type === 'TEAM_HEAD' ? (
                                    <Crown className="w-6 h-6 text-yellow-600" />
                                ) : (
                                    <Users className="w-6 h-6 text-gray-600" />
                                )}
                            </div>
                            <div>
                                <p className="font-semibold">{invitation.roleTitle}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground">Role</p>
                                    {invitation.type === 'TEAM_HEAD' && (
                                        <Badge variant="secondary" className="text-xs">
                                            Team Head
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sender Info */}
                        <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={invitation.sender?.image || undefined} />
                                <AvatarFallback>
                                    {invitation.sender?.name?.[0] || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{invitation.sender?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    Invited by • {invitation.createdAt.toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Personal Message */}
                        {invitation.message && (
                            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded-r-lg">
                                <p className="text-sm font-medium text-blue-900 mb-1">Personal Message</p>
                                <p className="text-sm text-blue-800">{invitation.message}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Accept Form */}
                <AcceptInvitationForm 
                    invitation={invitation}
                    isAuthenticated={!!session?.user}
                    currentUserEmail={session?.user?.email}
                />
            </div>
        </div>
    )
}