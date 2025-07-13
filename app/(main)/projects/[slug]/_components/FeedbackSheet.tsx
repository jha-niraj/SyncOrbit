"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MessageSquare, Loader2, Send } from "lucide-react"
import { toast } from "sonner"
import { addFeedback } from "@/actions/(client)/project.action"
import { useProjectStore } from "@/store/useProjectStore"

interface FeedbackSheetProps {
	projectId: string
	onFeedbackAdded?: () => void
}

export function FeedbackSheet({ projectId, onFeedbackAdded }: FeedbackSheetProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		title: "",
		description: ""
	})
	const { addFeedback: addFeedbackToStore } = useProjectStore()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const result = await addFeedback(projectId, formData)

			if (result.success && result.feedback) {
				toast.success("Feedback added successfully!")
				setFormData({ title: "", description: "" })

				// Add to store for real-time update
				addFeedbackToStore(result.feedback)

				// Close the sheet
				setIsOpen(false)

				// Call the callback to handle tab switching and scrolling
				if (onFeedbackAdded) {
					onFeedbackAdded()
				}
			} else {
				toast.error(result.error || "Failed to add feedback")
			}
		} catch (error) {
			console.error("Feedback submission error:", error)
			toast.error("An error occurred while adding feedback")
		} finally {
			setIsLoading(false)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
	}

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button className="bg-white text-black border-2 border-gray-300 hover:bg-gray-50 hover:border-black transition-colors">
					<MessageSquare className="h-4 w-4 mr-2" />
					Add Feedback
				</Button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-full sm:max-w-md"
				onPointerDownOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
			>
				<SheetHeader className="p-6 pb-4 border-b">
					<div className="flex items-center justify-between">
						<div>
							<SheetTitle className="text-lg font-semibold">Add Feedback</SheetTitle>
							<SheetDescription className="text-sm text-muted-foreground">
								Share your thoughts and suggestions for this project
							</SheetDescription>
						</div>
					</div>
				</SheetHeader>
				<div className="p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="title">Title *</Label>
							<Input
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								placeholder="Brief summary of your feedback"
								required
								disabled={isLoading}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description *</Label>
							<Textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								placeholder="Detailed feedback, suggestions, or feature requests..."
								rows={6}
								required
								disabled={isLoading}
							/>
						</div>
						<Button
							type="submit"
							disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
							className="w-full bg-black text-white hover:bg-gray-800"
						>
							{
								isLoading ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Adding Feedback...
									</>
								) : (
									<>
										<Send className="h-4 w-4 mr-2" />
										Add Feedback
									</>
								)
							}
						</Button>
					</form>
				</div>
			</SheetContent>
		</Sheet>
	)
} 