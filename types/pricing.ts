export interface PlanFeatures {
    users: string;
    projects: string;
    storage: string;
    analytics: string;
    support: string;
    integrations: string;
    timeTracking: boolean;
    advancedReporting: boolean;
    customFields: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    sso: boolean;
    customBranding: boolean;
    advancedSecurity: boolean;
}

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    features: PlanFeatures;
    cta: string;
    popular: boolean;
    link: string;
}

export interface FeatureDefinition {
    name: string;
    key: keyof PlanFeatures;
    category: string;
}