export async function uploadToCloudinary(base64Image: string, folder: string = 'customers') {
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                base64Image,
                folder
            })
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Failed to upload image');
        }

        return {
            success: true,
            url: result.url
        };
    } catch (error) {
        console.error('Upload to Cloudinary error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed'
        };
    }
}