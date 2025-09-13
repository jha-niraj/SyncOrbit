"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ActivityFeed } from "@/components/activity-feed"

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Activity Feed</h1>
              <p className="text-muted-foreground">
                Track all activities across your projects and team
              </p>
            </div>
          </div>
        </div>

        <ActivityFeed 
          variant="full" 
          showFilters={true}
          autoRefresh={true}
          refreshInterval={60000}
          maxItems={100}
        />
      </div>
    </div>
  )
}