"use client"

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";

function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await axios.post('/api/forgot-password', { email });

			if (response.status === 200) {
				toast.success("Password reset OTP sent!", {
					description: "Please check your email for the reset code."
				});
				const resetUrl = `/reset-password?email=${encodeURIComponent(email)}${callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ''
					}`;
				router.push(resetUrl);
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				const errorMessage = error.response.data.message || "Failed to send reset OTP";
				toast.error(errorMessage);
			} else {
				toast.error("An error occurred. Please try again.");
			}
			console.error("Error sending reset OTP:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/10">
			<div className="flex-1 flex flex-col items-center justify-center p-6">
				<motion.div
					className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[420px]"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					{/* Logo and Header */}
					<div className="flex flex-col items-center space-y-6">
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}
						>
							<Image
								src="/shunyatech.png"
								alt="ShunyaTech Logo"
								width={80}
								height={80}
								className="rounded-2xl shadow-lg"
							/>
						</motion.div>
						<div className="flex flex-col space-y-3 text-center">
							<h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
								Reset your password
							</h1>
							<p className="text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
								Enter your email address and we'll send you a reset code
							</p>
							{callbackUrl && (
								<p className="text-sm text-emerald-600 dark:text-emerald-400">
									You'll be redirected back after resetting
								</p>
							)}
						</div>
					</div>

					{/* Reset Form */}
					<motion.div
						className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 shadow-xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.6 }}
					>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="email" className="text-slate-700 dark:text-slate-200 font-medium">Email Address</Label>
								<Input
									id="email"
									placeholder="name@example.com"
									type="email"
									autoCapitalize="none"
									autoComplete="email"
									autoCorrect="off"
									disabled={isSubmitting}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="h-12 border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all duration-200"
									required
								/>
							</div>
							<Button
								disabled={isSubmitting}
								className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
							>
								{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Send Reset Code
							</Button>
						</form>
					</motion.div>

					{/* Navigation Links */}
					<motion.div
						className="text-center space-y-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.6 }}
					>
						<p className="text-sm text-slate-600 dark:text-slate-300">
							Remember your password?{" "}
							<Button
								variant="link"
								className="h-auto p-0 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium"
								onClick={() => {
									const signinUrl = callbackUrl
										? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
										: '/signin';
									router.push(signinUrl);
								}}
							>
								Back to Sign In
							</Button>
						</p>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}

export default function ForgotPasswordPage() {
	return (
		<Suspense fallback={
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/10">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
				>
					<div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full animate-pulse mx-auto mb-4"></div>
					<p className="text-slate-600 dark:text-slate-300">Loading...</p>
				</motion.div>
			</div>
		}>
			<ForgotPassword />
		</Suspense>
	)
}