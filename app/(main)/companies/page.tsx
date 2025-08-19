"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
    Building2, 
    Users, 
    FolderOpen,
    ArrowRight
} from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getClientCompanies } from "@/actions/(client)/companies.action"

interface Company {
    id: string
    name: string
    shortName: string
    logo: string | null
    productManager: {
        id: string
        name: string | null
        email: string | null
        image: string | null
    }
    projectCount: number
    _count: {
        users: number
    }
}

export default function CompaniesPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Redirect if not a client
        if (session?.user?.role && session.user.role !== "CLIENT") {
            router.push("/dashboard")
            return
        }
        
        loadCompanies()
    }, [session, router])

    const loadCompanies = async () => {
        setLoading(true)
        try {
            const result = await getClientCompanies()
            if (result.success) {
                setCompanies(result.companies)
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            console.error("Error loading companies:", error)
            toast.error("Failed to load companies")
        } finally {
            setLoading(false)
        }
    }

    if (session?.user?.role !== "CLIENT") {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center text-muted-foreground">
                    This page is only accessible to clients.
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-muted rounded w-1/3"></div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Companies</h1>
                    <p className="text-muted-foreground">
                        Companies managing your projects and services
                    </p>
                </div>
                <Badge variant="secondary" className="text-sm">
                    {companies.length} {companies.length === 1 ? 'Company' : 'Companies'}
                </Badge>
            </div>

            {companies.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Companies Found</h3>
                        <p className="text-muted-foreground mb-4">
                            You&apos;re not currently associated with any companies. 
                            Projects will appear here when you start working with development teams.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {companies.map((company) => (
                        <Card key={company.id} className="hover:shadow-lg transition-all duration-200 border-border/50">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {company.logo ? (
                                            <img 
                                                src={company.logo} 
                                                alt={company.name}
                                                className="h-12 w-12 rounded-lg object-cover border"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Building2 className="h-6 w-6 text-primary" />
                                            </div>
                                        )}
                                        <div>
                                            <CardTitle className="text-lg">{company.name}</CardTitle>
                                            <Badge variant="outline" className="text-xs">
                                                @{company.shortName}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <FolderOpen className="h-4 w-4" />
                                        <span>{company.projectCount} Projects</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>{company._count.users} Members</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Product Manager</h4>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={company.productManager.image || "/placeholder.svg"} />
                                            <AvatarFallback className="text-xs">
                                                {company.productManager.name?.split(" ").map(n => n[0]).join("") || "PM"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{company.productManager.name}</p>
                                            <p className="text-xs text-muted-foreground">{company.productManager.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Link href={`/companies/${company.shortName}`}>
                                        <Button className="w-full" variant="outline">
                                            View Details
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
