import { auth } from "@/auth"
import { getUserTasks } from "@/actions/tasks.action"
import { Card, CardContent } from "@/components/ui/card"
import { redirect } from "next/navigation"
import ScheduleClient from "./_components/schedules-client"
import { Role } from "@prisma/client"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Schedules | SyncOrbit",
    description: "View your task schedule.",
}

export default async function SchedulesPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    if (session.user.role === Role.CLIENT) {
        redirect('/')
    }

    const result = await getUserTasks({ assignedToMe: false })

    if (!result.success) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">Failed to load tasks</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            {result.error}
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 h-[calc(100vh-4rem)]">
            <h1 className="text-3xl font-bold mb-6">Task Schedule</h1>
            <ScheduleClient tasks={result.tasks} />
        </div>
    )
}
