"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, CheckCircle, Clock, MessageSquare, Trophy } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

export default function ClientDashboard() {
    // Mock data - in a real app, this would come from an API or database
    const projects = [
        {
            id: "1",
            title: "E-commerce Website",
            duration: "3 months",
            price: "$5,000",
            status: "Completed",
            completion: 100,
            image: "/placeholder.svg?height=200&width=300",
        },
        {
            id: "2",
            title: "Mobile App Development",
            duration: "6 months",
            price: "$12,000",
            status: "In Progress",
            completion: 65,
            image: "/placeholder.svg?height=200&width=300",
        },
        {
            id: "3",
            title: "Brand Redesign",
            duration: "2 months",
            price: "$3,500",
            status: "In Progress",
            completion: 40,
            image: "/placeholder.svg?height=200&width=300",
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

    const [newFeedback, setNewFeedback] = useState({ title: "", description: "" })

    const handleAddFeedback = () => {
        // In a real app, this would send the feedback to an API
        console.log("Adding feedback:", newFeedback)
        setNewFeedback({ title: "", description: "" })
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    }

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 container py-6">
                <motion.div className="grid gap-4 md:grid-cols-3 mb-8" variants={container} initial="hidden" animate="show">
                    <motion.div variants={item}>
                        <Card className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
                                <CardTitle className="text-sm font-medium">Total Business with Us</CardTitle>
                                <Trophy className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold">3 Projects</div>
                                <div className="flex items-center text-sm text-muted-foreground mt-2">
                                    <div className="h-4 w-4 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                                        <ArrowUpRight className="h-3 w-3 text-white" />
                                    </div>
                                    <span>+1 from last month</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={item}>
                        <Card className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-500/10 to-green-500/5">
                                <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold">1</div>
                                <p className="text-sm text-muted-foreground mt-2">Successfully delivered</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={item}>
                        <Card className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5">
                                <CardTitle className="text-sm font-medium">Ongoing Projects</CardTitle>
                                <Clock className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="text-3xl font-bold">2</div>
                                <p className="text-sm text-muted-foreground mt-2">In progress</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
                <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden h-full flex flex-col">
                                <div className="relative h-40 w-full">
                                    <Image
                                        src={project.image || "/placeholder.svg"}
                                        alt={project.title}
                                        className="object-cover w-full h-full"
                                        height={30}
                                        width={30}
                                    />
                                    <div className="absolute top-2 right-2">
                                        <div
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${project.status === "Completed"
                                                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                                    : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                                }`}
                                        >
                                            {project.status}
                                        </div>
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle>{project.title}</CardTitle>
                                    <CardDescription>
                                        Duration: {project.duration} • Price: {project.price}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Progress</span>
                                            <span>{project.completion}%</span>
                                        </div>
                                        <Progress value={project.completion} className="h-2" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link href={`/projects/${project.id}`} className="w-full">
                                        <Button variant="outline" className="w-full">
                                            View Details
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))
                    }
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
                                <DialogDescription>We value your opinion... unless it's about weekend deadlines.</DialogDescription>
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
                                <SheetDescription>Your previous feedback submissions</SheetDescription>
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