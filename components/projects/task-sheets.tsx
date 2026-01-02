"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Calendar as CalendarIcon, Flag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { createTask, updateTask, getAssignmentOptions } from "@/actions/tasks.action"
import { createSubTask, updateSubTask, deleteSubTask } from "@/actions/subtasks.action"
import { TaskStatus } from "@prisma/client"
import { formatDistanceToNow, format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { TaskWithRelations } from "@/types/task"

interface Team {
    id: string
    displayName: string
}

interface Member {
    id: string
    name: string | null
    email: string | null
    image: string | null
    teamId: string
}

interface CreateTaskSheetProps {
    projectId: string
    projectSlug: string
    children?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function CreateTaskSheet({ projectId, children, open, onOpenChange }: CreateTaskSheetProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [teams, setTeams] = useState<Team[]>([])
    const [members, setMembers] = useState<Member[]>([])

    // Form state
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [teamId, setTeamId] = useState("")
    const [developerId, setDeveloperId] = useState("")
    const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM")
    const [duration, setDuration] = useState("")
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined)

    useEffect(() => {
        const loadOptions = async () => {
            if ((open ?? internalOpen)) {
                const res = await getAssignmentOptions(projectId)
                if (res.success) {
                    setTeams(res.teams)
                    setMembers(res.members)
                }
            }
        }
        loadOptions()
    }, [projectId, open, internalOpen])

    const handleSubmit = async () => {
        if (!title || !teamId) {
            toast.error("Title and Team are required")
            return
        }
        setLoading(true)
        try {
            const res = await createTask({
                projectId,
                title,
                description,
                assignedTeamId: teamId,
                assignedDeveloperId: developerId || undefined,
                priority,
                duration: duration ? parseInt(duration) : undefined,
                startDate,
                dueDate
            })

            if (res.success) {
                toast.success("Task created")
                // Reset form
                setTitle("")
                setDescription("")
                setTeamId("")
                setDeveloperId("")
                setPriority("MEDIUM")
                setDuration("")
                setStartDate(undefined)
                setDueDate(undefined)
                if (onOpenChange) onOpenChange(false)
                else setInternalOpen(false)
            } else {
                toast.error(res.error || "Failed to create task")
            }
        } catch {
            toast.error("Error creating task")
        } finally {
            setLoading(false)
        }
    }

    const filteredMembers = teamId ? members.filter(m => m.teamId === teamId) : []

    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen
    const onOpenChangeHandler = isControlled ? onOpenChange : setInternalOpen

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChangeHandler}>
            {children && <SheetTrigger asChild>{children}</SheetTrigger>}
            <SheetContent className="w-full sm:max-w-[40vw] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Create New Task</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Task Title</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Implement Login API" />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Task details..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Assign Team</Label>
                            <Select value={teamId} onValueChange={setTeamId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Team" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teams.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.displayName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Assign Developer (Optional)</Label>
                            <Select value={developerId} onValueChange={setDeveloperId} disabled={!teamId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Developer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredMembers.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name || m.email}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={priority} onValueChange={(v: "LOW" | "MEDIUM" | "HIGH" | "URGENT") => setPriority(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="URGENT">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Duration (Hours)</Label>
                            <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 4" />
                        </div>
                    </div>

                    <Button className="w-full mt-4" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Creating..." : "Create Task"}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

interface TaskDetailsSheetProps {
    task: TaskWithRelations | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdate?: () => void
}

export function TaskDetailsSheet({ task, open, onOpenChange, onUpdate }: TaskDetailsSheetProps) {
    const [subTaskTitle, setSubTaskTitle] = useState("")

    if (!task) return null

    const handleStatusChange = async (status: TaskStatus) => {
        try {
            await updateTask({ taskId: task.id, status })
            toast.success("Status updated")
            onUpdate?.()
        } catch {
            toast.error("Failed to update status")
        }
    }

    const handleDateChange = async (type: 'startDate' | 'dueDate', date: Date | undefined) => {
        try {
            await updateTask({
                taskId: task.id,
                [type]: date
            })
            toast.success(`${type === 'startDate' ? 'Start' : 'Due'} date updated`)
            onUpdate?.()
        } catch {
            toast.error("Failed to update date")
        }
    }

    const handleCreateSubTask = async () => {
        if (!subTaskTitle.trim()) return
        try {
            const res = await createSubTask({ taskId: task.id, title: subTaskTitle })
            if (res.success) {
                setSubTaskTitle("")
                toast.success("Subtask added")
                onUpdate?.()
            }
        } catch {
            toast.error("Failed to add subtask")
        }
    }

    const handleToggleSubTask = async (id: string, completed: boolean) => {
        try {
            await updateSubTask({ subTaskId: id, completed })
            onUpdate?.()
        } catch {
            toast.error("Failed to update subtask")
        }
    }

    const handleDeleteSubTask = async (id: string) => {
        try {
            await deleteSubTask({ subTaskId: id })
            toast.success("Subtask deleted")
            onUpdate?.()
        } catch {
            toast.error("Failed to delete subtask")
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-[50vw] overflow-y-auto">
                <SheetHeader>
                    <div className="flex items-start justify-between gap-4">
                        <SheetTitle className="text-xl">{task.title}</SheetTitle>
                        <Badge>{task.status.replace("_", " ")}</Badge>
                    </div>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    {/* Status Select */}
                    <div>
                        <Label className="mb-2 block text-xs text-muted-foreground uppercase tracking-wider">Status</Label>
                        <Select value={task.status} onValueChange={(v: TaskStatus) => handleStatusChange(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="YET_TO_START">Yet to Start</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-2 block text-xs text-muted-foreground uppercase tracking-wider">Priority</Label>
                            <div className="flex items-center gap-2">
                                <Flag className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{task.priority}</span>
                            </div>
                        </div>
                        <div>
                            <Label className="mb-2 block text-xs text-muted-foreground uppercase tracking-wider">Assigned To</Label>
                            <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src={task.assignedDeveloper?.image || ""} />
                                    <AvatarFallback>{task.assignedDeveloper?.name?.[0] || "?"}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{task.assignedDeveloper?.name || "Unassigned"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-2 block text-xs text-muted-foreground uppercase tracking-wider">Start Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-normal h-9", !task.startDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {task.startDate ? format(new Date(task.startDate), "PPP") : "Set Start Date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={task.startDate ? new Date(task.startDate) : undefined} onSelect={(d) => handleDateChange('startDate', d)} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <Label className="mb-2 block text-xs text-muted-foreground uppercase tracking-wider">Due Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-normal h-9", !task.dueDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {task.dueDate ? format(new Date(task.dueDate), "PPP") : "Set Due Date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={task.dueDate ? new Date(task.dueDate) : undefined} onSelect={(d) => handleDateChange('dueDate', d)} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div>
                        <Label className="mb-2 block text-xs text-muted-foreground uppercase tracking-wider">Description</Label>
                        <div className="bg-muted/30 p-4 rounded-lg text-sm whitespace-pre-wrap">
                            {task.description || "No description provided."}
                        </div>
                    </div>

                    <div>
                        <Label className="mb-2 block text-xs text-muted-foreground uppercase tracking-wider">Subtasks</Label>
                        <div className="space-y-2 mb-4">
                            {task.subtasks?.map(st => (
                                <div key={st.id} className="flex items-center gap-2 group">
                                    <Checkbox checked={st.completed} onCheckedChange={(c) => handleToggleSubTask(st.id, c as boolean)} />
                                    <span className={`flex-1 text-sm ${st.completed ? "line-through text-muted-foreground" : ""}`}>{st.title}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteSubTask(st.id)}>
                                        <Trash2 className="w-3 h-3 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a subtask..."
                                value={subTaskTitle}
                                onChange={e => setSubTaskTitle(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleCreateSubTask()}
                            />
                            <Button size="icon" onClick={handleCreateSubTask}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        Created {formatDistanceToNow(new Date(task.createdAt))} ago
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
