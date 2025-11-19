import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getAnalyticsData } from "@/actions/(client)/analytics.action"
import AnalyticsPageClient from "./_components/AnalyticsPageClient"
import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import { AnalyticsData } from "@/types/analytics"

export const metadata: Metadata = {
    title: "Analytics | ProjectCentral",
    description: "Track performance, monitor progress, and gain insights into your projects and teams.",
    keywords: ["analytics", "dashboard", "metrics", "performance", "statistics"],
    openGraph: {
        title: "Analytics | ProjectCentral",
        description: "Track performance and gain insights",
        type: "website",
    },
}

export default async function AnalyticsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    // Check if user has access to analytics page
    if (session.user.role === 'CLIENT') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader className="text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <CardTitle>Access Restricted</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            Analytics dashboard is only available for Product Managers and Developers.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const result = await getAnalyticsData()

    if (!result.success || !result.analytics) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader className="text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <CardTitle>No Data Available</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground mb-4">
                            {result.error || "Unable to load analytics data at this time."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <AnalyticsPageClient initialAnalytics={result.analytics as AnalyticsData} />
    )
}