"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { TaskStatus } from "@prisma/client"
import { cloudinary } from "@/lib/cloudinary"

// Generate unique referral codes
function generateReferralCode(companyShortName: string, suffix: string): string {
	const timestamp = Date.now().toString(36)
	const random = Math.random().toString(36).substr(2, 5)
	return `${timestamp}${random}${companyShortName}${suffix}`.toLowerCase()
}

// Cloudinary upload interface
interface CloudinaryUploadResult {
	secure_url: string;
}

async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	return new Promise<CloudinaryUploadResult>((resolve, reject) => {
		cloudinary.uploader.upload_stream(
			{
				folder: 'company-logos',
				resource_type: 'auto'
			},
			(error, result) => {
				if (error) reject(error);
				else resolve(result as CloudinaryUploadResult);
			}
		).end(buffer);
	});
}

// Schema for company registration
const createCompanySchema = z.object({
	name: z.string().min(1, "Company name is required").max(100),
	shortName: z.string().min(1, "Short name is required").max(20).regex(/^[a-zA-Z0-9]+$/, "Only alphanumeric characters allowed"),
})

// Create company during PM registration
export async function createCompany(data: z.infer<typeof createCompanySchema>, productManagerId: string) {
	try {
		const validatedData = createCompanySchema.parse(data)

		// Check if company name or short name already exists
		const existingCompany = await prisma.company.findFirst({
			where: {
				OR: [
					{ name: validatedData.name },
					{ shortName: validatedData.shortName }
				]
			}
		})

		if (existingCompany) {
			return { 
				success: false, 
				error: existingCompany.name === validatedData.name ? "Company name already exists" : "Short name already exists"
			}
		}

		// Generate referral codes
		const devReferralCode = generateReferralCode(validatedData.shortName, "dev")
		const clientReferralCode = generateReferralCode(validatedData.shortName, "client")

		const company = await prisma.company.create({
			data: {
				name: validatedData.name,
				shortName: validatedData.shortName,
				devReferralCode,
				clientReferralCode,
				productManagerId,
			},
			include: {
				productManager: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					}
				}
			}
		})

		// Update the PM user with company reference
		await prisma.user.update({
			where: { id: productManagerId },
			data: { companyId: company.id }
		})

		return { success: true, company }
	} catch (error) {
		console.error("Create company error:", error)
		if (error instanceof z.ZodError) {
			return { success: false, error: "Invalid company data" }
		}
		return { success: false, error: "Failed to create company" }
	}
}

// Get company by referral code
export async function getCompanyByReferralCode(referralCode: string) {
	try {
		const company = await prisma.company.findFirst({
			where: {
				OR: [
					{ devReferralCode: referralCode },
					{ clientReferralCode: referralCode }
				]
			},
			select: {
				id: true,
				name: true,
				shortName: true,
				devReferralCode: true,
				clientReferralCode: true,
			}
		})

		if (!company) {
			return { success: false, error: "Invalid referral code" }
		}

		return { success: true, company }
	} catch (error) {
		console.error("Get company by referral code error:", error)
		return { success: false, error: "Failed to validate referral code" }
	}
}

// Get PM dashboard data
export async function getPMDashboardData() {
	try {
		const session = await auth()
		if (!session?.user?.id || session.user.role !== 'PRODUCTMANAGER') {
			return { success: false, error: "Unauthorized" }
		}

		const company = await prisma.company.findFirst({
			where: { productManagerId: session.user.id },
			include: {
				users: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
						role: true,
						createdAt: true,
						assignedTasks: {
							select: {
								id: true,
								title: true,
								status: true,
								createdAt: true,
								project: {
									select: {
										id: true,
										title: true,
										slug: true,
									}
								}
							}
						}
					},
					where: {
						role: { in: ['DEVELOPER', 'CLIENT'] }
					}
				},
				productManager: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					}
				}
			}
		})

		if (!company) {
			return { success: false, error: "Company not found" }
		}

		// Get all projects for the company
		const projects = await prisma.project.findMany({
			where: {
				user: {
					companyId: company.id
				}
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					}
				},
				tasks: {
					include: {
						assignedDeveloper: {
							select: {
								id: true,
								name: true,
								image: true,
							}
						},
						subtasks: true,
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		// Calculate statistics
		const totalProjects = projects.length
		const completedProjects = projects.filter(p => p.status === 'COMPLETED').length
		const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length
		const totalRevenue = projects.reduce((sum, p) => sum + p.budget, 0)
		const paidAmount = projects.reduce((sum, p) => sum + p.paidAmount, 0)
		const pendingAmount = totalRevenue - paidAmount

		const developers = company.users.filter((u: any) => u.role === 'DEVELOPER')
		const clients = company.users.filter((u: any) => u.role === 'CLIENT')

		// Calculate developer statistics
		const developerStats = developers.map((dev: any) => {
			const tasks = dev.assignedTasks
			const completedTasks = tasks.filter((t: any) => t.status === TaskStatus.COMPLETED).length
			const inProgressTasks = tasks.filter((t: any) => t.status === TaskStatus.IN_PROGRESS).length
			const totalTasks = tasks.length

			return {
				...dev,
				taskStats: {
					total: totalTasks,
					completed: completedTasks,
					inProgress: inProgressTasks,
					completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
				}
			}
		})

		return {
			success: true,
			data: {
				company,
				projects,
				statistics: {
					totalProjects,
					completedProjects,
					activeProjects,
					totalRevenue,
					paidAmount,
					pendingAmount,
					developersCount: developers.length,
					clientsCount: clients.length,
				},
				developers: developerStats,
				clients,
			}
		}
	} catch (error) {
		console.error("Get PM dashboard data error:", error)
		return { success: false, error: "Failed to fetch dashboard data" }
	}
}

// Get PM profile data
export async function getPMProfile() {
	try {
		const session = await auth()
		if (!session?.user?.id || session.user.role !== 'PRODUCTMANAGER') {
			return { success: false, error: "Unauthorized" }
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			include: {
				managedCompany: {
					select: {
						id: true,
						name: true,
						shortName: true,
						devReferralCode: true,
						clientReferralCode: true,
						createdAt: true,
						users: {
							select: {
								id: true,
								name: true,
								email: true,
								role: true,
								createdAt: true,
							}
						}
					}
				}
			}
		})

		if (!user) {
			return { success: false, error: "User not found" }
		}

		return { success: true, user }
	} catch (error) {
		console.error("Get PM profile error:", error)
		return { success: false, error: "Failed to fetch profile data" }
	}
}

