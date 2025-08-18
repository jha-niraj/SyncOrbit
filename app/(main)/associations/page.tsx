"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
    Building2, 
    Users, 
    FolderOpen, 
    Mail, 
    UserPlus, 
    Trash2, 
    CheckCircle, 
    XCircle,
    Clock,
    Shield
} from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { 
    getUserAssociations,
    inviteUserToCompany,
    inviteUserToProject,
    respondToInvitation,
    getPendingInvitations,
    removeUserFromCompany,
    removeUserFromProject
} from "@/actions/(productmanager)/associations.action"

interface UserAssociations {
    user: {
        id: string
        name: string | null
        email: string | null
        role: string
    }
    memberOfCompany: any
    managedCompany: any
    projectMemberships: any[]
    ownedProjects: any[]
}

interface Invitation {
    id: string
    type: string
    message: string | null
    createdAt: string
    sender: {
        name: string | null
        email: string | null
    }
    company: {
        name: string
    } | null
    project: {
        title: string
    } | null
}

export default function AssociationsPage() {
    const { data: session } = useSession()
    const [associations, setAssociations] = useState<UserAssociations | null>(null)
    const [invitations, setInvitations] = useState<Invitation[]>([])
    const [loading, setLoading] = useState(true)
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteMessage, setInviteMessage] = useState("")
    const [inviteType, setInviteType] = useState<"company" | "project">("company")
    const [selectedProject, setSelectedProject] = useState("")

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [associationsResult, invitationsResult] = await Promise.all([
                getUserAssociations(),
                getPendingInvitations()
            ])

            if (associationsResult.success) {
                setAssociations(associationsResult.data)
            }

            if (invitationsResult.success) {
                setInvitations(invitationsResult.invitations)
            }
        } catch (error) {
            console.error("Error loading data:", error)
            toast.error("Failed to load data")
        } finally {
            setLoading(false)
        }
    }

    const handleInviteUser = async () => {
        if (!inviteEmail.trim()) {
            toast.error("Email is required")
            return
        }

        try {
            let result
            if (inviteType === "company") {
                result = await inviteUserToCompany(inviteEmail, inviteMessage)
            } else {
                if (!selectedProject) {
                    toast.error("Please select a project")
                    return
                }
                result = await inviteUserToProject(selectedProject, inviteEmail, "MEMBER", inviteMessage)
            }

            if (result.success) {
                toast.success(result.message)
                setInviteDialogOpen(false)
                setInviteEmail("")
                setInviteMessage("")
                setSelectedProject("")
                await loadData()
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            console.error("Error inviting user:", error)
            toast.error("Failed to send invitation")
        }
    }

    const handleInvitationResponse = async (invitationId: string, action: "accept" | "decline") => {
        try {
            const result = await respondToInvitation(invitationId, action)
            if (result.success) {
                toast.success(result.message)
                await loadData()
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            console.error("Error responding to invitation:", error)
            toast.error("Failed to respond to invitation")
        }
    }

    const handleRemoveUser = async (userId: string, type: "company" | "project", projectId?: string) => {
        try {
            let result
            if (type === "company") {
                result = await removeUserFromCompany(userId)
            } else if (projectId) {
                result = await removeUserFromProject(projectId, userId)
            }

            if (result?.success) {
                toast.success(result.message)
                await loadData()
            } else {
                toast.error(result?.error || "Failed to remove user")
            }
        } catch (error) {
            console.error("Error removing user:", error)
            toast.error("Failed to remove user")
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-muted rounded w-1/3"></div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="h-64 bg-muted rounded"></div>
                        <div className="h-64 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!associations) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center text-muted-foreground">
                    Failed to load associations
                </div>
            </div>
        )
    }

    const isProductManager = session?.user?.role === "PRODUCTMANAGER"

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Associations</h1>
                    <p className="text-muted-foreground">
                        Manage your connections across companies and projects
                    </p>
                </div>
                {isProductManager && (
                    <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Invite User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Invite User</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="inviteType">Invitation Type</Label>
                                    <Select value={inviteType} onValueChange={(value: "company" | "project") => setInviteType(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="company">Company Member</SelectItem>
                                            <SelectItem value="project">Project Member</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {inviteType === "project" && (
                                    <div>
                                        <Label htmlFor="project">Select Project</Label>
                                        <Select value={selectedProject} onValueChange={setSelectedProject}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {associations.ownedProjects?.map((project) => (
                                                    <SelectItem key={project.id} value={project.id}>
                                                        {project.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div>
                                    <Label htmlFor="email">User Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="user@example.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="message">Message (Optional)</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Add a personal message..."
                                        value={inviteMessage}
                                        onChange={(e) => setInviteMessage(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleInviteUser}>
                                        Send Invitation
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    {invitations.length > 0 && (
                        <TabsTrigger value="invitations" className="relative">
                            Invitations
                            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                                {invitations.length}
                            </Badge>
                        </TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Company Membership */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Company Membership
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {associations.memberOfCompany ? (
                                    <div className="space-y-2">
                                        <h4 className="font-semibold">{associations.memberOfCompany.name}</h4>
                                        <Badge variant="secondary">{associations.memberOfCompany.shortName}</Badge>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">Not a member of any company</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Managed Company (PM only) */}
                        {isProductManager && associations.managedCompany && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Managed Company
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold">{associations.managedCompany.name}</h4>
                                            <Badge variant="secondary">{associations.managedCompany.shortName}</Badge>
                                        </div>
                                        <div>
                                            <h5 className="font-medium mb-2">Team Members ({associations.managedCompany.users?.length || 0})</h5>
                                            <div className="space-y-2">
                                                {associations.managedCompany.users?.map((user: any) => (
                                                    <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback className="text-xs">
                                                                    {user.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium text-sm">{user.name}</p>
                                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {user.role}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        {user.id !== session?.user?.id && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleRemoveUser(user.id, "company")}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Project Memberships */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FolderOpen className="h-5 w-5" />
                                    Project Memberships
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {associations.projectMemberships.length > 0 ? (
                                    <div className="space-y-2">
                                        {associations.projectMemberships.map((membership) => (
                                            <div key={membership.id} className="p-2 border rounded">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h5 className="font-medium">{membership.project.title}</h5>
                                                        <p className="text-sm text-muted-foreground">
                                                            Owner: {membership.project.user.name}
                                                        </p>
                                                        {membership.project.user.company && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {membership.project.user.company.name}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Badge>{membership.project.status}</Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">Not a member of any projects</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Owned Projects */}
                        {associations.ownedProjects.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Owned Projects
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {associations.ownedProjects.map((project) => (
                                            <div key={project.id} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="font-medium">{project.title}</h5>
                                                    <Badge>{project.status}</Badge>
                                                </div>
                                                <div>
                                                    <h6 className="text-sm font-medium mb-1">
                                                        Team Members ({project.members?.length || 0})
                                                    </h6>
                                                    {project.members?.map((member: any) => (
                                                        <div key={member.id} className="flex items-center justify-between p-1 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarFallback className="text-xs">
                                                                        {member.user.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span>{member.user.name}</span>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {member.user.role}
                                                                </Badge>
                                                            </div>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleRemoveUser(member.user.id, "project", project.id)}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="invitations">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Pending Invitations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {invitations.length > 0 ? (
                                <div className="space-y-4">
                                    {invitations.map((invitation) => (
                                        <div key={invitation.id} className="p-4 border rounded-lg">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline">
                                                            {invitation.type === "COMPANY_MEMBER" ? "Company" : "Project"}
                                                        </Badge>
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">
                                                            {new Date(invitation.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-semibold">
                                                        Join {invitation.company?.name || invitation.project?.title}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        From: {invitation.sender.name} ({invitation.sender.email})
                                                    </p>
                                                    {invitation.message && (
                                                        <p className="text-sm bg-muted p-2 rounded">
                                                            {invitation.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleInvitationResponse(invitation.id, "accept")}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleInvitationResponse(invitation.id, "decline")}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Decline
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No pending invitations</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
