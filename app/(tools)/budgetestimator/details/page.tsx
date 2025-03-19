"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import BudgetEstimator from "../_components/budget-estimator"

export default function EstimatorPage() {
    const searchParams = useSearchParams()
    const projectType = searchParams.get("type") || ""
    const [pageTitle, setPageTitle] = useState("Project Budget Estimator")

    useEffect(() => {
        if (projectType) {
            setPageTitle(`${projectType} Budget Estimator`)
            document.title = `${projectType} Budget Estimator | BudgetPro`
        }
    }, [projectType])

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </Link>

                <h1 className="text-3xl font-bold mb-2 text-gray-900">{pageTitle}</h1>
                <p className="text-gray-600 mb-8">Fill in your project details to get an accurate budget estimate</p>

                <BudgetEstimator initialProjectType={projectType} />
            </div>
        </div>
    )
}

