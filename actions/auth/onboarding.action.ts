"use server"

import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"

interface OnboardingData {
    email: string
    name: string
    image?: string
    role: "CLIENT" | "DEVELOPER" | "PRODUCTMANAGER"
    referralCode?: string
    companyName?: string
    companyEmail?: string
}

export async function completeOnboarding(data: OnboardingData) {
    try {
        const { email, name, image, role, referralCode, companyName, companyEmail } = data

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            // User already exists, just update their profile if needed
            const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                    name,
                    image,
                    role: role as Role,
                    companyEmail,
                    referralCode
                }
            })

            return {
                success: true,
                user: updatedUser
            }
        }

        // Validate referral code if provided
        let referralCodeRecord = null
        let companyId = null

        if (referralCode) {
            referralCodeRecord = await prisma.referralCode.findUnique({
                where: { 
                    code: referralCode,
                    status: "ACTIVE"
                },
                include: { company: true }
            })

            if (!referralCodeRecord) {
                throw new Error("Invalid or expired referral code")
            }

            // Check if referral code matches the role
            if (referralCodeRecord.role !== role) {
                throw new Error(`This referral code is for ${referralCodeRecord.role} role, but you selected ${role}`)
            }

            // Check if referral code has usage limit
            if (referralCodeRecord.usedCount >= referralCodeRecord.maxUses) {
                throw new Error("This referral code has reached its usage limit")
            }

            // Check expiration
            if (referralCodeRecord.expiresAt && new Date() > referralCodeRecord.expiresAt) {
                throw new Error("This referral code has expired")
            }

            companyId = referralCodeRecord.companyId
        }

        // Handle company creation for Product Manager
        let tempCompanyId = null
        if (role === "PRODUCTMANAGER" && companyName) {
            if (!companyId) {
                // Create a short name from company name
                const shortName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10) + Math.random().toString(36).substring(2, 6)
                
                // We'll create the company after creating the user
                tempCompanyId = shortName
            }
        }

        // Create the user
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                image,
                role: role as Role,
                companyId,
                companyEmail,
                referralCode,
                usedReferralCodeId: referralCodeRecord?.id,
                emailVerified: new Date() // Mark as verified since they used Google auth
            }
        })

        // Update referral code usage if used
        if (referralCodeRecord) {
            await prisma.referralCode.update({
                where: { id: referralCodeRecord.id },
                data: {
                    usedCount: {
                        increment: 1
                    }
                }
            })
        }

        // Create company for PM after user is created
        if (role === "PRODUCTMANAGER" && tempCompanyId && companyName) {
            const newCompany = await prisma.company.create({
                data: {
                    name: companyName,
                    shortName: tempCompanyId,
                    devReferralCode: `dev_${tempCompanyId}_${Math.random().toString(36).substring(2, 8)}`,
                    clientReferralCode: `client_${tempCompanyId}_${Math.random().toString(36).substring(2, 8)}`,
                    productManagerId: newUser.id
                }
            })

            // Update user with company ID
            await prisma.user.update({
                where: { id: newUser.id },
                data: {
                    companyId: newCompany.id
                }
            })
        }

        return {
            success: true,
            user: newUser
        }
    } catch (error) {
        console.error("Complete onboarding error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to complete onboarding"
        }
    }
}
