"use client"

import { useState, useRef } from "react"
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar"
import {
    Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
    User, Mail, Calendar, Building2, Shield, Users, Plus, Edit, Trash2,
    MoreVertical, Star, Award, Code, Megaphone, ShoppingCart, Palette,
    Briefcase, Settings as SettingsIcon, Crown, UserCheck, Camera, Loader2
} from "lucide-react"
import { Role, TeamType } from "@prisma/client"
import { format } from "date-fns"
import { toast } from "sonner"
import { uploadImage } from "@/actions/shared/upload.action"
import { updateProfile } from "@/actions/user/profile.action"
import { useRouter } from "next/navigation"

// Team type icons
const TEAM_ICONS = {
    [TeamType.TECHNICAL]: Code,
    [TeamType.MARKETING]: Megaphone,
    [TeamType.SALES]: ShoppingCart,
    [TeamType.DESIGN]: Palette,
    [TeamType.OPERATIONS]: SettingsIcon,
    [TeamType.FINANCE]: Briefcase,
    [TeamType.CUSTOM]: Users,
}

// Role badges
const ROLE_BADGES = {
    [Role.COMPANY_OWNER]: { color: "bg-purple-100 text-purple-800", icon: Crown },
    [Role.TEAM_HEAD]: { color: "bg-blue-100 text-blue-800", icon: Shield },
    [Role.TEAM_MEMBER]: { color: "bg-green-100 text-green-800", icon: UserCheck },
    [Role.CLIENT]: { color: "bg-gray-100 text-gray-800", icon: User },
    [Role.ADMIN]: { color: "bg-red-100 text-red-800", icon: Shield },
}

interface Membership {
    id: string
    roleTitle: string
    team: {
        id: string
        displayName: string
        teamType: TeamType
        color: string | null
        head?: {
            name: string | null
        } | null
    }
}

interface TeamMember {
    id: string
    roleTitle: string
    user: {
        name: string | null
        image: string | null
    }
}

interface Team {
    id: string
    displayName: string
    teamType: TeamType
    color: string | null
    _count: {
        members: number
        assignedProjects: number
    }
    members: TeamMember[]
    head?: {
        name: string | null
    } | null
}

interface Company {
    id: string
    name: string
    website?: string | null
    logo?: string | null
    teams?: Team[]
    owner?: {
        name: string | null
        image: string | null
    } | null
}

interface UserProfile {
    id: string
    name: string | null
    email: string | null
    image: string | null
    bio: string | null
    role: Role
    createdAt: string | Date
    company?: Company | null
    ownedCompany?: Company | null
    ledTeams: Team[]
    teamMemberships: Membership[]
    _count: {
        assignedTasks: number
        projects: number
        createdTasks: number
    }
}

interface ProfilePageClientProps {
    userProfile: UserProfile
}

