import { Metadata } from "next"
import { InternalAnalytics } from "@/components/analytics/InternalAnalytics"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Internal Analytics | ProjectCentral",
    description: "View internal project performance and metrics.",
}

export default async function InternalAnalyticsPage() {
    const session = await auth()
    if (!session?.user) redirect("/signin")

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Internal Analytics</h1>
                <p className="text-muted-foreground">
                    Detailed insights into your company's internal projects and team performance.
                </p>
            </div>
            <InternalAnalytics />
        </div>
    )
}