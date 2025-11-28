"use client";

import { useEffect, useState } from "react";
import {
	Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	CheckCircle2, Loader2, XCircle
} from "lucide-react";
import { verifyPayment } from "@/actions/payments.action";
import { useRouter } from "next/navigation";

interface PaymentVerificationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	sessionId: string;
}

type VerificationStatus = "verifying" | "success" | "failed";

export function PaymentVerificationDialog({
	open,
	onOpenChange,
	sessionId,
}: PaymentVerificationDialogProps) {
	const [status, setStatus] = useState<VerificationStatus>("verifying");
	const [subscription, setSubscription] = useState<any>(null);
	const [error, setError] = useState<string>("");
	const router = useRouter();

	useEffect(() => {
		if (open && sessionId) {
			verifyPaymentStatus();
		}
	}, [open, sessionId]);

	const verifyPaymentStatus = async () => {
		setStatus("verifying");
		setError("");

		try {
			const result = await verifyPayment({ sessionId });

			if (result.success) {
				setStatus("success");
				setSubscription(result.subscription);
			} else {
				setStatus("failed");
				setError(result.error || "Payment verification failed");
			}
		} catch (error) {
			console.error("Error verifying payment:", error);
			setStatus("failed");
			setError("An unexpected error occurred");
		}
	};

	const handleClose = () => {
		onOpenChange(false);
		if (status === "success") {
			// Redirect to dashboard
			router.push("/dashboard");
		} else {
			// Remove session_id from URL
			const url = new URL(window.location.href);
			url.searchParams.delete("session_id");
			router.replace(url.pathname + url.search);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
						{status === "verifying" && "Verifying Payment"}
						{status === "success" && "Payment Successful!"}
						{status === "failed" && "Payment Failed"}
					</DialogTitle>
					<DialogDescription className="text-gray-600 dark:text-gray-400">
						{status === "verifying" &&
							"Please wait while we verify your payment..."}
						{status === "success" &&
							"Your subscription has been activated successfully!"}
						{status === "failed" &&
							"There was an issue with your payment."}
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col items-center justify-center py-8">
					{
						status === "verifying" && (
							<div className="space-y-6 text-center">
								<div className="relative">
									<div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
									<Loader2 className="h-20 w-20 animate-spin text-orange-500 mx-auto relative" />
								</div>
								<div className="space-y-2">
									<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Verifying your payment with Dodo Payments...
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										This should only take a moment
									</p>
								</div>
							</div>
						)
					}
					{
						status === "success" && (
							<div className="space-y-6 text-center w-full">
								<div className="relative">
									<div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
									<CheckCircle2 className="h-20 w-20 text-green-500 mx-auto relative" />
								</div>
								<div className="space-y-2">
									<p className="text-xl font-bold text-gray-900 dark:text-white">
										Welcome to {subscription?.plan} Plan!
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Your subscription is now active and you have access to all
										premium features.
									</p>
								</div>
								{
									subscription && (
										<div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 p-5 rounded-xl border border-orange-200 dark:border-orange-900/30 text-left space-y-3">
											<h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Your Plan Details:</h4>
											<div className="grid grid-cols-2 gap-3 text-sm">
												<div className="flex flex-col">
													<span className="text-gray-500 dark:text-gray-400 text-xs">Plan</span>
													<span className="font-semibold text-gray-900 dark:text-white">{subscription.plan}</span>
												</div>
												<div className="flex flex-col">
													<span className="text-gray-500 dark:text-gray-400 text-xs">Projects</span>
													<span className="font-semibold text-gray-900 dark:text-white">
														{
															subscription.maxProjects === 999999
																? "Unlimited"
																: subscription.maxProjects
														}
													</span>
												</div>
												<div className="flex flex-col">
													<span className="text-gray-500 dark:text-gray-400 text-xs">Teams</span>
													<span className="font-semibold text-gray-900 dark:text-white">
														{
															subscription.maxTeams === 999999
																? "Unlimited"
																: subscription.maxTeams
														}
													</span>
												</div>
												<div className="flex flex-col">
													<span className="text-gray-500 dark:text-gray-400 text-xs">Storage</span>
													<span className="font-semibold text-gray-900 dark:text-white">
														{
															subscription.maxStorage === 999999
																? "Unlimited"
																: `${subscription.maxStorage} GB`
														}
													</span>
												</div>
											</div>
										</div>
									)
								}
							</div>
						)
					}
					{
						status === "failed" && (
							<div className="space-y-6 text-center">
								<div className="relative">
									<div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
									<XCircle className="h-20 w-20 text-red-500 mx-auto relative" />
								</div>
								<div className="space-y-2">
									<p className="text-xl font-bold text-gray-900 dark:text-white">Payment Verification Failed</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
								</div>
							</div>
						)
					}
				</div>
				<div className="flex justify-end gap-2">
					{
						status === "failed" && (
							<Button
								variant="outline"
								onClick={verifyPaymentStatus}
								className="border-gray-200 dark:border-neutral-700"
							>
								Retry Verification
							</Button>
						)
					}
					<Button
						onClick={handleClose}
						className={status === "success" ? "bg-[#FE5C02] hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25" : ""}
					>
						{status === "success" ? "Go to Dashboard" : "Close"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}