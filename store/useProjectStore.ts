import { create } from 'zustand'
import { FeedbackStatus, TaskStatus, Status } from '@prisma/client'

interface User {
    id: string
    name: string | null
    image: string | null
    role?: string
}

interface Message {
    id: string
    content: string
    imageUrl?: string | null
    linkUrl?: string | null
    linkTitle?: string | null
    createdAt: Date
    user: User
}

interface Feedback {
    id: string
    title: string
    description: string | null
    status: FeedbackStatus
    createdAt: Date
    user: User
}

interface Task {
    id: string
    title: string
    description: string | null
    status: TaskStatus
    assignedDeveloper: User | null
}

interface Project {
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
    user: User
    tasks: Task[]
    feedbacks: Feedback[]
    messages: Message[]
}

interface ProjectStore {
    project: Project | null
    isLoading: boolean
    error: string | null
    
    // Actions
    setProject: (project: Project) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    
    // Feedback actions
    addFeedback: (feedback: Feedback) => void
    updateFeedback: (feedbackId: string, updates: Partial<Feedback>) => void
    
    // Message actions
    addMessage: (message: Message) => void
    updateMessage: (messageId: string, message: Message) => void
    
    // Task actions
    updateTask: (taskId: string, updates: Partial<Task>) => void
    
    // Payment actions
    updatePayment: (paidAmount: number, paymentStatus: string) => void
    
    // Clear store
    clear: () => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
    project: null,
    isLoading: false,
    error: null,
    
    setProject: (project) => set({ project, error: null }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    
    addFeedback: (feedback) => set((state) => ({
        project: state.project ? {
            ...state.project,
            feedbacks: [...state.project.feedbacks, feedback]
        } : null
    })),
    
    updateFeedback: (feedbackId, updates) => set((state) => ({
        project: state.project ? {
            ...state.project,
            feedbacks: state.project.feedbacks.map(f => 
                f.id === feedbackId ? { ...f, ...updates } : f
            )
        } : null
    })),
    
    addMessage: (message) => set((state) => ({
        project: state.project ? {
            ...state.project,
            messages: [...state.project.messages, message]
        } : null
    })),
    
    updateMessage: (messageId, message) => set((state) => ({
        project: state.project ? {
            ...state.project,
            messages: state.project.messages.map(m => 
                m.id === messageId ? message : m
            )
        } : null
    })),
    
    updateTask: (taskId, updates) => set((state) => ({
        project: state.project ? {
            ...state.project,
            tasks: state.project.tasks.map(t => 
                t.id === taskId ? { ...t, ...updates } : t
            )
        } : null
    })),
    
    updatePayment: (paidAmount, paymentStatus) => set((state) => ({
        project: state.project ? {
            ...state.project,
            paidAmount,
            paymentStatus
        } : null
    })),
    
    clear: () => set({ project: null, isLoading: false, error: null })
}))

// Helper functions for currency formatting
export const getCurrencySymbol = (currency: string) => {
    const symbols = {
        USD: '$',
        INR: '₹',
        NPR: 'Rs.'
    }
    return symbols[currency as keyof typeof symbols] || currency
}

export const formatCurrency = (amount: number, currency: string) => {
    const symbol = getCurrencySymbol(currency)
    return `${symbol}${amount.toLocaleString()}`
}

export const getPaymentProgress = (paidAmount: number, totalAmount: number) => {
    return totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0
}

export const getPaymentStatus = (paidAmount: number, totalAmount: number) => {
    const percentage = getPaymentProgress(paidAmount, totalAmount)
    if (percentage === 0) return 'PENDING'
    if (percentage < 100) return 'PARTIAL'
    return 'COMPLETED'
} 