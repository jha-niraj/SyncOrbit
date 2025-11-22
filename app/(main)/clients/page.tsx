import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getCompanyClients } from "@/actions/clients.action"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { Mail, Calendar, DollarSign, Briefcase } from "lucide-react"

export const metadata: Metadata = {
    title: "Clients | ProjectCentral",
    description: "Manage your company clients.",
}

export default async function ClientsPage() {
    const session = await auth()
    if (!session?.user) redirect("/signin")

    const result = await getCompanyClients()

    if (result.error) {
        // Handle error (maybe show a toast or error message)
        return <div className="p-6">Error: {result.error}</div>
    }

    const clients = result.data || []

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                <p className="text-muted-foreground">
                    Manage and view all your clients.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {clients.map((client) => (
                    <Card key={client.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={client.image || ""} alt={client.name || "Client"} />
                                <AvatarFallback>{client.name?.charAt(0) || "C"}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <CardTitle className="text-lg">{client.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" /> {client.email}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" /> Joined
                                </span>
                                <span>{format(new Date(client.createdAt), "MMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <Briefcase className="h-4 w-4" /> Projects
                                </span>
                                <span>{client._count.projectMemberships}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <DollarSign className="h-4 w-4" /> Total Spent
                                </span>
                                <span>${client.totalSpent.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-2">
                                <Badge variant={client.isActive ? "default" : "secondary"}>
                                    {client.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full" variant="outline">
                                <Link href={`/clients/${client.id}`}>View Details</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {clients.length === 0 && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No clients found.
                    </div>
                )}
            </div>
        </div>
    )
}
