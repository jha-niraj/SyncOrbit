import { differenceInDays, isAfter, isBefore, parseISO } from "date-fns"

export interface ProjectHealthData {
  // Project basic info
  id: string
  title: string
  startDate: Date
  endDate: Date | null
  status: string
  budget: number
  paidAmount: number
  
  // Task completion metrics
  tasks: {
    total: number
    completed: number
    inProgress: number
    yetToStart: number
    overdue: number
  }
  
  // Timeline metrics
  timeline: {
    totalDuration: number // in days
    elapsed: number // days since start
    remaining: number // days until end (if endDate exists)
  }
  
  // Client satisfaction metrics (optional)
  feedback?: {
    averageRating: number // 1-5 scale
    totalFeedbacks: number
  }
  
  // Budget metrics
  budgetUtilization: number // percentage
}

export interface HealthScoreResult {
  overall: number // 0-100 scale
  breakdown: {
    taskCompletion: {
      score: number
      weight: number
      details: string
    }
    timelineAdherence: {
      score: number
      weight: number
      details: string
    }
    clientSatisfaction: {
      score: number
      weight: number
      details: string
    }
    budgetHealth: {
      score: number
      weight: number
      details: string
    }
  }
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical'
  recommendations: string[]
}

/**
 * Calculate Task Completion Score (0-100)
 * Based on percentage of completed tasks vs total tasks
 */
export function calculateTaskCompletionScore(tasks: ProjectHealthData['tasks']): number {
  if (tasks.total === 0) return 100 // No tasks means perfect score
  
  const completionPercentage = (tasks.completed / tasks.total) * 100
  
  // Bonus points for having tasks in progress vs yet to start
  const progressBonus = tasks.inProgress > 0 && tasks.yetToStart === 0 ? 10 : 0
  
  // Penalty for overdue tasks
  const overduePenalty = tasks.overdue * 5 // 5 points penalty per overdue task
  
  return Math.max(0, Math.min(100, completionPercentage + progressBonus - overduePenalty))
}

/**
 * Calculate Timeline Adherence Score (0-100)
 * Based on project progress vs timeline progress
 */
export function calculateTimelineAdherenceScore(data: ProjectHealthData): number {
  // If no end date is set, score based on whether project is progressing
  if (!data.endDate) {
    const daysSinceStart = differenceInDays(new Date(), data.startDate)
    const hasProgress = data.tasks.completed > 0 || data.tasks.inProgress > 0
    
    if (daysSinceStart <= 7 && hasProgress) return 95 // Great start
    if (daysSinceStart <= 30 && hasProgress) return 85 // Good progress
    if (daysSinceStart <= 60 && hasProgress) return 75 // Reasonable progress
    if (hasProgress) return 65 // Some progress but taking long
    return daysSinceStart <= 7 ? 50 : 25 // No progress
  }
  
  const totalDays = differenceInDays(data.endDate, data.startDate)
  const elapsedDays = differenceInDays(new Date(), data.startDate)
  const timeProgress = Math.min(100, (elapsedDays / totalDays) * 100)
  
  const taskProgress = data.tasks.total > 0 ? (data.tasks.completed / data.tasks.total) * 100 : 0
  
  // Ideal scenario: task progress matches or exceeds time progress
  const progressRatio = taskProgress / Math.max(timeProgress, 1)
  
  // If project is overdue
  if (isAfter(new Date(), data.endDate)) {
    return Math.max(10, 60 - (elapsedDays - totalDays) * 2) // Penalty for being overdue
  }
  
  // Score based on progress ratio
  if (progressRatio >= 1.2) return 100 // Way ahead of schedule
  if (progressRatio >= 1.0) return 95  // On or ahead of schedule
  if (progressRatio >= 0.8) return 85  // Slightly behind but manageable
  if (progressRatio >= 0.6) return 70  // Behind schedule
  if (progressRatio >= 0.4) return 55  // Significantly behind
  if (progressRatio >= 0.2) return 40  // Critically behind
  return 25 // Minimal progress
}

