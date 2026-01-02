import { auth } from "@/auth"
import { getUserProjects } from "@/actions/projects.action"
import { Card, CardContent } from "@/components/ui/card"
import { redirect } from "next/navigation"
import ProjectsPageClient from "../_components/ProjectsPageClient"
import { Metadata } from "next"
import { ClientType } from "@prisma/client"

export const metadata: Metadata = {
    title: "Internal Projects | SyncOrbit",
    description: "Manage your internal projects.",
}

export default async function InternalProjectsPage() {
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
                        <p className="text-muted-foreground">Failed to load projects</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            {result.error}
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Filter for Internal Projects
    const projects = result.projects.filter(p => p.clientType === ClientType.INTERNAL)

    return <ProjectsPageClient projects={projects} />
}
