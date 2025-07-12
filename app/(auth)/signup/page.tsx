"use client"

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react"
import { toast } from "sonner";

function SignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [googleSignUp, setGoogleSignUp] = useState<boolean>(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl");

	const handleGoogleSignUp = async () => {
		try {
			setGoogleSignUp(true);
			const redirectUrl = callbackUrl || '/dashboard';
			await signIn('google', { callbackUrl: redirectUrl });
		} catch (err) {
			const error = err as Error;
			console.log('Google sign-in error:', error);
			toast.error("Google sign-in failed. Please try again.");
			setGoogleSignUp(false);
		}
	};

	const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await axios.post("/api/register", {
				name,
				email,
				password
			});

			if (response.status === 200) {
				// Store signup data in session storage for auto-signin after verification
				const signupData = {
					name,
					email,
					password
				};
				sessionStorage.setItem('signupData', JSON.stringify(signupData));

				toast.success("Account created successfully!", {
					description: "Please check your email for verification OTP."
				});

				const verifyUrl = `/verifyemail?email=${encodeURIComponent(email)}${callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ''
					}`;
				router.push(verifyUrl);
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				const errorMessage = error.response.data.message || "An error occurred during registration";
				toast.error(errorMessage);
			} else if (axios.isAxiosError(error) && error.request) {
				toast.error("No response from server. Please try again.");
			} else {
				toast.error("Error setting up the request. Please try again.");
			}
			console.log("Registration error:", error);
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
								Create an account
							</h1>
							<p className="text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
								Join ShunyaTech and transform your digital dreams into reality
							</p>
							{
								callbackUrl && (
									<p className="text-sm text-emerald-600 dark:text-emerald-400">
										You&apos;ll be redirected back after signup
									</p>
								)
							}
						</div>
					</div>
					<motion.div
						className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 shadow-xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.6 }}
					>
						<form onSubmit={handleSignUp} className="space-y-6">
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name" className="text-slate-700 dark:text-slate-200 font-medium">Full Name</Label>
									<Input
										id="name"
										placeholder="John Doe"
										type="text"
										autoCapitalize="none"
										autoCorrect="off"
										disabled={isSubmitting}
										value={name}
										onChange={(e) => setName(e.target.value)}
										className="h-12 border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all duration-200"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email" className="text-slate-700 dark:text-slate-200 font-medium">Email</Label>
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
								<div className="space-y-2">
									<Label htmlFor="password" className="text-slate-700 dark:text-slate-200 font-medium">Password</Label>
									<Input
										id="password"
										placeholder="••••••••"
										type="password"
										autoCapitalize="none"
										autoComplete="new-password"
										disabled={isSubmitting}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="h-12 border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all duration-200"
										required
									/>
									<p className="text-xs text-slate-500 dark:text-slate-400">
										Password must be at least 8 characters long
									</p>
								</div>
								<div className="flex items-start space-x-3 pt-2">
									<Checkbox required id="terms" className="mt-1" />
									<label
										htmlFor="terms"
										className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
									>
										I agree to the{" "}
										<Link href="/terms" className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
											terms of service
										</Link>{" "}
										and{" "}
										<Link href="/privacy" className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
											privacy policy
										</Link>
									</label>
								</div>
							</div>
							<Button
								disabled={isSubmitting}
								className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
							>
								{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Create Account
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</form>
						<div className="relative mt-8">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-slate-200 dark:border-slate-700" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white dark:bg-slate-800 px-4 text-slate-500 dark:text-slate-400">
									Or continue with
								</span>
							</div>
						</div>
						<Button
							variant="outline"
							type="button"
							disabled={isSubmitting || googleSignUp}
							onClick={handleGoogleSignUp}
							className="w-full h-12 mt-6 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors duration-200"
						>
							{
								googleSignUp ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
										<path
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											fill="#4285F4"
										/>
										<path
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											fill="#34A853"
										/>
										<path
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											fill="#FBBC05"
										/>
										<path
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											fill="#EA4335"
										/>
									</svg>
								)
							}
							Sign up with Google
						</Button>
					</motion.div>
					<motion.div
						className="text-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.6 }}
					>
						<p className="text-sm text-slate-600 dark:text-slate-300">
							Already have an account?{" "}
							<Link
								href={callbackUrl ? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/signin'}
								className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium"
							>
								Sign in
							</Link>
						</p>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}

export default function SignUpPage() {
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
			<SignUp />
		</Suspense>
	)
}