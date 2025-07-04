import Image from 'next/image';
import * as React from 'react';

interface EmailTemplateProps {
	name: string;
	otp: string;
}

export const VerificationEmailTemplate = ({ name, otp }: EmailTemplateProps): React.ReactNode => (
	<div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
		<div style={{ backgroundColor: '#1a1a1a', color: '#ffffff', padding: '30px 20px', textAlign: 'center' }}>
			<Image
				src="https://your-domain.com/shunyatech.png"
				alt="ShunyaTech"
				width={100}
				height={100}
			/>
			<h1 style={{ margin: '0', fontWeight: '500', fontSize: '24px' }}>Verify Your Email</h1>
		</div>
		<div style={{ padding: '35px 30px', backgroundColor: '#ffffff' }}>
			<p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
				Hi {name},
			</p>
			<p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
				Thank you for signing up with ShunyaTech! We&apos;re excited to have you on board.
			</p>
			<p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
				Please use the following OTP to verify your email address:
			</p>
			<div style={{
				textAlign: 'center',
				margin: '30px 0',
				padding: '20px',
				backgroundColor: '#f8f9fa',
				borderRadius: '8px',
				border: '2px dashed #6c757d'
			}}>
				<div style={{
					fontSize: '32px',
					fontWeight: 'bold',
					color: '#1a1a1a',
					letterSpacing: '8px',
					fontFamily: 'monospace'
				}}>
					{otp}
				</div>
				<p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#6c757d' }}>
					This OTP will expire in 10 minutes
				</p>
			</div>
			<p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
				If you didn&apos;t create an account with ShunyaTech, you can safely ignore this email.
			</p>
			<div style={{
				marginTop: '30px',
				paddingTop: '20px',
				borderTop: '1px solid #eeeeee',
				fontSize: '14px',
				color: '#6c757d'
			}}>
				<p>Need help? Contact our support team at support@shunyatech.com</p>
			</div>
		</div>
		<div style={{
			backgroundColor: '#f8f9fa',
			textAlign: 'center',
			padding: '20px',
			fontSize: '13px',
			color: '#6c757d'
		}}>
			<p>&copy; 2024 ShunyaTech. You think we&apos;ll deliver.</p>
			<p>Transform your digital dreams into reality</p>
		</div>
	</div>
);

export const PasswordResetEmailTemplate = ({ name, otp }: EmailTemplateProps): React.ReactNode => (
	<div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
		<div style={{ backgroundColor: '#dc3545', color: '#ffffff', padding: '30px 20px', textAlign: 'center' }}>
			<Image
				src="https://your-domain.com/shunyatech.png"
				alt="ShunyaTech"
				width={100}
				height={100}
			/>
			<h1 style={{ margin: '0', fontWeight: '500', fontSize: '24px' }}>Reset Your Password</h1>
		</div>
		<div style={{ padding: '35px 30px', backgroundColor: '#ffffff' }}>
			<p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
				Hi {name},
			</p>
			<p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
				We received a request to reset your password for your ShunyaTech account.
			</p>
			<p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
				Please use the following OTP to reset your password:
			</p>
			<div style={{
				textAlign: 'center',
				margin: '30px 0',
				padding: '20px',
				backgroundColor: '#fff5f5',
				borderRadius: '8px',
				border: '2px dashed #dc3545'
			}}>
				<div style={{
					fontSize: '32px',
					fontWeight: 'bold',
					color: '#dc3545',
					letterSpacing: '8px',
					fontFamily: 'monospace'
				}}>
					{otp}
				</div>
				<p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#6c757d' }}>
					This OTP will expire in 15 minutes
				</p>
			</div>
			<p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
				If you didn&apos;t request this password reset, please ignore this email and your password will remain unchanged.
			</p>
			<div style={{
				marginTop: '30px',
				paddingTop: '20px',
				borderTop: '1px solid #eeeeee',
				fontSize: '14px',
				color: '#6c757d'
			}}>
				<p>Need help? Contact our support team at support@shunyatech.com</p>
			</div>
		</div>
		<div style={{
			backgroundColor: '#f8f9fa',
			textAlign: 'center',
			padding: '20px',
			fontSize: '13px',
			color: '#6c757d'
		}}>
			<p>&copy; 2024 ShunyaTech. You think we&apos;ll deliver.</p>
			<p>Transform your digital dreams into reality</p>
		</div>
	</div>
);

export const WelcomeEmailTemplate = ({ name }: { name: string }): React.ReactNode => (
	<div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
		<div style={{ backgroundColor: '#28a745', color: '#ffffff', padding: '30px 20px', textAlign: 'center' }}>
			<Image
				src="https://your-domain.com/shunyatech.png"
				alt="ShunyaTech"
				style={{ height: '40px', marginBottom: '15px' }}
				width={100}
				height={100}
			/>
			<h1 style={{ margin: '0', fontWeight: '500', fontSize: '24px' }}>Welcome to ShunyaTech!</h1>
		</div>
		<div style={{ padding: '35px 30px', backgroundColor: '#ffffff' }}>
			<p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
				Hi {name},
			</p>
			<p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
				🎉 Congratulations! Your email has been successfully verified and your account is now active.
			</p>
			<p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
				You can now access your dashboard and explore all the features ShunyaTech has to offer:
			</p>
			<div style={{ margin: '25px 0' }}>
				<ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#333333', paddingLeft: '20px' }}>
					<li>View and track your projects</li>
					<li>Communicate with our team in real-time</li>
					<li>Access project files and resources</li>
					<li>Submit feedback and requests</li>
				</ul>
			</div>
			<div style={{ textAlign: 'center', margin: '30px 0' }}>
				<a
					href="https://shunyatech.com/dashboard"
					style={{
						display: 'inline-block',
						padding: '14px 28px',
						backgroundColor: '#28a745',
						color: '#ffffff',
						textDecoration: 'none',
						borderRadius: '8px',
						fontSize: '16px',
						fontWeight: '500'
					}}
				>
					Go to Dashboard
				</a>
			</div>
			<p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
				If you have any questions or need assistance, our team is here to help!
			</p>
			<div style={{
				marginTop: '30px',
				paddingTop: '20px',
				borderTop: '1px solid #eeeeee',
				fontSize: '14px',
				color: '#6c757d'
			}}>
				<p>Need help? Contact our support team at support@shunyatech.com</p>
			</div>
		</div>
		<div style={{
			backgroundColor: '#f8f9fa',
			textAlign: 'center',
			padding: '20px',
			fontSize: '13px',
			color: '#6c757d'
		}}>
			<p>&copy; 2024 ShunyaTech. You think we&apos;ll deliver.</p>
			<p>Transform your digital dreams into reality</p>
		</div>
	</div>
); 