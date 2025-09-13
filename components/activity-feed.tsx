"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Activity,
  Filter,
  Calendar,
  Users,
  FolderPlus,
  CheckSquare,
  MessageSquare,
  MessageCircle,
  UserPlus,
  Bell,
  RefreshCw,
  UserCheck,
  CheckCircle2,
  Shield,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ActivityItem,
  ActivityType,
  ActivityFilters,
  getActivityTypeColor,
  getActivityTypeIcon,
  formatActivityTime,
  groupActivitiesByDate,
  getRelativeDateLabel,
  getActivityTypeDisplayName
} from "@/lib/utils/activityFeed"
import { getActivities } from "@/actions/activityFeed.action"
import { toast } from "sonner"

// Icon mapping
const iconMap = {
  FolderPlus,
  RotateCcw, 
  CheckSquare,
  RefreshCw,
  UserCheck,
  CheckCircle2,
  MessageSquare,
  MessageCircle,
  UserPlus,
  Shield,
  Users,
  Bell,
  Activity
}

interface ActivityFeedProps {
  variant?: 'dashboard' | 'full'
  projectId?: string
  maxItems?: number
  showFilters?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export function ActivityFeed({
  variant = 'full',
  projectId,
  maxItems = 50,
  showFilters = true,
  autoRefresh = false,
  refreshInterval = 30000
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ActivityFilters>({
    limit: maxItems
  })

  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState<string>('7d')

  const loadActivities = async () => {
    try {
      setLoading(true)
      
      const options: any = {
        ...filters,
        limit: maxItems
      }

      // Add date range filter
      if (selectedDateRange !== 'all') {
        const days = parseInt(selectedDateRange.replace('d', ''))
        options.dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      }

      // Add type filters
      if (selectedTypes.length > 0) {
        options.types = selectedTypes
      }

      // Add project filter
      if (projectId) {
        options.projectIds = [projectId]
      }

      const result = await getActivities(options)
      
      if (result.success) {
        setActivities(result.activities)
      } else {
        toast.error(result.error || 'Failed to load activities')
        setActivities([])
      }
    } catch (error) {
      console.error('Load activities error:', error)
      toast.error('Failed to load activities')
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [selectedTypes, selectedDateRange, projectId])

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(loadActivities, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const handleFilterChange = (filterType: 'types' | 'dateRange', value: any) => {
    if (filterType === 'types') {
      setSelectedTypes(value)
    } else if (filterType === 'dateRange') {
      setSelectedDateRange(value)
    }
  }

  const getActivityIcon = (type: ActivityType) => {
    const iconName = getActivityTypeIcon(type) as keyof typeof iconMap
    const IconComponent = iconMap[iconName] || Activity
    return IconComponent
  }

  const renderActivityItem = (activity: ActivityItem) => {
    const IconComponent = getActivityIcon(activity.type)
    const colorClass = getActivityTypeColor(activity.type)

    return (
      <motion.div
        key={activity.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors group"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <IconComponent className="h-4 w-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground text-sm">
                  {activity.title}
                </p>
                <Badge variant="outline" className="text-xs">
                  {getActivityTypeDisplayName(activity.type)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {activity.description}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={activity.user.image || undefined} alt={activity.user.name || 'User'} />
                    <AvatarFallback className="text-xs">
                      {(activity.user.name || activity.user.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {activity.user.name || activity.user.email}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatActivityTime(activity.timestamp)}
                </span>
              </div>
            </div>
            {activity.actionUrl && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Link href={activity.actionUrl}>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  const renderFilterControls = () => {
    if (!showFilters) return null

    const activityTypes: { value: ActivityType; label: string }[] = [
      { value: 'project_created', label: 'Project Created' },
      { value: 'project_updated', label: 'Project Updated' },
      { value: 'task_created', label: 'Task Created' },
      { value: 'task_assigned', label: 'Task Assigned' },
      { value: 'task_status_changed', label: 'Task Status' },
      { value: 'subtask_completed', label: 'Subtask Completed' },
      { value: 'message_sent', label: 'Messages' },
      { value: 'feedback_created', label: 'Feedback' },
      { value: 'user_joined', label: 'New Users' }
    ]

    return (
      <div className="flex items-center gap-3 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Activity Types
              {selectedTypes.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedTypes.length}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-2">
              <div className="font-medium text-sm mb-3">Filter by activity type:</div>
              <div className="grid grid-cols-1 gap-1">
                {activityTypes.map(type => (
                  <label
                    key={type.value}
                    className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-muted/50 rounded p-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTypes([...selectedTypes, type.value])
                        } else {
                          setSelectedTypes(selectedTypes.filter(t => t !== type.value))
                        }
                      }}
                      className="rounded"
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
              {selectedTypes.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTypes([])}
                  className="w-full mt-3"
                >
                  Clear All
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Select value={selectedDateRange} onValueChange={(value) => setSelectedDateRange(value)}>
          <SelectTrigger className="w-40">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last Day</SelectItem>
            <SelectItem value="7d">Last Week</SelectItem>
            <SelectItem value="30d">Last Month</SelectItem>
            <SelectItem value="90d">Last 3 Months</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={loadActivities} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>
    )
  }

  if (variant === 'dashboard') {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest updates from your projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-muted rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-1">
              <AnimatePresence>
                {activities.slice(0, 5).map(renderActivityItem)}
              </AnimatePresence>
              {activities.length > 5 && (
                <div className="pt-3">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/dashboard/activity">
                      View All Activities
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No recent activities</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Full variant
  const groupedActivities = groupActivitiesByDate(activities)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Feed
        </CardTitle>
        <CardDescription>
          {projectId ? 'Project activities and updates' : 'Recent activities across all your projects'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderFilterControls()}
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : Object.keys(groupedActivities).length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence>
              {Object.entries(groupedActivities).map(([dateString, dayActivities]) => (
                <motion.div
                  key={dateString}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-px bg-border flex-1" />
                    <Badge variant="outline" className="text-xs">
                      {getRelativeDateLabel(dateString)}
                    </Badge>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  <div className="space-y-1">
                    {dayActivities.map(renderActivityItem)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Activities Found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedTypes.length > 0 || selectedDateRange !== '7d' 
                ? 'Try adjusting your filters to see more activities' 
                : 'No activities to display for the selected time period'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ActivityFeed