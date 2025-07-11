import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { verifyOTP } from "@/lib/email";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email, otp, newPassword } = body;

		if (!email || !otp || !newPassword) {
			return NextResponse.json(
				{ message: "Email, OTP, and new password are required" },
				{ status: 400 }
			);
		}

		// Validate password strength
		if (newPassword.length < 8) {
			return NextResponse.json(
				{ message: "Password must be at least 8 characters long" },
				{ status: 400 }
			);
		}

		// Find user by email
		const user = await prisma.user.findUnique({
			where: {
				email: email as string
			},
			select: {
				id: true,
				email: true,
				emailVerified: true,
				resetToken: true,
				resetTokenExpiry: true
			}
		});

		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		if (!user.emailVerified) {
			return NextResponse.json(
				{ message: "Please verify your email first" },
				{ status: 400 }
			);
		}

		// Verify reset OTP
		const isValidOTP = verifyOTP(otp, user.resetToken, user.resetTokenExpiry);

		if (!isValidOTP) {
			return NextResponse.json(
				{ message: "Invalid or expired OTP" },
				{ status: 400 }
			);
		}

		// Hash new password
		const hashedPassword = await bcryptjs.hash(newPassword, 12);

		// Update user with new password and clear reset OTP
		await prisma.user.update({
			where: { id: user.id },
			data: {
				hashedPassword,
				resetToken: null,
				resetTokenExpiry: null
			}
		});

		return NextResponse.json(
			{
				message: "Password reset successfully! You can now sign in with your new password.",
				success: true
			},
			{ status: 200 }
		);

	} catch (error) {
		const err = error as Error;
		console.error("Reset password error:", err.message);
		return NextResponse.json(
			{ message: "An unexpected error occurred. Please try again." },
			{ status: 500 }
		);
	}
} 