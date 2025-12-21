"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/actions/shared/upload.action";
import { revalidatePath } from "next/cache";

export async function uploadDocument(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Authentication required" };
        }

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const file = formData.get("file") as File;
        const extractedText = formData.get("extractedText") as string;

        // 1. Upload to Cloudinary
        const uploadResult = await uploadImageToCloudinary(formData);
        if (!uploadResult.success || !uploadResult.url) {
            return { success: false, error: uploadResult.message || "Failed to upload file" };
        }

        // 2. Get User's Company
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { ownedCompany: { select: { id: true } }, companyId: true }
        });

        const companyId = user?.ownedCompany?.id || user?.companyId;
        if (!companyId) {
            return { success: false, error: "Company not found" };
        }

        // 3. Save Document
        const document = await prisma.document.create({
            data: {
                title,
                description,
                fileUrl: uploadResult.url,
                fileType: file.type,
                size: file.size,
                companyId,
                uploaderId: session.user.id,
                extractedText
            }
        });

        // 4. Update Knowledge Base
        if (extractedText) {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            const existingKB = await prisma.knowledgeBase.findUnique({
                where: {
                    companyId_date: {
                        companyId,
                        date: today
                    }
                }
            });

            if (existingKB) {
                await prisma.knowledgeBase.update({
                    where: { id: existingKB.id },
                    data: {
                        content: existingKB.content + "\n\n" + `Title: ${title}\n` + extractedText
                    }
                });
            } else {
                await prisma.knowledgeBase.create({
                    data: {
                        companyId,
                        date: today,
                        content: `Title: ${title}\n` + extractedText
                    }
                });
            }
        }

        revalidatePath("/tools/documents");
        return { success: true, document };

    } catch (error) {
        console.error("Error uploading document:", error);
        return { success: false, error: "Failed to upload document" };
    }
}

export async function getDocuments() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Authentication required" };

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { ownedCompany: { select: { id: true } }, companyId: true }
        });

        const companyId = user?.ownedCompany?.id || user?.companyId;
        if (!companyId) return { success: false, error: "Company not found" };

        const documents = await prisma.document.findMany({
            where: { companyId },
            orderBy: { createdAt: "desc" },
            include: { uploader: { select: { name: true } } }
        });

        return { success: true, documents };
    } catch (error) {
        return { success: false, error: "Failed to fetch documents" };
    }
}
