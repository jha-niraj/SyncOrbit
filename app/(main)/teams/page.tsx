import { auth } from "@/auth"
import { getCompanyTeams } from "@/actions/teams.action"
import { getUserInvitations } from "@/actions/invitations.action"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Users, Plus, Settings, Mail, Crown, Code, Megaphone, ShoppingCart, Palette, 
    Briefcase, MoreVertical
} from "lucide-react"
import { Role, TeamType } from "@prisma/client"
import { redirect } from "next/navigation"
import Link from "next/link"
import TeamInviteDialog from "@/components/teams/TeamInviteDialog"
import CreateTeamDialog from "@/components/teams/CreateTeamDialog"
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

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

interface TeamsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TeamsPage({ searchParams }: TeamsPageProps) {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    // Get teams and invitations
    const [teamsResult, invitationsResult] = await Promise.all([
        getCompanyTeams(),
        getUserInvitations()
    ])

    if (!teamsResult.success) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">No teams found or you&apos;re not part of any company.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Contact your company administrator or complete onboarding first.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { teams, userRole } = teamsResult
    const { invitations } = invitationsResult
    const canManageTeams = userRole === Role.COMPANY_OWNER

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Teams</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your company teams and members
                    </p>
                </div>

                {
                    canManageTeams && (
                        <div className="flex gap-2">
                            <CreateTeamDialog>
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Create Team
                                </Button>
                            </CreateTeamDialog>
                        </div>
                    )
                }
            </div>
            {
                invitations && invitations.length > 0 && (
                    <Card className="mb-8 border-blue-200 bg-blue-50/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <Mail className="w-5 h-5" />
                                Pending Invitations ({invitations.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {
                                    invitations.map((invitation) => (
                                        <div key={invitation.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={invitation.sender?.image || undefined} />
                                                        <AvatarFallback>{invitation.sender?.name?.[0] || 'U'}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">
                                                            {invitation.company?.name} - {invitation.team?.displayName || invitation.team?.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            as {invitation.roleTitle} • invited by {invitation.sender?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline">
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </CardContent>
                    </Card>
                )
            }

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {
                    teams.map((team) => {
                        const IconComponent = TEAM_ICONS[team.teamType] || Users
                        const isTeamHead = team.headId === session.user.id
                        const memberCount = team._count?.members || 0
                        const projectCount = team._count?.assignedProjects || 0

                        return (
                            <Card key={team.id} className="group hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                                style={{
                                                    backgroundColor: team.color ? `${team.color}15` : '#f3f4f6',
                                                    color: team.color || '#6b7280'
                                                }}
                                            >
                                                <IconComponent className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{team.displayName}</CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    {team.teamType.charAt(0) + team.teamType.slice(1).toLowerCase()} Team
                                                </p>
                                            </div>
                                        </div>

                                        {
                                            (canManageTeams || isTeamHead) && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Settings className="w-4 h-4 mr-2" />
                                                            Manage Team
                                                        </DropdownMenuItem>
                                                        <TeamInviteDialog teamId={team.id} type="member">
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                <Plus className="w-4 h-4 mr-2" />
                                                                Invite Members
                                                            </DropdownMenuItem>
                                                        </TeamInviteDialog>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">
                                                            Archive Team
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )
                                        }
                                    </div>

                                    {
                                        team.description && (
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {team.description}
                                            </p>
                                        )
                                    }
                                </CardHeader>
                                <CardContent className="pt-0">
                                    {
                                        team.head ? (
                                            <div className="flex items-center gap-2 mb-4">
                                                <Crown className="w-4 h-4 text-yellow-500" />
                                                <Avatar className="w-6 h-6">
                                                    <AvatarImage src={team.head.image || undefined} />
                                                    <AvatarFallback className="text-xs">
                                                        {team.head.name?.[0] || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium">{team.head.name}</span>
                                                {
                                                    isTeamHead && (
                                                        <Badge variant="secondary" className="text-xs px-2 py-0">You</Badge>
                                                    )
                                                }
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                                                <Crown className="w-4 h-4" />
                                                <span className="text-sm">No head assigned</span>
                                                {
                                                    canManageTeams && (
                                                        <TeamInviteDialog teamId={team.id} type="head">
                                                            <Button size="sm" variant="outline" className="h-6 text-xs">
                                                                Invite Head
                                                            </Button>
                                                        </TeamInviteDialog>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {memberCount} members
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4" />
                                                {projectCount} projects
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t space-y-2">
                                        <Link href={`/teams/${team.id}`}>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                size="sm"
                                            >
                                                View Team Details
                                            </Button>
                                        </Link>
                                        {
                                            (canManageTeams || isTeamHead) && (
                                                <TeamInviteDialog teamId={team.id} type="member">
                                                    <Button
                                                        variant="secondary"
                                                        className="w-full gap-2"
                                                        size="sm"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Invite Members
                                                    </Button>
                                                </TeamInviteDialog>
                                            )
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                }
                {
                    teams.length === 0 && (
                        <div className="col-span-full">
                            <Card className="text-center py-12">
                                <CardContent>
                                    <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No teams found</h3>
                                    <p className="text-muted-foreground mb-4">
                                        {
                                            canManageTeams
                                                ? "Create your first team to get started organizing your company."
                                                : "No teams have been created yet. Contact your administrator."
                                        }
                                    </p>
                                    {
                                        canManageTeams && (
                                            <CreateTeamDialog>
                                                <Button className="gap-2">
                                                    <Plus className="w-4 h-4" />
                                                    Create First Team
                                                </Button>
                                            </CreateTeamDialog>
                                        )
                                    }
                                </CardContent>
                            </Card>
                        </div>
                    )
                }
            </div>
        </div>
    )
}