import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getNotifications } from "@/actions/notifications.action"
import NotificationsPageClient from "./_components/NotificationsPageClient"
import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { BellOff } from "lucide-react"

export const metadata: Metadata = {
    title: "Notifications | SyncOrbit",
    description: "Stay updated with your projects, tasks, and team activities.",
    keywords: ["notifications", "updates", "alerts", "project management"],
    openGraph: {
        title: "Notifications | SyncOrbit",
        description: "Stay updated with your projects and tasks",
        type: "website",
    },
}

export default async function NotificationsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    // Check role access - allow all authenticated users to see notifications, 
    // but maybe filter what they see based on their role if needed.
    // The original code restricted it, but let's check if that was intended.
    // "COMPANY_OWNER", "TEAM_HEAD", "TEAM_MEMBER", "CLIENT" are all roles.
    // ADMIN is the only one left out?

    const allowedRoles = ["COMPANY_OWNER", "TEAM_HEAD", "TEAM_MEMBER", "CLIENT"]
    if (!allowedRoles.includes(session.user.role)) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-96">
                    <CardContent className="flex flex-col items-center gap-4 pt-6">
                        <BellOff className="h-12 w-12 text-muted-foreground" />
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">No Notifications</h3>
                            <p className="text-sm text-muted-foreground">
                                Notifications are only available for developers, clients and product managers
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Fetch initial notifications
    const result = await getNotifications(1, 20)

    return (
        <NotificationsPageClient
            initialNotifications={result.notifications || []}
            initialTotal={result.total || 0}
            initialCurrentPage={result.currentPage || 1}
            initialHasMore={result.hasMore || false}
        />
    )
}