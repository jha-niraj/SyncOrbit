"use client"

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react"
import { toast } from "sonner";

function DeveloperSignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<'DEVELOPER' | 'PRODUCTMANAGER'>('DEVELOPER');
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
				password,
				role
			});

			if (response.status === 200) {
				const signupData = {
					name,
					email,
					password
				};
				sessionStorage.setItem('signupData', JSON.stringify(signupData));

				toast.success("Developer account created successfully!", {
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
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-blue-950/10 dark:to-indigo-950/10">
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
							className="rounded-2xl bg-black"
						>
							<Image
								src="/shunyatech.png"
								alt="ShunyaTech"
								width={80}
								height={80}
								className="rounded-2xl"
							/>
						</motion.div>
						<div className="text-center space-y-2">
							<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
								Join as Developer
							</h1>
							<p className="text-gray-600 dark:text-gray-400">
								Create your developer account to start working on projects
							</p>
						</div>
					</div>
					<form onSubmit={handleSignUp} className="space-y-6">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-100">
									Full Name
								</Label>
								<Input
									id="name"
									type="text"
									placeholder="Enter your full name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									className="h-12"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-gray-100">
									Email Address
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="h-12"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-gray-100">
									Password
								</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="h-12"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="role" className="text-sm font-medium text-gray-900 dark:text-gray-100">
									Your Role
								</Label>
								<Select value={role} onValueChange={(value: 'DEVELOPER' | 'PRODUCTMANAGER') => setRole(value)}>
									<SelectTrigger className="h-12">
										<SelectValue placeholder="Select your role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="DEVELOPER">Developer</SelectItem>
										<SelectItem value="PRODUCTMANAGER">Product Manager</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<Button
							type="submit"
							className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium transition-colors"
							disabled={isSubmitting}
						>
							{
								isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating Account...
									</>
								) : (
									<>
										Create Developer Account
										<ArrowRight className="ml-2 h-4 w-4" />
									</>
								)
							}
						</Button>
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300 dark:border-gray-600" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
									Or continue with
								</span>
							</div>
						</div>
						<Button
							type="button"
							variant="outline"
							className="w-full h-12 border-gray-300 dark:border-gray-600"
							onClick={handleGoogleSignUp}
							disabled={googleSignUp}
						>
							{
								googleSignUp ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Connecting...
									</>
								) : (
									<>
										<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
											<path
												fill="currentColor"
												d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											/>
											<path
												fill="currentColor"
												d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											/>
											<path
												fill="currentColor"
												d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											/>
											<path
												fill="currentColor"
												d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											/>
										</svg>
										Continue with Google
									</>
								)
							}
						</Button>
					</form>
					<div className="text-center">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Already have an account?{" "}
							<Link href="/devs/signin" className="font-medium text-black dark:text-white hover:underline">
								Sign in here
							</Link>
						</p>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default function DeveloperSignUpPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DeveloperSignUp />
		</Suspense>
	);
} 