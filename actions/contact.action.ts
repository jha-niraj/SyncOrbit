"use server"

import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Contact form validation schema
const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContactForm(formData: ContactFormData) {
    console.log("Received form data:", formData); // Debug log

    try {
        // Validate form data
        const validatedData = contactSchema.safeParse(formData);

        if (!validatedData.success) {
            console.log("Validation failed:", validatedData.error); // Debug log
            return {
                success: false,
                message: "Validation failed",
                errors: validatedData.error.errors,
            };
        }

        // Create contact record
        const contact = await prisma.contact.create({
            data: {
                name: validatedData.data.name,
                email: validatedData.data.email,
                inquiryType: "GENERAL",
                message: validatedData.data.message,
            },
        });

        console.log("Contact created:", contact); // Debug log

        return {
            success: true,
            message: "Thank you for your message. We'll get back to you soon!",
            data: contact,
        };
    } catch (error) {
        console.error("Server error in submitContactForm:", error); // Debug log
        
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: "Validation failed",
                errors: error.errors,
            };
        }

        return {
            success: false,
            message: "Something went wrong. Please try again later.",
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
} 