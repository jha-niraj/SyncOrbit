import { auth } from "@/auth"
import { getCompanyTeams } from "@/actions/teams.action"
import { getUserInvitations } from "@/actions/invitations.action"
import { Card, CardContent } from "@/components/ui/card"
import { redirect } from "next/navigation"
import TeamsPageClient from "./_components/TeamsPageClient"
import { Role } from "@prisma/client"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Teams | ProjectCentral",
    description: "Manage your company teams and members. Create teams, invite members, and organize your workforce efficiently.",
    keywords: ["teams", "team management", "collaboration", "project management", "workforce"],
    openGraph: {
        title: "Teams | ProjectCentral",
        description: "Manage your company teams and members efficiently",
        type: "website",
    },
}

export default async function TeamsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    // Fetch data using server actions
    const [teamsResult, invitationsResult] = await Promise.all([
        getCompanyTeams(),
        getUserInvitations()
    ])

    // Handle error state
    if (!teamsResult.success) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">No teams found or you&apos;re not part of any company.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Contact your company administrator or complete onboarding first.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { teams, userRole } = teamsResult
    const { invitations } = invitationsResult

    // Pass server-fetched data to client component
    return (
        <TeamsPageClient
            teams={teams}
            invitations={invitations || []}
            userRole={userRole as Role}
            userId={session.user.id}
        />
    )
}