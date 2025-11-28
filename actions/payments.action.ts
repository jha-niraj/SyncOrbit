"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dodoClient, SUBSCRIPTION_PLANS, SubscriptionPlanType } from "@/lib/dodopayments";
import { revalidatePath } from "next/cache";

interface CreateCheckoutSessionParams {
	plan: SubscriptionPlanType;
	returnUrl: string;
	currency?: 'USD' | 'INR';
	amount?: number;
}

interface CreateCheckoutSessionResult {
	success: boolean;
	sessionUrl?: string;
	sessionId?: string;
	error?: string;
}

export async function createCheckoutSession(
	params: CreateCheckoutSessionParams
): Promise<CreateCheckoutSessionResult> {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return { success: false, error: "Unauthorized" };
		}

		const { plan, returnUrl, currency = 'USD', amount } = params;

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
			where: { 
				id: session.user.id 
			},
			select: { 
				id: true, 
				email: true, 
				name: true, 
				dodoCustomerId: true 
			},
		});

		if (!user) {
			return { success: false, error: "User not found" };
		}

		let dodoCustomerId: string | null = user.dodoCustomerId;

		// Create Dodo customer if doesn't exist
		if (!dodoCustomerId && user.email) {
			try {
				console.log('Creating Dodo customer for user:', user.id);
				
				const customerData: any = {
					email: user.email,
					name: user.name || undefined,
					metadata: {
						user_id: user.id,
					},
				};
				
				const customer = await dodoClient.customers.create(customerData);
				console.log('Dodo customer created:', customer);

				// Extract customer ID with fallbacks
				const customerId = (customer.customer_id || (customer as any).id || '') as string;
				if (!customerId) {
					console.error('No customer ID in response:', customer);
					throw new Error('No customer ID returned from Dodo Payments');
				}
				
				console.log('Customer ID extracted:', customerId);
				dodoCustomerId = customerId;

				// Update user with Dodo customer ID
				if (dodoCustomerId) {
					await prisma.user.update({
						where: { id: user.id },
						data: { dodoCustomerId },
					});
					console.log('User updated with Dodo customer ID');
				}
			} catch (error: any) {
				console.error("Error creating Dodo customer:", error);
				console.error("Error details:", error.message, error.response?.data);
				return { 
					success: false, 
					error: `Failed to create customer: ${error.message || 'Unknown error'}` 
				};
			}
		}

		// Ensure we have a customer ID
		if (!dodoCustomerId) {
			return { success: false, error: "Failed to get customer ID" };
		}

		// Create checkout session
		try {
			// Prepare checkout session data
			const paymentAmount = amount || planConfig.price;
			const paymentCurrency = currency;
			
			// Get the product ID for the plan
			const productId = (planConfig as any).dodoProductId;
			if (!productId) {
				return { 
					success: false, 
					error: `No product ID configured for ${planConfig.name} plan` 
				};
			}
			
			const checkoutSessionData: any = {
				product_cart: [
					{
						product_id: productId,
						quantity: 1,
					},
				],
				success_url: returnUrl,
				customer_id: dodoCustomerId, // Use customer_id instead of customer
				metadata: {
					user_id: user.id,
					plan: plan,
					customer_id: dodoCustomerId,
					currency: paymentCurrency,
					amount: paymentAmount.toString(),
				},
			};
			
			console.log('Creating checkout session with data:', checkoutSessionData);
			const checkoutSession = await dodoClient.checkoutSessions.create(checkoutSessionData);
			console.log('Checkout session created:', checkoutSession);

			// Get the payment link URL
			const sessionUrl = (checkoutSession as any).payment_link || (checkoutSession as any).url || '';
			const sessionId = checkoutSession.session_id || '';
			
			if (!sessionUrl) {
				console.error('No payment URL in checkout session:', checkoutSession);
				throw new Error('No payment URL returned from Dodo Payments');
			}
			
			if (!sessionId) {
				console.error('No session ID in checkout session:', checkoutSession);
				throw new Error('No session ID returned from Dodo Payments');
			}

			// Create pending payment record
			await prisma.payment.create({
				data: {
					userId: user.id,
					dodoCheckoutSessionId: sessionId,
					amount: paymentAmount,
					currency: paymentCurrency,
					status: 'PENDING',
					description: `${planConfig.name} Plan - ${planConfig.billingCycle} (${paymentCurrency})`,
					metadata: {
						plan,
						billingCycle: planConfig.billingCycle,
						currency: paymentCurrency,
						amount: paymentAmount,
					},
				},
			});
			
			console.log('Payment record created successfully');

			return {
				success: true,
				sessionUrl,
				sessionId,
			};
		} catch (error: any) {
			console.error("Error creating checkout session:", error);
			console.error("Error details:", error.message, error.response?.data);
			return { 
				success: false, 
				error: `Failed to create checkout session: ${error.message || 'Unknown error'}` 
			};
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

				// Get currency and amount from payment metadata
				const paymentMetadata = payment.metadata as any;
				const subscriptionCurrency = paymentMetadata?.currency || planConfig.currency;
				const subscriptionAmount = paymentMetadata?.amount || planConfig.price;

				// Create new subscription
				const subscription = await prisma.subscription.create({
					data: {
						userId: session.user.id,
						plan: plan,
						status: 'ACTIVE',
						amount: subscriptionAmount,
						currency: subscriptionCurrency,
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
							currency: subscriptionCurrency,
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
