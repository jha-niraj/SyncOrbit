"use client"

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react"
import { toast } from "sonner";
import { getCompanyByReferralCode } from "@/actions/(productmanager)/pm.action";

interface Company {
	id: string;
	name: string;
	shortName: string;
}

function DeveloperSignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [referralCode, setReferralCode] = useState("");
	const [role, setRole] = useState<'DEVELOPER' | 'PRODUCTMANAGER'>('DEVELOPER');
	const [companyName, setCompanyName] = useState("");
	const [companyShortName, setCompanyShortName] = useState("");
	const [company, setCompany] = useState<Company | null>(null);
	const [validatingReferral, setValidatingReferral] = useState(false);
	const [referralValidated, setReferralValidated] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [googleSignUp, setGoogleSignUp] = useState<boolean>(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl");
	const urlReferralCode = searchParams.get("ref");

	// Auto-populate referral code from URL
	useEffect(() => {
		if (urlReferralCode) {
			setReferralCode(urlReferralCode);
			validateReferralCode(urlReferralCode);
		}
	}, [urlReferralCode]);

	const validateReferralCode = async (code: string) => {
		if (!code.trim()) {
			setCompany(null);
			setReferralValidated(false);
			return;
		}

		setValidatingReferral(true);
		try {
			const result = await getCompanyByReferralCode(code);
			if (result.success && result.company) {
				setCompany(result.company);
				setReferralValidated(true);
				toast.success(`Referral code validated for ${result.company.name}`);
			} else {
				setCompany(null);
				setReferralValidated(false);
				toast.error(result.error || "Invalid referral code");
			}
		} catch (error) {
			console.error("Referral validation error:", error);
			setCompany(null);
			setReferralValidated(false);
			toast.error("Failed to validate referral code");
		} finally {
			setValidatingReferral(false);
		}
	};

	const handleReferralCodeChange = (value: string) => {
		setReferralCode(value);
		// Debounce validation
		setTimeout(() => validateReferralCode(value), 500);
	};

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
			const requestData: {
				name: string;
				email: string;
				password: string;
				role: 'DEVELOPER' | 'PRODUCTMANAGER';
				referralCode?: string;
				companyId?: string;
				companyName?: string;
				companyShortName?: string;
			} = {
				name,
				email,
				password,
				role
			};

			// Add referral code if provided and validated
			if (referralCode && referralValidated && company) {
				requestData.referralCode = referralCode;
				requestData.companyId = company.id;
			}

			// Add company info for PM registration
			if (role === 'PRODUCTMANAGER') {
				if (!companyName.trim()) {
					toast.error("Company name is required for Product Manager registration");
					setIsSubmitting(false);
					return;
				}
				if (!companyShortName.trim()) {
					toast.error("Company short name is required for Product Manager registration");
					setIsSubmitting(false);
					return;
				}
				requestData.companyName = companyName;
				requestData.companyShortName = companyShortName;
			}

			const response = await axios.post("/api/register", requestData);

			if (response.data.success) {
				toast.success("Registration successful! Please check your email for verification.");
				router.push(`/signin?message=Registration successful. Please verify your email.`);
			} else {
				toast.error(response.data.error || "Registration failed. Please try again.");
			}
		} catch (error: unknown) {
			console.error("Registration error:", error);
			if (axios.isAxiosError(error) && error.response?.data?.error) {
				toast.error(error.response.data.error);
			} else {
				toast.error("Registration failed. Please try again.");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-md mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="text-center mb-8"
					>
						<Link href="/" className="inline-block mb-6">
							<Image
								src="/logo.png"
								alt="ShunyaTech Logo"
								width={60}
								height={60}
								className="mx-auto"
							/>
						</Link>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
							Join ShunyaTech
						</h1>
						<p className="text-gray-600 dark:text-gray-300">
							{role === 'PRODUCTMANAGER' ? 'Register your company' : 'Join as a developer'}
						</p>
					</motion.div>

					{/* Company Display for Referral Code */}
					{company && referralValidated && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="mb-6"
						>
							<Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
								<CardContent className="p-4">
									<div className="flex items-center gap-3">
										<Building2 className="h-5 w-5 text-green-600" />
										<div>
											<p className="font-semibold text-green-800 dark:text-green-200">
												{company.name}
											</p>
											<p className="text-sm text-green-600 dark:text-green-300">
												Referral code validated
											</p>
										</div>
										<Badge className="ml-auto bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
											Verified
										</Badge>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					)}

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
							<CardHeader>
								<CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
									Create Account
								</CardTitle>
								<CardDescription className="text-center text-gray-600 dark:text-gray-300">
									Fill in your details to get started
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSignUp} className="space-y-6">
									<div className="space-y-2">
										<Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Role
										</Label>
										<Select value={role} onValueChange={(value: 'DEVELOPER' | 'PRODUCTMANAGER') => setRole(value)}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select your role" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="DEVELOPER">Developer</SelectItem>
												<SelectItem value="PRODUCTMANAGER">Product Manager</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Referral Code Field (only for developers) */}
									{role === 'DEVELOPER' && (
										<div className="space-y-2">
											<Label htmlFor="referralCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
												Referral Code (Optional)
											</Label>
											<div className="relative">
												<Input
													id="referralCode"
													type="text"
													value={referralCode}
													onChange={(e) => handleReferralCodeChange(e.target.value)}
													placeholder="Enter referral code..."
													className="pr-10"
												/>
												{validatingReferral && (
													<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
														<Loader2 className="h-4 w-4 animate-spin text-blue-500" />
													</div>
												)}
											</div>
											{referralCode && !validatingReferral && (
												<p className={`text-sm ${referralValidated ? 'text-green-600' : 'text-red-600'}`}>
													{referralValidated ? 'Valid referral code' : 'Invalid referral code'}
												</p>
											)}
										</div>
									)}

									{/* Company Fields (only for PMs) */}
									{role === 'PRODUCTMANAGER' && (
										<>
											<div className="space-y-2">
												<Label htmlFor="companyName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
													Company Name *
												</Label>
												<Input
													id="companyName"
													type="text"
													value={companyName}
													onChange={(e) => setCompanyName(e.target.value)}
													placeholder="Enter company name..."
													required
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="companyShortName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
													Company Short Name *
												</Label>
												<Input
													id="companyShortName"
													type="text"
													value={companyShortName}
													onChange={(e) => setCompanyShortName(e.target.value)}
													placeholder="e.g., shunyatech"
													required
													pattern="[a-zA-Z0-9]+"
													title="Only alphanumeric characters allowed"
												/>
												<p className="text-xs text-gray-500">
													Used for generating referral codes (alphanumeric only)
												</p>
											</div>
										</>
									)}

									<div className="space-y-2">
										<Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Full Name
										</Label>
										<Input
											id="name"
											type="text"
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder="Enter your full name"
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Email Address
										</Label>
										<Input
											id="email"
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="Enter your email"
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Password
										</Label>
										<Input
											id="password"
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Create a password"
											required
										/>
									</div>

									<Button
										type="submit"
										className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
										disabled={isSubmitting}
									>
										{isSubmitting ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Creating Account...
											</>
										) : (
											<>
												Create Account
												<ArrowRight className="ml-2 h-4 w-4" />
											</>
										)}
									</Button>

									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<span className="w-full border-t border-gray-300 dark:border-gray-600" />
										</div>
										<div className="relative flex justify-center text-xs uppercase">
											<span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
												Or continue with
											</span>
										</div>
									</div>

									<Button
										type="button"
										variant="outline"
										onClick={handleGoogleSignUp}
										className="w-full border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
										disabled={googleSignUp}
									>
										{googleSignUp ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Signing up...
											</>
										) : (
											<>
												<Image
													src="/google-logo.png"
													alt="Google"
													width={20}
													height={20}
													className="mr-2"
												/>
												Sign up with Google
											</>
										)}
									</Button>
								</form>

								<div className="mt-6 text-center">
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Already have an account?{' '}
										<Link href="/signin" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
											Sign in
										</Link>
									</p>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

export default function DeveloperSignUpPage() {
	return (
		<Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
			<DeveloperSignUp />
		</Suspense>
	);
} 