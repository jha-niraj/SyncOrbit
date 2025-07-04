import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generateOTP, generateOTPExpiry, sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
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

        // Generate new OTP
        const newOtp = generateOTP();
        const newOtpExpiry = generateOTPExpiry(10); // 10 minutes

        // Update user with new OTP
        await prisma.user.update({
            where: { id: user.id },
            data: {
                verifyToken: newOtp,
                verifyTokenExpiry: newOtpExpiry
            }
        });

        // Send new verification email
        try {
            await sendVerificationEmail(email, user.name || "", newOtp);
        } catch (emailError) {
            console.error("Failed to resend verification email:", emailError);
            return NextResponse.json(
                { message: "Failed to send verification email. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: "Verification OTP has been resent to your email.",
                success: true
            },
            { status: 200 }
        );

    } catch (error) {
        const err = error as Error;
        console.error("Resend OTP error:", err.message);
        return NextResponse.json(
            { message: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
} 