"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { 
    Users, 
    Search, 
    Filter, 
    Mail,
    Phone,
    Calendar,
    Award,
    Activity,
    MoreVertical,
    UserPlus,
    Eye,
    CheckCircle,
    Clock
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { getTeamMembers, getDeveloperDetails } from "@/actions/(productmanager)/team.action"
import { useToast } from "@/hooks/use-toast"

export default function TeamPage() {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isLoading, setIsLoading] = useState(true)
    const [developerDetails, setDeveloperDetails] = useState<DeveloperDetails | null>(null)
    const [loadingDetails, setLoadingDetails] = useState(false)

    // Types
    interface TeamMember {
        id: string
        name: string
        email: string
        image?: string
        role: string
        bio?: string
        skills?: string[]
        createdAt: string
        stats?: {
            projectCount: number
            completedTasks: number
            inProgressTasks: number
            pendingTasks: number
            totalTasks: number
            completionRate: number
        }
        projects?: Project[]
        tasks?: Task[]
    }

    interface DeveloperDetails extends TeamMember {
        stats?: {
            projectCount: number
            completedTasks: number
            inProgressTasks: number
            pendingTasks: number
            totalTasks: number
            completionRate: number
        }
    }

    interface Project {
        id: string
        title: string
        slug: string
        status: string
    }

    interface Task {
        id: string
        title: string
        status: string
        project: Project
    }

    // Load team members on component mount
    const loadTeamMembers = useCallback(async () => {
        if (session?.user?.role !== 'PRODUCTMANAGER') {
            setIsLoading(false)
            return
        }

        try {
            setIsLoading(true)
            const result = await getTeamMembers()
            
            if (result.success) {
                setTeamMembers(result.teamMembers as TeamMember[])
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to load team members",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error("Error loading team members:", error)
            toast({
                title: "Error",
                description: "Failed to load team members",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }, [session?.user?.role, toast])

    useEffect(() => {
        loadTeamMembers()
    }, [loadTeamMembers])

    const handleViewDeveloper = async (developerId: string) => {
        try {
            setLoadingDetails(true)
            const result = await getDeveloperDetails(developerId)
            
            if (result.success) {
                setDeveloperDetails(result.developer as unknown as DeveloperDetails)
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to load developer details",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error("Error loading developer details:", error)
            toast({
                title: "Error",
                description: "Failed to load developer details",
                variant: "destructive"
            })
        } finally {
            setLoadingDetails(false)
        }
    }

    // Check if user has access to team page
    if (session?.user?.role === 'CLIENT') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader className="text-center">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <CardTitle>Access Restricted</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            Team management is only available for Product Managers and Developers.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'PRODUCTMANAGER':
                return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
            case 'DEVELOPER':
                return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
            case 'ADMIN':
                return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
        }
    }

    const filteredMembers = teamMembers.filter(member => {
        const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesRole = roleFilter === "all" || member.role === roleFilter
        // For now, assume all members are active since we don't have status in real data
        const matchesStatus = statusFilter === "all" || statusFilter === "ACTIVE"
        return matchesSearch && matchesRole && matchesStatus
    })

    const renderMemberCard = (member: TeamMember) => {
        return (
            <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group"
            >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                                <Avatar className="h-16 w-16 border-2 border-border/50">
                                    <AvatarImage src={member.image || ""} alt={member.name || ""} />
                                    <AvatarFallback className="text-lg font-semibold">
                                        {member.name?.split(' ').map((n: string) => n[0]).join('') || "??"}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <div className="space-y-2 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-foreground truncate">{member.name || "Unknown User"}</h3>
                                        <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 border text-xs">
                                            ACTIVE
                                        </Badge>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <Badge className={`${getRoleColor(member.role)} border text-xs w-fit`}>
                                            {member.role}
                                        </Badge>
                                        <p className="text-sm text-muted-foreground">{member.role === 'DEVELOPER' ? 'Developer' : member.role === 'CLIENT' ? 'Client' : 'Product Manager'}</p>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">
                                                Joined {formatDistanceToNow(new Date(member.createdAt))} ago
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                {member.role === 'DEVELOPER' && (
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleViewDeveloper(member.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent className="w-[400px] sm:w-[540px]">
                                            <SheetHeader>
                                                <SheetTitle>Developer Details</SheetTitle>
                                                <SheetDescription>
                                                    Detailed information about {member.name}
                                                </SheetDescription>
                                            </SheetHeader>
                                            {loadingDetails ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <Activity className="h-6 w-6 animate-spin" />
                                                </div>
                                            ) : developerDetails ? (
                                                <div className="mt-6 space-y-6">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-20 w-20">
                                                            <AvatarImage src={developerDetails.image || ""} alt={developerDetails.name || ""} />
                                                            <AvatarFallback className="text-xl">
                                                                {developerDetails.name?.split(' ').map((n: string) => n[0]).join('') || "??"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h3 className="text-xl font-semibold">{developerDetails.name}</h3>
                                                            <p className="text-muted-foreground">{developerDetails.email}</p>
                                                            <Badge className={`${getRoleColor(developerDetails.role)} border text-xs mt-1`}>
                                                                {developerDetails.role}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    
                                                    {developerDetails.bio && (
                                                        <div>
                                                            <h4 className="font-medium mb-2">Bio</h4>
                                                            <p className="text-sm text-muted-foreground">{developerDetails.bio}</p>
                                                        </div>
                                                    )}

                                                    {developerDetails?.skills && developerDetails?.skills?.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium mb-2">Skills</h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {developerDetails?.skills?.map((skill: string) => (
                                                                    <Badge key={skill} variant="outline">{skill}</Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h4 className="font-medium mb-2">Statistics</h4>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="text-center p-3 bg-muted rounded-lg">
                                                                <div className="text-2xl font-bold text-blue-600">{developerDetails.stats?.projectCount || 0}</div>
                                                                <div className="text-xs text-muted-foreground">Projects</div>
                                                            </div>
                                                            <div className="text-center p-3 bg-muted rounded-lg">
                                                                <div className="text-2xl font-bold text-green-600">{developerDetails.stats?.completedTasks || 0}</div>
                                                                <div className="text-xs text-muted-foreground">Completed Tasks</div>
                                                            </div>
                                                            <div className="text-center p-3 bg-muted rounded-lg">
                                                                <div className="text-2xl font-bold text-orange-600">{developerDetails.stats?.inProgressTasks || 0}</div>
                                                                <div className="text-xs text-muted-foreground">In Progress</div>
                                                            </div>
                                                            <div className="text-center p-3 bg-muted rounded-lg">
                                                                <div className="text-2xl font-bold text-gray-600">{developerDetails.stats?.pendingTasks || 0}</div>
                                                                <div className="text-xs text-muted-foreground">Pending</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {developerDetails?.projects && developerDetails?.projects?.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium mb-2">Current Projects</h4>
                                                            <div className="space-y-2">
                                                                {developerDetails?.projects.map((project: Project) => (
                                                                    <div key={project.id} className="flex items-center justify-between p-2 border rounded">
                                                                        <span className="font-medium">{project.title}</span>
                                                                        <Badge variant="outline">{project.status}</Badge>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null}
                                        </SheetContent>
                                    </Sheet>
                                )}
                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        {/* Bio */}
                        {member.bio && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {member.bio}
                            </p>
                        )}

                        {/* Skills */}
                        {member.skills && member.skills.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-foreground">Skills:</span>
                                <div className="flex flex-wrap gap-1">
                                    {member.skills.slice(0, 4).map((skill: string) => (
                                        <Badge key={skill} variant="outline" className="text-xs">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {member.skills.length > 4 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{member.skills.length - 4} more
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Award className="h-3 w-3 text-primary" />
                                    <span className="text-sm font-semibold text-foreground">{member.stats?.projectCount || 0}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">Projects</span>
                            </div>
                            
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                    <span className="text-sm font-semibold text-foreground">{member.stats?.completedTasks || 0}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">Completed</span>
                            </div>
                            
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Clock className="h-3 w-3 text-orange-600" />
                                    <span className="text-sm font-semibold text-foreground">{member.stats?.inProgressTasks || 0}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">In Progress</span>
                            </div>
                        </div>

                        {/* Contact Actions */}
                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1">
                                <Mail className="h-3 w-3 mr-2" />
                                Email
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                                <Phone className="h-3 w-3 mr-2" />
                                Call
                            </Button>
                        </div>

                        {/* Last Active */}
                        <div className="text-center pt-2 border-t border-border/50">
                            <span className="text-xs text-muted-foreground">
                                Member since {formatDistanceToNow(new Date(member.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader className="text-center">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                        <CardTitle>Loading Team Members</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            Please wait while we fetch your team data...
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Team Members</h1>
                        <p className="text-muted-foreground">
                            Manage your development team and track performance
                        </p>
                    </div>
                    
                    {session?.user?.role === 'PRODUCTMANAGER' && (
                        <Button className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Invite Member
                        </Button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-background/50 backdrop-blur-sm border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{teamMembers.length}</p>
                                    <p className="text-sm text-muted-foreground">Total Members</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-background/50 backdrop-blur-sm border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                                    <Activity className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">
                                        {teamMembers.filter(m => m.role === 'DEVELOPER').length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Developers</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-background/50 backdrop-blur-sm border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                    <Award className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">
                                        {teamMembers.reduce((sum, m) => sum + (m.stats?.projectCount || 0), 0)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Total Projects</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-background/50 backdrop-blur-sm border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">
                                        {teamMembers.reduce((sum, m) => sum + (m.stats?.completedTasks || 0), 0)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Completed Tasks</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search team members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="PRODUCTMANAGER">Product Manager</SelectItem>
                            <SelectItem value="DEVELOPER">Developer</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="AWAY">Away</SelectItem>
                            <SelectItem value="OFFLINE">Offline</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Team Members Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="h-96">
                                <CardHeader className="space-y-2">
                                    <div className="flex gap-4">
                                        <div className="h-16 w-16 bg-muted rounded-full animate-pulse" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 bg-muted rounded animate-pulse" />
                                            <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="h-3 bg-muted rounded animate-pulse" />
                                        <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredMembers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredMembers.map(renderMemberCard)}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">No team members found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                                ? "Try adjusting your search criteria" 
                                : "Start building your team by inviting members"
                            }
                        </p>
                        {session?.user?.role === 'PRODUCTMANAGER' && (
                            <Button>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Invite Team Member
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
