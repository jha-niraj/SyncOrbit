"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Task } from "../_components/task-card"
import { TaskBoard } from "../_components/task-board"

const project = {
    id: 1,
    title: "E-commerce Website",
    description: "A full-featured e-commerce platform with product management, shopping cart, and payment integration.",
    logo: "/placeholder.svg?height=100&width=100",
    duration: "3 months",
    price: "$5,000",
    completion: 65,
    client: {
        id: "client-1",
        name: "Acme Corporation",
        logo: "/placeholder.svg?height=80&width=80",
        contactPerson: "Sarah Johnson",
        email: "sarah@acmecorp.com",
        phone: "+1 (555) 123-4567",
    },
    team: {
        productManager: { id: "pm-1", name: "Jane Smith", email: "jane@example.com", avatar: "/placeholder-user.jpg" },
        developers: [
            {
                id: "dev-1",
                name: "John Doe",
                email: "john@example.com",
                role: "Frontend Developer",
                avatar: "/placeholder-user.jpg",
            },
            {
                id: "dev-2",
                name: "Mike Johnson",
                email: "mike@example.com",
                role: "Backend Developer",
                avatar: "/placeholder-user.jpg",
            },
        ],
    },
}
const initialTasks: Task[] = [
    {
        id: "task-1",
        title: "Implement User Authentication",
        description: "Add login and registration functionality with JWT authentication and social login options.",
        status: "yetToStart",
        priority: "high",
        dueDate: "2023-11-30T00:00:00.000Z",
        assignee: {
            id: "dev-1",
            name: "John Doe",
            avatar: "/placeholder-user.jpg",
        },
    },
    {
        id: "task-2",
        title: "Create Product Listing Page",
        description: "Design and implement the product grid view with filtering and sorting options.",
        status: "yetToStart",
        priority: "medium",
        dueDate: "2023-12-05T00:00:00.000Z",
        assignee: {
            id: "dev-1",
            name: "John Doe",
            avatar: "/placeholder-user.jpg",
        },
    },
    {
        id: "task-3",
        title: "Shopping Cart Functionality",
        description: "Implement add to cart, update quantity, and checkout process with payment gateway integration.",
        status: "inProgress",
        priority: "high",
        dueDate: "2023-12-10T00:00:00.000Z",
        assignee: {
            id: "dev-2",
            name: "Mike Johnson",
            avatar: "/placeholder-user.jpg",
        },
    },
    {
        id: "task-4",
        title: "Database Schema Design",
        description: "Create the initial database structure with proper relationships and indexes.",
        status: "completed",
        priority: "medium",
        dueDate: "2023-11-15T00:00:00.000Z",
        assignee: {
            id: "dev-2",
            name: "Mike Johnson",
            avatar: "/placeholder-user.jpg",
        },
    },
    {
        id: "task-5",
        title: "API Documentation",
        description: "Create comprehensive API documentation using Swagger/OpenAPI.",
        status: "completed",
        priority: "low",
        dueDate: "2023-11-20T00:00:00.000Z",
        assignee: {
            id: "dev-2",
            name: "Mike Johnson",
            avatar: "/placeholder-user.jpg",
        },
    },
]
const feedbacks = [
    {
        id: "1",
        title: "Great Work!",
        description: "The team delivered on time and exceeded expectations.",
        date: "2023-10-15T14:30:00",
    },
    {
        id: "2",
        title: "Minor Issues",
        description: "Overall good, but there were some minor bugs that needed fixing.",
        date: "2023-09-22T10:15:00",
    },
]
export default function ProjectDetails({ params }: { params: { id: string } }) {
    const [newFeedback, setNewFeedback] = useState({ title: "", description: "" })

    const handleAddFeedback = () => {
        console.log("Adding feedback:", newFeedback)
        setNewFeedback({ title: "", description: "" })
    }

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 container py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-12 w-12 rounded-md overflow-hidden">
                                            <img
                                                src={project.logo || "/placeholder.svg"}
                                                alt={`${project.title} logo`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <CardTitle>{project.title}</CardTitle>
                                            <Badge variant="outline" className="mt-1">
                                                {project.completion < 100 ? "In Progress" : "Completed"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardDescription className="mt-2">{project.description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium">Duration</h3>
                                        <p className="text-sm text-muted-foreground">{project.duration}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium">Price</h3>
                                        <p className="text-sm text-muted-foreground">{project.price}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">Project Completion</span>
                                        <span>{project.completion}%</span>
                                    </div>
                                    <Progress value={project.completion} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Client Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-16 w-16 rounded-md overflow-hidden">
                                        <img
                                            src={project.client.logo || "/placeholder.svg"}
                                            alt={`${project.client.name} logo`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{project.client.name}</h3>
                                        <p className="text-sm text-muted-foreground">{project.client.contactPerson}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <h3 className="text-sm font-medium">Email</h3>
                                        <p className="text-sm text-muted-foreground">{project.client.email}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium">Phone</h3>
                                        <p className="text-sm text-muted-foreground">{project.client.phone}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Team Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Product Manager</h3>
                                    <div className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarImage src={project.team.productManager.avatar} />
                                            <AvatarFallback>{project.team.productManager.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{project.team.productManager.name}</p>
                                            <p className="text-xs text-muted-foreground">{project.team.productManager.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Developers</h3>
                                    <div className="space-y-2">
                                        {
                                            project.team.developers.map((dev) => (
                                                <div key={dev.id} className="flex items-center gap-2">
                                                    <Avatar>
                                                        <AvatarImage src={dev.avatar} />
                                                        <AvatarFallback>{dev.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">{dev.name}</p>
                                                        <p className="text-xs text-muted-foreground">{dev.role}</p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
                <div className="mb-8">
                    <TaskBoard projectId={params.id} initialTasks={initialTasks} developers={project.team.developers} />
                </div>
                <h2 className="text-xl font-semibold mb-4">Feedback</h2>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="sm:w-auto w-full">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Add Feedback
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add Feedback</DialogTitle>
                                <DialogDescription>Your feedback is welcome... as long as it's positive.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="title">Title</label>
                                    <Input
                                        id="title"
                                        placeholder="Feedback title"
                                        value={newFeedback.title}
                                        onChange={(e) => setNewFeedback({ ...newFeedback, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="description">Description</label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your feedback"
                                        value={newFeedback.description}
                                        onChange={(e) => setNewFeedback({ ...newFeedback, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleAddFeedback}>
                                    Submit Feedback
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="sm:w-auto w-full">
                                See Feedback
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Feedback History</SheetTitle>
                                <SheetDescription>Previous feedback for this project</SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-4">
                                {
                                    feedbacks.map((feedback) => (
                                        <Card key={feedback.id}>
                                            <CardHeader>
                                                <CardTitle className="text-base">{feedback.title}</CardTitle>
                                                <CardDescription>{new Date(feedback.date).toLocaleString()}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">{feedback.description}</p>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </main>
        </div>
    )
}