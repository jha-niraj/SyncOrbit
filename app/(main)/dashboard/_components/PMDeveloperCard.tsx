"use client"

import { Badge } from "@/components/ui/badge"
import { 
    Avatar, AvatarFallback, AvatarImage 
} from "@/components/ui/avatar"

interface PMDeveloperCardProps {
    developer: {
        id: string
        name: string | null
        email: string | null
        image: string | null
        role: string
        createdAt: Date
        assignedTasks: {
            id: string
            title: string
            status: string
            createdAt: Date
            project: {
                id: string
                title: string
                slug: string
            }
        }[]
        taskStats: {
            total: number
            completed: number
            inProgress: number
            completionRate: number
        }
    }
}

export function PMDeveloperCard({ developer }: PMDeveloperCardProps) {
    return (
        <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <Avatar className="h-10 w-10">
                <AvatarImage src={developer.image || undefined} />
                <AvatarFallback>{developer.name?.charAt(0) || 'D'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">{developer.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                        {developer.taskStats.total} tasks
                    </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{developer.taskStats.completed} completed</span>
                    <span>•</span>
                    <span>{developer.taskStats.inProgress} in progress</span>
                </div>
            </div>
        </div>
    )
}
