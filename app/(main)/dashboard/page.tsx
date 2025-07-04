import { getClientDashboardData } from "@/actions/(client)/dashboard.action";
import { DashboardStats } from "./_components/DashboardStats";
import { ProjectList } from "./_components/ProjectList";
import { Separator } from "@/components/ui/separator";

export default async function DashboardPage() {
    const data = await getClientDashboardData();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Welcome back! Here&apos;s an overview of your projects.
                        </p>
                    </div>

                    <Separator />

                    {/* Stats Overview */}
                    <DashboardStats
                        totalSpent={data.user.totalSpent}
                        projectStats={data.projectStats}
                        taskStats={data.taskStats}
                    />

                    {/* Projects List */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Your Projects</h2>
                        </div>
                        <ProjectList projects={data.projects} />
                    </div>
                </div>
            </div>
        </div>
    );
}