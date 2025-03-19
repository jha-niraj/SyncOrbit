import type { EstimateResult } from "@/types"

type ProjectFormData = {
    projectType: string
    projectDescription?: string
    projectGoals?: string[]
    targetAudience?: string
    teamSize?: string
    expectedLaunchDate?: string
    budgetRange?: string
    additionalRequirements: string[]
    customRequirements: string[]
    timeline: string
    complexity: string
    integrationsNeeded?: string
    competitiveAnalysis?: boolean
    maintenancePlan?: boolean
    scalabilityRequirements?: string
    securityRequirements?: string[]
}

// This is a mock implementation - in a real app, you would fetch data from your database
export async function getInHouseEstimate(formData: ProjectFormData): Promise<EstimateResult> {
    // Simulate API call with timeout
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real implementation, this would be fetched from a database
            // For demo purposes, we're using hardcoded values

            // Base costs from historical data
            const historicalCosts = {
                "Web Development": {
                    base: 18000,
                    low: 14000,
                    medium: 18000,
                    high: 28000,
                },
                "Mobile App": {
                    base: 30000,
                    low: 22000,
                    medium: 30000,
                    high: 45000,
                },
                "E-commerce": {
                    base: 35000,
                    low: 25000,
                    medium: 35000,
                    high: 50000,
                },
                "Enterprise Software": {
                    base: 60000,
                    low: 45000,
                    medium: 60000,
                    high: 90000,
                },
                "UI/UX Design": {
                    base: 12000,
                    low: 8000,
                    medium: 12000,
                    high: 18000,
                },
                "Digital Marketing": {
                    base: 9000,
                    low: 6000,
                    medium: 9000,
                    high: 15000,
                },
                Branding: {
                    base: 14000,
                    low: 10000,
                    medium: 14000,
                    high: 20000,
                },
                "Content Creation": {
                    base: 7000,
                    low: 5000,
                    medium: 7000,
                    high: 10000,
                },
                "Video Editing": {
                    base: 8000,
                    low: 5000,
                    medium: 8000,
                    high: 12000,
                },
            }

            // Get base cost for project type and complexity
            const projectTypeData = historicalCosts[formData.projectType as keyof typeof historicalCosts] || {
                base: 20000,
                low: 15000,
                medium: 20000,
                high: 30000,
            }

            const baseCost = projectTypeData[formData.complexity as keyof typeof projectTypeData] || projectTypeData.medium

            // Timeline adjustment
            const timelineAdjustment = {
                "1-3 months": 1.15,
                "3-6 months": 1,
                "6-12 months": 0.9,
                "12+ months": 0.85,
            }

            const timelineMultiplier = timelineAdjustment[formData.timeline as keyof typeof timelineAdjustment] || 1

            // Requirements adjustment
            const requirementsMultiplier =
                1 + formData.additionalRequirements.length * 0.04 + formData.customRequirements.length * 0.06

            // Additional services adjustment
            const additionalServicesMultiplier =
                (formData.competitiveAnalysis ? 0.05 : 0) +
                (formData.maintenancePlan ? 0.1 : 0) +
                (formData.securityRequirements && formData.securityRequirements.length > 0 ? 0.08 : 0)

            // Calculate total cost
            const totalCost = Math.round(
                baseCost * timelineMultiplier * requirementsMultiplier * (1 + additionalServicesMultiplier),
            )

            // Create breakdown based on historical data
            const result: EstimateResult = {
                projectName: `${formData.projectType} Project`,
                projectType: formData.projectType,
                complexity: formData.complexity,
                timeline: formData.timeline,
                additionalRequirements: formData.additionalRequirements,
                customRequirements: formData.customRequirements,
                projectGoals: formData.projectGoals || [],
                targetAudience: formData.targetAudience || "",
                teamSize: formData.teamSize || "",
                budgetRange: formData.budgetRange || "",
                totalCost: totalCost,
                breakdown: {
                    Development: Math.round(totalCost * 0.4),
                    Design: Math.round(totalCost * 0.15),
                    Infrastructure: Math.round(totalCost * 0.15),
                    Testing: Math.round(totalCost * 0.15),
                    Management: Math.round(totalCost * 0.1),
                    Maintenance: Math.round(totalCost * 0.05),
                },
                details: {
                    Development: [
                        { description: "Frontend Implementation", cost: Math.round(totalCost * 0.2) },
                        { description: "Backend Services", cost: Math.round(totalCost * 0.15) },
                        { description: "Integration", cost: Math.round(totalCost * 0.05) },
                    ],
                    Design: [
                        { description: "UI Components", cost: Math.round(totalCost * 0.08) },
                        { description: "UX Flow", cost: Math.round(totalCost * 0.07) },
                    ],
                    Infrastructure: [
                        { description: "Server Setup", cost: Math.round(totalCost * 0.05) },
                        { description: "Database", cost: Math.round(totalCost * 0.05) },
                        { description: "Security", cost: Math.round(totalCost * 0.05) },
                    ],
                    Testing: [
                        { description: "QA Testing", cost: Math.round(totalCost * 0.08) },
                        { description: "User Testing", cost: Math.round(totalCost * 0.04) },
                        { description: "Performance Testing", cost: Math.round(totalCost * 0.03) },
                    ],
                    Management: [
                        { description: "Project Management", cost: Math.round(totalCost * 0.06) },
                        { description: "Client Meetings", cost: Math.round(totalCost * 0.04) },
                    ],
                    Maintenance: [
                        { description: "Support", cost: Math.round(totalCost * 0.03) },
                        { description: "Updates", cost: Math.round(totalCost * 0.02) },
                    ],
                },
            }

            resolve(result)
        }, 1500)
    })
}

