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
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        // Validate role if provided
        const validRoles = ['CLIENT', 'DEVELOPER', 'PRODUCTMANAGER', 'ADMIN'];
        const userRole = role && validRoles.includes(role) ? role : 'CLIENT';

        // Special validation for PRODUCTMANAGER
        if (userRole === 'PRODUCTMANAGER') {
            if (!companyName || !companyShortName) {
                return NextResponse.json(
                    { success: false, error: "Company name and short name are required for Product Manager registration" },
                    { status: 400 }
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
            role: userRole as Role,
            ...(referralCode && { referralCode }),
            ...(companyId && { companyId })
        };

        // Create user first
        const user = await prisma.user.create({
            data: userData
        });

        // Handle company creation for Product Manager
        if (userRole === 'PRODUCTMANAGER' && companyName && companyShortName) {
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
                        { status: 400 }
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