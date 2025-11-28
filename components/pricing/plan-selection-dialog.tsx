"use client";

import { useState } from "react";
import {
	Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Check, Loader2
} from "lucide-react";
import { SUBSCRIPTION_PLANS, SubscriptionPlanType } from "@/lib/dodopayments";
import { createCheckoutSession } from "@/actions/payments.action";
import { toast } from "sonner";

interface PlanSelectionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	plan: SubscriptionPlanType;
	selectedCurrency: 'USD' | 'INR';
	selectedPrice: number;
	currencySymbol: string;
	billingCycle: 'monthly' | 'annual';
}

export function PlanSelectionDialog({
	open,
	onOpenChange,
	plan,
	selectedCurrency,
	selectedPrice,
	currencySymbol,
	billingCycle,
}: PlanSelectionDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const planConfig = SUBSCRIPTION_PLANS[plan];

	const handleSubscribe = async () => {
		if (plan === 'FREE') {
			toast.info("You're already on the free plan!");
			onOpenChange(false);
			return;
		}

		setIsLoading(true);

		try {
			const returnUrl = `${window.location.origin}/pricing?session_id={CHECKOUT_SESSION_ID}`;

			const result = await createCheckoutSession({
				plan,
				returnUrl,
				currency: selectedCurrency,
				amount: selectedPrice,
			});

			if (result.success && result.sessionUrl) {
				// Redirect to Dodo Payments checkout
				window.location.href = result.sessionUrl;
			} else {
				toast.error(result.error || "Failed to create checkout session");
				setIsLoading(false);
			}
		} catch (error) {
			console.error("Error creating checkout:", error);
			toast.error("An unexpected error occurred");
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[550px] bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
						Subscribe to {planConfig.name}
					</DialogTitle>
					<DialogDescription className="text-gray-600 dark:text-gray-400">
						Review your plan details before proceeding to payment
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 py-4">
					<div className="text-center py-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-2xl border border-orange-200 dark:border-orange-900/30">
						<div className="text-5xl font-bold text-gray-900 dark:text-white">
							{currencySymbol}{selectedPrice}
							<span className="text-lg font-normal text-gray-500 dark:text-gray-400">
								/{billingCycle}
							</span>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
							Billed {billingCycle} • {selectedCurrency}
						</p>
					</div>
					<div className="space-y-3">
						<h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
							<Check className="h-5 w-5 text-orange-500" />
							What's included:
						</h4>
						<ul className="space-y-2.5 pl-7 grid grid-cols-1 md:grid-cols-2">
							{
								planConfig.features.map((feature, index) => (
									<li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
										<span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
										<span>{feature}</span>
									</li>
								))
							}
						</ul>
					</div>
					<div className="bg-gray-50 dark:bg-neutral-800/50 p-5 rounded-xl border border-gray-200 dark:border-neutral-700">
						<h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Plan Limits:</h4>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
							<div className="flex flex-col items-center justify-center">
								<span className="text-gray-500 dark:text-gray-400 text-xs">Projects</span>
								<span className="font-semibold text-gray-900 dark:text-white">
									{
										planConfig.maxProjects === 999999
											? "Unlimited"
											: planConfig.maxProjects
									}
								</span>
							</div>
							<div className="flex flex-col items-center justify-center">
								<span className="text-gray-500 dark:text-gray-400 text-xs">Teams</span>
								<span className="font-semibold text-gray-900 dark:text-white">
									{
										planConfig.maxTeams === 999999
											? "Unlimited"
											: planConfig.maxTeams
									}
								</span>
							</div>
							<div className="flex flex-col items-center justify-center">
								<span className="text-gray-500 dark:text-gray-400 text-xs">Team Members</span>
								<span className="font-semibold text-gray-900 dark:text-white">
									{
										planConfig.maxTeamMembers === 999999
											? "Unlimited"
											: planConfig.maxTeamMembers
									}
								</span>
							</div>
							<div className="flex flex-col items-center justify-center">
								<span className="text-gray-500 dark:text-gray-400 text-xs">Storage</span>
								<span className="font-semibold text-gray-900 dark:text-white">
									{
										planConfig.maxStorage === 999999
											? "Unlimited"
											: `${planConfig.maxStorage} GB`
									}
								</span>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter className="gap-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
						className="border-gray-200 dark:border-neutral-700"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubscribe}
						disabled={isLoading}
						className="bg-[#FE5C02] hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25"
					>
						{
							isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</>
							) : (
								`Subscribe for ${currencySymbol}${selectedPrice}/${billingCycle}`
							)
						}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
