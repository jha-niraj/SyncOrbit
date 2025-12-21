import { auth } from "@/auth"
import { getUserProjects } from "@/actions/projects.action"
import {
    Card, CardContent
} from "@/components/ui/card"
import {
    Briefcase
} from "lucide-react"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { MyProjectsPageClient } from "./_components/MyProjectsPageClient"

export const metadata: Metadata = {
    title: "My Projects | SyncOrbit",
    description: "View and manage your assigned projects, track progress, and monitor your tasks across all projects.",
    keywords: ["my projects", "assigned projects", "project tracking", "task management", "personal dashboard"],
    openGraph: {
        title: "My Projects | SyncOrbit",
        description: "Track your assigned projects and tasks",
        type: "website",
    },
}

export default async function MyProjectsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    const result = await getUserProjects()

    if (!result.success) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">Failed to load your projects</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            {result.error}
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { projects } = result

    return <MyProjectsPageClient projects={projects} user={session.user} />
}