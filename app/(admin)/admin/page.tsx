import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, FileText, MessageSquare, ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
    // Mock data - in a real app, this would come from an API or database
    const systemOverview = {
        totalUsers: 42,
        totalProjects: 15,
        feedbackCount: 28,
    }

    const users = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "DEVELOPER" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "PRODUCT_MANAGER" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "DEVELOPER" },
        { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "CLIENT" },
        { id: 5, name: "Alex Brown", email: "alex@example.com", role: "ADMIN" },
    ]

    const auditLogs = [
        { id: 1, action: "User Login", user: "John Doe", timestamp: "2023-10-15T14:30:00" },
        { id: 2, action: "Project Created", user: "Jane Smith", timestamp: "2023-10-14T10:15:00" },
        { id: 3, action: "Task Status Updated", user: "Mike Johnson", timestamp: "2023-10-14T09:45:00" },
        { id: 4, action: "Feedback Added", user: "Sarah Williams", timestamp: "2023-10-13T16:20:00" },
        { id: 5, action: "Role Updated", user: "Alex Brown", timestamp: "2023-10-12T11:10:00" },
    ]

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold">Project Management System</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">Welcome, Admin</span>
                    </div>
                </div>
            </header>
            <main className="flex-1 container py-6">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
                <h2 className="text-xl font-semibold mb-4">System Overview</h2>
                <div className="grid gap-4 md:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{systemOverview.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">+3 new users this month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{systemOverview.totalProjects}</div>
                            <p className="text-xs text-muted-foreground">+2 new projects this month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Feedback Summary</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{systemOverview.feedbackCount}</div>
                            <p className="text-xs text-muted-foreground">+5 new feedback this month</p>
                        </CardContent>
                    </Card>
                </div>
                <h2 className="text-xl font-semibold mb-4">Role Management</h2>
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>User Roles</CardTitle>
                        <CardDescription>Manage user roles and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Current Role</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.role}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Select defaultValue={user.role}>
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="Select role" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="CLIENT">CLIENT</SelectItem>
                                                                <SelectItem value="DEVELOPER">DEVELOPER</SelectItem>
                                                                <SelectItem value="PRODUCT_MANAGER">PRODUCT_MANAGER</SelectItem>
                                                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Button size="sm">Update Role</Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Absolute power... but don&apos;t get carried away.</p>
                    </CardContent>
                </Card>
                <h2 className="text-xl font-semibold mb-4">Audit Logs</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>System Activity</CardTitle>
                        <CardDescription>Recent actions taken by users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Action</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Timestamp</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        auditLogs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center">
                                                        <ShieldAlert className="h-4 w-4 mr-2 text-muted-foreground" />
                                                        {log.action}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{log.user}</TableCell>
                                                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}