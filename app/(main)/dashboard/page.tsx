import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"

// Dashboard Components
import OwnerDashboard from "@/components/dashboard/OwnerDashboard"
import LeadDashboard from "@/components/dashboard/LeadDashboard"
import MemberDashboard from "@/components/dashboard/MemberDashboard"
import ClientDashboard from "@/components/dashboard/ClientDashboard"

// Server Actions
import { getOwnerDashboardData } from "@/actions/owner/dashboard"
import { getLeadDashboardData } from "@/actions/lead/dashboard"
import { getMemberDashboardData } from "@/actions/member/dashboard"
import { getClientDashboardData } from "@/actions/client/dashboard"

export const metadata = {
	title: "Dashboard | SyncOrbit",
	description: "Manage your projects, teams, and operations."
}

export default async function DashboardPage() {
	const session = await auth()
	if (!session?.user) redirect("/signin")

	const userRole = session.user.role

	// Role-based data fetching and component rendering
	switch (userRole) {
		case Role.COMPANY_OWNER: {
			const data = await getOwnerDashboardData()
			return <OwnerDashboard data={data} />
		}
		case Role.TEAM_HEAD: {
			const data = await getLeadDashboardData()
			return <LeadDashboard data={data} />
		}
		case Role.TEAM_MEMBER: {
			const data = await getMemberDashboardData()
			return <MemberDashboard data={data} />
		}
		case Role.CLIENT: {
			const data = await getClientDashboardData()
			return <ClientDashboard data={data} />
		}
		default:
			redirect("/signin")
	}
}