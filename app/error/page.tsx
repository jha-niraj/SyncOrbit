"use client"

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, AlertTriangle, XCircle, Info } from 'lucide-react';
import { Suspense } from 'react';

function AuthError() {
	const search = useSearchParams();
	const error = search.get("error");

	const errorMessages = {
		Configuration: "Server configuration error. Please contact support.",
		AccessDenied: "Access denied. You do not have permission to sign in.",
		Verification: "Sign in link expired. Please request a new one.",
		Default: "An unexpected error occurred during authentication.",
		OAuthSignin: "Error connecting to authentication provider.",
		OAuthCallback: "Error processing authentication callback.",
		OAuthCreateAccount: "Could not create an account with the provided credentials.",
		EmailCreateAccount: "Could not create an email account.",
		Callback: "Authentication failed. Please try again.",
		OAuthAccountNotLinked: "This account is not linked to any existing user."
	};

	const errorMessage = errorMessages[error as keyof typeof errorMessages] || errorMessages.Default;

	const getErrorIcon = () => {
		if (error === 'AccessDenied') return <XCircle className="h-20 w-20" />;
		if (error === 'Verification') return <AlertTriangle className="h-20 w-20" />;
		if (error === 'Configuration') return <Info className="h-20 w-20" />;
		return <AlertCircle className="h-20 w-20" />;
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="bg-white p-8 md:p-10 rounded-2xl shadow-lg max-w-md w-full mx-auto text-center border border-gray-100"
			>
				<motion.div
					className="mb-8 relative"
					initial={{ scale: 0.8 }}
					animate={{ scale: 1 }}
					transition={{
						type: "spring",
						stiffness: 200,
						damping: 15
					}}
				>
					<div className="absolute inset-0 bg-red-50 rounded-full scale-125 opacity-20"></div>
					<div className="relative text-red-500 w-full mx-auto flex items-center justify-center">
						{getErrorIcon()}
					</div>
				</motion.div>
				<h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Authentication Error</h2>
				<p className="text-gray-600 mb-8 text-lg">{errorMessage}</p>
				<div className="flex justify-center">
					<motion.div
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
					>
						<Link
							href="/signin"
							className="bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3 rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 font-medium"
						>
							<ArrowLeft className="h-4 w-4" />
							Return to Sign In
						</Link>
					</motion.div>
				</div>
				{
					process.env.NODE_ENV === 'development' && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
						>
							<p className="text-xs text-gray-500 flex items-center justify-center gap-1">
								<Info className="h-3 w-3" /> Debug Info: <span className="font-mono">{error}</span>
							</p>
						</motion.div>
					)
				}
			</motion.div>
		</div>
	);
}

export default function AuthErrorLayout() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AuthError />
		</Suspense>
	)
}