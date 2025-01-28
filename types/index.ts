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