/**
 * Calculate Client Satisfaction Score (0-100)
 * Based on feedback ratings and frequency
 */
export function calculateClientSatisfactionScore(feedback?: ProjectHealthData['feedback']): number {
  if (!feedback || feedback.totalFeedbacks === 0) {
    return 70 // Neutral score when no feedback available
  }
  
  // Base score from average rating (1-5 scale converted to 0-100)
  const baseScore = ((feedback.averageRating - 1) / 4) * 100
  
  // Bonus for having multiple feedbacks (shows engagement)
  const engagementBonus = Math.min(10, feedback.totalFeedbacks * 2)
  
  return Math.min(100, baseScore + engagementBonus)
}

/**
 * Calculate Budget Health Score (0-100)
 * Based on budget utilization and project progress
 */
export function calculateBudgetHealthScore(data: ProjectHealthData): number {
  const utilizationPercentage = (data.paidAmount / data.budget) * 100
  const taskProgress = data.tasks.total > 0 ? (data.tasks.completed / data.tasks.total) * 100 : 0
  
  // Ideal scenario: budget utilization matches task progress
  const budgetEfficiency = taskProgress > 0 ? utilizationPercentage / taskProgress : utilizationPercentage
  
  // Perfect efficiency around 1.0 (spending matches progress)
  if (budgetEfficiency >= 0.8 && budgetEfficiency <= 1.2) return 100
  if (budgetEfficiency >= 0.6 && budgetEfficiency <= 1.4) return 90
  if (budgetEfficiency >= 0.4 && budgetEfficiency <= 1.6) return 75
  if (budgetEfficiency >= 0.2 && budgetEfficiency <= 1.8) return 60
  
  // Penalty for overspending or underspending relative to progress
  if (budgetEfficiency > 2.0) return 30 // Severe overspending
  if (budgetEfficiency < 0.2) return 40 // Severe underspending (might indicate stalled project)
  
  return 50
}

/**
 * Generate recommendations based on health score breakdown
 */
export function generateRecommendations(data: ProjectHealthData, breakdown: HealthScoreResult['breakdown']): string[] {
  const recommendations: string[] = []
  
  // Task completion recommendations
  if (breakdown.taskCompletion.score < 60) {
    recommendations.push("Focus on completing pending tasks to improve project progress")
    if (data.tasks.yetToStart > 0) {
      recommendations.push(`Start working on ${data.tasks.yetToStart} pending tasks`)
    }
    if (data.tasks.overdue > 0) {
      recommendations.push(`Address ${data.tasks.overdue} overdue tasks immediately`)
    }
  }
  
  // Timeline adherence recommendations
  if (breakdown.timelineAdherence.score < 60) {
    if (data.endDate && isAfter(new Date(), data.endDate)) {
      recommendations.push("Project is overdue - reassess timeline and priorities")
    } else {
      recommendations.push("Accelerate development to stay on schedule")
      recommendations.push("Consider reallocating resources or adjusting scope")
    }
  }
  
  // Client satisfaction recommendations
  if (breakdown.clientSatisfaction.score < 60) {
    recommendations.push("Schedule regular client check-ins to gather feedback")
    recommendations.push("Address any client concerns promptly")
  } else if (!data.feedback || data.feedback.totalFeedbacks === 0) {
    recommendations.push("Request client feedback to ensure satisfaction")
  }
  
  // Budget health recommendations
  if (breakdown.budgetHealth.score < 60) {
    const utilizationPercentage = (data.paidAmount / data.budget) * 100
    const taskProgress = data.tasks.total > 0 ? (data.tasks.completed / data.tasks.total) * 100 : 0
    
    if (utilizationPercentage > taskProgress * 1.5) {
      recommendations.push("Review budget allocation - spending ahead of progress")
    } else if (utilizationPercentage < taskProgress * 0.5) {
      recommendations.push("Consider adjusting budget or accelerating payments")
    }
  }
  
  // Overall project recommendations
  if (data.tasks.total === 0) {
    recommendations.push("Create and assign tasks to track project progress")
  }
  
  return recommendations.slice(0, 5) // Limit to top 5 recommendations
}

