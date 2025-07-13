"use client"

import { useEffect } from 'react'
import { useProjectStore } from '@/store/useProjectStore'
import { Status, TaskStatus, FeedbackStatus } from '@prisma/client'

interface ProjectStoreProviderProps {
	children: React.ReactNode
	initialProject: {
		id: string
		title: string
		description: string | null
		slug: string
		status: Status
		budget: number
		currency: string
		paidAmount: number
		paymentStatus: string
		startDate: Date
		endDate: Date | null
		user: {
			id: string
			name: string | null
			email: string | null
			image: string | null
		}
		tasks: {
			id: string
			title: string
			description: string | null
			status: TaskStatus
			assignedDeveloper: {
				id: string
				name: string | null
				image: string | null
			} | null
		}[]
		feedbacks: {
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
		}[]
		messages: {
			id: string
			content: string
			imageUrl?: string | null
			linkUrl?: string | null
			linkTitle?: string | null
			createdAt: Date
			user: {
				id: string
				name: string | null
				image: string | null
				role: string
			}
		}[]
	}
}

export function ProjectStoreProvider({ children, initialProject }: ProjectStoreProviderProps) {
	const { setProject } = useProjectStore()

	useEffect(() => {
		if (initialProject) {
			setProject(initialProject)
		}
	}, [initialProject, setProject])

	return <>{children}</>
} 