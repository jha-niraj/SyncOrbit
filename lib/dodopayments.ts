import DodoPayments from 'dodopayments';

// Use server-side only API key (without NEXT_PUBLIC_ prefix for security)
const apiKey = process.env.DODO_PAYMENTS_API_KEY || process.env.NEXT_PUBLIC_DODO_PAYMENTS_API_KEY;

if (!apiKey) {
    throw new Error('DODO_PAYMENTS_API_KEY is not set in environment variables');
}

export const dodoClient = new DodoPayments({
    bearerToken: apiKey,
    environment: 'test_mode', // Change to 'live_mode' for production
});

// Subscription plan configurations
export const SUBSCRIPTION_PLANS = {
    FREE: {
        name: 'Free',
        price: 0,
        currency: 'USD',
        billingCycle: 'monthly',
        maxProjects: 3,
        maxTeams: 1,
        maxTeamMembers: 5,
        maxStorage: 1, // GB
        hasAdvancedAnalytics: false,
        hasPrioritySupport: false,
        hasCustomBranding: false,
        hasApiAccess: false,
        dodoProductId: null, // No product needed for free plan
        features: [
            'Up to 3 projects',
            '1 team',
            'Up to 5 team members',
            '1 GB storage',
            'Basic analytics',
            'Community support',
        ],
    },
    STARTER: {
        name: 'Starter',
        price: 29,
        currency: 'USD',
        billingCycle: 'monthly',
        maxProjects: 10,
        maxTeams: 3,
        maxTeamMembers: 15,
        maxStorage: 10, // GB
        hasAdvancedAnalytics: false,
        hasPrioritySupport: false,
        hasCustomBranding: false,
        hasApiAccess: false,
        dodoProductId: 'pdt_gIC9hBW3PVV7NEq5cRdTJA', // Starter plan product ID (INR 2000)
        features: [
            'Up to 10 projects',
            '3 teams',
            'Up to 15 team members',
            '10 GB storage',
            'Basic analytics',
            'Email support',
            'Project templates',
        ],
    },
    PROFESSIONAL: {
        name: 'Professional',
        price: 99,
        currency: 'USD',
        billingCycle: 'monthly',
        maxProjects: 50,
        maxTeams: 10,
        maxTeamMembers: 50,
        maxStorage: 100, // GB
        hasAdvancedAnalytics: true,
        hasPrioritySupport: true,
        hasCustomBranding: false,
        hasApiAccess: true,
        dodoProductId: 'pdt_ilvOmnTjvfAS1jCXaswWRS', // Professional plan product ID
        features: [
            'Up to 50 projects',
            '10 teams',
            'Up to 50 team members',
            '100 GB storage',
            'Advanced analytics',
            'Priority support',
            'API access',
            'Custom workflows',
            'Integrations',
        ],
    },
    ENTERPRISE: {
        name: 'Enterprise',
        price: 299,
        currency: 'USD',
        billingCycle: 'monthly',
        maxProjects: 999999, // Unlimited
        maxTeams: 999999, // Unlimited
        maxTeamMembers: 999999, // Unlimited
        maxStorage: 999999, // Unlimited
        hasAdvancedAnalytics: true,
        hasPrioritySupport: true,
        hasCustomBranding: true,
        hasApiAccess: true,
        dodoProductId: null, // Contact sales - no direct product
        features: [
            'Unlimited projects',
            'Unlimited teams',
            'Unlimited team members',
            'Unlimited storage',
            'Advanced analytics',
            'Priority support',
            'API access',
            'Custom branding',
            'Dedicated account manager',
            'SLA guarantee',
            'Custom integrations',
        ],
    },
} as const;

export type SubscriptionPlanType = keyof typeof SUBSCRIPTION_PLANS;
