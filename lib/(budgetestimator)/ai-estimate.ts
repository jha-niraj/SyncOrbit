"use client"
import type { EstimateResult } from "@/types"

type ProjectFormData = {
	projectType: string
	projectDescription: string
	projectGoals: string[]
	targetAudience: string
	teamSize: string
	expectedLaunchDate: string
	budgetRange: string
	additionalRequirements: string[]
	timeline: string
	complexity: string
	customRequirements: string[]
	integrationsNeeded: string
	competitiveAnalysis: boolean
	maintenancePlan: boolean
	scalabilityRequirements: string
	securityRequirements: string[]
}
// This is a mock implementation - in a real app, you would use the AI SDK to generate estimates
export async function generateAIEstimate(formData: ProjectFormData): Promise<EstimateResult> {
	// In a real implementation, you would use the AI SDK to generate the estimate
	// For demo purposes, we're simulating an API call with a timeout

	return new Promise((resolve) => {
		setTimeout(() => {
			// Generate a base cost based on project type
			let baseCost = 0
			switch (formData.projectType) {
				case "Web Development":
					baseCost = 18000
					break
				case "Mobile App":
					baseCost = 30000
					break
				case "E-commerce":
					baseCost = 35000
					break
				case "Enterprise Software":
					baseCost = 60000
					break
				case "UI/UX Design":
					baseCost = 12000
					break
				case "Digital Marketing":
					baseCost = 9000
					break
				case "Branding":
					baseCost = 14000
					break
				case "Content Creation":
					baseCost = 7000
					break
				case "Video Editing":
					baseCost = 8000
					break
				default:
					baseCost = 20000
			}

			// Adjust for complexity
			const complexityMultiplier = formData.complexity === "low" ? 0.8 : formData.complexity === "high" ? 1.5 : 1

			// Adjust for timeline
			const timelineMultiplier =
				formData.timeline === "1-3 months"
					? 1.2
					: formData.timeline === "6-12 months"
						? 0.9
						: formData.timeline === "12+ months"
							? 0.8
							: 1

			// Adjust for additional requirements
			const requirementsMultiplier =
				1 + formData.additionalRequirements.length * 0.05 + formData.customRequirements.length * 0.07

			// Adjust for project description (more detailed = more accurate)
			const descriptionMultiplier = formData.projectDescription.length > 200 ? 1.1 : 1

			// Adjust for security requirements
			const securityMultiplier = 1 + formData.securityRequirements.length * 0.03

			// Adjust for additional services
			const additionalServicesMultiplier =
				(formData.competitiveAnalysis ? 0.05 : 0) +
				(formData.maintenancePlan ? 0.1 : 0) +
				(formData.integrationsNeeded.length > 10 ? 0.08 : 0) +
				(formData.scalabilityRequirements.length > 10 ? 0.07 : 0)

			// Calculate total cost
			const adjustedCost =
				baseCost *
				complexityMultiplier *
				timelineMultiplier *
				requirementsMultiplier *
				descriptionMultiplier *
				securityMultiplier *
				(1 + additionalServicesMultiplier)

			// Create breakdown
			const developmentCost = adjustedCost * 0.35
			const designCost = adjustedCost * 0.2
			const infrastructureCost = adjustedCost * 0.15
			const testingCost = adjustedCost * 0.15
			const managementCost = adjustedCost * 0.1
			const maintenanceCost = adjustedCost * 0.05

			// Create result object
			const result: EstimateResult = {
				projectName: `${formData.projectType} Project`,
				projectType: formData.projectType,
				complexity: formData.complexity,
				timeline: formData.timeline,
				additionalRequirements: formData.additionalRequirements,
				customRequirements: formData.customRequirements,
				projectGoals: formData.projectGoals,
				targetAudience: formData.targetAudience,
				teamSize: formData.teamSize,
				budgetRange: formData.budgetRange,
				totalCost: Math.round(adjustedCost),
				breakdown: {
					Development: Math.round(developmentCost),
					Design: Math.round(designCost),
					Infrastructure: Math.round(infrastructureCost),
					Testing: Math.round(testingCost),
					Management: Math.round(managementCost),
					Maintenance: Math.round(maintenanceCost),
				},
				details: {
					Development: [
						{ description: "Frontend Development", cost: Math.round(developmentCost * 0.4) },
						{ description: "Backend Development", cost: Math.round(developmentCost * 0.3) },
						{ description: "API Integration", cost: Math.round(developmentCost * 0.2) },
						{ description: "Third-party Services", cost: Math.round(developmentCost * 0.1) },
					],
					Design: [
						{ description: "UI Design", cost: Math.round(designCost * 0.5) },
						{ description: "UX Research", cost: Math.round(designCost * 0.3) },
						{ description: "Prototyping", cost: Math.round(designCost * 0.2) },
					],
					Infrastructure: [
						{ description: "Hosting Setup", cost: Math.round(infrastructureCost * 0.3) },
						{ description: "Database Configuration", cost: Math.round(infrastructureCost * 0.3) },
						{ description: "Security Implementation", cost: Math.round(infrastructureCost * 0.2) },
						{ description: "DevOps", cost: Math.round(infrastructureCost * 0.2) },
					],
					Testing: [
						{ description: "Quality Assurance", cost: Math.round(testingCost * 0.4) },
						{ description: "User Testing", cost: Math.round(testingCost * 0.3) },
						{ description: "Performance Testing", cost: Math.round(testingCost * 0.2) },
						{ description: "Security Testing", cost: Math.round(testingCost * 0.1) },
					],
					Management: [
						{ description: "Project Management", cost: Math.round(managementCost * 0.6) },
						{ description: "Client Communication", cost: Math.round(managementCost * 0.2) },
						{ description: "Documentation", cost: Math.round(managementCost * 0.2) },
					],
					Maintenance: [
						{ description: "Post-launch Support", cost: Math.round(maintenanceCost * 0.5) },
						{ description: "Updates & Patches", cost: Math.round(maintenanceCost * 0.3) },
						{ description: "Performance Monitoring", cost: Math.round(maintenanceCost * 0.2) },
					],
				},
			}

			resolve(result)
		}, 2000) // Simulate API delay
	})
}

