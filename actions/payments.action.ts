"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dodoClient, SUBSCRIPTION_PLANS, SubscriptionPlanType } from "@/lib/dodopayments";
import { revalidatePath } from "next/cache";

interface CreateCheckoutSessionParams {
	plan: SubscriptionPlanType;
	returnUrl: string;
}

interface CreateCheckoutSessionResult {
	success: boolean;
	sessionUrl?: string;
	sessionId?: string;
	error?: string;
}

/**
 * Create a checkout session for a subscription plan
 */
export async function createCheckoutSession(
	params: CreateCheckoutSessionParams
): Promise<CreateCheckoutSessionResult> {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return { success: false, error: "Unauthorized" };
		}

		const { plan, returnUrl } = params;

		// Validate plan
		if (!SUBSCRIPTION_PLANS[plan]) {
			return { success: false, error: "Invalid subscription plan" };
		}

		// Free plan doesn't need payment
		if (plan === 'FREE') {
			return { success: false, error: "Free plan doesn't require payment" };
		}

		const planConfig = SUBSCRIPTION_PLANS[plan];

		// Get or create Dodo customer
		let user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { id: true, email: true, name: true, dodoCustomerId: true },
		});

		if (!user) {
			return { success: false, error: "User not found" };
		}

		let dodoCustomerId: string | null = user.dodoCustomerId;

		// Create Dodo customer if doesn't exist
		if (!dodoCustomerId && user.email) {
			try {
				const customerData: any = {
					email: user.email,
					name: user.name || undefined,
					metadata: {
						user_id: user.id,
					},
				};
				
				const customer = await dodoClient.customers.create(customerData);

				// Extract customer ID with fallbacks
				const customerId = (customer.customer_id || (customer as any).id || '') as string;
				if (!customerId) {
					throw new Error('No customer ID returned from Dodo Payments');
				}
				dodoCustomerId = customerId;

				// Update user with Dodo customer ID
				if (dodoCustomerId) {
					await prisma.user.update({
						where: { id: user.id },
						data: { dodoCustomerId },
					});
				}
			} catch (error) {
				console.error("Error creating Dodo customer:", error);
				return { success: false, error: "Failed to create customer" };
			}
		}

		// Ensure we have a customer ID
		if (!dodoCustomerId) {
			return { success: false, error: "Failed to get customer ID" };
		}

		// Create checkout session
		// Note: You'll need to create products in Dodo Payments dashboard first
		// For now, we'll create a simple checkout session
		try {
			const checkoutSession = await dodoClient.checkoutSessions.create({
				payment_link: true,
				success_url: returnUrl,
				metadata: {
					user_id: user.id,
					plan: plan,
					customer_id: dodoCustomerId,
				},
			} as any);

			// Create pending payment record
			await prisma.payment.create({
				data: {
					userId: user.id,
					dodoCheckoutSessionId: checkoutSession.session_id || '',
					amount: planConfig.price,
					currency: planConfig.currency,
					status: 'PENDING',
					description: `${planConfig.name} Plan - ${planConfig.billingCycle}`,
					metadata: {
						plan,
						billingCycle: planConfig.billingCycle,
					},
				},
			});

			// Get the payment link URL
			const sessionUrl = (checkoutSession as any).payment_link || (checkoutSession as any).url || '';

			return {
				success: true,
				sessionUrl,
				sessionId: checkoutSession.session_id || '',
			};
		} catch (error) {
			console.error("Error creating checkout session:", error);
			return { success: false, error: "Failed to create checkout session" };
		}
	} catch (error) {
		console.error("Error in createCheckoutSession:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}

interface VerifyPaymentParams {
	sessionId: string;
}

interface VerifyPaymentResult {
	success: boolean;
	subscription?: any;
	error?: string;
}

/**
 * Verify payment and create/update subscription
 */
export async function verifyPayment(
	params: VerifyPaymentParams
): Promise<VerifyPaymentResult> {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return { success: false, error: "Unauthorized" };
		}

		const { sessionId } = params;

		// Get payment record
		const payment = await prisma.payment.findUnique({
			where: { dodoCheckoutSessionId: sessionId },
			include: { user: true },
		});

		if (!payment) {
			return { success: false, error: "Payment not found" };
		}

		if (payment.userId !== session.user.id) {
			return { success: false, error: "Unauthorized" };
		}

		// Check if already processed
		if (payment.status === 'SUCCEEDED') {
			const subscription = await prisma.subscription.findFirst({
				where: { userId: session.user.id, status: 'ACTIVE' },
			});
			return { success: true, subscription };
		}

		// Retrieve checkout session from Dodo
		try {
			const checkoutSession = await dodoClient.checkoutSessions.retrieve(sessionId);

			// Check payment status - handle different possible status values
			const sessionStatus = (checkoutSession as any).status;
			const paymentStatus = (checkoutSession as any).payment_status;
			
			const isPaid = sessionStatus === 'complete' || 
			               sessionStatus === 'paid' || 
			               paymentStatus === 'paid' ||
			               (checkoutSession as any).paid === true;

			if (isPaid) {
				// Update payment status
				await prisma.payment.update({
					where: { id: payment.id },
					data: {
						status: 'SUCCEEDED',
						paidAt: new Date(),
						dodoPaymentId: checkoutSession.payment_id,
					},
				});

				// Get plan from metadata
				const plan = (payment.metadata as any)?.plan as SubscriptionPlanType;

				if (!plan || !SUBSCRIPTION_PLANS[plan]) {
					return { success: false, error: "Invalid plan in payment metadata" };
				}

				const planConfig = SUBSCRIPTION_PLANS[plan];

				// Calculate period end (30 days for monthly)
				const currentPeriodStart = new Date();
				const currentPeriodEnd = new Date();
				currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

				// Cancel existing active subscriptions
				await prisma.subscription.updateMany({
					where: {
						userId: session.user.id,
						status: 'ACTIVE',
					},
					data: {
						status: 'CANCELLED',
						cancelledAt: new Date(),
					},
				});

				// Create new subscription
				const subscription = await prisma.subscription.create({
					data: {
						userId: session.user.id,
						plan: plan,
						status: 'ACTIVE',
						amount: planConfig.price,
						currency: planConfig.currency,
						billingCycle: planConfig.billingCycle,
						maxProjects: planConfig.maxProjects,
						maxTeams: planConfig.maxTeams,
						maxTeamMembers: planConfig.maxTeamMembers,
						maxStorage: planConfig.maxStorage,
						hasAdvancedAnalytics: planConfig.hasAdvancedAnalytics,
						hasPrioritySupport: planConfig.hasPrioritySupport,
						hasCustomBranding: planConfig.hasCustomBranding,
						hasApiAccess: planConfig.hasApiAccess,
						currentPeriodStart,
						currentPeriodEnd,
						metadata: {
							checkoutSessionId: sessionId,
							paymentId: payment.id,
						},
					},
				});

				// Link payment to subscription
				await prisma.payment.update({
					where: { id: payment.id },
					data: { subscriptionId: subscription.id },
				});

				revalidatePath('/pricing');
				revalidatePath('/dashboard');

				return { success: true, subscription };
			} else if (sessionStatus === 'open' || (paymentStatus && paymentStatus === 'unpaid') || !(checkoutSession as any).paid) {
				return { success: false, error: "Payment not completed yet" };
			} else {
				// Update payment as failed
				await prisma.payment.update({
					where: { id: payment.id },
					data: {
						status: 'FAILED',
						failedAt: new Date(),
					},
				});
				return { success: false, error: "Payment failed" };
			}
		} catch (error) {
			console.error("Error verifying payment with Dodo:", error);
			return { success: false, error: "Failed to verify payment" };
		}
	} catch (error) {
		console.error("Error in verifyPayment:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}

/**
 * Get current user subscription
 */
export async function getCurrentSubscription() {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return { success: false, error: "Unauthorized" };
		}

		const subscription = await prisma.subscription.findFirst({
			where: {
				userId: session.user.id,
				status: 'ACTIVE',
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		// If no subscription, return FREE plan
		if (!subscription) {
			const freePlan = SUBSCRIPTION_PLANS.FREE;
			return {
				success: true,
				subscription: {
					plan: 'FREE',
					status: 'ACTIVE',
					...freePlan,
				},
			};
		}

		return { success: true, subscription };
	} catch (error) {
		console.error("Error getting subscription:", error);
		return { success: false, error: "Failed to get subscription" };
	}
}

/**
 * Cancel subscription
 */
export async function cancelSubscription() {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return { success: false, error: "Unauthorized" };
		}

		const subscription = await prisma.subscription.findFirst({
			where: {
				userId: session.user.id,
				status: 'ACTIVE',
			},
		});

		if (!subscription) {
			return { success: false, error: "No active subscription found" };
		}

		// Update subscription status
		await prisma.subscription.update({
			where: { id: subscription.id },
			data: {
				status: 'CANCELLED',
				cancelledAt: new Date(),
			},
		});

		// If there's a Dodo subscription ID, cancel it there too
		if (subscription.dodoSubscriptionId) {
			try {
				// Note: Dodo Payments subscription cancellation
				// You may need to implement this based on Dodo's API
				// await dodoClient.subscriptions.cancel(subscription.dodoSubscriptionId);
				console.log("Subscription cancelled locally. Dodo subscription ID:", subscription.dodoSubscriptionId);
			} catch (error) {
				console.error("Error cancelling Dodo subscription:", error);
				// Continue anyway as we've already cancelled locally
			}
		}

		revalidatePath('/pricing');
		revalidatePath('/dashboard');

		return { success: true };
	} catch (error) {
		console.error("Error cancelling subscription:", error);
		return { success: false, error: "Failed to cancel subscription" };
	}
}
