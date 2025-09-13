import { formatDistanceToNow } from "date-fns"

export type ActivityType = 
  | 'project_created'
  | 'project_updated' 
  | 'project_status_changed'
  | 'task_created'
  | 'task_updated'
  | 'task_status_changed'
  | 'task_assigned'
  | 'subtask_created'
  | 'subtask_completed'
  | 'message_sent'
  | 'feedback_created'
  | 'feedback_updated'
  | 'user_joined'
  | 'user_role_changed'
  | 'project_member_added'
  | 'notification_sent'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: Date
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: string
  }
  metadata?: {
    projectId?: string
    projectSlug?: string
    projectTitle?: string
    taskId?: string
    taskTitle?: string
    oldValue?: string
    newValue?: string
    targetUserId?: string
    targetUserName?: string
    [key: string]: any
  }
  actionUrl?: string
}

export interface ActivityFilters {
  types?: ActivityType[]
  projectIds?: string[]
  userIds?: string[]
  dateFrom?: Date
  dateTo?: Date
  limit?: number
}

/**
 * Get activity type color for UI display
 */
export function getActivityTypeColor(type: ActivityType): string {
  switch (type) {
    case 'project_created':
    case 'project_updated':
      return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20'
    
    case 'project_status_changed':
      return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20'
    
    case 'task_created':
    case 'task_updated':
    case 'task_assigned':
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20'
    
    case 'task_status_changed':
      return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20'
    
    case 'subtask_created':
    case 'subtask_completed':
      return 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20'
    
    case 'message_sent':
      return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20'
    
    case 'feedback_created':
    case 'feedback_updated':
      return 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/20'
    
    case 'user_joined':
    case 'user_role_changed':
    case 'project_member_added':
      return 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20'
    
    case 'notification_sent':
      return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/20'
    
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/20'
  }
}

/**
 * Get activity type icon name
 */
export function getActivityTypeIcon(type: ActivityType): string {
  switch (type) {
    case 'project_created':
    case 'project_updated':
      return 'FolderPlus'
    
    case 'project_status_changed':
      return 'RotateCcw'
    
    case 'task_created':
    case 'task_updated':
      return 'CheckSquare'
    
    case 'task_status_changed':
      return 'RefreshCw'
    
    case 'task_assigned':
      return 'UserCheck'
    
    case 'subtask_created':
    case 'subtask_completed':
      return 'CheckCircle2'
    
    case 'message_sent':
      return 'MessageSquare'
    
    case 'feedback_created':
    case 'feedback_updated':
      return 'MessageCircle'
    
    case 'user_joined':
      return 'UserPlus'
    
    case 'user_role_changed':
      return 'Shield'
    
    case 'project_member_added':
      return 'Users'
    
    case 'notification_sent':
      return 'Bell'
    
    default:
      return 'Activity'
  }
}

/**
 * Format activity timestamp for display
 */
export function formatActivityTime(timestamp: Date): string {
  return formatDistanceToNow(timestamp, { addSuffix: true })
}

/**
 * Group activities by date for better organization
 */
export function groupActivitiesByDate(activities: ActivityItem[]): { [date: string]: ActivityItem[] } {
  const grouped: { [date: string]: ActivityItem[] } = {}
  
  activities.forEach(activity => {
    const date = activity.timestamp.toDateString()
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(activity)
  })
  
  return grouped
}

/**
 * Get relative date label for grouping
 */
export function getRelativeDateLabel(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    })
  }
}

/**
 * Filter activities based on provided filters
 */
export function filterActivities(activities: ActivityItem[], filters: ActivityFilters): ActivityItem[] {
  let filtered = [...activities]
  
  // Filter by activity types
  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter(activity => filters.types!.includes(activity.type))
  }
  
  // Filter by project IDs
  if (filters.projectIds && filters.projectIds.length > 0) {
    filtered = filtered.filter(activity => 
      activity.metadata?.projectId && filters.projectIds!.includes(activity.metadata.projectId)
    )
  }
  
  // Filter by user IDs
  if (filters.userIds && filters.userIds.length > 0) {
    filtered = filtered.filter(activity => 
      filters.userIds!.includes(activity.user.id)
    )
  }
  
  // Filter by date range
  if (filters.dateFrom) {
    filtered = filtered.filter(activity => activity.timestamp >= filters.dateFrom!)
  }
  
  if (filters.dateTo) {
    filtered = filtered.filter(activity => activity.timestamp <= filters.dateTo!)
  }
  
  // Sort by timestamp (newest first)
  filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  
  // Apply limit
  if (filters.limit && filters.limit > 0) {
    filtered = filtered.slice(0, filters.limit)
  }
  
  return filtered
}

/**
 * Get activity type display name
 */
export function getActivityTypeDisplayName(type: ActivityType): string {
  switch (type) {
    case 'project_created': return 'Project Created'
    case 'project_updated': return 'Project Updated'
    case 'project_status_changed': return 'Project Status Changed'
    case 'task_created': return 'Task Created'
    case 'task_updated': return 'Task Updated'
    case 'task_status_changed': return 'Task Status Changed'
    case 'task_assigned': return 'Task Assigned'
    case 'subtask_created': return 'Subtask Created'
    case 'subtask_completed': return 'Subtask Completed'
    case 'message_sent': return 'Message Sent'
    case 'feedback_created': return 'Feedback Created'
    case 'feedback_updated': return 'Feedback Updated'
    case 'user_joined': return 'User Joined'
    case 'user_role_changed': return 'Role Changed'
    case 'project_member_added': return 'Member Added'
    case 'notification_sent': return 'Notification'
    default: return 'Activity'
  }
}