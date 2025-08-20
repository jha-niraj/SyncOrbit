// Notifications related types and interfaces

// Notification types
export type NotificationType = 
    | 'PROJECT_ASSIGNED' 
    | 'TASK_ASSIGNED' 
    | 'TASK_COMPLETED' 
    | 'PROJECT_UPDATE' 
    | 'USER_PROMOTED' 
    | 'CLIENT_ONBOARDED' 
    | 'FEEDBACK_RECEIVED' 
    | 'GENERAL';
    
export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    read: boolean;
    createdAt: Date;
    receiverId: string;
}