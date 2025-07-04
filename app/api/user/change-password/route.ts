import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { hashedPassword: true }
        });

        if (!user?.hashedPassword) {
            return NextResponse.json(
                { error: "No password set for this account" },
                { status: 400 }
            );
        }

        const isValid = await bcryptjs.compare(currentPassword, user.hashedPassword);
        if (!isValid) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 400 }
            );
        }

        const hashedNewPassword = await bcryptjs.hash(newPassword, 12);
        await prisma.user.update({
            where: { id: session.user.id },
            data: { hashedPassword: hashedNewPassword }
        });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Password change error:", error);
        return NextResponse.json(
            { error: "Failed to change password" },
            { status: 500 }
        );
    }
} 