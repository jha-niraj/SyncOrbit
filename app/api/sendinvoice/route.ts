import { sendInvoiceEmail } from '@/utils/mail';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    console.log('API route hit');

    try {
        const { recipientEmail, invoiceImage, invoiceNumber } = await req.json();

        if (!recipientEmail || !invoiceImage || !invoiceNumber) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const data = await sendInvoiceEmail(recipientEmail, invoiceImage, invoiceNumber);

        return NextResponse.json({ message: 'Email sent successfully', data }, { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ message: 'Server error', error: error }, { status: 500 });
    }
}