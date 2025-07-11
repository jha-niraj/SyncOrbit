import { Resend } from 'resend';
import {
	VerificationEmailTemplate,
	PasswordResetEmailTemplate,
	WelcomeEmailTemplate,
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
			from: 'ShunyaTech <noreply@setu.nirajjha.xyz>',
			to: [email],
			subject: 'Verify Your Email - ShunyaTech',
			react: VerificationEmailTemplate({ name, otp }),
			text: 'Verify Your Email - ShunyaTech',
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
			from: 'ShunyaTech <noreply@setu.nirajjha.xyz>',
			to: [email],
			subject: 'Reset Your Password - ShunyaTech',
			react: PasswordResetEmailTemplate({ name, otp }),
			text: 'Reset Your Password - ShunyaTech',
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
			from: 'ShunyaTech <noreply@setu.nirajjha.xyz>',
			to: [email],
			subject: 'Welcome to ShunyaTech! 🎉',
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