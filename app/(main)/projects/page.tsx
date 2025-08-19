"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
    DollarSign, 
    Users, 
    Search, 
    Filter, 
    Plus,
    MoreVertical,
    Eye,
    MessageSquare,
    BarChart3,
    Briefcase
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { Status, TaskStatus } from "@prisma/client"
import { formatCurrency, getCurrencySymbol } from "@/store/useProjectStore"
import { getUserProjects } from "@/actions/(client)/projects.action"
import { toast } from "sonner"

interface ProjectData {
    id: string
    title: string
    description: string | null
    slug: string
    status: Status
    budget: number
    paidAmount: number
    currency: string
    startDate: Date
    endDate: Date | null
    user: {
        id: string
        name: string | null
        email: string | null
        image: string | null
        managedCompany?: {
            name: string
            shortName: string
        } | null
    }
    tasks: Array<{
        id: string
        status: TaskStatus
        assignedDeveloper?: {
            id: string
            name: string | null
            image: string | null
        } | null
    }>
    members: Array<{
        user: {
            id: string
            name: string | null
            image: string | null
            role: string
        }
    }>
    _count: {
        tasks: number
        feedbacks: number
        messages: number
    }
}

export default function ProjectsPage() {
    const { data: session } = useSession()
    const [projects, setProjects] = useState<ProjectData[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadProjects()
    }, [])

    const loadProjects = async () => {
        try {
            setIsLoading(true)
            const result = await getUserProjects()
            
            if (result.success) {
                setProjects(result.projects)
            } else {
                toast.error(result.error || "Failed to load projects")
            }
        } catch (error) {
            console.error("Load projects error:", error)
            toast.error("Failed to load projects")
        } finally {
            setIsLoading(false)
        }
    }

    // Calculate project progress
    const getProjectProgress = (tasks: any[]) => {
        if (!tasks || tasks.length === 0) return 0
        const completed = tasks.filter(task => task.status === TaskStatus.COMPLETED).length
        return Math.round((completed / tasks.length) * 100)
    }

    // Calculate payment progress
    const getPaymentProgress = (paid: number, budget: number) => {
        return Math.round((paid / budget) * 100)
    }

    // Get status color
    const getStatusColor = (status: Status) => {
        switch (status) {
            case Status.IN_PROGRESS:
                return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
            case Status.COMPLETED:
                return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
            case Status.ON_HOLD:
                return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
            case Status.CANCELLED:
                return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
        }
    }

    // Filter projects
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesStatus = statusFilter === "all" || project.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const renderProjectCard = (project: ProjectData) => {
        const progress = getProjectProgress(project.tasks)
        const paymentProgress = getPaymentProgress(project.paidAmount, project.budget)
        
        // Get team members from project members
        const teamMembers = project.members.map(member => ({
            id: member.user.id,
            name: member.user.name || "Unknown",
            image: member.user.image || "/placeholder.svg"
        }))
        
        return (
            <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group"
            >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {project.title}
                                    </CardTitle>
                                    <Badge className={`${getStatusColor(project.status)} border text-xs`}>
                                        {project.status.replace('_', ' ')}
                                    </Badge>
                                </div>
                                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                                    {project.description || "No description available"}
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        {/* Progress Section */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-foreground">Project Progress</span>
                                <span className="text-sm text-muted-foreground">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-foreground">Payment Progress</span>
                                <span className="text-sm text-muted-foreground">{paymentProgress}%</span>
                            </div>
                            <Progress value={paymentProgress} className="h-2" />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground">Budget</p>
                                    <p className="text-sm font-semibold text-foreground truncate">
                                        {getCurrencySymbol(project.currency)}{formatCurrency(project.budget, project.currency)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Users className="h-4 w-4 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground">Team</p>
                                    <p className="text-sm font-semibold text-foreground">
                                        {teamMembers.length} members
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Team Members */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">Team:</span>
                                <div className="flex -space-x-2">
                                    {teamMembers.slice(0, 3).map((member, index: number) => (
                                        <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                                            <AvatarImage src={member.image} alt={member.name} />
                                            <AvatarFallback className="text-xs">
                                                {member.name.split(' ').map((n: string) => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {teamMembers.length > 3 && (
                                        <div className="h-6 w-6 bg-muted border-2 border-background rounded-full flex items-center justify-center">
                                            <span className="text-xs text-muted-foreground">
                                                +{teamMembers.length - 3}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/projects/${project.slug}/chat`}>
                                        <MessageSquare className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/projects/${project.slug}/feedback`}>
                                        <BarChart3 className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/projects/${project.slug}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Action Button */}
                        <Button asChild className="w-full mt-4">
                            <Link href={`/projects/${project.slug}`}>
                                View Project Details
                            </Link>
                        </Button>
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
                        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
                        <p className="text-muted-foreground">
                            Manage and track your project progress
                        </p>
                    </div>
                    
                    {session?.user?.role !== 'CLIENT' && (
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Project
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Projects</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="ON_HOLD">On Hold</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Projects Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="h-80">
                                <CardHeader className="space-y-2">
                                    <div className="h-4 bg-muted rounded animate-pulse" />
                                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="h-2 bg-muted rounded animate-pulse" />
                                        <div className="h-2 bg-muted rounded animate-pulse" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-12 bg-muted rounded animate-pulse" />
                                        <div className="h-12 bg-muted rounded animate-pulse" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map(renderProjectCard)}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || statusFilter !== "all" 
                                ? "Try adjusting your search criteria" 
                                : "Get started by creating your first project"
                            }
                        </p>
                        {session?.user?.role !== 'CLIENT' && (
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Project
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
