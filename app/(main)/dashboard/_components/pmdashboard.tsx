import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, BarChart, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ProductManagerDashboard() {
    const projects = [
        {
            id: 1,
            title: "E-commerce Website",
            status: "In Progress",
            team: [
                { id: 1, name: "John Doe", role: "Frontend Developer" },
                { id: 2, name: "Jane Smith", role: "Backend Developer" },
            ],
            completion: 65,
        },
        {
            id: 2,
            title: "Mobile App Development",
            status: "In Progress",
            team: [
                { id: 3, name: "Mike Johnson", role: "Mobile Developer" },
                { id: 4, name: "Sarah Williams", role: "UI/UX Designer" },
            ],
            completion: 40,
        },
        {
            id: 3,
            title: "Brand Redesign",
            status: "Completed",
            team: [
                { id: 5, name: "Alex Brown", role: "Graphic Designer" },
                { id: 2, name: "Jane Smith", role: "Frontend Developer" },
            ],
            completion: 100,
        },
    ]

    const teamPerformance = {
        taskCompletionRate: 78,
        teamEfficiency: 85,
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold">Project Management System</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">Welcome, Product Manager</span>
                    </div>
                </div>
            </header>
            <main className="flex-1 container py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Product Manager Dashboard</h1>
                    <Link href="/projects/create">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create New Project
                        </Button>
                    </Link>
                </div>
                <h2 className="text-xl font-semibold mb-4">Ongoing Projects</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    {
                        projects.map((project) => (
                            <Card key={project.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{project.title}</CardTitle>
                                    <CardDescription>Status: {project.status}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="mb-4">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">Completion</span>
                                            <span className="text-sm font-medium">{project.completion}%</span>
                                        </div>
                                        <Progress value={project.completion} className="h-2" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Team Members</h4>
                                        <div className="space-y-2">
                                            {
                                                project.team.map((member) => (
                                                    <div key={member.id} className="flex items-center text-sm">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                                            {member.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{member.name}</p>
                                                            <p className="text-xs text-muted-foreground">{member.role}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link href={`/projects/${project.id}`} className="w-full">
                                        <Button variant="outline" className="w-full">
                                            View Project
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))
                    }
                </div>
                <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
                <div className="grid gap-4 md:grid-cols-2 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Task Completion Rate</CardTitle>
                            <BarChart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{teamPerformance.taskCompletionRate}%</div>
                            <Progress value={teamPerformance.taskCompletionRate} className="h-2 mt-2" />
                            <p className="text-xs text-muted-foreground mt-2">+5% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Team Efficiency</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{teamPerformance.teamEfficiency}%</div>
                            <Progress value={teamPerformance.teamEfficiency} className="h-2 mt-2" />
                            <p className="text-xs text-muted-foreground mt-2">
                                Managing developers is like herding cats... good luck!
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}