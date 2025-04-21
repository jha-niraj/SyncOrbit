"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleAlert, Clock, CheckCircle, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskCard, type Task, type Developer } from "../_components/task-card";

interface TaskBoardProps {
    projectId?: string
    initialTasks?: Task[]
    developers?: Developer[]
}
export function TaskBoard({ projectId, initialTasks = [], developers = [] }: TaskBoardProps) {
    console.log(projectId);
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [newTask, setNewTask] = useState<Partial<Task>>({
        title: "",
        description: "",
        status: "yetToStart",
        priority: "medium",
        dueDate: new Date().toISOString().split("T")[0],
    })

    const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
    }

    const handleTaskUpdate = (updatedTask: Task) => {
        setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    }

    const handleAddTask = () => {
        const selectedDeveloper = developers.find((dev) => dev.id === newTask.assignee?.id)

        const task: Task = {
            id: `task-${Date.now()}`,
            title: newTask.title || "New Task",
            description: newTask.description || "",
            status: (newTask.status as Task["status"]) || "yetToStart",
            priority: (newTask.priority as Task["priority"]) || "medium",
            dueDate: newTask.dueDate || new Date().toISOString(),
            assignee: selectedDeveloper
                ? {
                    id: selectedDeveloper.id,
                    name: selectedDeveloper.name,
                    avatar: selectedDeveloper.avatar,
                }
                : undefined,
        }

        setTasks([...tasks, task])
        setNewTask({
            title: "",
            description: "",
            status: "yetToStart",
            priority: "medium",
            dueDate: new Date().toISOString().split("T")[0],
            assignee: undefined,
        })
        setIsAddingTask(false)
    }

    const yetToStartTasks = tasks.filter((task) => task.status === "yetToStart")
    const inProgressTasks = tasks.filter((task) => task.status === "inProgress")
    const completedTasks = tasks.filter((task) => task.status === "completed")

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full">
            <div className="lg:w-3/4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Task Management</h2>
                    <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Task</DialogTitle>
                                <DialogDescription>Create a new task for this project.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Task title"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Task description"
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select
                                            value={newTask.priority as string}
                                            onValueChange={(value: "low" | "medium" | "high") => setNewTask({ ...newTask, priority: value })}
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
                                            value={newTask.dueDate}
                                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="assignee">Assign Developer</Label>
                                    <Select
                                        value={newTask.assignee?.id}
                                        onValueChange={(value) => {
                                            const developer = developers.find((dev) => dev.id === value)
                                            setNewTask({
                                                ...newTask,
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
                                            <SelectValue placeholder="Select developer" />
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
                                        value={newTask.status as string}
                                        onValueChange={(value: "yetToStart" | "inProgress" | "completed") =>
                                            setNewTask({ ...newTask, status: value })
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
                                <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddTask}>Add Task</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <Tabs defaultValue="yetToStart" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="yetToStart" className="flex items-center">
                            <CircleAlert className="h-4 w-4 mr-2 text-yellow-500" />
                            Yet to Start ({yetToStartTasks.length})
                        </TabsTrigger>
                        <TabsTrigger value="inProgress" className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                            In Progress ({inProgressTasks.length})
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="yetToStart" className="mt-4">
                        <ScrollArea className="h-[calc(100vh-280px)]">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 p-1">
                                <AnimatePresence>
                                    {
                                    yetToStartTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onStatusChange={handleStatusChange}
                                            onTaskUpdate={handleTaskUpdate}
                                            developers={developers}
                                        />
                                    ))
                                    }
                                </AnimatePresence>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="inProgress" className="mt-4">
                        <ScrollArea className="h-[calc(100vh-280px)]">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 p-1">
                                <AnimatePresence>
                                    {
                                    inProgressTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onStatusChange={handleStatusChange}
                                            onTaskUpdate={handleTaskUpdate}
                                            developers={developers}
                                        />
                                    ))
                                    }
                                </AnimatePresence>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
            <div className="lg:w-1/4 border-l pl-6">
                <div className="flex items-center mb-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-lg font-medium">Completed ({completedTasks.length})</h3>
                </div>
                <ScrollArea className="h-[calc(100vh-220px)]">
                    <div className="space-y-4 pr-4">
                        <AnimatePresence>
                            {
                            completedTasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <TaskCard
                                        task={task}
                                        onStatusChange={handleStatusChange}
                                        onTaskUpdate={handleTaskUpdate}
                                        developers={developers}
                                    />
                                </motion.div>
                            ))
                            }
                        </AnimatePresence>
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}