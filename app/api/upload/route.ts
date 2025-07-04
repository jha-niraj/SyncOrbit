import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { base64Image, folder = 'shunyatech' } = await req.json();
        
        if (!base64Image) {
            return NextResponse.json({ success: false, error: 'No image provided' }, { status: 400 });
        }

        const base64Data = base64Image.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    transformation: [
                        { width: 1000, height: 1000, crop: "limit" },
                        { quality: "auto" },
                        { format: "webp" }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as { secure_url: string });
                }
            ).end(buffer);
        });

        return NextResponse.json({
            success: true,
            url: result.secure_url
        });

    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
    }
}