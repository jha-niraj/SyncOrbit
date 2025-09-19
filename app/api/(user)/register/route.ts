import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { RequestBody } from "@/types";
import { generateOTP, generateOTPExpiry, sendVerificationEmail } from "@/lib/email";
import { Role } from "@prisma/client";
import { createCompany } from "@/actions/(productmanager)/pm.action";

export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json();
        const { name, email, password, role, companyName, companyShortName, referralCode, companyId } = body;

        console.log(name, email, password, role, companyName, companyShortName, referralCode, companyId);

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: "Invalid email format" },
                { status: 401 }
            );
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 8 characters long" },
                { status: 402 }
            );
        }

        // Validate role if provided
        const validRoles = [Role.CLIENT, Role.TEAM_MEMBER, Role.TEAM_HEAD, Role.COMPANY_OWNER, Role.ADMIN];
        let userRole: Role = role && validRoles.includes(role as Role) ? role as Role : Role.CLIENT;
        let companyIdToUse = companyId;

        // Validate referral code if provided
        let referralCodeData = null;
        if (referralCode) {
            try {
                const referralCodeRecord = await prisma.referralCode.findUnique({
                    where: { code: referralCode },
                    include: { company: true }
                });

                if (!referralCodeRecord) {
                    return NextResponse.json(
                        { success: false, error: "Invalid referral code" },
                        { status: 404 }
                    );
                }

                if (referralCodeRecord.status !== "ACTIVE") {
                    return NextResponse.json(
                        { success: false, error: "Referral code is not active" },
                        { status: 405 }
                    );
                }

                if (referralCodeRecord.expiresAt && new Date() > referralCodeRecord.expiresAt) {
                    return NextResponse.json(
                        { success: false, error: "Referral code has expired" },
                        { status: 406 }
                    );
                }

                if (referralCodeRecord.usedCount >= referralCodeRecord.maxUses) {
                    return NextResponse.json(
                        { success: false, error: "Referral code has reached maximum uses" },
                        { status: 407 }
                    );
                }

                // Use the role from the referral code
                userRole = referralCodeRecord.role;
                companyIdToUse = referralCodeRecord.companyId!;
                referralCodeData = referralCodeRecord;
            } catch (error) {
                console.error("Referral code validation error:", error);
                return NextResponse.json(
                    { success: false, error: "Failed to validate referral code" },
                    { status: 500 }
                );
            }
        }

        // Special validation for COMPANY_OWNER
        if (userRole === Role.COMPANY_OWNER) {
            if (!companyName || !companyShortName) {
                return NextResponse.json(
                    { success: false, error: "Company name and short name are required for Product Manager registration" },
                    { status: 408 }
                );
            }
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return NextResponse.json({ 
                success: false, 
                error: "User already exists with this email" 
            }, { status: 409 });
        }

        const hashedPassword = await bcryptjs.hash(password, 12);

        // Generate OTP for email verification
        const otp = generateOTP();
        const otpExpiry = generateOTPExpiry(10); // 10 minutes

        const userData = {
            name,
            email,
            hashedPassword,
            verifyToken: otp,
            verifyTokenExpiry: otpExpiry,
            role: userRole,
            ...(referralCode && { referralCode }),
            ...(companyIdToUse && { companyId: companyIdToUse })
        };

        // Create user first
        const user = await prisma.user.create({
            data: userData
        });

        // Update referral code usage if one was used
        if (referralCodeData) {
            try {
                await prisma.referralCode.update({
                    where: { id: referralCodeData.id },
                    data: {
                        usedCount: { increment: 1 },
                        // Mark as USED if reached max uses
                        status: referralCodeData.usedCount + 1 >= referralCodeData.maxUses ? "USED" : "ACTIVE",
                        // Connect user to referral code
                        usedBy: {
                            connect: { id: user.id }
                        }
                    }
                });

                // Also update the user with the referral code relation
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        usedReferralCodeId: referralCodeData.id
                    }
                });
            } catch (referralError) {
                console.error("Failed to update referral code usage:", referralError);
                // Note: We don't fail the registration for this, just log the error
            }
        }

        // Handle company creation for Company Owner
        if (userRole === Role.COMPANY_OWNER && companyName && companyShortName) {
            try {
                const companyResult = await createCompany(
                    {
                        name: companyName,
                        shortName: companyShortName,
                    },
                    user.id
                );

                if (!companyResult.success) {
                    // Delete the user if company creation fails
                    await prisma.user.delete({
                        where: { id: user.id }
                    });
                    return NextResponse.json(
                        { success: false, error: companyResult.error },
                        { status: 409 }
                    );
                }
            } catch (companyError) {
                console.error("Company creation error:", companyError);
                // Delete the user if company creation fails
                await prisma.user.delete({
                    where: { id: user.id }
                });
                return NextResponse.json(
                    { success: false, error: "Failed to create company. Please try again." },
                    { status: 500 }
                );
            }
        }

        try {
            await sendVerificationEmail(email, name, otp);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // Delete the user if email sending fails
            await prisma.user.delete({
                where: { id: user.id }
            });
            return NextResponse.json(
                { success: false, error: "Failed to send verification email. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully. Please check your email for verification OTP.",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        const err = error as Error;
        console.error("Registration error:", err.message);
        return NextResponse.json({ 
            success: false, 
            error: "An unexpected error occurred. Please try again." 
        }, { status: 500 });
    }
}