"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, ArrowRight } from "lucide-react"

export function PMSetupView() {
    return (
        <div className="min-h-screen bg-gradient-to-bl dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
            <div className="max-w-2xl mx-auto p-8 text-center">
                <Card className="bg-white dark:bg-gray-800 shadow-xl">
                    <CardHeader className="pb-6">
                        <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            Welcome, Product Manager!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Your company profile is being set up. Please complete your profile setup to access the full dashboard.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/profile">
                                <Button size="lg" className="w-full sm:w-auto">
                                    <Users className="mr-2 h-5 w-5" />
                                    Complete Profile Setup
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
