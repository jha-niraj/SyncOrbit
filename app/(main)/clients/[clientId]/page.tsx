import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getClientDetails } from "@/actions/clients.action"
import { 
    Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card"
import { 
    Avatar, AvatarFallback, AvatarImage 
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { 
    Mail, Calendar, DollarSign, ArrowLeft 
} from "lucide-react"

export const metadata: Metadata = {
    title: "Client Details | SyncOrbit",
    description: "View client details and project history.",
}

interface PageProps {
    params: Promise<{ clientId: string }>
}

export default async function ClientDetailsPage({ params }: PageProps) {
    const { clientId } = await params
    const session = await auth()
    if (!session?.user) redirect("/signin")

    const result = await getClientDetails(clientId)

    if (result.error) {
        return (
            <div className="p-6 space-y-4">
                <div className="text-red-500">Error: {result.error}</div>
                <Button asChild variant="outline">
                    <Link href="/clients">Back to Clients</Link>
                </Button>
            </div>
        )
    }

    const client = result.data!

    return (
        <div className="p-6 space-y-6">
            <Button asChild variant="ghost" className="pl-0">
                <Link href="/clients" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Clients
                </Link>
            </Button>

            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={client.image || ""} alt={client.name || "Client"} />
                        <AvatarFallback className="text-2xl">{client.name?.charAt(0) || "C"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Mail className="h-4 w-4" /> {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Calendar className="h-4 w-4" /> Joined {format(new Date(client.createdAt), "MMMM d, yyyy")}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Badge variant={client.isActive ? "default" : "secondary"} className="text-lg px-4 py-1">
                        {client.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <div className="text-2xl font-bold flex items-center gap-1">
                        <DollarSign className="h-6 w-6 text-muted-foreground" />
                        {client.totalSpent.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Lifetime Value</p>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Project History</h2>
                <div className="grid gap-4">
                    {client.projectMemberships.map((membership) => (
                        <Card key={membership.project.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle>{membership.project.title}</CardTitle>
                                        <CardDescription>
                                            {membership.project.startDate ? format(new Date(membership.project.startDate), "MMM d, yyyy") : "N/A"}
                                            {" - "}
                                            {membership.project.endDate ? format(new Date(membership.project.endDate), "MMM d, yyyy") : "Ongoing"}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={membership.project.status === "COMPLETED" ? "default" : "outline"}>
                                        {membership.project.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">${membership.project.budget.toLocaleString()}</span>
                                        <span className="text-muted-foreground">Budget</span>
                                    </div>
                                    {/* Add more project details here if needed */}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {client.projectMemberships.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed">
                            No projects found for this client.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
