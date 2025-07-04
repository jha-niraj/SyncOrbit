"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ResetPassword() {
	const [otp, setOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email");

	useEffect(() => {
		if (!email) {
			router.push("/forgotpassword");
			return;
		}
	}, [email, router]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email) return;

		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (newPassword.length < 8) {
			toast.error("Password must be at least 8 characters long");
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await axios.post("/api/reset-password", {
				email,
				otp,
				newPassword
			});

			if (response.status === 200) {
				toast.success("Password reset successfully!", {
					description: "You can now sign in with your new password."
				});
				router.push("/signin");
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				const errorMessage = error.response.data.message || "Password reset failed";
				toast.error(errorMessage);
			} else {
				toast.error("An error occurred. Please try again.");
			}
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
							<h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
							<p className="text-sm text-muted-foreground">
								Enter the reset code sent to<br />
								<span className="font-medium text-primary">{email}</span>
							</p>
						</div>
					</div>

					<div className="grid gap-6">
						<form onSubmit={handleSubmit}>
							<div className="grid gap-4">
								<div className="grid gap-2">
									<Label htmlFor="otp">Reset Code</Label>
									<Input
										id="otp"
										placeholder="Enter 6-digit code"
										type="text"
										maxLength={6}
										pattern="[0-9]{6}"
										autoComplete="one-time-code"
										disabled={isSubmitting}
										value={otp}
										onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="newPassword">New Password</Label>
									<Input
										id="newPassword"
										placeholder="••••••••"
										type="password"
										autoComplete="new-password"
										disabled={isSubmitting}
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="confirmPassword">Confirm Password</Label>
									<Input
										id="confirmPassword"
										placeholder="••••••••"
										type="password"
										autoComplete="new-password"
										disabled={isSubmitting}
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
								</div>
								<Button
									disabled={isSubmitting || otp.length !== 6 || !newPassword || !confirmPassword}
								>
									{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Reset Password
								</Button>
							</div>
						</form>

						<div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
							<p>Didn't receive the code?</p>
							<Button
								variant="link"
								className="h-auto p-0"
								onClick={() => router.push('/forgotpassword')}
							>
								Request new code
							</Button>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}