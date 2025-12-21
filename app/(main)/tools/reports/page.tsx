import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { BarChart, PieChart, TrendingUp, Users, DollarSign, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ReportsPage() {
    const reportTypes = [
        {
            title: "Financial Summary",
            description: "Overview of invoices, revenue, and pending payments.",
            icon: <DollarSign className="h-8 w-8 text-green-500" />,
            stats: "$12,450 Revenue"
        },
        {
            title: "Project Progress",
            description: "Status of all active and completed projects.",
            icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
            stats: "85% Completion Rate"
        },
        {
            title: "Team Performance",
            description: "productivity and task completion by team members.",
            icon: <Users className="h-8 w-8 text-purple-500" />,
            stats: "12 Active Teams"
        }
    ]

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground">Deep dive into your company's performance metrics.</p>
                </div>
                <Button className="gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Custom Report
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reportTypes.map((report) => (
                    <Card key={report.title} className="hover:shadow-lg transition-shadow border-primary/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="bg-muted p-3 rounded-2xl">
                                {report.icon}
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-muted-foreground">{report.stats}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-xl mb-2">{report.title}</CardTitle>
                            <CardDescription>{report.description}</CardDescription>
                            <Button variant="link" className="px-0 mt-4 text-primary">
                                View Full Report →
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-primary/5">
                <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>Recently generated and auto-saved reports.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <BarChart className="h-12 w-12 mb-4 opacity-20" />
                        <p>No recent reports found.</p>
                        <p className="text-xs">Generated reports will appear here for easy access.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
