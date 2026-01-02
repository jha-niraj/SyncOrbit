import { auth } from "@/auth"
import { getUserTasks } from "@/actions/tasks.action"
import { Card, CardContent } from "@/components/ui/card"
import { redirect } from "next/navigation"
import TaskboardClient from "./_components/taskboard-client"
import { Role } from "@prisma/client"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Taskboard | SyncOrbit",
    description: "Manage all your tasks in one place.",
}

export default async function TaskboardPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    if (session.user.role === Role.CLIENT) {
        redirect('/')
    }

    const result = await getUserTasks({ assignedToMe: false }) // Get all visible tasks

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
            <h1 className="text-3xl font-bold mb-6">My Taskboard</h1>
            <TaskboardClient tasks={result.tasks} />
        </div>
    )
}
