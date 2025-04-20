"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, Edit, MoreHorizontal, MoveRight, User } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface Task {
    id: string
    title: string
    description: string
    status: "yetToStart" | "inProgress" | "completed"
    priority: "low" | "medium" | "high"
    dueDate: string
    assignee?: {
        id: string
        name: string
        avatar?: string
    }
}

export interface Developer {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
}

interface TaskCardProps {
    task: Task
    onStatusChange: (taskId: string, newStatus: Task["status"]) => void
    onTaskUpdate: (updatedTask: Task) => void
    developers?: Developer[]
}

export function TaskCard({ task, onStatusChange, onTaskUpdate, developers = [] }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedTask, setEditedTask] = useState<Task>(task)

    const priorityColors = {
        low: "bg-green-500/10 text-green-500 border-green-500/20",
        medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        high: "bg-red-500/10 text-red-500 border-red-500/20",
    }

    const handleStatusChange = (newStatus: Task["status"]) => {
        onStatusChange(task.id, newStatus)
    }

    const handleSaveEdit = () => {
        onTaskUpdate(editedTask)
        setIsEditing(false)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date)
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full"
        >
            <Card className="h-full">
                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-base line-clamp-1">{task.title}</CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Task menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DialogTrigger asChild onClick={() => setIsEditing(true)}>
                                    <DropdownMenuItem>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Task
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleStatusChange("yetToStart")}>
                                    Move to Yet to Start
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange("inProgress")}>
                                    Move to In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange("completed")}>Move to Completed</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={priorityColors[task.priority]}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(task.dueDate)}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    {
                        task.assignee ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={task.assignee.avatar || "/placeholder-user.jpg"} />
                                                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs">{task.assignee.name}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>Assigned to {task.assignee.name}</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span className="text-xs">Unassigned</span>
                            </div>
                        )
                    }
                    <Dialog open={isEditing} onOpenChange={setIsEditing}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                                <Edit className="h-3 w-3 mr-2" />
                                Edit
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Task</DialogTitle>
                                <DialogDescription>Make changes to the task details below.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={editedTask.title}
                                        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={editedTask.description}
                                        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select
                                            value={editedTask.priority}
                                            onValueChange={(value: "low" | "medium" | "high") =>
                                                setEditedTask({ ...editedTask, priority: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="dueDate">Due Date</Label>
                                        <Input
                                            id="dueDate"
                                            type="date"
                                            value={editedTask.dueDate.split("T")[0]}
                                            onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="assignee">Assignee</Label>
                                    <Select
                                        value={editedTask.assignee?.id}
                                        onValueChange={(value) => {
                                            const developer = developers.find((dev) => dev.id === value)
                                            setEditedTask({
                                                ...editedTask,
                                                assignee: developer
                                                    ? {
                                                        id: developer.id,
                                                        name: developer.name,
                                                        avatar: developer.avatar,
                                                    }
                                                    : undefined,
                                            })
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select assignee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                developers.map((dev) => (
                                                    <SelectItem key={dev.id} value={dev.id}>
                                                        {dev.name}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={editedTask.status}
                                        onValueChange={(value: "yetToStart" | "inProgress" | "completed") =>
                                            setEditedTask({ ...editedTask, status: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="yetToStart">Yet to Start</SelectItem>
                                            <SelectItem value="inProgress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveEdit}>Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    {
                        task.status !== "completed" && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => {
                                                const nextStatus = {
                                                    yetToStart: "inProgress",
                                                    inProgress: "completed",
                                                    completed: "completed",
                                                }[task.status] as Task["status"]
                                                handleStatusChange(nextStatus)
                                            }}
                                        >
                                            <MoveRight className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Move to next status</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )
                    }
                </CardFooter>
            </Card>
        </motion.div>
    )
}