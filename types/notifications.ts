// Notifications related types and interfaces

// Notification types - must match Prisma schema enum
export type NotificationType = 
    | 'PROJECT_ASSIGNED' 
    | 'TASK_ASSIGNED' 
    | 'TASK_COMPLETED' 
    | 'PROJECT_UPDATE' 
    | 'USER_PROMOTED' 
    | 'CLIENT_ONBOARDED' 
    | 'FEEDBACK_RECEIVED' 
    | 'MENTION'
    | 'TEAM_INVITATION'
    | 'GENERAL';
    
export interface Notification {
    id: string
    type: NotificationType
    title: string
    description?: string | null
    message?: string
    read: boolean
    createdAt: string | Date
    receiverId: string
    actionUrl?: string | null
    sender?: NotificationSender | null
}

export interface NotificationSender {
    id: string
    name: string | null
    image?: string | null
}

export interface NotificationResponse {
    success: boolean
    notifications?: Notification[]
    unreadCount?: number
    error?: string
}