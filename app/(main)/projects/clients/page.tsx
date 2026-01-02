import { auth } from "@/auth"
import { getUserProjects } from "@/actions/projects.action"
import { Card, CardContent } from "@/components/ui/card"
import { redirect } from "next/navigation"
import ProjectsPageClient from "../_components/ProjectsPageClient"
import { Metadata } from "next"
import { ClientType } from "@prisma/client"

export const metadata: Metadata = {
    title: "Client Projects | SyncOrbit",
    description: "Manage your external client projects.",
}

export default async function ClientProjectsPage() {
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

    // Filter for External Projects
    const projects = result.projects.filter(p => p.clientType === ClientType.EXTERNAL)

    return <ProjectsPageClient projects={projects} />
}