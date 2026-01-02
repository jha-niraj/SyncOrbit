"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
    Plus, MessageSquare, Search, AlertCircle, CheckCircle, Clock
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { getProjectFeedback, createFeedback, updateFeedbackStatus } from "@/actions/(client)/feedback.action"
import { toast } from "sonner"
import { FeedbackStatus } from "@prisma/client"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

interface FeedbackItem {
    id: string
    title: string
    description: string | null
    status: FeedbackStatus
    createdAt: Date
    updatedAt: Date
    user: {
        id: string
        name: string | null
        email: string | null
        image: string | null
        role: string
    }
}

interface FeedbackSheetProps {
    slug: string
    projectTitle: string
}

export function FeedbackSheet({ slug, projectTitle }: FeedbackSheetProps) {
    const [feedback, setFeedback] = useState<FeedbackItem[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    // Form states
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newFeedback, setNewFeedback] = useState({
        title: "",
        description: "",
        priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
        category: ""
    })

    // Filter states
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [priorityFilter, setPriorityFilter] = useState("ALL")

    const loadFeedback = useCallback(async () => {
        if (!open) return
        try {
            setLoading(true)
            const result = await getProjectFeedback(slug)

            if (result.success) {
                setFeedback(result.feedback)
            } else {
                toast.error(result.error || "Failed to load feedback")
            }
        } catch (error) {
            console.error("Load feedback error:", error)
            toast.error("Failed to load feedback")
        } finally {
            setLoading(false)
        }
    }, [slug, open])

    useEffect(() => {
        loadFeedback()
    }, [loadFeedback])

    const handleCreateFeedback = async () => {
        if (!newFeedback.title.trim()) {
            toast.error("Please enter a title")
            return
        }

        try {
            const result = await createFeedback({
                projectSlug: slug,
                title: newFeedback.title,
                description: newFeedback.description,
                priority: newFeedback.priority,
                category: newFeedback.category
            })

            if (result.success && result.feedback) {
                setFeedback(prev => [result.feedback!, ...prev])
                setNewFeedback({
                    title: "",
                    description: "",
                    priority: "MEDIUM",
                    category: ""
                })
                setIsDialogOpen(false)
                toast.success("Feedback created successfully")
            } else {
                toast.error(result.error || "Failed to create feedback")
            }
        } catch (error) {
            console.error("Create feedback error:", error)
            toast.error("Failed to create feedback")
        }
    }

    const handleUpdateStatus = async (feedbackId: string, status: FeedbackStatus) => {
        try {
            const result = await updateFeedbackStatus(feedbackId, status)

            if (result.success) {
                setFeedback(prev => prev.map(item =>
                    item.id === feedbackId
                        ? { ...item, status }
                        : item
                ))
                toast.success("Status updated successfully")
            } else {
                toast.error(result.error || "Failed to update status")
            }
        } catch (error) {
            console.error("Update status error:", error)
            toast.error("Failed to update status")
        }
    }

    // Filter feedback based on search and filters
    const filteredFeedback = feedback.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter
        const matchesPriority = priorityFilter === "ALL" || priorityFilter === "HIGH" // Simplified for now

        return matchesSearch && matchesStatus && matchesPriority
    })

    const getStatusBadgeVariant = (status: FeedbackStatus) => {
        switch (status) {
            case FeedbackStatus.PENDING:
                return "secondary" as const
            case FeedbackStatus.IN_PROGRESS:
                return "default" as const
            case FeedbackStatus.COMPLETED:
                return "default" as const
            case FeedbackStatus.CANCELLED:
                return "destructive" as const
            default:
                return "secondary"
        }
    }

    const getStatusIcon = (status: FeedbackStatus) => {
        switch (status) {
            case FeedbackStatus.PENDING:
                return <Clock className="h-4 w-4" />
            case FeedbackStatus.IN_PROGRESS:
                return <AlertCircle className="h-4 w-4" />
            case FeedbackStatus.COMPLETED:
                return <CheckCircle className="h-4 w-4" />
            case FeedbackStatus.CANCELLED:
                return <AlertCircle className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Feedback
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-[50vw] flex flex-col h-full overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        {projectTitle} - Feedback
                    </SheetTitle>
                </SheetHeader>

                <div className="py-4 space-y-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search feedback..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="icon">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Create New Feedback</DialogTitle>
                                        <DialogDescription>
                                            Share your thoughts, report issues, or suggest improvements for this project.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-sm font-medium">Title</Label>
                                            <Input
                                                placeholder="Brief description of the feedback"
                                                value={newFeedback.title}
                                                onChange={(e) => setNewFeedback(prev => ({ ...prev, title: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Description</Label>
                                            <Textarea
                                                placeholder="Provide detailed information about your feedback"
                                                value={newFeedback.description}
                                                onChange={(e) => setNewFeedback(prev => ({ ...prev, description: e.target.value }))}
                                                rows={4}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-sm font-medium">Priority</Label>
                                                <Select
                                                    value={newFeedback.priority}
                                                    onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") =>
                                                        setNewFeedback(prev => ({ ...prev, priority: value }))
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="LOW">Low</SelectItem>
                                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                                        <SelectItem value="HIGH">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium">Category</Label>
                                                <Input
                                                    placeholder="e.g., Bug, Feature, UI/UX"
                                                    value={newFeedback.category}
                                                    onChange={(e) => setNewFeedback(prev => ({ ...prev, category: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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
                        <div className="flex gap-4">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Priority</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="LOW">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : filteredFeedback.length > 0 ? (
                            <AnimatePresence>
                                {
                                    filteredFeedback.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Card className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-start justify-between">
                                                            <div className="space-y-1">
                                                                <h3 className="font-semibold">{item.title}</h3>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    <span>{item.user.name || "Anonymous"}</span>
                                                                    <span>•</span>
                                                                    <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant={getStatusBadgeVariant(item.status)} className="text-xs px-1.5 py-0.5">
                                                                    {getStatusIcon(item.status)}
                                                                </Badge>
                                                                <Select
                                                                    value={item.status}
                                                                    onValueChange={(value) => handleUpdateStatus(item.id, value as FeedbackStatus)}
                                                                >
                                                                    <SelectTrigger className="h-6 w-[20px] p-0 border-0 focus:ring-0">
                                                                        <span className="sr-only">Change status</span>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value={FeedbackStatus.PENDING}>Pending</SelectItem>
                                                                        <SelectItem value={FeedbackStatus.IN_PROGRESS}>In Progress</SelectItem>
                                                                        <SelectItem value={FeedbackStatus.COMPLETED}>Completed</SelectItem>
                                                                        <SelectItem value={FeedbackStatus.CANCELLED}>Cancelled</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        {
                                                            item.description && (
                                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                                    {item.description}
                                                                </p>
                                                            )
                                                        }
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))
                                }
                            </AnimatePresence>
                        ) : (
                            <div className="text-center py-8">
                                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No feedback yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Be the first to share your thoughts about this project.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
