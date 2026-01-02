import { auth } from "@/auth"
import { getTeamDetails } from "@/actions/teams.action"
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
    Users, Settings, Crown, Mail, Calendar,
    Code, Megaphone, ShoppingCart, Palette, Briefcase,
    ArrowLeft, MoreVertical, UserPlus, Edit
} from "lucide-react"
import { TeamType } from "@prisma/client"
import { redirect } from "next/navigation"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import TeamInviteDialog from "@/components/teams/TeamInviteDialog"
import Link from "next/link"

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

interface TeamDetailsPageProps {
    params: Promise<{ teamId: string }>
}

export default async function TeamDetailsPage({ params }: TeamDetailsPageProps) {
    const session = await auth()
    const { teamId } = await params

    if (!session?.user) {
        redirect('/signin')
    }

    const result = await getTeamDetails(teamId)

    if (!result.success || !result.team) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">Team not found or you don&apos;t have access.</p>
                        <Link href="/teams">
                            <Button variant="outline" className="mt-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Teams
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { team, canManage } = result
    const IconComponent = TEAM_ICONS[team.teamType] || Users
    const isTeamHead = team.headId === session.user.id

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/teams">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Teams
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-lg flex items-center justify-center"
                            style={{
                                backgroundColor: team.color ? `${team.color}15` : '#f3f4f6',
                                color: team.color || '#6b7280'
                            }}
                        >
                            <IconComponent className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{team.displayName}</h1>
                            <p className="text-muted-foreground">
                                {team.teamType.charAt(0) + team.teamType.slice(1).toLowerCase()} Team • {team.company?.name}
                            </p>
                        </div>
                    </div>
                </div>
                {
                    team.description && (
                        <p className="text-lg text-muted-foreground max-w-3xl">
                            {team.description}
                        </p>
                    )
                }
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Team Members ({team.members?.length || 0})
                                </CardTitle>
                                {
                                    canManage && (
                                        <TeamInviteDialog teamId={team.id} type="member">
                                            <Button size="sm" className="gap-2">
                                                <UserPlus className="w-4 h-4" />
                                                Invite Member
                                            </Button>
                                        </TeamInviteDialog>
                                    )
                                }
                            </div>
                        </CardHeader>
                        <CardContent>
                            {
                                team.members && team.members.length > 0 ? (
                                    <div className="space-y-4">
                                        {
                                            team.members.map((member) => (
                                                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-10 h-10">
                                                            <AvatarImage src={member.user.image || undefined} />
                                                            <AvatarFallback>
                                                                {member.user.name?.[0] || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium">{member.user.name}</p>
                                                                {
                                                                    team.headId === member.user.id && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            Head
                                                                        </Badge>
                                                                    )
                                                                }
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                {member.roleTitle}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Joined {member.joinedAt?.toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {
                                                        canManage && team.headId !== member.user.id && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <MoreVertical className="w-4 h-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem>
                                                                        <Edit className="w-4 h-4 mr-2" />
                                                                        Update Role
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem className="text-destructive">
                                                                        Remove from Team
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No team members yet.</p>
                                        {
                                            canManage && (
                                                <TeamInviteDialog teamId={team.id} type="member">
                                                    <Button variant="outline" className="mt-4 gap-2">
                                                        <UserPlus className="w-4 h-4" />
                                                        Invite First Member
                                                    </Button>
                                                </TeamInviteDialog>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Assigned Projects ({team.assignedProjects?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                team.assignedProjects && team.assignedProjects.length > 0 ? (
                                    <div className="space-y-3">
                                        {
                                            team.assignedProjects.map((assignment) => (
                                                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{assignment.project.title}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Status: <Badge variant="outline" className="text-xs">
                                                                {assignment.project.status}
                                                            </Badge>
                                                        </p>
                                                        {
                                                            assignment.project.startDate && (
                                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {assignment.project.startDate.toLocaleDateString()}
                                                                    {assignment.project.endDate && ` - ${assignment.project.endDate.toLocaleDateString()}`}
                                                                </p>
                                                            )
                                                        }
                                                    </div>
                                                    <Button variant="outline" size="sm">
                                                        View Project
                                                    </Button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No projects assigned to this team yet.</p>
                                    </div>
                                )
                            }
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Crown className="w-5 h-5 text-yellow-500" />
                                Team Head
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                team.head ? (
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={team.head.image || undefined} />
                                            <AvatarFallback>
                                                {team.head.name?.[0] || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{team.head.name}</p>
                                            <p className="text-sm text-muted-foreground">{team.head.email}</p>
                                            {
                                                isTeamHead && (
                                                    <Badge variant="secondary" className="text-xs mt-1">You</Badge>
                                                )
                                            }
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground">
                                        <Crown className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No head assigned</p>
                                        {
                                            canManage && (
                                                <TeamInviteDialog teamId={team.id} type="head">
                                                    <Button size="sm" variant="outline" className="mt-3 gap-2">
                                                        <Mail className="w-4 h-4" />
                                                        Invite Head
                                                    </Button>
                                                </TeamInviteDialog>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Total Members:</span>
                                <span className="font-medium">{team.members?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Active Projects:</span>
                                <span className="font-medium">{team.assignedProjects?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Open Tasks:</span>
                                <span className="font-medium">{team.tasks?.length || 0}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Created:</span>
                                <span className="font-medium text-sm">
                                    {team.createdAt.toLocaleDateString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    {
                        canManage && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <TeamInviteDialog teamId={team.id} type="member">
                                        <Button className="w-full gap-2" size="sm">
                                            <UserPlus className="w-4 h-4" />
                                            Invite Member
                                        </Button>
                                    </TeamInviteDialog>
                                    {
                                        !team.head && (
                                            <TeamInviteDialog teamId={team.id} type="head">
                                                <Button variant="outline" className="w-full gap-2" size="sm">
                                                    <Crown className="w-4 h-4" />
                                                    Invite Team Head
                                                </Button>
                                            </TeamInviteDialog>
                                        )
                                    }
                                    <Button variant="outline" className="w-full gap-2" size="sm">
                                        <Settings className="w-4 h-4" />
                                        Team Settings
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    }
                </div>
            </div>
        </div>
    )
}