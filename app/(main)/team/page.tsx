"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
    Users, 
    Search, 
    Filter, 
    Mail,
    Phone,
    MapPin,
    Star,
    Award,
    Activity,
    MoreVertical,
    UserPlus
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"

// Mock data - replace with actual data fetching
const mockTeamMembers = [
    {
        id: "1",
        name: "Alice Johnson",
        email: "alice@projectcentral.com",
        phone: "+1 (555) 123-4567",
        role: "DEVELOPER",
        specialization: "Frontend Developer",
        image: "/placeholder.svg",
        location: "San Francisco, CA",
        joinedAt: new Date("2023-01-15"),
        status: "ACTIVE",
        skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
        projectsCount: 12,
        tasksCompleted: 156,
        rating: 4.8,
        lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        bio: "Passionate frontend developer with 5+ years of experience in modern web technologies.",
        projects: [
            { id: "1", name: "E-commerce Platform", role: "Lead Frontend" },
            { id: "2", name: "Mobile Banking App", role: "Frontend Developer" },
            { id: "3", name: "CRM System", role: "UI Developer" }
        ]
    },
    {
        id: "2",
        name: "Bob Chen",
        email: "bob@projectcentral.com",
        phone: "+1 (555) 234-5678",
        role: "DEVELOPER",
        specialization: "Backend Developer",
        image: "/placeholder.svg",
        location: "Seattle, WA",
        joinedAt: new Date("2023-03-20"),
        status: "ACTIVE",
        skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
        projectsCount: 8,
        tasksCompleted: 98,
        rating: 4.9,
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        bio: "Backend specialist focused on scalable architectures and cloud solutions.",
        projects: [
            { id: "1", name: "E-commerce Platform", role: "Backend Lead" },
            { id: "4", name: "Analytics Dashboard", role: "Backend Developer" }
        ]
    },
    {
        id: "3",
        name: "Carol Martinez",
        email: "carol@projectcentral.com",
        phone: "+1 (555) 345-6789",
        role: "DEVELOPER",
        specialization: "Full Stack Developer",
        image: "/placeholder.svg",
        location: "Austin, TX",
        joinedAt: new Date("2022-11-10"),
        status: "ACTIVE",
        skills: ["React", "Node.js", "MongoDB", "Docker"],
        projectsCount: 15,
        tasksCompleted: 203,
        rating: 4.7,
        lastActive: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        bio: "Full-stack developer with expertise in modern web applications and DevOps.",
        projects: [
            { id: "2", name: "Mobile Banking App", role: "Full Stack Developer" },
            { id: "5", name: "Content Management", role: "Lead Developer" }
        ]
    },
    {
        id: "4",
        name: "David Wilson",
        email: "david@projectcentral.com",
        phone: "+1 (555) 456-7890",
        role: "DEVELOPER",
        specialization: "DevOps Engineer",
        image: "/placeholder.svg",
        location: "New York, NY",
        joinedAt: new Date("2023-02-05"),
        status: "AWAY",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        projectsCount: 6,
        tasksCompleted: 74,
        rating: 4.6,
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        bio: "DevOps engineer specializing in cloud infrastructure and automation.",
        projects: [
            { id: "1", name: "E-commerce Platform", role: "DevOps" },
            { id: "3", name: "CRM System", role: "Infrastructure" }
        ]
    }
]

export default function TeamPage() {
    const { data: session } = useSession()
    const [teamMembers, setTeamMembers] = useState(mockTeamMembers)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isLoading, setIsLoading] = useState(false)

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
            case 'AWAY':
                return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
            case 'OFFLINE':
                return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
        }
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
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.specialization.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "all" || member.role === roleFilter
        const matchesStatus = statusFilter === "all" || member.status === statusFilter
        return matchesSearch && matchesRole && matchesStatus
    })

    const renderStarRating = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-3 w-3 ${
                            star <= rating 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "text-muted-foreground"
                        }`}
                    />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{rating}</span>
            </div>
        )
    }

    const renderMemberCard = (member: any) => {
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
                                    <AvatarImage src={member.image} alt={member.name} />
                                    <AvatarFallback className="text-lg font-semibold">
                                        {member.name.split(' ').map((n: string) => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <div className="space-y-2 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                                        <Badge className={`${getStatusColor(member.status)} border text-xs`}>
                                            {member.status}
                                        </Badge>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <Badge className={`${getRoleColor(member.role)} border text-xs w-fit`}>
                                            {member.role}
                                        </Badge>
                                        <p className="text-sm text-muted-foreground">{member.specialization}</p>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">{member.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        {/* Bio */}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {member.bio}
                        </p>

                        {/* Skills */}
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

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Award className="h-3 w-3 text-primary" />
                                    <span className="text-sm font-semibold text-foreground">{member.projectsCount}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">Projects</span>
                            </div>
                            
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Activity className="h-3 w-3 text-primary" />
                                    <span className="text-sm font-semibold text-foreground">{member.tasksCompleted}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">Tasks</span>
                            </div>
                            
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                    {renderStarRating(member.rating)}
                                </div>
                                <span className="text-xs text-muted-foreground">Rating</span>
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
                                Last active {formatDistanceToNow(member.lastActive, { addSuffix: true })}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
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
                                        {teamMembers.filter(m => m.status === 'ACTIVE').length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Active Now</p>
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
                                        {teamMembers.reduce((sum, m) => sum + m.projectsCount, 0)}
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
                                    <Star className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">
                                        {(teamMembers.reduce((sum, m) => sum + m.rating, 0) / teamMembers.length).toFixed(1)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Avg Rating</p>
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
