import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const updates = await req.json();
		const allowedUpdates = ["name", "image", "coverImage"];
		const filteredUpdates = Object.keys(updates)
			.filter(key => allowedUpdates.includes(key))
			.reduce((obj, key) => {
				obj[key] = updates[key];
				return obj;
			}, {} as Record<string, unknown>);

		const updatedUser = await prisma.user.update({
			where: { id: session.user.id },
			data: filteredUpdates,
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				coverImage: true,
				role: true,
				createdAt: true,
				totalSpent: true
			}
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		console.error("User update error:", error);
		return NextResponse.json(
			{ error: "Failed to update user" },
			{ status: 500 }
		);
	}
} 