// Update PM profile
const updatePMProfileSchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	bio: z.string().max(500).optional(),
	image: z.string().url().optional(),
	companyName: z.string().min(1, "Company name is required").max(100).optional(),
	companyLogo: z.string().url().optional(),
})

export async function updatePMProfile(data: z.infer<typeof updatePMProfileSchema>) {
	try {
		const session = await auth()
		if (!session?.user?.id || session.user.role !== 'PRODUCTMANAGER') {
			return { success: false, error: "Unauthorized" }
		}

		const validatedData = updatePMProfileSchema.parse(data)

		// Update user profile
		const user = await prisma.user.update({
			where: { id: session.user.id },
			data: {
				name: validatedData.name,
				bio: validatedData.bio,
				image: validatedData.image,
			},
			include: {
				managedCompany: {
					select: {
						id: true,
						name: true,
						shortName: true,
						devReferralCode: true,
						clientReferralCode: true,
					}
				}
			}
		})

		// Update company information if provided
		if (user.managedCompany && (validatedData.companyName || validatedData.companyLogo)) {
			await prisma.company.update({
				where: { id: user.managedCompany.id },
				data: {
					...(validatedData.companyName && { name: validatedData.companyName }),
					...(validatedData.companyLogo && { logo: validatedData.companyLogo }),
				}
			})
		}

		revalidatePath('/profile')
		return { success: true, user }
	} catch (error) {
		console.error("Update PM profile error:", error)
		if (error instanceof z.ZodError) {
			return { success: false, error: "Invalid profile data" }
		}
		return { success: false, error: "Failed to update profile" }
	}
}

// Upload company logo
export async function uploadCompanyLogo(formData: FormData) {
	try {
		const session = await auth()
		if (!session?.user?.id || session.user.role !== 'PRODUCTMANAGER') {
			return { success: false, error: "Unauthorized" }
		}

		const imageFile = formData.get('logo') as File;
		
		if (!imageFile) {
			return { success: false, error: "No logo file provided" }
		}

		// Validate file type
		if (!imageFile.type.startsWith('image/')) {
			return { success: false, error: "Please select an image file" }
		}

		// Validate file size (max 5MB)
		if (imageFile.size > 5 * 1024 * 1024) {
			return { success: false, error: "Logo file must be less than 5MB" }
		}

		const result = await uploadToCloudinary(imageFile);
		
		return { success: true, logoUrl: result.secure_url };
	} catch (error) {
		console.error("Upload company logo error:", error);
		return { success: false, error: "Failed to upload logo" };
	}
}

// Register user with referral code
export async function registerWithReferralCode(
	userData: {
		name: string
		email: string
		password: string
		role: 'DEVELOPER' | 'CLIENT'
	},
	referralCode: string
) {
	try {
		// Get company by referral code
		const companyResult = await getCompanyByReferralCode(referralCode)
		if (!companyResult.success || !companyResult.company) {
			return { success: false, error: "Invalid referral code" }
		}

		const company = companyResult.company
		
		// Validate referral code type matches role
		const isDevReferral = company.devReferralCode === referralCode
		const isClientReferral = company.clientReferralCode === referralCode

		if (userData.role === 'DEVELOPER' && !isDevReferral) {
			return { success: false, error: "Invalid referral code for developer registration" }
		}

		if (userData.role === 'CLIENT' && !isClientReferral) {
			return { success: false, error: "Invalid referral code for client registration" }
		}

		// Return success with company info for further processing
		return { 
			success: true, 
			company: {
				id: company.id,
				name: company.name,
				shortName: company.shortName,
			},
			referralCode 
		}
	} catch (error) {
		console.error("Register with referral code error:", error)
		return { success: false, error: "Failed to validate referral code" }
	}
}