export default function ProfilePageClient({ userProfile }: ProfilePageClientProps) {
    const router = useRouter()
    const roleBadge = ROLE_BADGES[userProfile.role as Role] || ROLE_BADGES[Role.CLIENT]
    const RoleIcon = roleBadge.icon

    const [uploading, setUploading] = useState(false)
    const [companyUploading, setCompanyUploading] = useState(false)
    const [saving, setSaving] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const companyFileInputRef = useRef<HTMLInputElement>(null)

    // Form state
    const [name, setName] = useState(userProfile.name || "")
    const [bio, setBio] = useState(userProfile.bio || "")

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'user' | 'company') => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size too large. Max 5MB.")
            return
        }

        const isCompany = type === 'company'
        const setLoader = isCompany ? setCompanyUploading : setUploading

        setLoader(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("type", type)
            if (isCompany && userProfile.ownedCompany?.id) {
                formData.append("companyId", userProfile.ownedCompany.id)
            }

            const result = await uploadImage(formData)

            if (result.success) {
                toast.success("Image uploaded successfully")
                router.refresh()
            } else {
                toast.error(result.error || "Failed to upload image")
            }
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload image")
        } finally {
            setLoader(false)
        }
    }

    const handleSaveProfile = async () => {
        setSaving(true)
        try {
            const result = await updateProfile({ name, bio })
            if (result.success) {
                toast.success(result.message)
                router.refresh()
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            console.error("Save error:", error)
            toast.error("Failed to update profile")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <Avatar className="w-20 h-20 border-2 border-background shadow-sm">
                        <AvatarImage src={userProfile.image || undefined} className="object-cover" />
                        <AvatarFallback className="text-2xl">
                            {userProfile.name?.[0] || userProfile.email?.[0] || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {uploading ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                            <Camera className="w-6 h-6 text-white" />
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'user')}
                        disabled={uploading}
                    />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">
                            {userProfile.name || userProfile.email}
                        </h1>
                        <Badge className={`gap-1 ${roleBadge.color}`}>
                            <RoleIcon className="w-3 h-3" />
                            {userProfile.role.replace('_', ' ').toLowerCase()}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{userProfile.email}</span>
                        </div>
                        {
                            userProfile.company && (
                                <div className="flex items-center gap-1">
                                    <Building2 className="w-4 h-4" />
                                    <span>{userProfile.company.name}</span>
                                </div>
                            )
                        }
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {format(new Date(userProfile.createdAt), 'MMM yyyy')}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {userProfile.ledTeams.length + userProfile.teamMemberships.length}
                                </div>
                                <p className="text-sm text-muted-foreground">Teams</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Award className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{userProfile._count.assignedTasks}</div>
                                <p className="text-sm text-muted-foreground">Assigned Tasks</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{userProfile._count.projects}</div>
                                <p className="text-sm text-muted-foreground">Projects Created</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Star className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{userProfile._count.createdTasks}</div>
                                <p className="text-sm text-muted-foreground">Tasks Created</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="teams">Teams</TabsTrigger>
                    <TabsTrigger value="company">Company</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Memberships</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                userProfile.teamMemberships.length > 0 ? (
                                    <div className="space-y-4">
                                        {
                                            userProfile.teamMemberships.map((membership: Membership) => {
                                                const TeamIcon = TEAM_ICONS[membership.team.teamType] || Users
                                                return (
                                                    <div key={membership.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                                style={{
                                                                    backgroundColor: membership.team.color ? `${membership.team.color}20` : '#f1f5f9',
                                                                    color: membership.team.color || '#64748b'
                                                                }}
                                                            >
                                                                <TeamIcon className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium">{membership.team.displayName}</h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Led by {membership.team.head?.name || 'No head assigned'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="capitalize">
                                                                {membership.roleTitle}
                                                            </Badge>
                                                            <Badge variant="secondary">
                                                                {membership.team.teamType.toLowerCase()}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>You&apos;re not a member of any teams yet.</p>
                                    </div>
                                )
                            }
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="teams" className="space-y-6">
                    {
                        userProfile.role !== Role.CLIENT && userProfile.ledTeams.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Teams I Lead
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {
                                            userProfile.ledTeams.map((team: Team) => {
                                                const TeamIcon = TEAM_ICONS[team.teamType] || Users
                                                return (
                                                    <Card key={team.id}>
                                                        <CardHeader>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                                        style={{
                                                                            backgroundColor: team.color ? `${team.color}20` : '#f1f5f9',
                                                                            color: team.color || '#64748b'
                                                                        }}
                                                                    >
                                                                        <TeamIcon className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-semibold">{team.displayName}</h3>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {team.teamType.toLowerCase()} team
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="text-center">
                                                                        <div className="text-lg font-semibold">{team._count.members}</div>
                                                                        <div className="text-xs text-muted-foreground">Members</div>
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <div className="text-lg font-semibold">{team._count.assignedProjects}</div>
                                                                        <div className="text-xs text-muted-foreground">Projects</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="space-y-3">
                                                                <h4 className="text-sm font-medium">Team Members</h4>
                                                                {
                                                                    team.members.length > 0 ? (
                                                                        <div className="grid gap-3 md:grid-cols-2">
                                                                            {
                                                                                team.members.map((member: TeamMember) => (
                                                                                    <div key={member.id} className="flex items-center gap-3">
                                                                                        <Avatar className="w-8 h-8">
                                                                                            <AvatarImage src={member.user.image || undefined} />
                                                                                            <AvatarFallback className="text-xs">
                                                                                                {member.user.name?.[0] || 'U'}
                                                                                            </AvatarFallback>
                                                                                        </Avatar>
                                                                                        <div className="flex-1">
                                                                                            <p className="text-sm font-medium">{member.user.name}</p>
                                                                                            <p className="text-xs text-muted-foreground">
                                                                                                {member.roleTitle}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-sm text-muted-foreground">No members yet</p>
                                                                    )
                                                                }
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    }
                    {
                        userProfile.role === Role.COMPANY_OWNER && userProfile.ownedCompany && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-5 h-5" />
                                            Company Teams
                                        </div>
                                        <Button className="gap-2">
                                            <Plus className="w-4 h-4" />
                                            Add Team
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {
                                        userProfile.ownedCompany.teams && userProfile.ownedCompany.teams.length > 0 ? (
                                            <div className="space-y-4">
                                                {
                                                    userProfile.ownedCompany.teams.map((team: Team) => {
                                                        const TeamIcon = TEAM_ICONS[team.teamType] || Users
                                                        return (
                                                            <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                                        style={{
                                                                            backgroundColor: team.color ? `${team.color}20` : '#f1f5f9',
                                                                            color: team.color || '#64748b'
                                                                        }}
                                                                    >
                                                                        <TeamIcon className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-medium">{team.displayName}</h3>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {team.head?.name ? `Led by ${team.head.name}` : 'No head assigned'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="text-center">
                                                                        <div className="text-sm font-semibold">{team._count.members}</div>
                                                                        <div className="text-xs text-muted-foreground">Members</div>
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <div className="text-sm font-semibold">{team._count.assignedProjects}</div>
                                                                        <div className="text-xs text-muted-foreground">Projects</div>
                                                                    </div>
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="sm">
                                                                                <MoreVertical className="w-4 h-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem>
                                                                                <Edit className="w-4 h-4 mr-2" />
                                                                                Edit Team
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem>
                                                                                <Users className="w-4 h-4 mr-2" />
                                                                                Manage Members
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem className="text-red-600">
                                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                                Delete Team
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p>No teams created yet.</p>
                                                <Button className="mt-4 gap-2">
                                                    <Plus className="w-4 h-4" />
                                                    Create First Team
                                                </Button>
                                            </div>
                                        )
                                    }
                                </CardContent>
                            </Card>
                        )
                    }
                </TabsContent>
                <TabsContent value="company" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Company Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                userProfile.company || userProfile.ownedCompany ? (
                                    <div className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <Label className="text-sm font-medium">Company Name</Label>
                                                <p className="text-lg">
                                                    {userProfile.ownedCompany?.name || userProfile.company?.name}
                                                </p>
                                            </div>
                                            {
                                                (userProfile.ownedCompany?.website || userProfile.company?.website) && (
                                                    <div>
                                                        <Label className="text-sm font-medium">Website</Label>
                                                        <p className="text-lg">
                                                            {userProfile.ownedCompany?.website || userProfile.company?.website}
                                                        </p>
                                                    </div>
                                                )
                                            }
                                            <div>
                                                <Label className="text-sm font-medium">Your Role</Label>
                                                <Badge className={`${roleBadge.color}`}>
                                                    {userProfile.role === Role.COMPANY_OWNER ? 'Owner' : 'Employee'}
                                                </Badge>
                                            </div>
                                            {
                                                userProfile.company?.owner && (
                                                    <div>
                                                        <Label className="text-sm font-medium">Company Owner</Label>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Avatar className="w-6 h-6">
                                                                <AvatarImage src={userProfile.company.owner.image || undefined} />
                                                                <AvatarFallback className="text-xs">
                                                                    {userProfile.company.owner.name?.[0] || 'O'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span>{userProfile.company.owner.name}</span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        {
                                            userProfile.role === Role.COMPANY_OWNER && userProfile.ownedCompany && (
                                                <div className="mt-6 pt-6 border-t">
                                                    <Label className="text-sm font-medium mb-2 block">Company Logo</Label>
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative group">
                                                            <Avatar className="w-16 h-16 border-2 border-muted">
                                                                <AvatarImage src={userProfile.ownedCompany.logo || undefined} />
                                                                <AvatarFallback>
                                                                    <Building2 className="w-8 h-8 text-muted-foreground" />
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div
                                                                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                                onClick={() => companyFileInputRef.current?.click()}
                                                            >
                                                                {
                                                                    companyUploading ? (
                                                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                                    ) : (
                                                                        <Camera className="w-5 h-5 text-white" />
                                                                    )
                                                                }
                                                            </div>
                                                            <input
                                                                type="file"
                                                                ref={companyFileInputRef}
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageUpload(e, 'company')}
                                                                disabled={companyUploading}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">
                                                                Click to upload a new company logo.
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Recommended size: 256x256px
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No company information available.</p>
                                    </div>
                                )
                            }
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={userProfile.email || ''}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handleSaveProfile} disabled={saving}>
                                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-700">Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                                <div>
                                    <h3 className="font-medium text-red-700">Delete Account</h3>
                                    <p className="text-sm text-red-600">
                                        Permanently delete your account and all data.
                                    </p>
                                </div>
                                <Button variant="destructive">
                                    Delete Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}