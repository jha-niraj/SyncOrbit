"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
    ArrowLeft, 
    Plus,
    MessageSquare,
    Star,
    Filter,
    Search,
    Calendar,
    User,
    AlertCircle,
    CheckCircle,
    Clock,
    MoreVertical
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface FeedbackPageProps {
    params: Promise<{
        slug: string
    }>
}

// Mock data - replace with actual data fetching
const mockProject = {
    id: "1",
    title: "E-commerce Platform",
    slug: "ecommerce-platform"
}

const mockFeedback = [
    {
        id: "1",
        title: "Product Page Loading Speed",
        description: "The product pages are taking too long to load, especially for products with multiple images. This might affect user experience and conversion rates.",
        priority: "HIGH",
        status: "OPEN",
        category: "Performance",
        author: {
            id: "1",
            name: "John Doe",
            image: "/placeholder.svg",
            role: "CLIENT"
        },
        assignee: {
            id: "2",
            name: "Alice Dev",
            image: "/placeholder.svg",
            role: "DEVELOPER"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        comments: [
            {
                id: "1",
                content: "I've identified the issue. The images aren't being optimized properly. Working on a fix.",
                author: {
                    id: "2",
                    name: "Alice Dev",
                    image: "/placeholder.svg",
                    role: "DEVELOPER"
                },
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
            }
        ]
    },
    {
        id: "2",
        title: "Checkout Process Improvement",
        description: "Users are finding the checkout process confusing. Consider simplifying the steps and adding progress indicators.",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        category: "UX/UI",
        author: {
            id: "1",
            name: "John Doe",
            image: "/placeholder.svg",
            role: "CLIENT"
        },
        assignee: {
            id: "3",
            name: "Bob Designer",
            image: "/placeholder.svg",
            role: "DEVELOPER"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        comments: []
    },
    {
        id: "3",
        title: "Mobile Responsiveness",
        description: "The mobile version looks great! The responsive design is working perfectly across all devices.",
        priority: "LOW",
        status: "RESOLVED",
        category: "Design",
        author: {
            id: "1",
            name: "John Doe",
            image: "/placeholder.svg",
            role: "CLIENT"
        },
        assignee: {
            id: "3",
            name: "Bob Designer",
            image: "/placeholder.svg",
            role: "DEVELOPER"
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        comments: []
    }
]

export default function ProjectFeedbackPage({ params }: FeedbackPageProps) {
    const { data: session } = useSession()
    const [project, setProject] = useState(mockProject)
    const [feedback, setFeedback] = useState(mockFeedback)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [priorityFilter, setPriorityFilter] = useState<string>("all")
    const [isNewFeedbackOpen, setIsNewFeedbackOpen] = useState(false)
    const [newFeedback, setNewFeedback] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        category: ""
    })

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH':
                return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
            case 'MEDIUM':
                return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
            case 'LOW':
                return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN':
                return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
            case 'IN_PROGRESS':
                return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"
            case 'RESOLVED':
                return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
            case 'CLOSED':
                return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'OPEN':
                return <AlertCircle className="h-4 w-4" />
            case 'IN_PROGRESS':
                return <Clock className="h-4 w-4" />
            case 'RESOLVED':
                return <CheckCircle className="h-4 w-4" />
            default:
                return <MessageSquare className="h-4 w-4" />
        }
    }

    const filteredFeedback = feedback.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || item.status === statusFilter
        const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter
        return matchesSearch && matchesStatus && matchesPriority
    })

    const handleCreateFeedback = () => {
        if (!newFeedback.title.trim() || !newFeedback.description.trim()) return

        const feedback = {
            id: Date.now().toString(),
            ...newFeedback,
            status: "OPEN",
            author: {
                id: session?.user?.id || "1",
                name: session?.user?.name || "User",
                image: session?.user?.image || "/placeholder.svg",
                role: session?.user?.role || "CLIENT"
            },
            assignee: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            comments: []
        }

        setFeedback(prev => [feedback, ...prev])
        setNewFeedback({ title: "", description: "", priority: "MEDIUM", category: "" })
        setIsNewFeedbackOpen(false)
    }

    const renderFeedbackCard = (item: any) => {
        return (
            <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group"
            >
                <Card className="hover:shadow-lg transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-start gap-2">
                                    <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {item.title}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Badge className={`${getPriorityColor(item.priority)} border text-xs`}>
                                            {item.priority}
                                        </Badge>
                                        <Badge className={`${getStatusColor(item.status)} border text-xs flex items-center gap-1`}>
                                            {getStatusIcon(item.status)}
                                            {item.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                                {item.category && (
                                    <Badge variant="outline" className="w-fit text-xs">
                                        {item.category}
                                    </Badge>
                                )}
                            </div>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {item.description}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={item.author.image} alt={item.author.name} />
                                        <AvatarFallback className="text-xs">
                                            {item.author.name.split(' ').map((n: string) => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-muted-foreground">{item.author.name}</span>
                                </div>
                                
                                {item.assignee && (
                                    <>
                                        <span className="text-xs text-muted-foreground">→</span>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={item.assignee.image} alt={item.assignee.name} />
                                                <AvatarFallback className="text-xs">
                                                    {item.assignee.name.split(' ').map((n: string) => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-muted-foreground">{item.assignee.name}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {formatDistanceToNow(item.updatedAt, { addSuffix: true })}
                            </div>
                        </div>

                        {item.comments.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MessageSquare className="h-3 w-3" />
                                {item.comments.length} comment{item.comments.length !== 1 ? 's' : ''}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/projects/${project.slug}`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Feedback</h1>
                            <p className="text-muted-foreground">{project.title}</p>
                        </div>
                    </div>
                    
                    <Dialog open={isNewFeedbackOpen} onOpenChange={setIsNewFeedbackOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                New Feedback
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create New Feedback</DialogTitle>
                                <DialogDescription>
                                    Share your thoughts, suggestions, or report issues about the project.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground">Title</label>
                                    <Input
                                        placeholder="Brief summary of your feedback"
                                        value={newFeedback.title}
                                        onChange={(e) => setNewFeedback(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium text-foreground">Description</label>
                                    <Textarea
                                        placeholder="Detailed description of your feedback"
                                        value={newFeedback.description}
                                        onChange={(e) => setNewFeedback(prev => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-foreground">Priority</label>
                                        <Select value={newFeedback.priority} onValueChange={(value) => setNewFeedback(prev => ({ ...prev, priority: value }))}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="LOW">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium text-foreground">Category</label>
                                        <Input
                                            placeholder="e.g., Bug, Feature, Design"
                                            value={newFeedback.category}
                                            onChange={(e) => setNewFeedback(prev => ({ ...prev, category: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 justify-end">
                                    <Button variant="outline" onClick={() => setIsNewFeedbackOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreateFeedback}>
                                        Create Feedback
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search feedback..."
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
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="OPEN">Open</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Filter by priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Feedback List */}
                {filteredFeedback.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {filteredFeedback.map(renderFeedbackCard)}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">No feedback found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                                ? "Try adjusting your search criteria" 
                                : "Be the first to share your feedback on this project"
                            }
                        </p>
                        <Button onClick={() => setIsNewFeedbackOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Feedback
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
