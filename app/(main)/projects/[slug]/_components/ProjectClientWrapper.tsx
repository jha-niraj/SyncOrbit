"use client"

import { FeedbackSheet } from "./FeedbackSheet"
import { ChatSheet } from "./ChatSheet"

interface Message {
	id: string
	content: string
	createdAt: Date
	user: {
		id: string
		name: string | null
		image: string | null
		role: string
	}
}

interface ProjectClientWrapperProps {
	projectId: string
	projectTitle: string
	initialMessages: Message[]
	userRole?: string
}

export function ProjectClientWrapper({
	projectId,
	projectTitle,
	initialMessages,
	userRole
}: ProjectClientWrapperProps) {
	const handleFeedbackAdded = () => {
		// Refresh the page to show new feedback
		window.location.reload()
	}

	return (
		<>
			<ChatSheet
				projectId={projectId}
				projectTitle={projectTitle}
				initialMessages={initialMessages}
			/>
			{userRole === 'CLIENT' && (
				<FeedbackSheet
					projectId={projectId}
					onFeedbackAdded={handleFeedbackAdded}
				/>
			)}
		</>
	)
} 