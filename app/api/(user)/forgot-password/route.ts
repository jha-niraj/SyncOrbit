import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generateOTP, generateOTPExpiry, sendPasswordResetEmail } from "@/lib/email";

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

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ message: "Invalid email format" },
				{ status: 400 }
			);
		}

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email }
		});

		if (!user) {
			// Don't reveal that user doesn't exist for security
			return NextResponse.json(
				{
					message: "If an account with this email exists, you will receive a password reset OTP.",
					success: true
				},
				{ status: 200 }
			);
		}

		if (!user.emailVerified) {
			return NextResponse.json(
				{ message: "Please verify your email first before resetting password." },
				{ status: 400 }
			);
		}

		// Generate reset OTP
		const resetOtp = generateOTP();
		const resetOtpExpiry = generateOTPExpiry(15); // 15 minutes for password reset

		// Update user with reset OTP
		await prisma.user.update({
			where: { id: user.id },
			data: {
				resetToken: resetOtp,
				resetTokenExpiry: resetOtpExpiry
			}
		});

		// Send password reset email
		try {
			await sendPasswordResetEmail(email, user.name || "", resetOtp);
		} catch (emailError) {
			console.error("Failed to send password reset email:", emailError);
			return NextResponse.json(
				{ message: "Failed to send password reset email. Please try again." },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{
				message: "Password reset OTP has been sent to your email.",
				success: true
			},
			{ status: 200 }
		);

	} catch (error) {
		const err = error as Error;
		console.error("Forgot password error:", err.message);
		return NextResponse.json(
			{ message: "An unexpected error occurred. Please try again." },
			{ status: 500 }
		);
	}
} 