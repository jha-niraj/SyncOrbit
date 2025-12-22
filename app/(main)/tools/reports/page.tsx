import { getReports } from "@/actions/tools/report.action";
import { ReportsDashboard } from "./_components/ReportsDashboard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ReportsPage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const result = await getReports();
    const reports = (result.success && result.reports) ? result.reports : [];

    return (
        <div className="py-8 w-full max-w-[1400px] mx-auto px-6">
            <ReportsDashboard reports={reports} />
        </div>
    );
}