// Request body:
export interface RequestBody {
    name: string;
    email: string;
    password: string;
    referralCode?: string;
    role?: 'CLIENT' | 'DEVELOPER' | 'PRODUCTMANAGER' | 'ADMIN';
}

// Invoice Page Types:
export interface InvoiceItem {
    description: string
    quantity: number
    price: number
}

export interface TaxItem {
    description: string
    percentage: number
}

export interface InvoiceData {
    invoiceid: string
    logo: string | null
    companyName: string
    companyEmail: string
    companyAddress: string
    companyCity: string
    clientName: string
    clientEmail: string
    clientAddress: string
    clientCity: string
    invoiceDate: string
    dueDate: string
    items: InvoiceItem[]
    taxes: TaxItem[]
    clientSignature: string | null
    companySignature: string | null
}

// Budget Estimator Types and Interfaces:
export type EstimateDetail = {
    description: string
    cost: number
}
export type EstimateResult = {
    projectName: string
    projectType: string
    complexity: string
    timeline: string
    additionalRequirements?: string[]
    customRequirements?: string[]
    projectGoals?: string[]
    targetAudience?: string
    teamSize?: string
    budgetRange?: string
    totalCost: number
    breakdown: {
        [key: string]: number
    }
    details?: {
        [key: string]: EstimateDetail[]
    }
}