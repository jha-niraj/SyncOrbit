import { auth } from "@/auth"
import { getUserProjects } from "@/actions/projects.action"
import { 
    Card, CardContent 
} from "@/components/ui/card"
import {
    Users, Code, Megaphone, ShoppingCart, Palette, Briefcase, Settings
} from "lucide-react"
import { 
    Status, TaskStatus, TeamType 
} from "@prisma/client"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { MyProjectsPageClient } from "./_components/MyProjectsPageClient"

export const metadata: Metadata = {
    title: "My Projects | SyncOrbit",
    description: "View and manage your assigned projects, track progress, and monitor your tasks across all projects.",
    keywords: ["my projects", "assigned projects", "project tracking", "task management", "personal dashboard"],
    openGraph: {
        title: "My Projects | SyncOrbit",
        description: "Track your assigned projects and tasks",
        type: "website",
    },
}

// Team type icon mapping
const TEAM_ICONS = {
    [TeamType.TECHNICAL]: Code,
    [TeamType.MARKETING]: Megaphone,
    [TeamType.SALES]: ShoppingCart,
    [TeamType.DESIGN]: Palette,
    [TeamType.OPERATIONS]: Settings,
    [TeamType.FINANCE]: Briefcase,
    [TeamType.CUSTOM]: Users,
}

// Status colors
const STATUS_COLORS = {
    [Status.IN_PROGRESS]: "bg-blue-500",
    [Status.COMPLETED]: "bg-green-500",
    [Status.ON_HOLD]: "bg-yellow-500",
    [Status.CANCELLED]: "bg-red-500",
}

interface ProjectTask {
    status: TaskStatus
}

function getTaskProgress(tasks: ProjectTask[]) {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length
    return Math.round((completedTasks / tasks.length) * 100)
}

function formatCurrency(amount: number, currency: string) {
    const symbols: Record<string, string> = {
        USD: '$',
        INR: '₹',
        NPR: 'Rs.'
    }
    return `${symbols[currency] || '$'}${amount.toLocaleString()}`
}

export default async function MyProjectsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/signin')
    }

    const result = await getUserProjects()

    if (!result.success) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">Failed to load your projects</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            {result.error}
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { projects } = result

    return <MyProjectsPageClient projects={projects} user={session.user} />
}