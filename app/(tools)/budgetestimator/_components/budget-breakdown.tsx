"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "./chart";
import type { EstimateResult } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BarChart2, Target, Info } from "lucide-react"

type BudgetBreakdownProps = {
    estimate: EstimateResult
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export default function BudgetBreakdown({ estimate }: BudgetBreakdownProps) {
    const [activeTab, setActiveTab] = useState("summary")

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Prepare data for charts
    const chartData = Object.entries(estimate.breakdown).map(([key, value], index) => ({
        name: key.split(/(?=[A-Z])/).join(" "),
        value: value,
        color: COLORS[index % COLORS.length],
    }))

    return (
        <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6 bg-gray-100">
                    <TabsTrigger value="summary" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                        Summary
                    </TabsTrigger>
                    <TabsTrigger value="breakdown" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                        Detailed Breakdown
                    </TabsTrigger>
                    <TabsTrigger value="charts" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                        Charts
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="space-y-6">
                    <Card className="border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{estimate.projectName}</h3>
                                    <p className="text-gray-600">{estimate.projectType}</p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <div className="text-3xl font-bold text-blue-600">{formatCurrency(estimate.totalCost)}</div>
                                    <p className="text-sm text-gray-600">Estimated Total</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <Clock className="h-5 w-5 text-blue-500 mr-3" />
                                    <div>
                                        <p className="text-xs text-gray-500">Timeline</p>
                                        <p className="font-medium text-gray-900">{estimate.timeline}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <BarChart2 className="h-5 w-5 text-blue-500 mr-3" />
                                    <div>
                                        <p className="text-xs text-gray-500">Complexity</p>
                                        <p className="font-medium text-gray-900 capitalize">{estimate.complexity}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <Target className="h-5 w-5 text-blue-500 mr-3" />
                                    <div>
                                        <p className="text-xs text-gray-500">Confidence</p>
                                        <p className="font-medium text-gray-900">
                                            {estimate.complexity === "low"
                                                ? "High"
                                                : estimate.complexity === "medium"
                                                    ? "Medium"
                                                    : "Moderate"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {
                                    estimate.additionalRequirements && estimate.additionalRequirements.length > 0 && (
                                        <div>
                                            <span className="text-sm font-medium block mb-2 text-gray-900">Selected Features</span>
                                            <div className="flex flex-wrap gap-2">
                                                {
                                                    estimate.additionalRequirements.map((req, index) => (
                                                        <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                                                            {req}
                                                        </Badge>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    estimate.customRequirements && estimate.customRequirements.length > 0 && (
                                        <div>
                                            <span className="text-sm font-medium block mb-2 text-gray-900">Custom Requirements</span>
                                            <div className="flex flex-wrap gap-2">
                                                {
                                                    estimate.customRequirements.map((req, index) => (
                                                        <Badge key={index} className="bg-blue-50 border border-blue-200 text-blue-700">
                                                            {req}
                                                        </Badge>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </CardContent>
                    </Card>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Cost Overview</h3>
                        <div className="space-y-4">
                            {
                                Object.entries(estimate.breakdown).map(([key, value], index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-700">{key.split(/(?=[A-Z])/).join(" ")}</span>
                                            <span className="text-sm font-medium text-gray-900">{formatCurrency(value)}</span>
                                        </div>
                                        <Progress
                                            value={(value / estimate.totalCost) * 100}
                                            className="h-2 bg-gray-100"
                                            indicatorClassName="bg-transparent" // Override the default bg-primary
                                            style={{
                                                "--indicator-color": COLORS[index % COLORS.length]
                                            } as React.CSSProperties}
                                            // Add this prop to the Progress component
                                            indicatorStyle={{
                                                backgroundColor: COLORS[index % COLORS.length]
                                            }}
                                        />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="breakdown">
                    <div className="space-y-6">
                        {
                            Object.entries(estimate.breakdown).map(([category, cost], index) => (
                                <Card key={index} className="border-gray-200 shadow-sm overflow-hidden">
                                    <CardHeader className="bg-gray-50 py-3 px-4">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-base font-medium text-gray-900">
                                                {category.split(/(?=[A-Z])/).join(" ")}
                                            </CardTitle>
                                            <span className="font-medium text-blue-600">{formatCurrency(cost)}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        {
                                            estimate.details && estimate.details[category] && (
                                                <div className="space-y-2">
                                                    {
                                                        estimate.details[category].map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                                                            >
                                                                <span className="text-gray-700">{item.description}</span>
                                                                <span className="text-gray-900">{formatCurrency(item.cost)}</span>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </CardContent>
                                </Card>
                            ))
                        }
                        <Card className="border-gray-200 shadow-sm bg-blue-50">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-900">Total Estimated Cost</h3>
                                    <span className="text-xl font-bold text-blue-600">{formatCurrency(estimate.totalCost)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="charts">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-medium text-gray-900">Cost Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                nameKey="name"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {
                                                    chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))
                                                }
                                            </Pie>
                                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-medium text-gray-900">Cost Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis dataKey="name" tick={{ fill: "#6B7280" }} />
                                            <YAxis tickFormatter={(value) => `$${value / 1000}k`} tick={{ fill: "#6B7280" }} />
                                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                            <Bar dataKey="value" fill="#3b82f6">
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start">
                            <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-gray-900 mb-1">Estimation Notes</h4>
                                <p className="text-sm text-gray-700">
                                    This estimate is based on the information provided and industry standards. Actual costs may vary based
                                    on detailed requirements, market conditions, and specific implementation details. We recommend
                                    scheduling a consultation for a more precise estimate.
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}