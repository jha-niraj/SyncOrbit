import { getClientDashboardData, getDeveloperExternalDashboardData } from "@/actions/(client)/dashboard.action";
import { getOwnerExternalDashboardData } from "@/actions/(productmanager)/pm.action";
import { getDashboardMetrics } from "@/actions/dashboard.action";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { DeveloperDashboard } from "../_components/developerdashboard";
import { PMDashboard } from "../_components/pmdashboard";
import { ClientDashboard } from "../_components/ClientDashboard";
import { PMSetupView } from "../_components/PMSetupView";

export const metadata: Metadata = {
	title: "External Dashboard | ProjectCentral",
	description: "View your external project overview, statistics, and recent activity.",
	keywords: ["dashboard", "external", "projects", "overview", "statistics", "management"],
	openGraph: {
		title: "External Dashboard | ProjectCentral",
		description: "View your external project overview and statistics",
		type: "website",
	},
}

export default async function ExternalDashboardPage() {
	const session = await auth();

	if (!session?.user) {
		redirect('/signin');
	}

	const userRole = session.user.role;

	if (userRole === 'COMPANY_OWNER') {
		const result = await getOwnerExternalDashboardData();
		if (result.success && result.data) {
			return <PMDashboard data={result.data} />;
		} else {
			// If no data or error, might show setup or empty state
            // For external dashboard, if no company, it's same as internal
			return <PMSetupView />;
		}
	}

	if (userRole === 'TEAM_MEMBER') {
		const data = await getDeveloperExternalDashboardData();
		return <DeveloperDashboard data={data} userRole={userRole} />;
	}

	// Clients only see their own dashboard which is "External" by definition usually, 
    // but if we want to be consistent, we can use the same ClientDashboard.
    // However, clients usually don't have "Internal" vs "External" view of themselves.
    // They just see their projects.
	// Default to client dashboard
	const data = await getClientDashboardData();
	const dashboardMetrics = await getDashboardMetrics();

	return <ClientDashboard data={data} dashboardMetrics={dashboardMetrics} />;
}
