import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getClientCompanies } from "@/actions/(client)/companies.action"
import CompaniesPageClient from "./_components/CompaniesPageClient"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "My Companies | SyncOrbit",
    description: "View and manage companies you are associated with.",
    keywords: ["companies", "client", "projects", "management"],
    openGraph: {
        title: "My Companies | SyncOrbit",
        description: "View and manage your companies",
        type: "website",
    },
}

export default async function CompaniesPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    if (session.user.role !== "CLIENT") {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center text-muted-foreground">
                    This page is only accessible to clients.
                </div>
            </div>
        )
    }

    const result = await getClientCompanies()

    return (
        <CompaniesPageClient initialCompanies={result.success ? result.companies : []} />
    )
}