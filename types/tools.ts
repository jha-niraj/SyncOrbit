// Types for Tools Module (Documents, Invoices, Financials, Reports)

import { User } from './user'

// ============================================
// DOCUMENT TYPES
// ============================================

export interface Document {
    id: string
    title: string
    description: string | null
    fileUrl: string
    fileType: string
    size: number | null
    category: string
    extractedText: string | null
    uploaderId: string
    uploader?: Partial<User>
    companyId: string
    createdAt: Date
    updatedAt: Date
}

export interface DocumentUploadData {
    file: File
    title: string
    description?: string
    extractedText?: string
}

// ============================================
// INVOICE TYPES
// ============================================

export interface InvoiceItem {
    description: string
    quantity: number
    price: number
}

export interface InvoiceTax {
    description: string
    percentage: number
}

export interface Client {
    id: string
    name: string | null
    email: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    pincode?: string | null
}

export interface Company {
    id: string
    name: string
    email?: string
    address?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    pincode?: string | null
    logo?: string | null
}

export interface InvoiceMessage {
    id: string
    content: string
    senderId: string
    sender: Partial<User>
    invoiceId: string
    createdAt: Date
}

export interface Invoice {
    id: string
    invoiceNumber: string
    amount: number
    status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
    dueDate: Date
    issuedAt: Date
    pdfUrl?: string | null
    clientId: string
    client: Client
    companyId: string
    company: Company
    items: InvoiceItem[] | unknown
    messages?: InvoiceMessage[]
    createdAt: Date
    updatedAt: Date
}

export interface InvoiceFormData {
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
    clientId?: string
    invoiceDate: string
    dueDate: string
    items: InvoiceItem[]
    taxes: InvoiceTax[]
    clientSignature: string | null
    companySignature: string | null
}

// ============================================
// FINANCIAL TYPES
// ============================================

export interface ExpenseCategory {
    id?: string
    name: string
    companyId?: string
    createdAt?: Date
}

export interface Expense {
    id: string
    description: string
    amount: number
    category: string
    date: Date
    creatorId: string
    creator?: Partial<User>
    companyId: string
    verified?: boolean
    currency?: string
    receiptUrl?: string | null
    createdAt: Date
    updatedAt: Date
}

export interface ExpenseFormData {
    description: string
    amount: number
    category: string
    date: Date
}

// ============================================
// REPORT TYPES
// ============================================

export type ReportType = 'FINANCIAL' | 'OPERATIONS' | 'TEAMS' | 'CUSTOM'

export interface ReportData {
    summary?: string
    metrics?: Record<string, number | string>
    charts?: Array<{
        type: string
        data: unknown
    }>
    [key: string]: unknown
}

export interface Report {
    id: string
    title: string
    type: string
    data: ReportData | unknown
    creatorId: string
    creator?: Partial<User>
    companyId: string
    createdAt: Date
    updatedAt: Date
}

export interface ReportGenerationData {
    title: string
    type: ReportType
    reportData: ReportData
}

// ============================================
// AI CHAT TYPES
// ============================================

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export interface AIResponse {
    success: boolean
    message?: ChatMessage
    error?: string
}
