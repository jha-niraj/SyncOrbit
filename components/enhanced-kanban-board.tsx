"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
    Dialog, DialogContent, DialogDescription, DialogHeader,
    DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
    Users, Calendar, Clock, AlertCircle, CheckCircle,
    Plus, MoreVertical, Edit, Trash2, User, Flag,
    Code, Megaphone, ShoppingCart, Palette, Briefcase, Settings,
    ArrowRight, ArrowLeft, Timer, Target
} from "lucide-react"
import { TaskStatus, Priority, TeamType, Role } from "@prisma/client"
import { createTask, updateTask, getAssignmentOptions } from "@/actions/tasks.action"
import { toast } from "sonner"
import { formatDistanceToNow, format } from "date-fns"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

// Team type icons
const TEAM_ICONS = {
    [TeamType.TECHNICAL]: Code,
    [TeamType.MARKETING]: Megaphone,
    [TeamType.SALES]: ShoppingCart,
    [TeamType.DESIGN]: Palette,
    [TeamType.OPERATIONS]: Settings,
    [TeamType.FINANCE]: Briefcase,
    [TeamType.CUSTOM]: Users,
}

// Priority colors
const PRIORITY_COLORS = {
    [Priority.LOW]: "text-gray-600 bg-gray-100",
    [Priority.MEDIUM]: "text-blue-600 bg-blue-100", 
    [Priority.HIGH]: "text-orange-600 bg-orange-100",
    [Priority.URGENT]: "text-red-600 bg-red-100"
}

// Status columns configuration
const COLUMNS = [
    { id: TaskStatus.YET_TO_START, title: "To Do", color: "border-gray-300" },
    { id: TaskStatus.IN_PROGRESS, title: "In Progress", color: "border-blue-300" },
    { id: TaskStatus.COMPLETED, title: "Done", color: "border-green-300" }
]

interface Task {
    id: string
    title: string
    description?: string
    status: TaskStatus
    priority: Priority
    duration?: number
    assignedTeam: {
        id: string
        displayName: string
        teamType: TeamType
        color?: string | null
    }
    assignedDeveloper?: {
        id: string
        name: string | null
        email: string | null
        image?: string | null
    }
    project: {
        id: string
        title: string
        slug: string
    }
    createdBy: {
        id: string
        name: string | null
        email: string | null
    }
    createdAt: Date
    updatedAt: Date
}

interface AssignmentOption {
    teams: Array<{
        id: string
        name: string
        displayName: string
        teamType: TeamType
        color?: string | null
        members: any[]
    }>
    members: Array<{
        id: string
        name: string | null
        email: string | null
        image?: string | null
        teamId: string
        teamName: string
        teamColor?: string | null
    }>
}

interface EnhancedKanbanBoardProps {
    tasks: Task[]
    projectId: string
    userRole: Role
    userId: string
    onTaskUpdate?: () => void
}

