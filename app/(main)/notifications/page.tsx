"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { motion } from "framer-motion"
import {
    Bell,
    BellOff,
    CheckCheck,
    Trash2,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "@/actions/notifications.action"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { NotificationType } from "@prisma/client"

interface Notification {
    id: string
    title: string
    description: string | null
    type: NotificationType
    read: boolean
    actionUrl: string | null
    createdAt: Date
    sender: {
        id: string
        name: string | null
        image: string | null
    } | null
}

const notificationTypeColors = {
    PROJECT_ASSIGNED: "bg-blue-100 text-blue-800 border-blue-200",
    TASK_ASSIGNED: "bg-green-100 text-green-800 border-green-200",
    TASK_COMPLETED: "bg-purple-100 text-purple-800 border-purple-200",
    PROJECT_UPDATE: "bg-orange-100 text-orange-800 border-orange-200",
    USER_PROMOTED: "bg-yellow-100 text-yellow-800 border-yellow-200",
    CLIENT_ONBOARDED: "bg-indigo-100 text-indigo-800 border-indigo-200",
    FEEDBACK_RECEIVED: "bg-pink-100 text-pink-800 border-pink-200",
    MENTION: "bg-cyan-100 text-cyan-800 border-cyan-200",
    GENERAL: "bg-gray-100 text-gray-800 border-gray-200"
}

export default function NotificationsPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [markingAllRead, setMarkingAllRead] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    const fetchNotifications = useCallback(async (page: number = currentPage) => {
        try {
            setRefreshing(page === 1)
            const result = await getNotifications(page, 20)
            if (result.success) {
                setNotifications(result.notifications || [])
                setCurrentPage(result.currentPage || 1)
                setTotalPages(Math.ceil((result.total || 0) / 20))
                setHasMore(result.hasMore || false)
            } else {
                toast.error(result.error || "Failed to fetch notifications")
            }
        } catch (error) {
            toast.error("Failed to fetch notifications")
            console.error(error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [currentPage])

    useEffect(() => {
        if (session?.user && ["DEVELOPER", "PRODUCTMANAGER"].includes(session.user.role)) {
            fetchNotifications(1)
        } else {
            setLoading(false)
        }
    }, [session, fetchNotifications])

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read) {
            try {
                await markNotificationAsRead(notification.id)
                setNotifications(prev =>
                    prev.map(n =>
                        n.id === notification.id
                            ? { ...n, read: true }
                            : n
                    )
                )
            } catch (error) {
                console.error("Failed to mark as read:", error)
            }
        }

        if (notification.actionUrl) {
            router.push(notification.actionUrl)
        }
    }

    const handleMarkAllRead = async () => {
        setMarkingAllRead(true)
        try {
            const result = await markAllNotificationsAsRead()
            if (result.success) {
                toast.success("All notifications marked as read")
                setNotifications(prev =>
                    prev.map(n => ({ ...n, read: true }))
                )
            } else {
                toast.error(result.error || "Failed to mark all as read")
            }
        } catch (error) {
            toast.error("Failed to mark all as read")
            console.error(error)
        } finally {
            setMarkingAllRead(false)
        }
    }

    const handleDeleteNotification = async (notificationId: string) => {
        setDeletingId(notificationId)
        try {
            const result = await deleteNotification(notificationId)
            if (result.success) {
                toast.success("Notification deleted")
                setNotifications(prev => prev.filter(n => n.id !== notificationId))
            } else {
                toast.error(result.error || "Failed to delete notification")
            }
        } catch (error) {
            toast.error("Failed to delete notification")
            console.error(error)
        } finally {
            setDeletingId(null)
        }
    }

    const unreadCount = notifications.filter(n => !n.read).length

    if (!session?.user || !["DEVELOPER", "PRODUCTMANAGER"].includes(session.user.role)) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-96">
                    <CardContent className="flex flex-col items-center gap-4 pt-6">
                        <BellOff className="h-12 w-12 text-muted-foreground" />
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">No Notifications</h3>
                            <p className="text-sm text-muted-foreground">
                                Notifications are only available for developers and product managers
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Bell className="h-6 w-6" />
                        Notifications
                        {
                            unreadCount > 0 && (
                                <Badge variant="destructive" className="ml-2">
                                    {unreadCount} unread
                                </Badge>
                            )
                        }
                    </h1>
                    <p className="text-muted-foreground">
                        Stay updated with your projects and tasks
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchNotifications(1)}
                        disabled={refreshing}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    {
                        unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleMarkAllRead}
                                disabled={markingAllRead}
                            >
                                <CheckCheck className="h-4 w-4 mr-2" />
                                Mark All Read
                            </Button>
                        )
                    }
                </div>
            </div>
            {
                loading ? (
                    <div className="space-y-4">
                        {
                            [1, 2, 3, 4, 5].map((i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <div className="animate-pulse space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 bg-muted rounded-full" />
                                                <div className="space-y-2 flex-1">
                                                    <div className="h-4 bg-muted rounded w-3/4" />
                                                    <div className="h-3 bg-muted rounded w-1/2" />
                                                    <div className="h-3 bg-muted rounded w-1/4" />
                                                </div>
                                                <div className="h-6 bg-muted rounded w-16" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                ) : notifications.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center gap-4 py-12">
                            <BellOff className="h-12 w-12 text-muted-foreground" />
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">No Notifications</h3>
                                <p className="text-sm text-muted-foreground">
                                    You&apos;re all caught up! No notifications to show.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {
                            notifications.map((notification, index) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card
                                        className={`hover:shadow-md transition-all cursor-pointer ${!notification.read ? "ring-2 ring-primary/20 bg-primary/5" : ""
                                            }`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 flex-1">
                                                    {
                                                        notification.sender?.image ? (
                                                            <Avatar className="h-10 w-10 border-2 border-border/50">
                                                                <AvatarImage src={notification.sender.image} />
                                                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                                    {notification.sender.name?.[0] || "S"}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <Bell className="h-5 w-5 text-primary" />
                                                            </div>
                                                        )
                                                    }
                                                    <div className="flex-1 min-w-0 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold text-lg leading-none">
                                                                {notification.title}
                                                            </h3>
                                                            {
                                                                !notification.read && (
                                                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                                                )
                                                            }
                                                        </div>
                                                        {
                                                            notification.description && (
                                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                                    {notification.description}
                                                                </p>
                                                            )
                                                        }
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-xs ${notificationTypeColors[notification.type]}`}
                                                            >
                                                                {notification.type.replace('_', ' ')}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">
                                                                {format(new Date(notification.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                                            </span>
                                                            {
                                                                notification.sender?.name && (
                                                                    <span className="text-xs text-muted-foreground">
                                                                        • by {notification.sender.name}
                                                                    </span>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDeleteNotification(notification.id)
                                                        }}
                                                        disabled={deletingId === notification.id}
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        }
                        {
                            totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fetchNotifications(currentPage - 1)}
                                        disabled={currentPage === 1 || loading}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>
                                    <span className="text-sm text-muted-foreground px-4">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fetchNotifications(currentPage + 1)}
                                        disabled={!hasMore || loading}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}