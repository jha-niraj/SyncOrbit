'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const updateProfileSchema = z.object({
	name: z.string().min(2).max(50).optional(),
	image: z.string().url().optional(),
	coverImage: z.string().url().optional(),
	bio: z.string().max(500).optional(),
	skills: z.string().max(200).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export async function updateProfile(data: UpdateProfileInput) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const validatedData = updateProfileSchema.parse(data);

		const updatedUser = await prisma.user.update({
			where: { id: session.user.id },
			data: validatedData,
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				coverImage: true,
				bio: true,
				skills: true,
			}
		});

		return { success: true, user: updatedUser };
	} catch (error) {
		console.error('Error updating profile:', error);
		if (error instanceof z.ZodError) {
			return { success: false, error: "Invalid input data" };
		}
		return { success: false, error: "Failed to update profile" };
	}
}

export async function getProfile() {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				coverImage: true,
				bio: true,
				skills: true,
				role: true,
				totalSpent: true,
				projects: {
					select: {
						id: true,
						title: true,
						status: true,
					}
				}
			}
		});

		if (!user) {
			throw new Error("User not found");
		}

		return { success: true, user };
	} catch (error) {
		console.error('Error fetching profile:', error);
		return { success: false, error: "Failed to fetch profile" };
	}
} 