export function EnhancedKanbanBoard({ 
    tasks, 
    projectId, 
    userRole, 
    userId, 
    onTaskUpdate 
}: EnhancedKanbanBoardProps) {
    const [localTasks, setLocalTasks] = useState<Task[]>(tasks)
    const [isCreating, setIsCreating] = useState(false)
    const [isEditing, setIsEditing] = useState<string | null>(null)
    const [assignmentOptions, setAssignmentOptions] = useState<AssignmentOption>({
        teams: [],
        members: []
    })

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTeamId: "",
        assignedDeveloperId: "",
        priority: Priority.MEDIUM as Priority,
        duration: 0
    })

    // Permission checks
    const canCreateTasks = userRole === Role.COMPANY_OWNER || userRole === Role.TEAM_HEAD
    const canEditAllTasks = userRole === Role.COMPANY_OWNER || userRole === Role.TEAM_HEAD
    const canEditMyTasks = userRole === Role.TEAM_MEMBER

    useEffect(() => {
        setLocalTasks(tasks)
    }, [tasks])

    // Load assignment options when creating/editing
    const loadAssignmentOptions = async () => {
        const result = await getAssignmentOptions(projectId)
        if (result.success) {
            setAssignmentOptions({
                teams: result.teams,
                members: result.members
            })
        }
    }

    // Filter tasks based on user permissions
    const getVisibleTasks = () => {
        if (userRole === Role.CLIENT) {
            // Clients see all tasks but in read-only mode
            return localTasks
        }

        if (userRole === Role.TEAM_MEMBER) {
            // Team members see tasks from their teams
            return localTasks.filter(task => {
                // Check if user is a member of the assigned team or if task is assigned to them
                return task.assignedDeveloper?.id === userId || 
                       assignmentOptions.members.some(m => m.id === userId && m.teamId === task.assignedTeam.id)
            })
        }

        // Company owners and team heads see all tasks
        return localTasks
    }

    // Check if user can edit specific task
    const canEditTask = (task: Task) => {
        if (userRole === Role.COMPANY_OWNER) return true
        if (userRole === Role.TEAM_HEAD) return true
        if (userRole === Role.TEAM_MEMBER) return task.assignedDeveloper?.id === userId
        return false
    }

    // Handle drag and drop
    const onDragEnd = async (result: any) => {
        if (!result.destination) return

        const { source, destination, draggableId } = result
        
        // Check if status actually changed
        if (source.droppableId === destination.droppableId) return

        const task = localTasks.find(t => t.id === draggableId)
        if (!task || !canEditTask(task)) {
            toast.error("You don't have permission to move this task")
            return
        }

        const newStatus = destination.droppableId as TaskStatus

        // Optimistically update local state
        setLocalTasks(prev => 
            prev.map(t => 
                t.id === draggableId 
                    ? { ...t, status: newStatus }
                    : t
            )
        )

        try {
            const result = await updateTask({
                taskId: draggableId,
                status: newStatus
            })

            if (result.success) {
                toast.success("Task status updated")
                onTaskUpdate?.()
            } else {
                // Revert on error
                setLocalTasks(tasks)
                toast.error(result.error || "Failed to update task")
            }
        } catch (error) {
            setLocalTasks(tasks)
            toast.error("Failed to update task")
        }
    }

    // Handle create task
    const handleCreateTask = async () => {
        if (!formData.title || !formData.assignedTeamId) {
            toast.error("Please fill in required fields")
            return
        }

        try {
            const result = await createTask({
                ...formData,
                projectId
            })

            if (result.success) {
                toast.success(result.message)
                setIsCreating(false)
                resetForm()
                onTaskUpdate?.()
            } else {
                toast.error(result.error || "Failed to create task")
            }
        } catch (error) {
            toast.error("Failed to create task")
        }
    }

    // Handle edit task
    const handleEditTask = async (taskId: string) => {
        if (!formData.title) {
            toast.error("Title is required")
            return
        }

        try {
            const result = await updateTask({
                taskId,
                ...formData
            })

            if (result.success) {
                toast.success("Task updated successfully")
                setIsEditing(null)
                resetForm()
                onTaskUpdate?.()
            } else {
                toast.error(result.error || "Failed to update task")
            }
        } catch (error) {
            toast.error("Failed to update task")
        }
    }

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            assignedTeamId: "",
            assignedDeveloperId: "",
            priority: Priority.MEDIUM as Priority,
            duration: 0
        })
    }

    const openCreateDialog = () => {
        setIsCreating(true)
        loadAssignmentOptions()
        resetForm()
    }

    const openEditDialog = (task: Task) => {
        setIsEditing(task.id)
        loadAssignmentOptions()
        setFormData({
            title: task.title,
            description: task.description || "",
            assignedTeamId: task.assignedTeam.id,
            assignedDeveloperId: task.assignedDeveloper?.id || "",
            priority: task.priority,
            duration: task.duration || 0
        })
    }

    const visibleTasks = getVisibleTasks()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Task Board</h3>
                    <p className="text-sm text-muted-foreground">
                        {visibleTasks.length} tasks • {userRole.toLowerCase().replace('_', ' ')} view
                    </p>
                </div>

                {canCreateTasks && (
                    <Button onClick={openCreateDialog} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Task
                    </Button>
                )}
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {COLUMNS.map(column => {
                        const columnTasks = visibleTasks.filter(task => task.status === column.id)
                        
                        return (
                            <div key={column.id} className="space-y-4">
                                <div className={`border-b-2 ${column.color} pb-2`}>
                                    <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                                        {column.title}
                                    </h4>
                                    <Badge variant="secondary" className="mt-1">
                                        {columnTasks.length}
                                    </Badge>
                                </div>

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`space-y-3 min-h-[200px] ${
                                                snapshot.isDraggingOver ? 'bg-muted/50 rounded-lg p-2' : ''
                                            }`}
                                        >
                                            {columnTasks.map((task, index) => {
                                                const TeamIcon = TEAM_ICONS[task.assignedTeam.teamType] || Users
                                                
                                                return (
                                                    <Draggable
                                                        key={task.id}
                                                        draggableId={task.id}
                                                        index={index}
                                                        isDragDisabled={!canEditTask(task)}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <Card
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`cursor-pointer hover:shadow-md transition-shadow ${
                                                                    snapshot.isDragging ? 'shadow-lg' : ''
                                                                }`}
                                                            >
                                                                <CardHeader className="pb-2">
                                                                    <div className="flex items-start justify-between">
                                                                        <CardTitle className="text-sm font-medium line-clamp-2">
                                                                            {task.title}
                                                                        </CardTitle>
                                                                        
                                                                        {canEditTask(task) && (
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                                        <MoreVertical className="w-4 h-4" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem onClick={() => openEditDialog(task)}>
                                                                                        <Edit className="w-4 h-4 mr-2" />
                                                                                        Edit
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        )}
                                                                    </div>

                                                                    {task.description && (
                                                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                                            {task.description}
                                                                        </p>
                                                                    )}
                                                                </CardHeader>

                                                                <CardContent className="pt-0 space-y-3">
                                                                    {/* Team and Priority */}
                                                                    <div className="flex items-center justify-between">
                                                                        <div
                                                                            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs"
                                                                            style={{
                                                                                backgroundColor: task.assignedTeam.color ? `${task.assignedTeam.color}20` : '#f1f5f9',
                                                                                color: task.assignedTeam.color || '#64748b'
                                                                            }}
                                                                        >
                                                                            <TeamIcon className="w-3 h-3" />
                                                                            <span>{task.assignedTeam.displayName}</span>
                                                                        </div>

                                                                        <Badge variant="secondary" className={`text-xs ${PRIORITY_COLORS[task.priority]}`}>
                                                                            {task.priority.toLowerCase()}
                                                                        </Badge>
                                                                    </div>

                                                                    {/* Assigned Developer */}
                                                                    {task.assignedDeveloper && (
                                                                        <div className="flex items-center gap-2">
                                                                            <Avatar className="w-6 h-6">
                                                                                <AvatarImage src={task.assignedDeveloper.image || undefined} />
                                                                                <AvatarFallback className="text-xs">
                                                                                    {task.assignedDeveloper.name?.[0] || 'U'}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {task.assignedDeveloper.name}
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {/* Duration */}
                                                                    {task.duration && task.duration > 0 && (
                                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                            <Timer className="w-3 h-3" />
                                                                            <span>{task.duration}h</span>
                                                                        </div>
                                                                    )}
                                                                </CardContent>
                                                            </Card>
                                                        )}
                                                    </Draggable>
                                                )
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        )
                    })}
                </div>
            </DragDropContext>

            {/* Create/Edit Task Dialog */}
            <Dialog open={isCreating || isEditing !== null} onOpenChange={(open) => {
                if (!open) {
                    setIsCreating(false)
                    setIsEditing(null)
                    resetForm()
                }
            }}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {isCreating ? 'Create New Task' : 'Edit Task'}
                        </DialogTitle>
                        <DialogDescription>
                            {isCreating 
                                ? 'Assign a task to a team or specific team member.'
                                : 'Update task details and assignment.'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter task title"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter task description"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="team">Assign to Team *</Label>
                                <Select
                                    value={formData.assignedTeamId}
                                    onValueChange={(value) => setFormData(prev => ({ 
                                        ...prev, 
                                        assignedTeamId: value,
                                        assignedDeveloperId: "" // Reset developer when team changes
                                    }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select team" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assignmentOptions.teams.map(team => {
                                            const TeamIcon = TEAM_ICONS[team.teamType] || Users
                                            return (
                                                <SelectItem key={team.id} value={team.id}>
                                                    <div className="flex items-center gap-2">
                                                        <TeamIcon className="w-4 h-4" />
                                                        <span>{team.displayName}</span>
                                                    </div>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="developer">Assign to Member</Label>
                                <Select
                                    value={formData.assignedDeveloperId}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, assignedDeveloperId: value }))}
                                    disabled={!formData.assignedTeamId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assignmentOptions.members
                                            .filter(member => member.teamId === formData.assignedTeamId)
                                            .map(member => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="w-4 h-4">
                                                            <AvatarImage src={member.image || undefined} />
                                                            <AvatarFallback className="text-xs">
                                                                {member.name?.[0] || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span>{member.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as Priority }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(Priority).map(priority => (
                                            <SelectItem key={priority} value={priority}>
                                                <div className={`flex items-center gap-2 ${PRIORITY_COLORS[priority]}`}>
                                                    <Flag className="w-3 h-3" />
                                                    <span className="capitalize">{priority.toLowerCase()}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="duration">Duration (hours)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    min="0"
                                    max="1000"
                                    value={formData.duration}
                                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsCreating(false)
                            setIsEditing(null)
                            resetForm()
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={isCreating ? handleCreateTask : () => handleEditTask(isEditing!)}>
                            {isCreating ? 'Create Task' : 'Update Task'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}