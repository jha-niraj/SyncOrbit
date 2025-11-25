import { auth } from "@/auth"
import { getUserProjects } from "@/actions/projects.action"
import { Card, CardContent } from "@/components/ui/card"
import { redirect } from "next/navigation"
import ProjectsPageClient from "./_components/ProjectsPageClient"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Projects | SyncOrbit",
    description: "Manage your assigned projects and collaborate with your teams. Track progress, budgets, and team assignments.",
    keywords: ["projects", "project management", "collaboration", "teams", "tasks"],
    openGraph: {
        title: "Projects | SyncOrbit",
        description: "Manage your assigned projects and collaborate with your teams",
        type: "website",
    },
}

export default async function ProjectsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    // Fetch projects using server action
    const result = await getUserProjects()

    // Handle error state
    if (!result.success) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">Failed to load projects</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            {result.error}
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { projects } = result

    // Pass data to client component
    return <ProjectsPageClient projects={projects} />
}