"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

interface UpdateProfileData {
    name: string
    bio?: string
}

export async function updateProfile(data: UpdateProfileData) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { success: false, error: "Authentication required" }
        }

        const { name, bio } = data

        if (!name || name.trim().length === 0) {
            return { success: false, error: "Name is required" }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                bio
            }
        })

        revalidatePath("/profile")
        return { success: true, message: "Profile updated successfully" }
    } catch (error) {
        console.error("Error updating profile:", error)
        return { success: false, error: "Failed to update profile" }
    }
}
