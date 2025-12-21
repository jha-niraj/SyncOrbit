import { startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek, subWeeks, startOfDay, endOfDay, subDays } from "date-fns"

export interface StatCard {
	id: string
	title: string
	value: string | number
	previousValue?: string | number
	change?: number // percentage change
	changeType?: 'increase' | 'decrease' | 'neutral'
	description: string
	icon: string
	color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'pink' | 'gray'
	trend?: number[] // Array of values for sparkline trend
	format?: 'currency' | 'percentage' | 'number'
}

export interface DashboardMetrics {
	revenueStats: {
		totalRevenue: number
		monthlyRevenue: number
		previousMonthRevenue: number
		revenueGrowth: number
		pendingPayments: number
		averageProjectValue: number
		monthlyTrend: number[]
	}
	projectStats: {
		total: number
		active: number
		completed: number
		onHold: number
		overdue: number
		completionRate: number
		averageProjectDuration: number
		projectsTrend: number[]
	}
	taskStats: {
		total: number
		completed: number
		inProgress: number
		overdue: number
		completionRate: number
		averageTasksPerProject: number
		tasksTrend: number[]
	}
	teamStats: {
		totalMembers: number
		activeDevelopers: number
		utilization: number
		averageTasksPerDeveloper: number
		teamEfficiency: number
		newMembersThisMonth: number
		utilizationTrend: number[]
	}
	clientStats: {
		totalClients: number
		activeClients: number
		newClientsThisMonth: number
		clientRetentionRate: number
		averageSatisfaction: number
		clientsTrend: number[]
	}
}

/**
 * Calculate percentage change between current and previous values
 */
export function calculatePercentageChange(current: number, previous: number): number {
	if (previous === 0) return current > 0 ? 100 : 0
	return Math.round(((current - previous) / previous) * 100)
}

/**
 * Determine change type based on percentage
 */
export function getChangeType(change: number): 'increase' | 'decrease' | 'neutral' {
	if (change > 0) return 'increase'
	if (change < 0) return 'decrease'
	return 'neutral'
}

/**
 * Format currency values
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
	const symbols: Record<string, string> = {
		USD: '$',
		INR: '₹',
		NPR: 'Rs.'
	}

	const symbol = symbols[currency] || '$'

	if (value >= 1000000) {
		return `${symbol}${(value / 1000000).toFixed(1)}M`
	} else if (value >= 1000) {
		return `${symbol}${(value / 1000).toFixed(1)}K`
	} else {
		return `${symbol}${value.toLocaleString()}`
	}
}

/**
 * Format numbers with K/M suffixes
 */
export function formatNumber(value: number): string {
	if (value >= 1000000) {
		return `${(value / 1000000).toFixed(1)}M`
	} else if (value >= 1000) {
		return `${(value / 1000).toFixed(1)}K`
	} else {
		return value.toLocaleString()
	}
}

/**
 * Generate trend data for sparklines (mock data for now)
 */
export function generateTrendData(currentValue: number, periods: number = 7): number[] {
	const trend = []
	const variation = 0.2 // 20% variation

	for (let i = periods - 1; i >= 0; i--) {
		const baseValue = currentValue * (1 - (i * 0.1 * variation))
		const randomVariation = (Math.random() - 0.5) * variation * baseValue
		trend.push(Math.max(0, baseValue + randomVariation))
	}

	return trend
}

/**
 * Get color classes for different stat types
 */
