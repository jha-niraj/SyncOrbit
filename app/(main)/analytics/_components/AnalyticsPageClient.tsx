"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
    BarChart3, TrendingUp, TrendingDown, DollarSign, Users,
    Clock, Target, Award, Activity, Download, Filter
} from "lucide-react"
import { motion } from "framer-motion"
import { AnalyticsData, StatCardProps, ChartCardProps } from "@/types/analytics"

interface AnalyticsPageClientProps {
    initialAnalytics: AnalyticsData
}

export default function AnalyticsPageClient({ initialAnalytics }: AnalyticsPageClientProps) {
    const [analytics, setAnalytics] = useState<AnalyticsData>(initialAnalytics)
    const [timeFilter, setTimeFilter] = useState("6months")

    const StatCard = ({ title, value, change, icon: Icon, trend, description }: StatCardProps) => (
        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold text-foreground">{value}</p>
                        {
                            change && (
                                <div className="flex items-center gap-1 text-sm">
                                    {
                                        trend === 'up' ? (
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-red-500" />
                                        )
                                    }
                                    <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                                        {change}%
                                    </span>
                                    <span className="text-muted-foreground">vs last period</span>
                                </div>
                            )
                        }
                        {
                            description && (
                                <p className="text-xs text-muted-foreground">{description}</p>
                            )
                        }
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    const ChartCard = ({ title, children }: ChartCardProps) => (
        <Card className="bg-background/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
                        <p className="text-muted-foreground">
                            Track performance, monitor progress, and gain insights
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Select value={timeFilter} onValueChange={setTimeFilter}>
                            <SelectTrigger className="w-48">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1month">Last Month</SelectItem>
                                <SelectItem value="3months">Last 3 Months</SelectItem>
                                <SelectItem value="6months">Last 6 Months</SelectItem>
                                <SelectItem value="1year">Last Year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Projects"
                        value={analytics.overview.totalProjects}
                        change={12}
                        trend="up"
                        icon={Target}
                        description={`${analytics.overview.activeProjects} active, ${analytics.overview.completedProjects} completed`}
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`$${(analytics.overview.totalRevenue / 1000).toFixed(0)}K`}
                        change={8}
                        trend="up"
                        icon={DollarSign}
                        description="Across all projects"
                    />
                    <StatCard
                        title="Team Members"
                        value={analytics.overview.teamMembers}
                        change={5}
                        trend="up"
                        icon={Users}
                        description="Active developers and PMs"
                    />
                    <StatCard
                        title="On-Time Delivery"
                        value={`${analytics.overview.onTimeDelivery}%`}
                        change={-3}
                        trend="down"
                        icon={Clock}
                        description="Project completion rate"
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Project Progress Over Time">
                        <div className="space-y-4">
                            {
                                analytics.projectStats.slice(-6).map((stat) => (
                                    <div key={stat.month} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-foreground">{stat.month}</span>
                                            <div className="flex gap-4 text-sm">
                                                <span className="text-green-600">{stat.completed} completed</span>
                                                <span className="text-blue-600">{stat.active} active</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 h-2">
                                            <div
                                                className="bg-green-500 rounded-l"
                                                style={{ width: `${(stat.completed / (stat.completed + stat.active)) * 100}%` }}
                                            />
                                            <div
                                                className="bg-blue-500 rounded-r"
                                                style={{ width: `${(stat.active / (stat.completed + stat.active)) * 100}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Revenue: ${(stat.revenue / 1000).toFixed(0)}K
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </ChartCard>
                    <ChartCard title="Team Performance">
                        <div className="space-y-4">
                            {
                                analytics.teamPerformance.map((member, index) => (
                                    <motion.div
                                        key={member.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="space-y-2"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-foreground">{member.name}</span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {member.rating}★
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {member.efficiency}%
                                                </span>
                                            </div>
                                        </div>
                                        <Progress value={member.efficiency} className="h-2" />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{member.projectsCompleted} projects</span>
                                            <span>{member.tasksCompleted} tasks</span>
                                        </div>
                                    </motion.div>
                                ))
                            }
                        </div>
                    </ChartCard>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ChartCard title="Recent Activity">
                        <div className="space-y-4">
                            {
                                analytics.recentActivity.map((activity, index) => {
                                    const getActivityIcon = (type: string) => {
                                        switch (type) {
                                            case 'project_completed':
                                                return <Award className="h-4 w-4 text-green-500" />
                                            case 'milestone_reached':
                                                return <Target className="h-4 w-4 text-blue-500" />
                                            case 'new_client':
                                                return <Users className="h-4 w-4 text-purple-500" />
                                            case 'team_added':
                                                return <Activity className="h-4 w-4 text-orange-500" />
                                            default:
                                                return <Activity className="h-4 w-4 text-gray-500" />
                                        }
                                    }

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex-shrink-0 mt-0.5">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-foreground">{activity.message}</p>
                                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                                            </div>
                                        </motion.div>
                                    )
                                })
                            }
                        </div>
                    </ChartCard>
                    <ChartCard title="Key Metrics">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-foreground">Client Satisfaction</span>
                                    <span className="text-sm text-muted-foreground">{analytics.overview.clientSatisfaction}/5.0</span>
                                </div>
                                <Progress value={(analytics.overview.clientSatisfaction / 5) * 100} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-foreground">Average Project Duration</span>
                                    <span className="text-sm text-muted-foreground">{analytics.overview.averageProjectDuration} months</span>
                                </div>
                                <Progress value={70} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-foreground">Team Utilization</span>
                                    <span className="text-sm text-muted-foreground">78%</span>
                                </div>
                                <Progress value={78} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-foreground">Budget Accuracy</span>
                                    <span className="text-sm text-muted-foreground">92%</span>
                                </div>
                                <Progress value={92} className="h-2" />
                            </div>
                        </div>
                    </ChartCard>
                    <ChartCard title="Goals & Targets">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium text-foreground">Q2 Revenue Target</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">$180K / $200K</span>
                                    <span className="font-medium text-foreground">90%</span>
                                </div>
                                <Progress value={90} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium text-foreground">Team Growth</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">12 / 15 members</span>
                                    <span className="font-medium text-foreground">80%</span>
                                </div>
                                <Progress value={80} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium text-foreground">Delivery Performance</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">87% on-time</span>
                                    <span className="font-medium text-foreground">Target: 90%</span>
                                </div>
                                <Progress value={87} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium text-foreground">Client Retention</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">95% retention</span>
                                    <span className="font-medium text-foreground">Excellent</span>
                                </div>
                                <Progress value={95} className="h-2" />
                            </div>
                        </div>
                    </ChartCard>
                </div>
            </div>
        </div>
    )
}
