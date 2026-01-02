import { auth } from "@/auth"
import { getProjectBySlug } from "@/actions/projects.action"
import {
    Card, CardContent
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft } from "lucide-react"
import { redirect } from "next/navigation"
import Link from "next/link"
import ProjectDetailClient from "./_components/project-detail-client"

interface ProjectDetailProps {
    params: Promise<{ slug: string }>
}

export default async function ProjectDetail({ params }: ProjectDetailProps) {
    const session = await auth()
    const { slug } = await params

    if (!session?.user) {
        redirect('/signin')
    }

    const result = await getProjectBySlug(slug)

    if (!result.success || !result.project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="py-8 text-center">
                        <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">Project Not Found</h3>
                        <p className="text-muted-foreground mb-4">
                            {result.error || "The project you're looking for doesn't exist or you don't have access to it."}
                        </p>
                        <Link href="/projects">
                            <Button className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Projects
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Pass project and user data to the client component
    return <ProjectDetailClient project={result.project} user={session.user} />
}