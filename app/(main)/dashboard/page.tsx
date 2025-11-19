import { getClientDashboardData, getDeveloperDashboardData } from "@/actions/(client)/dashboard.action";
import { getOwnerDashboardData } from "@/actions/(productmanager)/pm.action";
import { getDashboardMetrics } from "@/actions/dashboard.action";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { DeveloperDashboard } from "./_components/developerdashboard";
import { PMDashboard } from "./_components/pmdashboard";
import { ClientDashboard } from "./_components/ClientDashboard";
import { PMSetupView } from "./_components/PMSetupView";

export const metadata: Metadata = {
	title: "Dashboard | ProjectCentral",
	description: "View your project overview, statistics, and recent activity.",
	keywords: ["dashboard", "projects", "overview", "statistics", "management"],
	openGraph: {
		title: "Dashboard | ProjectCentral",
		description: "View your project overview and statistics",
		type: "website",
	},
}

export default async function DashboardPage() {
	const session = await auth();

	if (!session?.user) {
		redirect('/signin');
	}

	const userRole = session.user.role;

	if (userRole === 'COMPANY_OWNER') {
		const result = await getOwnerDashboardData();
		if (result.success && result.data) {
			return <PMDashboard data={result.data} />;
		} else {
			return <PMSetupView />;
		}
	}

	if (userRole === 'TEAM_MEMBER') {
		const data = await getDeveloperDashboardData();
		return <DeveloperDashboard data={data} userRole={userRole} />;
	}

	// Default to client dashboard
	const data = await getClientDashboardData();
	const dashboardMetrics = await getDashboardMetrics();

	return <ClientDashboard data={data} dashboardMetrics={dashboardMetrics} />;
}