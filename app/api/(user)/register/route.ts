import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { RequestBody } from "@/types";
import { generateOTP, generateOTPExpiry, sendVerificationEmail } from "@/lib/email";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
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

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { message: "Password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return NextResponse.json({ 
                message: "User already exists with this email" 
            }, { status: 409 });
        }

        const hashedPassword = await bcryptjs.hash(password, 12);

        // Generate OTP for email verification
        const otp = generateOTP();
        const otpExpiry = generateOTPExpiry(10); // 10 minutes

        const user = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
                verifyToken: otp,
                verifyTokenExpiry: otpExpiry,
                role: 'CLIENT'
            }
        });

        // Send verification email
        try {
            await sendVerificationEmail(email, name, otp);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // Delete the user if email sending fails
            await prisma.user.delete({
                where: { id: user.id }
            });
            return NextResponse.json(
                { message: "Failed to send verification email. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
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
            message: "An unexpected error occurred. Please try again." 
        }, { status: 500 });
    }
}