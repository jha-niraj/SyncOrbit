import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { inquiryType, name, email, message } = body;

		// Create contact entry in database
		const contact = await prisma.contact.create({
			data: {
				inquiryType,
				name,
				email,
				message,
				createdAt: new Date(),
			},
		});

		// TODO: Email Integration Point
		// Add your email sending logic here. You can use services like:
		// - SendGrid: npm install @sendgrid/mail
		// - Resend: npm install resend
		// - NodeMailer: npm install nodemailer
		// 
		// Example structure for email integration:
		/*
		async function sendEmail(contact) {
		  // 1. Auto-response to user
		  await sendToUser({
			to: contact.email,
			subject: 'Thanks for contacting us!',
			html: `Hi ${contact.name}, we received your message...`
		  });
    
		  // 2. Notification to admin
		  await sendToAdmin({
			subject: `New ${contact.inquiryType} from ${contact.name}`,
			html: `
			  Name: ${contact.name}
			  Email: ${contact.email}
			  Type: ${contact.inquiryType}
			  Message: ${contact.message}
			`
		  });
		}
	    
		await sendEmail(contact);
		*/

		return NextResponse.json({ success: true, contact });
	} catch (err) {
		const error = err as Error;
		console.log('Failed to create contact:', error);
		return NextResponse.json(
			{ error: 'Failed to create contact' },
			{ status: 500 }
		);
	}
}