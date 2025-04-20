import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ProfilePage() {
    const user = {
        name: "John Doe",
        email: "john@example.com",
        role: "DEVELOPER",
        avatar: "/placeholder.svg?height=100&width=100",
        projects: [
            { id: 1, title: "E-commerce Website", status: "In Progress" },
            { id: 2, title: "Mobile App Development", status: "In Progress" },
        ],
        tasks: [
            { id: 1, title: "Implement User Authentication", status: "Yet to Start", project: "E-commerce Website" },
            { id: 2, title: "Shopping Cart Functionality", status: "In Progress", project: "E-commerce Website" },
            { id: 3, title: "Database Schema Design", status: "Completed", project: "E-commerce Website" },
        ],
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold">Project Management System</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard/developer">
                            <Button variant="ghost" size="sm">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-1 container py-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                        <div className="md:w-1/3">
                            <Card>
                                <CardHeader className="flex flex-col items-center">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <CardTitle>{user.name}</CardTitle>
                                    <CardDescription>{user.email}</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <Badge variant="outline">{user.role}</Badge>
                                    <div className="mt-6">
                                        <Button className="w-full">Edit Profile</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="md:w-2/3">
                            <Tabs defaultValue="projects">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="projects">Projects</TabsTrigger>
                                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                                </TabsList>
                                <TabsContent value="projects" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>My Projects</CardTitle>
                                            <CardDescription>Projects you are currently working on</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {user.projects.map((project) => (
                                                    <div
                                                        key={project.id}
                                                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                                                    >
                                                        <div>
                                                            <h3 className="font-medium">{project.title}</h3>
                                                            <p className="text-sm text-muted-foreground">Status: {project.status}</p>
                                                        </div>
                                                        <Link href={`/projects/${project.id}`}>
                                                            <Button variant="outline" size="sm">
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="tasks" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>My Tasks</CardTitle>
                                            <CardDescription>Tasks assigned to you</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {user.tasks.map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                                                    >
                                                        <div>
                                                            <h3 className="font-medium">{task.title}</h3>
                                                            <p className="text-sm text-muted-foreground">Project: {task.project}</p>
                                                            <div
                                                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mt-1 ${task.status === "Completed"
                                                                        ? "border-green-600/20 bg-green-600/10 text-green-600"
                                                                        : task.status === "In Progress"
                                                                            ? "border-blue-600/20 bg-blue-600/10 text-blue-600"
                                                                            : "border-yellow-600/20 bg-yellow-600/10 text-yellow-600"
                                                                    }`}
                                                            >
                                                                {task.status}
                                                            </div>
                                                        </div>
                                                        <Button variant="outline" size="sm">
                                                            Update Status
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}