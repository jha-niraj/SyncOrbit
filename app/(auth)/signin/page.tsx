"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [googleSignIn, setGoogleSignIn] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

	useEffect(() => {
		// Check for error or success in URL
		const error = searchParams.get("error");
		if (error === "OAuthAccountNotLinked") {
			toast.error("Email already in use with a different provider", {
				description: "Please sign in with the provider you used originally."
			});
		} else if (error === "EmailNotVerified") {
			toast.error("Email not verified", {
				description: "Please verify your email before signing in."
			});
		}
	}, [searchParams]);

	const handleSignInWithGoogle = async () => {
		try {
			setGoogleSignIn(true);
			const result = await signIn("google", {
				callbackUrl,
				redirect: false
			});

			if (result?.error) {
				if (result.error === "EmailNotVerified") {
					toast.error("Email not verified");
					router.push("/verifyemail");
				} else {
					toast.error("Failed to sign in with Google");
				}
			} else if (result?.url) {
				router.push(result.url);
			}
		} catch (error) {
			console.error("Google sign-in error:", error);
			toast.error("Failed to sign in with Google");
		} finally {
			setGoogleSignIn(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
				callbackUrl
			});

			if (result?.error) {
				switch (result.error) {
					case "EmailNotVerified":
						toast.error("Please verify your email first", {
							description: "Check your inbox for the verification email."
						});
						router.push(`/verifyemail?email=${encodeURIComponent(email)}`);
						break;
					case "CredentialsSignin":
						toast.error("Invalid email or password");
						break;
					default:
						toast.error("Failed to sign in");
				}
			} else if (result?.url) {
				toast.success("Signed in successfully!");
				router.push(result.url);
			}
		} catch (error) {
			console.error("Sign-in error:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
			<div className="flex-1 flex flex-col items-center justify-center">
				<motion.div
					className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex flex-col items-center space-y-4">
						<Image
							src="/shunyatech.png"
							alt="ShunyaTech Logo"
							width={64}
							height={64}
							className="rounded-sm"
						/>
						<div className="flex flex-col space-y-2 text-center">
							<h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
							<p className="text-sm text-muted-foreground">
								Sign in to your account to continue
							</p>
						</div>
					</div>

					<div className="grid gap-6">
						<form onSubmit={handleSubmit}>
							<div className="grid gap-4">
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
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
										required
									/>
								</div>
								<div className="grid gap-2">
									<div className="flex items-center justify-between">
										<Label htmlFor="password">Password</Label>
										<Link
											href="/forgotpassword"
											className="text-sm font-medium text-primary hover:underline"
										>
											Forgot password?
										</Link>
									</div>
									<Input
										id="password"
										placeholder="••••••••"
										type="password"
										autoCapitalize="none"
										autoComplete="current-password"
										disabled={isSubmitting}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
								</div>
								<Button disabled={isSubmitting}>
									{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Sign In
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</div>
						</form>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>

						<Button
							variant="outline"
							type="button"
							disabled={isSubmitting || googleSignIn}
							onClick={handleSignInWithGoogle}
							className="h-11"
						>
							{googleSignIn ? (
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
									<path d="M1 1h22v22H1z" fill="none" />
								</svg>
							)}
							Google
						</Button>
					</div>

					<div className="text-center text-sm text-muted-foreground">
						Don't have an account?{" "}
						<Link
							href="/register"
							className="font-medium text-primary hover:underline"
						>
							Sign up
						</Link>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