export function getColorClasses(color: StatCard['color']) {
	const colorMap = {
		blue: {
			bg: 'bg-blue-50 dark:bg-blue-950/20',
			icon: 'text-blue-600 dark:text-blue-400',
			border: 'border-blue-200 dark:border-blue-800',
			gradient: 'from-blue-500 to-blue-600'
		},
		green: {
			bg: 'bg-green-50 dark:bg-green-950/20',
			icon: 'text-green-600 dark:text-green-400',
			border: 'border-green-200 dark:border-green-800',
			gradient: 'from-green-500 to-green-600'
		},
		yellow: {
			bg: 'bg-yellow-50 dark:bg-yellow-950/20',
			icon: 'text-yellow-600 dark:text-yellow-400',
			border: 'border-yellow-200 dark:border-yellow-800',
			gradient: 'from-yellow-500 to-yellow-600'
		},
		red: {
			bg: 'bg-red-50 dark:bg-red-950/20',
			icon: 'text-red-600 dark:text-red-400',
			border: 'border-red-200 dark:border-red-800',
			gradient: 'from-red-500 to-red-600'
		},
		purple: {
			bg: 'bg-purple-50 dark:bg-purple-950/20',
			icon: 'text-purple-600 dark:text-purple-400',
			border: 'border-purple-200 dark:border-purple-800',
			gradient: 'from-purple-500 to-purple-600'
		},
		indigo: {
			bg: 'bg-indigo-50 dark:bg-indigo-950/20',
			icon: 'text-indigo-600 dark:text-indigo-400',
			border: 'border-indigo-200 dark:border-indigo-800',
			gradient: 'from-indigo-500 to-indigo-600'
		},
		pink: {
			bg: 'bg-pink-50 dark:bg-pink-950/20',
			icon: 'text-pink-600 dark:text-pink-400',
			border: 'border-pink-200 dark:border-pink-800',
			gradient: 'from-pink-500 to-pink-600'
		},
		gray: {
			bg: 'bg-gray-50 dark:bg-gray-950/20',
			icon: 'text-gray-600 dark:text-gray-400',
			border: 'border-gray-200 dark:border-gray-800',
			gradient: 'from-gray-500 to-gray-600'
		}
	}

	return colorMap[color]
}

/**
 * Calculate team utilization percentage
 */
export function calculateTeamUtilization(activeDevelopers: number, totalTasks: number, totalProjects: number): number {
	if (activeDevelopers === 0) return 0

	// Simple utilization calculation: tasks per developer vs expected capacity
	const tasksPerDeveloper = totalTasks / activeDevelopers
	const expectedTasksPerDeveloper = totalProjects * 2 // Assuming 2 tasks per project per developer

	return Math.min(100, Math.round((tasksPerDeveloper / expectedTasksPerDeveloper) * 100))
}

/**
 * Calculate project completion rate
 */
export function calculateCompletionRate(completed: number, total: number): number {
	if (total === 0) return 0
	return Math.round((completed / total) * 100)
}

/**
 * Determine if a metric needs attention (for alerts/warnings)
 */
export function needsAttention(metricType: string, value: number, threshold?: number): boolean {
	const defaultThresholds: Record<string, number> = {
		overdue_tasks: 5, // More than 5 overdue tasks
		team_utilization: 30, // Less than 30% utilization
		completion_rate: 70, // Less than 70% completion rate
		revenue_decline: -10, // More than 10% revenue decline
		client_satisfaction: 3.0 // Less than 3.0 rating
	}

	const effectiveThreshold = threshold ?? defaultThresholds[metricType] ?? 0

	switch (metricType) {
		case 'overdue_tasks':
			return value > effectiveThreshold
		case 'team_utilization':
		case 'completion_rate':
		case 'client_satisfaction':
			return value < effectiveThreshold
		case 'revenue_decline':
			return value < effectiveThreshold
		default:
			return false
	}
}

/**
 * Get time period data for trend calculations
 */
export function getTimePeriods() {
	const now = new Date()

	return {
		thisWeek: {
			start: startOfWeek(now),
			end: endOfWeek(now)
		},
		lastWeek: {
			start: startOfWeek(subWeeks(now, 1)),
			end: endOfWeek(subWeeks(now, 1))
		},
		thisMonth: {
			start: startOfMonth(now),
			end: endOfMonth(now)
		},
		lastMonth: {
			start: startOfMonth(subMonths(now, 1)),
			end: endOfMonth(subMonths(now, 1))
		},
		today: {
			start: startOfDay(now),
			end: endOfDay(now)
		},
		yesterday: {
			start: startOfDay(subDays(now, 1)),
			end: endOfDay(subDays(now, 1))
		}
	}
}