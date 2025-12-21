import { SubscriptionStatus, SubscriptionPlan } from "@prisma/client"

export interface UserSubscription {
    id: string
    userId: string
    plan: SubscriptionPlan
    status: SubscriptionStatus
    amount: number
    currency: string
    billingCycle: string | null
    maxProjects: number
    maxTeams: number
    maxTeamMembers: number
    maxStorage: number
    currentPeriodStart: Date
    currentPeriodEnd: Date | null
    cancelledAt?: Date | null
}

export interface PaymentRecord {
    id: string
    amount: number
    currency: string
    status: string
    createdAt: Date
}
