"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
    Building2, 
    Users, 
    FolderOpen,
    ArrowLeft,
    Calendar,
    CheckCircle,
    MessageSquare,
    FileText
} from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getClientCompanyDetails } from "@/actions/(client)/companies.action"
import Image from "next/image"

interface CompanyDetails {
    id: string
    name: string
    shortName: string
    logo: string | null
    productManager: {
        id: string
        name: string | null
        email: string | null
        image: string | null
        bio: string | null
    }
    users: Array<{
        id: string
        name: string | null
        email: string | null
        image: string | null
        bio: string | null
        skills: string | null
        assignedTasks: Array<{
            id: string
            title: string
            status: string
            project: {
                id: string
                title: string
            }
        }>
    }>
    projects: Array<{
        id: string
        title: string
        description: string | null
        status: string
        slug: string
        budget: number
        paidAmount: number
        startDate: Date
        endDate: Date | null
        tasks: Array<{
            id: string
            title: string
            status: string
            assignedDeveloper: {
                id: string
                name: string | null
                image: string | null
            } | null
            subtasks: Array<{
                id: string
                completed: boolean
            }>
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
    }>
}

export default function CompanyDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { data: session } = useSession()
    const router = useRouter()
    const [company, setCompany] = useState<CompanyDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null)

    useEffect(() => {
        // Handle async params in Next.js 15
        const resolveParams = async () => {
            const resolved = await params
            setResolvedParams(resolved)
        }
        
        resolveParams()
    }, [params])

    const loadCompanyDetails = useCallback(async () => {
        if (!resolvedParams?.slug) return
        
        setLoading(true)
        try {
            const result = await getClientCompanyDetails(resolvedParams.slug)
            if (result.success && result.company) {
                setCompany(result.company)
            } else {
                toast.error(result.error)
                router.push("/companies")
            }
        } catch (error) {
            console.error("Error loading company details:", error)
            toast.error("Failed to load company details")
            router.push("/companies")
        } finally {
            setLoading(false)
        }
    }, [resolvedParams?.slug, router])

    useEffect(() => {
        // Redirect if not a client
        if (session?.user?.role && session.user.role !== "CLIENT") {
            router.push("/dashboard")
            return
        }
        
        if (resolvedParams?.slug) {
            loadCompanyDetails()
        }
    }, [session, router, resolvedParams?.slug, loadCompanyDetails])

    const getProjectStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED": return "text-green-600 bg-green-100"
            case "IN_PROGRESS": return "text-blue-600 bg-blue-100"
            case "ON_HOLD": return "text-yellow-600 bg-yellow-100"
            case "CANCELLED": return "text-red-600 bg-red-100"
            default: return "text-gray-600 bg-gray-100"
        }
    }

    if (session?.user?.role !== "CLIENT") {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center text-muted-foreground">
                    This page is only accessible to clients.
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-muted rounded w-1/3"></div>
                    <div className="h-48 bg-muted rounded"></div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="h-64 bg-muted rounded"></div>
                        <div className="h-64 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!company) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center text-muted-foreground">
                    Company not found or access denied.
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/companies">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Companies
                    </Button>
                </Link>
            </div>

            {/* Company Header */}
            <Card className="border-border/50">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            {company.logo ? (
                                <Image
                                    src={company.logo} 
                                    alt={company.name}
                                    className="h-16 w-16 rounded-lg object-cover border"
                                    height={32}
                                    width={32}
                                />
                            ) : (
                                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Building2 className="h-8 w-8 text-primary" />
                                </div>
                            )}
                            <div>
                                <CardTitle className="text-2xl">{company.name}</CardTitle>
                                <Badge variant="outline" className="mt-1">
                                    @{company.shortName}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <h4 className="font-semibold mb-3">Product Manager</h4>
                            <div className="flex items-start gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={company.productManager.image || "/placeholder.svg"} />
                                    <AvatarFallback>
                                        {company.productManager.name?.split(" ").map(n => n[0]).join("") || "PM"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h5 className="font-medium">{company.productManager.name}</h5>
                                    <p className="text-sm text-muted-foreground">{company.productManager.email}</p>
                                    {company.productManager.bio && (
                                        <p className="text-sm text-muted-foreground mt-1">{company.productManager.bio}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Quick Stats</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                    <span>{company.projects.length} Projects</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>{company.users.length} Developers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Projects Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FolderOpen className="h-5 w-5" />
                                Your Projects ({company.projects.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {company.projects.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    No projects found with this company.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {company.projects.map((project) => {
                                        const completedTasks = project.tasks.filter(task => task.status === "COMPLETED").length
                                        const totalTasks = project.tasks.length
                                        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

                                        return (
                                            <Card key={project.id} className="border-border/30">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h4 className="font-semibold">{project.title}</h4>
                                                            {project.description && (
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    {project.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Badge className={getProjectStatusColor(project.status)}>
                                                            {project.status.replace("_", " ")}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="flex justify-between text-sm mb-1">
                                                                <span>Progress</span>
                                                                <span>{completedTasks}/{totalTasks} tasks</span>
                                                            </div>
                                                            <Progress value={progress} className="h-2" />
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                                            <div className="flex items-center gap-1">
                                                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                                                <span>{project._count.tasks} Tasks</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                                <span>{project._count.messages} Messages</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                                <span>{project._count.feedbacks} Feedback</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-2">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-sm text-muted-foreground">
                                                                    Started {new Date(project.startDate).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <Link href={`/projects/${project.slug}`}>
                                                                <Button size="sm" variant="outline">
                                                                    View Project
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Developers Section */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Development Team ({company.users.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {company.users.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    No developers assigned to your projects yet.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {company.users.map((developer) => {
                                        const tasksOnUserProjects = developer.assignedTasks.filter(task => 
                                            company.projects.some(project => project.id === task.project.id)
                                        )
                                        const completedTasks = tasksOnUserProjects.filter(task => task.status === "COMPLETED").length

                                        return (
                                            <Card key={developer.id} className="border-border/30">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={developer.image || "/placeholder.svg"} />
                                                            <AvatarFallback className="text-sm">
                                                                {developer.name?.split(" ").map(n => n[0]).join("") || "D"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="font-medium truncate">{developer.name}</h5>
                                                            <p className="text-xs text-muted-foreground truncate">{developer.email}</p>
                                                            
                                                            {developer.skills && (
                                                                <div className="mt-2">
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {developer.skills.split(',').slice(0, 2).map((skill, index) => (
                                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                                {skill.trim()}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="mt-3 space-y-1">
                                                                <div className="flex justify-between text-xs">
                                                                    <span className="text-muted-foreground">Tasks on your projects</span>
                                                                    <span>{completedTasks}/{tasksOnUserProjects.length}</span>
                                                                </div>
                                                                {tasksOnUserProjects.length > 0 && (
                                                                    <Progress 
                                                                        value={(completedTasks / tasksOnUserProjects.length) * 100} 
                                                                        className="h-1" 
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
