import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getUsersByCompany } from "@/actions/(productmanager)/user-role.action"
import RoleSettingsPageClient from "./_components/RoleSettingsPageClient"
import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Settings } from "lucide-react"
import { UserWithRole } from "@/types/role-settings"

export const metadata: Metadata = {
    title: "Role Settings | ProjectCentral",
    description: "Manage user roles and permissions within your company.",
    keywords: ["role settings", "user management", "permissions", "admin", "company owner"],
    openGraph: {
        title: "Role Settings | ProjectCentral",
        description: "Manage user roles and permissions",
        type: "website",
    },
}

export default async function RoleSettingsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    // Only Company Owners and Admins can access role settings
    if (session.user.role !== "COMPANY_OWNER" && session.user.role !== "ADMIN") {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-96">
                    <CardContent className="flex flex-col items-center gap-4 pt-6">
                        <Settings className="h-12 w-12 text-muted-foreground" />
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">Access Denied</h3>
                            <p className="text-sm text-muted-foreground">
                                Only Company Owners and Admins can access role settings
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const result = await getUsersByCompany()

    return (
        <RoleSettingsPageClient
            initialDevelopers={result.success ? (result.users as UserWithRole[]) : []}
        />
    )
}