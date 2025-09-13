"use server"

import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    // Add other properties if needed
}

export async function uploadImageToCloudinary(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, message: "Authentication required", url: null };
        }

        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, message: "No file provided", url: null };
        }

        // Validate file type
        const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const documentTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'application/zip',
            'application/x-zip-compressed'
        ];
        
        const validTypes = [...imageTypes, ...documentTypes];
        const isImage = imageTypes.includes(file.type);
        
        if (!validTypes.includes(file.type)) {
            return { 
                success: false, 
                message: "Invalid file type. Please upload images (JPG, PNG, WebP) or documents (PDF, DOC, DOCX, XLS, XLSX, TXT, ZIP).", 
                url: null 
            };
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return { 
                success: false, 
                message: "File size too large. Please upload images smaller than 5MB.", 
                url: null 
            };
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        const uploadOptions: any = {
            folder: "projectcentral/attachments",
            resource_type: "auto", // Auto-detect resource type
        };
        
        // Apply image optimizations only for images
        if (isImage) {
            uploadOptions.transformation = [
                { width: 1200, height: 1600, crop: "limit" },
                { quality: "auto:good" },
                { format: "auto" }
            ];
        }
        
        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                    } else {
                        resolve(result as CloudinaryUploadResult);
                    }
                }
            ).end(buffer);
        });

        return {
            success: true,
            message: `${isImage ? 'Image' : 'File'} uploaded successfully`,
            url: result.secure_url,
            publicId: result.public_id,
            fileType: file.type,
            fileName: file.name,
            isImage
        };

    } catch (error) {
        console.error("Error uploading image:", error);
        return {
            success: false,
            message: "Failed to upload file. Please try again.",
            url: null
        };
    }
}

export async function deleteImageFromCloudinary(publicId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, message: "Authentication required" };
        }

        await cloudinary.uploader.destroy(publicId);
        return { success: true, message: "Image deleted successfully" };
    } catch (error) {
        console.error("Error deleting image:", error);
        return { success: false, message: "Failed to delete image" };
    }
}