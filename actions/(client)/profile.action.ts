'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { cloudinary } from "@/lib/cloudinary";
import bcrypt from "bcryptjs";

const updateProfileSchema = z.object({
	name: z.string().min(2).max(50).optional(),
	image: z.string().url().optional(),
	bio: z.string().max(500).optional(),
	skills: z.string().max(200).optional(),
});

const changePasswordSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: z.string().min(6, "New password must be at least 6 characters"),
	confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"],
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

interface CloudinaryUploadResult {
    secure_url: string;
    // Add other properties if needed
}

async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: 'profile-images',
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result as CloudinaryUploadResult);
            }
        ).end(buffer);
    });
}

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

export async function uploadProfileImage(formData: FormData) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const imageFile = formData.get('image') as File;
		
		if (!imageFile) {
			return { success: false, error: "No image file provided" };
		}

		// Validate file type
		if (!imageFile.type.startsWith('image/')) {
			return { success: false, error: "Please select an image file" };
		}

		// Validate file size (5MB limit)
		const maxSize = 5 * 1024 * 1024; // 5MB in bytes
		if (imageFile.size > maxSize) {
			const sizeMB = (imageFile.size / (1024 * 1024)).toFixed(2);
			return { 
				success: false, 
				error: `Image size (${sizeMB}MB) exceeds the 5MB limit. Please choose a smaller image.` 
			};
		}

		const result = await uploadToCloudinary(imageFile);

		// Update user profile with new image URL
		const updatedUser = await prisma.user.update({
			where: { id: session.user.id },
			data: { image: result.secure_url },
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				bio: true,
				skills: true,
			}
		});

		return { success: true, user: updatedUser, imageUrl: result.secure_url };
	} catch (error) {
		console.error('Error uploading profile image:', error);
		return { success: false, error: error instanceof Error ? error.message : "Failed to upload image" };
	}
}

export async function changePassword(data: ChangePasswordInput) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const validatedData = changePasswordSchema.parse(data);

		// Get user's current password
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { hashedPassword: true }
		});

		if (!user?.hashedPassword) {
			return { success: false, error: "No password set for this account" };
		}

		// Verify current password
		const isValidPassword = await bcrypt.compare(validatedData.currentPassword, user.hashedPassword);
		if (!isValidPassword) {
			return { success: false, error: "Current password is incorrect" };
		}

		// Hash new password
		const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12);

		// Update password
		await prisma.user.update({
			where: { id: session.user.id },
			data: { hashedPassword: hashedNewPassword }
		});

		return { success: true, message: "Password changed successfully" };
	} catch (error) {
		console.error('Error changing password:', error);
		if (error instanceof z.ZodError) {
			return { success: false, error: error.errors[0].message };
		}
		return { success: false, error: "Failed to change password" };
	}
}

export async function deleteAccount(confirmationText: string) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Validate confirmation text
		if (confirmationText !== "DELETE") {
			return { success: false, error: "Please type 'DELETE' to confirm account deletion" };
		}

		// Delete user account and all related data
		await prisma.$transaction(async (tx) => {
			// Delete related data first (due to foreign key constraints)
			await tx.feedback.deleteMany({ where: { userId: session.user.id } });
			await tx.message.deleteMany({ where: { userId: session.user.id } });
			await tx.task.updateMany({ 
				where: { assignedDeveloperId: session.user.id },
				data: { assignedDeveloperId: null }
			});
			await tx.project.deleteMany({ where: { userId: session.user.id } });
			await tx.session.deleteMany({ where: { userId: session.user.id } });
			await tx.account.deleteMany({ where: { userId: session.user.id } });
			
			// Finally delete the user
			await tx.user.delete({ where: { id: session.user.id } });
		});

		return { success: true, message: "Account deleted successfully" };
	} catch (error) {
		console.error('Error deleting account:', error);
		return { success: false, error: "Failed to delete account" };
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
				bio: true,
				skills: true,
				role: true,
				totalSpent: true,
				projects: {
					select: {
						id: true,
						title: true,
						status: true,
						slug: true,
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