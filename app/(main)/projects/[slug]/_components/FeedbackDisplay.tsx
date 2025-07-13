"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle, MessageSquare, X, Calendar } from "lucide-react"
import { updateFeedbackStatus } from "@/actions/(client)/project.action"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useProjectStore } from "@/store/useProjectStore"
import { formatDistanceToNow } from "date-fns"
import { FeedbackStatus } from "@prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface Feedback {
	id: string
	title: string
	description: string | null
	status: FeedbackStatus
	createdAt: Date
	user: {
		id: string
		name: string | null
		image: string | null
	}
}

interface FeedbackDisplayProps {
	feedbacks: Feedback[]
}

export function FeedbackDisplay({ feedbacks }: FeedbackDisplayProps) {
	const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
	const { project, updateFeedback } = useProjectStore()
	const { data: session } = useSession()

	const displayFeedbacks = (project?.feedbacks || feedbacks)
		.slice()
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

	const handleStatusUpdate = async (feedbackId: string, newStatus: FeedbackStatus) => {
		setLoadingStates(prev => ({ ...prev, [feedbackId]: true }))

		try {
			const result = await updateFeedbackStatus(feedbackId, newStatus)
			if (result.success && result.feedback) {
				updateFeedback(feedbackId, { status: newStatus })
				toast.success("Feedback status updated successfully!")
			} else {
				toast.error(result.error || "Failed to update feedback status")
			}
		} catch (error) {
			console.error("Error updating feedback status:", error)
			toast.error("Failed to update feedback status")
		} finally {
			setLoadingStates(prev => ({ ...prev, [feedbackId]: false }))
		}
	}

	const getStatusColor = (status: FeedbackStatus) => {
		switch (status) {
			case FeedbackStatus.PENDING:
				return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
			case FeedbackStatus.IN_PROGRESS:
				return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
			case FeedbackStatus.COMPLETED:
				return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
			case FeedbackStatus.CANCELLED:
				return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
			default:
				return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
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
				return <X className="h-4 w-4" />
			default:
				return <Clock className="h-4 w-4" />
		}
	}

	const canUpdateStatus = session?.user?.role === 'ADMIN' || session?.user?.role === 'DEVELOPER' || session?.user?.role === 'PRODUCTMANAGER'

	if (displayFeedbacks.length === 0) {
		return (
			<div className="text-center py-12" data-feedback-section>
				<MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
				<h3 className="text-lg font-medium text-foreground mb-2">No feedback yet</h3>
				<p className="text-muted-foreground">
					Be the first to share your thoughts and suggestions for this project
				</p>
			</div>
		)
	}

	return (
		<div className="space-y-6" data-feedback-section>
			{displayFeedbacks.map((feedback) => (
				<div
					key={feedback.id}
					className="bg-card border border-border hover:shadow-md transition-shadow rounded-lg p-4 space-y-3"
				>
					<div className="flex items-start justify-between gap-3">
						<div className="flex-1">
							<h3 className="text-base font-semibold text-foreground mb-1">
								{feedback.title}
							</h3>
							<div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground">
								<div className="flex items-center gap-2">
									<Avatar className="h-5 w-5">
										<AvatarImage src={feedback.user.image || "/placeholder.svg"} alt={feedback.user.name || "User"} />
										<AvatarFallback className="text-[10px]">
											{feedback.user.name?.split(" ").map(n => n[0]).join("") || "U"}
										</AvatarFallback>
									</Avatar>
									<span>{feedback.user.name || "Unknown"}</span>
								</div>
								<div className="flex items-center gap-1">
									<Calendar className="h-3 w-3" />
									<span>{formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}</span>
								</div>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
							<Badge className={`${getStatusColor(feedback.status)} border flex items-center gap-1 text-xs px-2 py-0.5`}>
								{getStatusIcon(feedback.status)}
								<span className="capitalize">{feedback.status.toLowerCase().replace('_', ' ')}</span>
							</Badge>

							{canUpdateStatus && (
								<Select
									value={feedback.status}
									onValueChange={(value) => handleStatusUpdate(feedback.id, value as FeedbackStatus)}
									disabled={loadingStates[feedback.id]}
								>
									<SelectTrigger className="w-28 h-7 text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={FeedbackStatus.PENDING}>Pending</SelectItem>
										<SelectItem value={FeedbackStatus.IN_PROGRESS}>In Progress</SelectItem>
										<SelectItem value={FeedbackStatus.COMPLETED}>Completed</SelectItem>
										<SelectItem value={FeedbackStatus.CANCELLED}>Cancelled</SelectItem>
									</SelectContent>
								</Select>
							)}
						</div>
					</div>

					{feedback.description && (
						<div className="bg-muted rounded-md px-3 py-2">
							<p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
								{feedback.description}
							</p>
						</div>
					)}
				</div>

			))}
		</div>
	)
} 