/**
 * Calculate overall project health score
 */
export function calculateProjectHealthScore(data: ProjectHealthData): HealthScoreResult {
  // Define weights for different factors
  const weights = {
    taskCompletion: 0.4,      // 40% - Most important
    timelineAdherence: 0.3,   // 30% - Very important
    clientSatisfaction: 0.2,  // 20% - Important for long-term success
    budgetHealth: 0.1         // 10% - Important but less critical for health
  }
  
  // Calculate individual scores
  const taskCompletionScore = calculateTaskCompletionScore(data.tasks)
  const timelineAdherenceScore = calculateTimelineAdherenceScore(data)
  const clientSatisfactionScore = calculateClientSatisfactionScore(data.feedback)
  const budgetHealthScore = calculateBudgetHealthScore(data)
  
  // Calculate weighted overall score
  const overallScore = Math.round(
    taskCompletionScore * weights.taskCompletion +
    timelineAdherenceScore * weights.timelineAdherence +
    clientSatisfactionScore * weights.clientSatisfaction +
    budgetHealthScore * weights.budgetHealth
  )
  
  // Determine grade and status
  let grade: HealthScoreResult['grade']
  let status: HealthScoreResult['status']
  
  if (overallScore >= 90) {
    grade = 'A'
    status = 'Excellent'
  } else if (overallScore >= 80) {
    grade = 'B'
    status = 'Good'
  } else if (overallScore >= 70) {
    grade = 'C'
    status = 'Fair'
  } else if (overallScore >= 60) {
    grade = 'D'
    status = 'Poor'
  } else {
    grade = 'F'
    status = 'Critical'
  }
  
  const breakdown = {
    taskCompletion: {
      score: taskCompletionScore,
      weight: weights.taskCompletion,
      details: `${data.tasks.completed}/${data.tasks.total} tasks completed${data.tasks.overdue > 0 ? `, ${data.tasks.overdue} overdue` : ''}`
    },
    timelineAdherence: {
      score: timelineAdherenceScore,
      weight: weights.timelineAdherence,
      details: data.endDate 
        ? `${differenceInDays(new Date(), data.startDate)} days elapsed${isAfter(new Date(), data.endDate) ? ' (overdue)' : ''}`
        : 'No deadline set'
    },
    clientSatisfaction: {
      score: clientSatisfactionScore,
      weight: weights.clientSatisfaction,
      details: data.feedback 
        ? `${data.feedback.averageRating.toFixed(1)}/5 rating from ${data.feedback.totalFeedbacks} feedback(s)`
        : 'No feedback available'
    },
    budgetHealth: {
      score: budgetHealthScore,
      weight: weights.budgetHealth,
      details: `$${data.paidAmount.toLocaleString()} of $${data.budget.toLocaleString()} spent (${Math.round((data.paidAmount / data.budget) * 100)}%)`
    }
  }
  
  const recommendations = generateRecommendations(data, breakdown)
  
  return {
    overall: overallScore,
    breakdown,
    grade,
    status,
    recommendations
  }
}

/**
 * Get health score color for UI display
 */
export function getHealthScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600 dark:text-green-400'
  if (score >= 80) return 'text-blue-600 dark:text-blue-400'
  if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
  if (score >= 60) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

/**
 * Get health score background color for UI display
 */
export function getHealthScoreBgColor(score: number): string {
  if (score >= 90) return 'bg-green-100 dark:bg-green-950'
  if (score >= 80) return 'bg-blue-100 dark:bg-blue-950'
  if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-950'
  if (score >= 60) return 'bg-orange-100 dark:bg-orange-950'
  return 'bg-red-100 dark:bg-red-950'
}