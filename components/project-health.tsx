"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Info,
  Target,
  TrendingDown,
  TrendingUp,
  Users
} from "lucide-react"
import { 
  calculateProjectHealthScore, 
  ProjectHealthData, 
  HealthScoreResult,
  getHealthScoreColor,
  getHealthScoreBgColor
} from "@/lib/utils/healthScore"
import { cn } from "@/lib/utils"

interface ProjectHealthProps {
  data: ProjectHealthData
  variant?: 'card' | 'compact' | 'detailed'
  showRecommendations?: boolean
}

interface HealthScoreDisplayProps {
  score: number
  grade: string
  status: string
  size?: 'sm' | 'md' | 'lg'
}

function HealthScoreDisplay({ score, grade, status, size = 'md' }: HealthScoreDisplayProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "font-bold",
        sizeClasses[size],
        getHealthScoreColor(score)
      )}>
        {score}
      </div>
      <div className="text-center">
        <Badge 
          variant="secondary" 
          className={cn(
            "font-semibold",
            getHealthScoreBgColor(score),
            getHealthScoreColor(score)
          )}
        >
          Grade {grade}
        </Badge>
        <p className="text-xs text-muted-foreground mt-1">{status}</p>
      </div>
    </div>
  )
}

interface HealthBreakdownProps {
  breakdown: HealthScoreResult['breakdown']
}

function HealthBreakdown({ breakdown }: HealthBreakdownProps) {
  const factors = [
    {
      key: 'taskCompletion' as const,
      label: 'Task Completion',
      icon: CheckCircle2,
      description: 'Progress on completing project tasks'
    },
    {
      key: 'timelineAdherence' as const,
      label: 'Timeline Adherence',
      icon: Clock,
      description: 'Meeting project deadlines and milestones'
    },
    {
      key: 'clientSatisfaction' as const,
      label: 'Client Satisfaction',
      icon: Users,
      description: 'Client feedback and engagement levels'
    },
    {
      key: 'budgetHealth' as const,
      label: 'Budget Health',
      icon: DollarSign,
      description: 'Budget utilization vs project progress'
    }
  ]

  return (
    <div className="space-y-4">
      {factors.map((factor) => {
        const data = breakdown[factor.key]
        const Icon = factor.icon
        
        return (
          <div key={factor.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="font-medium text-sm">{factor.label}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{factor.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("font-semibold text-sm", getHealthScoreColor(data.score))}>
                  {data.score}%
                </span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round(data.weight * 100)}% weight)
                </span>
              </div>
            </div>
            <Progress 
              value={data.score} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">{data.details}</p>
          </div>
        )
      })}
    </div>
  )
}

interface RecommendationsProps {
  recommendations: string[]
}

function Recommendations({ recommendations }: RecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
        <p className="text-sm">Project is healthy! No immediate actions needed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Target className="h-4 w-4 text-amber-600" />
        <span className="font-medium text-sm">Recommended Actions</span>
      </div>
      <div className="space-y-2">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">{recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProjectHealth({ data, variant = 'card', showRecommendations = false }: ProjectHealthProps) {
  const healthResult = calculateProjectHealthScore(data)

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4" />
        <span className={cn("font-semibold", getHealthScoreColor(healthResult.overall))}>
          {healthResult.overall}%
        </span>
        <Badge 
          variant="secondary" 
          className={cn(
            "text-xs",
            getHealthScoreBgColor(healthResult.overall),
            getHealthScoreColor(healthResult.overall)
          )}
        >
          {healthResult.grade}
        </Badge>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Project Health Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive health assessment based on multiple factors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <HealthScoreDisplay 
              score={healthResult.overall} 
              grade={healthResult.grade}
              status={healthResult.status}
              size="lg"
            />
          </div>
          
          <HealthBreakdown breakdown={healthResult.breakdown} />
          
          {showRecommendations && (
            <>
              <div className="border-t pt-6">
                <Recommendations recommendations={healthResult.recommendations} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  // Default 'card' variant
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Project Health
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Health Score Details - {data.title}</DialogTitle>
                <DialogDescription>
                  Detailed breakdown of project health metrics and recommendations
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <HealthScoreDisplay 
                    score={healthResult.overall} 
                    grade={healthResult.grade}
                    status={healthResult.status}
                    size="lg"
                  />
                </div>
                
                <HealthBreakdown breakdown={healthResult.breakdown} />
                
                <div className="border-t pt-6">
                  <Recommendations recommendations={healthResult.recommendations} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <HealthScoreDisplay 
            score={healthResult.overall} 
            grade={healthResult.grade}
            status={healthResult.status}
            size="md"
          />
          {healthResult.overall >= 80 ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
        </div>
        
        <Progress 
          value={healthResult.overall} 
          className="mb-3"
        />
        
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>Tasks: {Math.round(healthResult.breakdown.taskCompletion.score)}%</div>
          <div>Timeline: {Math.round(healthResult.breakdown.timelineAdherence.score)}%</div>
          <div>Client: {Math.round(healthResult.breakdown.clientSatisfaction.score)}%</div>
          <div>Budget: {Math.round(healthResult.breakdown.budgetHealth.score)}%</div>
        </div>
        
        {healthResult.recommendations.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-1 text-amber-600">
              <AlertTriangle className="h-3 w-3" />
              <span className="text-xs font-medium">
                {healthResult.recommendations.length} recommendation(s)
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ProjectHealth