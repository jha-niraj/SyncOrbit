import { Resend } from 'resend';
import {
	VerificationEmailTemplate, PasswordResetEmailTemplate, WelcomeEmailTemplate, 
	InvitationEmailTemplate,
} from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export function generateOTP(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateOTPExpiry(minutes: number = 10): Date {
	const expiry = new Date();
	expiry.setMinutes(expiry.getMinutes() + minutes);
	return expiry;
}

export async function sendVerificationEmail(email: string, name: string, otp: string) {
	try {
		const { data, error } = await resend.emails.send({
			from: 'SyncOrbit <noreply@nirajjha.xyz>',
			to: [email],
			subject: 'Verify Your Email - SyncOrbit',
			react: VerificationEmailTemplate({ name, otp }),
			text: 'Verify Your Email - SyncOrbit',
		});

		if (error) {
			console.error('Error sending verification email:', error);
			throw new Error('Failed to send verification email');
		}

		return data;
	} catch (error) {
		console.error('Error in sendVerificationEmail:', error);
		throw error;
	}
}

export async function sendPasswordResetEmail(email: string, name: string, otp: string) {
	try {
		const { data, error } = await resend.emails.send({
			from: 'SyncOrbit <noreply@nirajjha.xyz>',
			to: [email],
			subject: 'Reset Your Password - SyncOrbit',
			react: PasswordResetEmailTemplate({ name, otp }),
			text: 'Reset Your Password - SyncOrbit',
		});

		if (error) {
			console.error('Error sending password reset email:', error);
			throw new Error('Failed to send password reset email');
		}

		return data;
	} catch (error) {
		console.error('Error in sendPasswordResetEmail:', error);
		throw error;
	}
}

export async function sendWelcomeEmail(email: string, name: string) {
	try {
		const { data, error } = await resend.emails.send({
			from: 'SyncOrbit <noreply@nirajjha.xyz>',
			to: [email],
			subject: 'Welcome to SyncOrbit! 🎉',
			react: WelcomeEmailTemplate({ name }),
		});

		if (error) {
			console.error('Error sending welcome email:', error);
			throw new Error('Failed to send welcome email');
		}

		return data;
	} catch (error) {
		console.error('Error in sendWelcomeEmail:', error);
		throw error;
	}
}

export async function sendInvitationEmail(
	email: string,
	recipientName: string,
	senderName: string,
	invitationType: 'company' | 'project',
	targetName: string,
	message?: string,
	invitationId?: string
) {
	try {
		const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
		const acceptUrl = `${baseUrl}/api/invitations/accept?id=${invitationId}`
		const declineUrl = `${baseUrl}/api/invitations/decline?id=${invitationId}`

		const { data, error } = await resend.emails.send({
			from: 'SyncOrbit <noreply@nirajjha.xyz>',
			to: [email],
			subject: `You're invited to join ${targetName} on SyncOrbit`,
			react: InvitationEmailTemplate({
				recipientName,
				senderName,
				invitationType,
				targetName,
				message,
				acceptUrl,
				declineUrl
			}),
		});

		if (error) {
			console.error('Error sending invitation email:', error);
			throw new Error('Failed to send invitation email');
		}

		return data;
	} catch (error) {
		console.error('Error in sendInvitationEmail:', error);
		throw error;
	}
}

// Verify OTP
export function verifyOTP(providedOTP: string, storedOTP: string | null, expiry: Date | null): boolean {
	if (!storedOTP || !expiry) {
		return false;
	}

	if (new Date() > expiry) {
		return false;
	}

	return providedOTP === storedOTP;
}