"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createTask } from "@/actions/(developers)/developers.action"

interface CreateTaskSheetProps {
	projectId: string
	trigger: React.ReactNode
	onTaskCreated?: () => void
}

export function CreateTaskSheet({ projectId, trigger, onTaskCreated }: CreateTaskSheetProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [creating, setCreating] = useState(false)
	const [taskData, setTaskData] = useState({
		title: "",
		description: "",
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		if (!taskData.title.trim()) {
			toast.error("Please enter a task title")
			return
		}

		setCreating(true)
		try {
			const result = await createTask({
				title: taskData.title,
				description: taskData.description || undefined,
				projectId,
			})

			if (result.success) {
				toast.success("Task created successfully")
				setTaskData({ title: "", description: "" })
				setIsOpen(false)
				onTaskCreated?.()
			} else {
				toast.error(result.error || "Failed to create task")
			}
		} catch (error) {
			console.error("Create task error:", error)
			toast.error("Failed to create task")
		} finally {
			setCreating(false)
		}
	}

	const handleCancel = () => {
		setTaskData({ title: "", description: "" })
		setIsOpen(false)
	}

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				{trigger}
			</SheetTrigger>
			<SheetContent className="w-full sm:max-w-md">
				<SheetHeader>
					<SheetTitle className="text-lg font-semibold">Create New Task</SheetTitle>
					<SheetDescription>
						Add a new task to this project
					</SheetDescription>
				</SheetHeader>

				<form onSubmit={handleSubmit} className="space-y-6 mt-6">
					<div className="space-y-2">
						<Label htmlFor="task-title">Task Title *</Label>
						<Input
							id="task-title"
							placeholder="e.g., Authentication related work"
							value={taskData.title}
							onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="task-description">Description (Optional)</Label>
						<Textarea
							id="task-description"
							placeholder="Describe what needs to be done..."
							value={taskData.description}
							onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
							rows={4}
						/>
					</div>

					<div className="flex gap-3 pt-6">
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							disabled={creating}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={creating || !taskData.title.trim()}
							className="flex-1"
						>
							{creating ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								<>
									<Plus className="mr-2 h-4 w-4" />
									Create Task
								</>
							)}
						</Button>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	)
} 