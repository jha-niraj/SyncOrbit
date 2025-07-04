import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyOTP, sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json(
                { message: "Email and OTP are required" },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (user.emailVerified) {
            return NextResponse.json(
                { message: "Email is already verified" },
                { status: 400 }
            );
        }

        // Verify OTP
        const isValidOTP = verifyOTP(otp, user.verifyToken, user.verifyTokenExpiry);

        if (!isValidOTP) {
            return NextResponse.json(
                { message: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        // Update user as verified and clear OTP fields
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verifyToken: null,
                verifyTokenExpiry: null
            }
        });

        // Send welcome email
        try {
            await sendWelcomeEmail(email, user.name || "");
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
            // Don't fail the verification if welcome email fails
        }

        return NextResponse.json(
            {
                message: "Email verified successfully! Welcome to ShunyaTech.",
                success: true
            },
            { status: 200 }
        );

    } catch (error) {
        const err = error as Error;
        console.error("Email verification error:", err.message);
        return NextResponse.json(
            { message: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
} 