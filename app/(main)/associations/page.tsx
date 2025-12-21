import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { 
    getUserAssociations, getPendingInvitations 
} from "@/actions/(productmanager)/associations.action"
import AssociationsPageClient from "./_components/AssociationsPageClient"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Associations | SyncOrbit",
    description: "Manage your company and project associations, and handle invitations.",
    keywords: ["associations", "memberships", "invitations", "teams", "projects"],
    openGraph: {
        title: "Associations | SyncOrbit",
        description: "Manage your associations and invitations",
        type: "website",
    },
}

export default async function AssociationsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    const [associationsResult, invitationsResult] = await Promise.all([
        getUserAssociations(),
        getPendingInvitations()
    ])

    return (
        <AssociationsPageClient
            initialAssociations={associationsResult.success ? (associationsResult.data as any) : null}
            initialInvitations={invitationsResult.success ? (invitationsResult.invitations as any[]) : []}
        />
    )
}