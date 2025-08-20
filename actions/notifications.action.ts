"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NotificationType } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getNotifications(page: number = 1, limit: number = 20) {
    try {
        const session = await auth()
        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        // Only show notifications for developers and product managers
        if (!["DEVELOPER", "PRODUCTMANAGER"].includes(session.user.role)) {
            return {
                success: true,
                notifications: [],
                total: 0,
                hasMore: false
            }
        }

        const skip = (page - 1) * limit

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where: {
                    receiverId: session.user.id
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                skip,
                take: limit
            }),
            prisma.notification.count({
                where: {
                    receiverId: session.user.id
                }
            })
        ])

        const hasMore = skip + notifications.length < total

        return {
            success: true,
            notifications,
            total,
            hasMore,
            currentPage: page
        }
    } catch (error) {
        console.error("Get notifications error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch notifications"
        }
    }
}

export async function getRecentNotifications(limit: number = 5) {
    try {
        const session = await auth()
        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        // Only show notifications for developers and product managers
        if (!["DEVELOPER", "PRODUCTMANAGER"].includes(session.user.role)) {
            return {
                success: true,
                notifications: [],
                unreadCount: 0
            }
        }

        const [notifications, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where: {
                    receiverId: session.user.id
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: limit
            }),
            prisma.notification.count({
                where: {
                    receiverId: session.user.id,
                    read: false
                }
            })
        ])

        return {
            success: true,
            notifications,
            unreadCount
        }
    } catch (error) {
        console.error("Get recent notifications error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch recent notifications"
        }
    }
}

export async function markNotificationAsRead(notificationId: string) {
    try {
        const session = await auth()
        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        const notification = await prisma.notification.findUnique({
            where: { id: notificationId }
        })

        if (!notification) {
            throw new Error("Notification not found")
        }

        if (notification.receiverId !== session.user.id) {
            throw new Error("Unauthorized: Cannot mark other user's notification as read")
        }

        await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true }
        })

        revalidatePath("/notifications")

        return {
            success: true
        }
    } catch (error) {
        console.error("Mark notification as read error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to mark notification as read"
        }
    }
}

export async function markAllNotificationsAsRead() {
    try {
        const session = await auth()
        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        await prisma.notification.updateMany({
            where: {
                receiverId: session.user.id,
                read: false
            },
            data: { read: true }
        })

        revalidatePath("/notifications")

        return {
            success: true
        }
    } catch (error) {
        console.error("Mark all notifications as read error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to mark all notifications as read"
        }
    }
}

export async function deleteNotification(notificationId: string) {
    try {
        const session = await auth()
        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        const notification = await prisma.notification.findUnique({
            where: { id: notificationId }
        })

        if (!notification) {
            throw new Error("Notification not found")
        }

        if (notification.receiverId !== session.user.id) {
            throw new Error("Unauthorized: Cannot delete other user's notification")
        }

        await prisma.notification.delete({
            where: { id: notificationId }
        })

        revalidatePath("/notifications")

        return {
            success: true
        }
    } catch (error) {
        console.error("Delete notification error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete notification"
        }
    }
}

export async function createNotification(
    receiverId: string,
    title: string,
    description?: string,
    type: NotificationType = "GENERAL",
    actionUrl?: string,
    metadata?: any
) {
    try {
        const session = await auth()
        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        // Verify the receiver exists and is eligible for notifications
        const receiver = await prisma.user.findUnique({
            where: { id: receiverId }
        })

        if (!receiver) {
            throw new Error("Receiver not found")
        }

        if (!["DEVELOPER", "PRODUCTMANAGER"].includes(receiver.role)) {
            throw new Error("Can only send notifications to developers and product managers")
        }

        const notification = await prisma.notification.create({
            data: {
                title,
                description,
                type,
                actionUrl,
                metadata,
                senderId: session.user.id,
                receiverId
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        })

        return {
            success: true,
            notification
        }
    } catch (error) {
        console.error("Create notification error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create notification"
        }
    }
}
