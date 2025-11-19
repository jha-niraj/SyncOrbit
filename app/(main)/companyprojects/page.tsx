import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getCompanyProjects, getTeamProjects } from "@/actions/projects.action"
import { Role } from "@prisma/client"
import { CompanyProjectsPageClient } from "./_components/CompanyProjectsPageClient"

export const metadata: Metadata = {
    title: "Company Projects | ProjectCentral",
    description: "Manage and oversee all projects across your company or view projects assigned to your teams.",
    keywords: ["company projects", "project portfolio", "company overview", "project management"],
    openGraph: {
        title: "Company Projects | ProjectCentral",
        description: "Manage and oversee all projects across your company or view projects assigned to your teams.",
        type: "website",
    },
}

export default async function CompanyProjectsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/signin")
    }

    const result = session.user.role === Role.COMPANY_OWNER
        ? await getCompanyProjects(session.user.companyId)
        : await getTeamProjects()

    if (!result.success) {
        // Handle error state
        return (
            <div className="container mx-auto py-8 text-center">
                <p className="text-muted-foreground">Failed to load projects</p>
                <p className="text-sm text-muted-foreground mt-2">{result.error}</p>
            </div>
        )
    }

    const { projects } = result

    return <CompanyProjectsPageClient projects={projects} user={session.user} />
}