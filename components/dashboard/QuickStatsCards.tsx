"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
	StatCard,
	DashboardMetrics,
	formatCurrency,
	formatNumber,
	getColorClasses,
	getChangeType,
	needsAttention
} from "@/lib/utils/dashboardStats"
import {
	DollarSign,
	FolderOpen,
	Users,
	Clock,
	TrendingUp,
	TrendingDown,
	AlertTriangle,
	CheckCircle,
	UserCheck,
	Target,
	Activity,
	Star
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface QuickStatsCardsProps {
	metrics: DashboardMetrics | null
	loading?: boolean
}

// Sparkline component for trend visualization
function Sparkline({ data, color }: { data: number[], color: string }) {
	if (!data || data.length === 0) return null

	const max = Math.max(...data)
	const min = Math.min(...data)
	const range = max - min

	if (range === 0) return null

	const points = data.map((value, index) => {
		const x = (index / (data.length - 1)) * 100
		const y = 100 - ((value - min) / range) * 100
		return `${x},${y}`
	}).join(' ')

	return (
		<svg className="w-16 h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
			<polyline
				points={points}
				fill="none"
				stroke={`hsl(var(--${color}))`}
				strokeWidth="2"
				className="opacity-60"
			/>
		</svg>
	)
}

// Individual stat card component
function StatCardComponent({ stat }: { stat: StatCard }) {
	const colorClasses = getColorClasses(stat.color)
	const isPositiveChange = stat.changeType === 'increase'
	const isNegativeChange = stat.changeType === 'decrease'

	// Determine if metric needs attention
	const requiresAttention = stat.id === 'overdue_tasks' ? needsAttention('overdue_tasks', Number(stat.value)) :
		stat.id === 'team_utilization' ? needsAttention('team_utilization', Number(stat.value)) :
			stat.id === 'completion_rate' ? needsAttention('completion_rate', Number(stat.value)) :
				stat.id === 'revenue_growth' && stat.change ? needsAttention('revenue_decline', stat.change) :
					false

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card className={cn(
				"relative overflow-hidden hover:shadow-lg transition-all duration-200",
				colorClasses.border,
				requiresAttention && "ring-2 ring-red-500/50"
			)}>
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className={cn(
								"p-2 rounded-lg",
								colorClasses.bg
							)}>
								<div className={cn("w-5 h-5", colorClasses.icon)}>
									{stat.icon === 'dollar-sign' && <DollarSign className="w-5 h-5" />}
									{stat.icon === 'folder-open' && <FolderOpen className="w-5 h-5" />}
									{stat.icon === 'users' && <Users className="w-5 h-5" />}
									{stat.icon === 'clock' && <Clock className="w-5 h-5" />}
									{stat.icon === 'check-circle' && <CheckCircle className="w-5 h-5" />}
									{stat.icon === 'user-check' && <UserCheck className="w-5 h-5" />}
									{stat.icon === 'target' && <Target className="w-5 h-5" />}
									{stat.icon === 'activity' && <Activity className="w-5 h-5" />}
									{stat.icon === 'star' && <Star className="w-5 h-5" />}
									{stat.icon === 'alert-triangle' && <AlertTriangle className="w-5 h-5" />}
								</div>
							</div>

							<div className="flex-1">
								<p className="text-sm font-medium text-muted-foreground">
									{stat.title}
								</p>
								<div className="flex items-center space-x-2">
									<p className="text-2xl font-bold">
										{stat.format === 'currency' ? formatCurrency(Number(stat.value)) :
											stat.format === 'percentage' ? `${stat.value}%` :
												stat.format === 'number' ? formatNumber(Number(stat.value)) :
													stat.value}
									</p>

									{requiresAttention && (
										<Badge variant="destructive" className="text-xs">
											<AlertTriangle className="w-3 h-3 mr-1" />
											Alert
										</Badge>
									)}
								</div>

								<p className="text-xs text-muted-foreground mt-1">
									{stat.description}
								</p>
							</div>
						</div>

						{/* Trend indicator and sparkline */}
						<div className="flex flex-col items-end space-y-2">
							{stat.trend && stat.trend.length > 0 && (
								<Sparkline data={stat.trend} color={stat.color} />
							)}

							{stat.change !== undefined && (
								<div className="flex items-center space-x-1">
									{isPositiveChange && (
										<TrendingUp className="w-4 h-4 text-green-500" />
									)}
									{isNegativeChange && (
										<TrendingDown className="w-4 h-4 text-red-500" />
									)}

									<span className={cn(
										"text-sm font-medium",
										isPositiveChange && "text-green-600 dark:text-green-400",
										isNegativeChange && "text-red-600 dark:text-red-400",
										stat.changeType === 'neutral' && "text-muted-foreground"
									)}>
										{stat.change > 0 ? '+' : ''}{stat.change}%
									</span>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}

// Loading skeleton
function StatsCardSkeleton() {
	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<Skeleton className="h-10 w-10 rounded-lg" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-6 w-16" />
							<Skeleton className="h-3 w-32" />
						</div>
					</div>
					<div className="flex flex-col items-end space-y-2">
						<Skeleton className="h-8 w-16" />
						<Skeleton className="h-4 w-12" />
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default function QuickStatsCards({ metrics, loading = false }: QuickStatsCardsProps) {
	if (loading || !metrics) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{Array.from({ length: 8 }).map((_, i) => (
					<StatsCardSkeleton key={i} />
				))}
			</div>
		)
	}

	// Generate stat cards from metrics
	const statCards: StatCard[] = [
		// Revenue metrics
		{
			id: 'total_revenue',
			title: 'Total Revenue',
			value: metrics.revenueStats.totalRevenue,
			change: metrics.revenueStats.revenueGrowth,
			changeType: getChangeType(metrics.revenueStats.revenueGrowth),
			description: 'All-time project revenue',
			icon: 'dollar-sign',
			color: 'green',
			trend: metrics.revenueStats.monthlyTrend,
			format: 'currency'
		},
		{
			id: 'monthly_revenue',
			title: 'Monthly Revenue',
			value: metrics.revenueStats.monthlyRevenue,
			previousValue: metrics.revenueStats.previousMonthRevenue,
			change: metrics.revenueStats.revenueGrowth,
			changeType: getChangeType(metrics.revenueStats.revenueGrowth),
			description: 'Revenue this month',
			icon: 'dollar-sign',
			color: 'blue',
			format: 'currency'
		},

		// Project metrics
		{
			id: 'active_projects',
			title: 'Active Projects',
			value: metrics.projectStats.active,
			description: `${metrics.projectStats.total} total projects`,
			icon: 'folder-open',
			color: 'purple',
			trend: metrics.projectStats.projectsTrend
		},
		{
			id: 'project_completion',
			title: 'Completion Rate',
			value: metrics.projectStats.completionRate,
			description: `${metrics.projectStats.completed} completed`,
			icon: 'check-circle',
			color: 'green',
			format: 'percentage'
		},

		// Task metrics
		{
			id: 'overdue_tasks',
			title: 'Overdue Tasks',
			value: metrics.taskStats.overdue,
			description: `${metrics.taskStats.total} total tasks`,
			icon: 'alert-triangle',
			color: 'red',
			trend: metrics.taskStats.tasksTrend
		},
		{
			id: 'task_completion',
			title: 'Task Progress',
			value: metrics.taskStats.completionRate,
			description: `${metrics.taskStats.completed} completed`,
			icon: 'target',
			color: 'indigo',
			format: 'percentage'
		},

		// Team metrics
		{
			id: 'team_utilization',
			title: 'Team Utilization',
			value: metrics.teamStats.utilization,
			description: `${metrics.teamStats.activeDevelopers} active devs`,
			icon: 'users',
			color: 'yellow',
			trend: metrics.teamStats.utilizationTrend,
			format: 'percentage'
		},
		{
			id: 'client_satisfaction',
			title: 'Client Satisfaction',
			value: metrics.clientStats.averageSatisfaction.toFixed(1),
			description: `${metrics.clientStats.activeClients} active clients`,
			icon: 'star',
			color: 'pink'
		}
	]

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			{statCards.map((stat) => (
				<StatCardComponent key={stat.id} stat={stat} />
			))}
		</div>
	)
}