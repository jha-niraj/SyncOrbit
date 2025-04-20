"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { Task } from "../../projects/_components/task-card"
import { TaskBoard } from "../../projects/_components/task-board"

export default function DeveloperDashboard() {
    const projects = [
        {
            id: "1",
            title: "E-commerce Website",
            status: "In Progress",
            completion: 65,
            image: "/placeholder.svg?height=200&width=300",
            tasks: {
                total: 10,
                completed: 4,
                inProgress: 2,
                yetToStart: 4,
            },
        },
        {
            id: "2",
            title: "Mobile App Development",
            status: "In Progress",
            completion: 40,
            image: "/placeholder.svg?height=200&width=300",
            tasks: {
                total: 12,
                completed: 3,
                inProgress: 2,
                yetToStart: 7,
            },
        },
    ]

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
                name: "John Developer",
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
                name: "John Developer",
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
                id: "dev-1",
                name: "John Developer",
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
                id: "dev-1",
                name: "John Developer",
                avatar: "/placeholder-user.jpg",
            },
        },
    ]

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
                <h2 className="text-xl font-semibold mb-4">Assigned Projects</h2>
                <motion.div className="grid gap-6 md:grid-cols-2 mb-8" variants={container} initial="hidden" animate="show">
                    {projects.map((project) => (
                        <motion.div key={project.id} variants={item}>
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
                                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                            {project.status}
                                        </div>
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle>{project.title}</CardTitle>
                                    <CardDescription>
                                        <div className="flex justify-between text-sm mt-1">
                                            <span>Progress</span>
                                            <span>{project.completion}%</span>
                                        </div>
                                        <Progress value={project.completion} className="h-2 mt-1" />
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-yellow-500/10 rounded-md p-2">
                                            <p className="text-lg font-bold text-yellow-500">{project.tasks.yetToStart}</p>
                                            <p className="text-xs text-muted-foreground">To Start</p>
                                        </div>
                                        <div className="bg-blue-500/10 rounded-md p-2">
                                            <p className="text-lg font-bold text-blue-500">{project.tasks.inProgress}</p>
                                            <p className="text-xs text-muted-foreground">In Progress</p>
                                        </div>
                                        <div className="bg-green-500/10 rounded-md p-2">
                                            <p className="text-lg font-bold text-green-500">{project.tasks.completed}</p>
                                            <p className="text-xs text-muted-foreground">Completed</p>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link href={`/projects/${project.id}`} className="w-full">
                                        <Button variant="outline" className="w-full">
                                            View Project
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))
                    }
                </motion.div>
                <div className="mb-8">
                    <TaskBoard initialTasks={initialTasks} />
                </div>
            </main>
        </div>
    )
}