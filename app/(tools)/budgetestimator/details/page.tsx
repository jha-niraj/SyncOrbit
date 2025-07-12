"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
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
        <div className="min-h-screen py-20 max-w-7xl mx-auto">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-2 text-white">{pageTitle}</h1>
                <p className="text-gray-200 mb-8">Fill in your project details to get an accurate budget estimate</p>
                <BudgetEstimator initialProjectType={projectType} />
            </div>
        </div>
    )
}