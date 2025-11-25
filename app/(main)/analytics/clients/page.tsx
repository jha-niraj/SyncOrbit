import { Metadata } from "next"
import { ClientAnalytics } from "@/components/analytics/ClientAnalytics"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Client Analytics | SyncOrbit",
    description: "View client project performance and metrics.",
}

export default async function ClientAnalyticsPage() {
    const session = await auth()
    if (!session?.user) redirect("/signin")

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Client Analytics</h1>
                <p className="text-muted-foreground">
                    Insights into your client projects, spending, and progress.
                </p>
            </div>
            <ClientAnalytics />
        </div>
    )
}
