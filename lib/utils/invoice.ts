export interface InvoiceItem {
	id: string
	description: string
	quantity: number
	rate: number
	amount: number
	category?: string
}

interface ProjectTask {
	id: string
	status: string
	title: string
	estimatedHours?: number | null
}

interface ProjectData {
	title: string
	budget?: number | null
	tasks?: ProjectTask[]
}

export interface InvoiceDetails {
	id: string
	invoiceNumber: string
	issueDate: Date
	dueDate: Date
	status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
	subtotal: number
	taxRate: number
	taxAmount: number
	discountRate?: number
	discountAmount?: number
	total: number
	currency: 'USD' | 'INR' | 'NPR'
	paymentTerms: string
	notes?: string
	items: InvoiceItem[]
}

export interface InvoiceBranding {
	companyLogo?: string
	companyName: string
	companyAddress: string
	companyEmail: string
	companyPhone?: string
	companyWebsite?: string
	primaryColor: string
	accentColor: string
}

export interface InvoiceRecipient {
	name: string
	email: string
	address?: string
	company?: string
}

export interface FullInvoice {
	details: InvoiceDetails
	branding: InvoiceBranding
	recipient: InvoiceRecipient
	project?: {
		id: string
		title: string
		slug: string
	}
}

/**
 * Generate invoice number
 */
export function generateInvoiceNumber(companyPrefix: string = 'INV'): string {
	const now = new Date()
	const year = now.getFullYear()
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const timestamp = now.getTime().toString().slice(-6)

	return `${companyPrefix}-${year}${month}-${timestamp}`
}

/**
 * Calculate invoice totals
 */
export function calculateInvoiceTotals(
	items: InvoiceItem[],
	taxRate: number = 0,
	discountRate: number = 0
): {
	subtotal: number
	discountAmount: number
	taxAmount: number
	total: number
} {
	const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
	const discountAmount = (subtotal * discountRate) / 100
	const discountedSubtotal = subtotal - discountAmount
	const taxAmount = (discountedSubtotal * taxRate) / 100
	const total = discountedSubtotal + taxAmount

	return {
		subtotal,
		discountAmount,
		taxAmount,
		total
	}
}

/**
 * Format currency for display
 */
export function formatInvoiceCurrency(
	amount: number,
	currency: 'USD' | 'INR' | 'NPR' = 'USD'
): string {
	const formatters = {
		USD: new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}),
		INR: new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR'
		}),
		NPR: new Intl.NumberFormat('en-NP', {
			style: 'currency',
			currency: 'NPR',
			minimumFractionDigits: 2
		})
	}

	return formatters[currency]?.format(amount) || `$${amount.toFixed(2)}`
}

/**
 * Calculate due date based on payment terms
 */
export function calculateDueDate(issueDate: Date, paymentTerms: string): Date {
	const due = new Date(issueDate)

	switch (paymentTerms.toLowerCase()) {
		case 'immediate':
		case 'due on receipt':
			return due
		case 'net 7':
			due.setDate(due.getDate() + 7)
			return due
		case 'net 15':
			due.setDate(due.getDate() + 15)
			return due
		case 'net 30':
		default:
			due.setDate(due.getDate() + 30)
			return due
		case 'net 60':
			due.setDate(due.getDate() + 60)
			return due
		case 'net 90':
			due.setDate(due.getDate() + 90)
			return due
	}
}

/**
 * Generate invoice items from project data
 */
export function generateInvoiceItemsFromProject(
	project: ProjectData,
	hourlyRate: number = 50,
	includeExpenses: boolean = false
): InvoiceItem[] {
	const items: InvoiceItem[] = []

	// Add project base fee
	items.push({
		id: 'project-base',
		description: `${project.title} - Development Services`,
		quantity: 1,
		rate: project.budget || 0,
		amount: project.budget || 0,
		category: 'Development'
	})

	// Add task-based items if needed
	if (project.tasks && project.tasks.length > 0) {
		const completedTasks = project.tasks.filter((t: ProjectTask) => t.status === 'COMPLETED')

		if (completedTasks.length > 0) {
			const taskHours = completedTasks.length * 8 // Assuming 8 hours per task

			items.push({
				id: 'task-hours',
				description: `Development Hours (${completedTasks.length} tasks completed)`,
				quantity: taskHours,
				rate: hourlyRate,
				amount: taskHours * hourlyRate,
				category: 'Development'
			})
		}
	}

	// Add expenses if requested
	if (includeExpenses) {
		items.push({
			id: 'expenses',
			description: 'Project Expenses (hosting, tools, etc.)',
			quantity: 1,
			rate: 200,
			amount: 200,
			category: 'Expenses'
		})
	}

	return items
}

/**
 * Validate invoice data
 */
export function validateInvoiceData(invoice: Partial<InvoiceDetails>): {
	isValid: boolean
	errors: string[]
} {
	const errors: string[] = []

	if (!invoice.invoiceNumber?.trim()) {
		errors.push('Invoice number is required')
	}

	if (!invoice.issueDate) {
		errors.push('Issue date is required')
	}

	if (!invoice.dueDate) {
		errors.push('Due date is required')
	}

	if (!invoice.items || invoice.items.length === 0) {
		errors.push('At least one invoice item is required')
	}

	if (invoice.items) {
		invoice.items.forEach((item, index) => {
			if (!item.description?.trim()) {
				errors.push(`Item ${index + 1}: Description is required`)
			}
			if (item.quantity <= 0) {
				errors.push(`Item ${index + 1}: Quantity must be greater than 0`)
			}
			if (item.rate < 0) {
				errors.push(`Item ${index + 1}: Rate cannot be negative`)
			}
		})
	}

	return {
		isValid: errors.length === 0,
		errors
	}
}

/**
 * Get invoice status color
 */
export function getInvoiceStatusColor(status: InvoiceDetails['status']): string {
	switch (status) {
		case 'DRAFT':
			return 'text-gray-600 bg-gray-100'
		case 'SENT':
			return 'text-blue-600 bg-blue-100'
		case 'PAID':
			return 'text-green-600 bg-green-100'
		case 'OVERDUE':
			return 'text-red-600 bg-red-100'
		case 'CANCELLED':
			return 'text-gray-500 bg-gray-50'
		default:
			return 'text-gray-600 bg-gray-100'
	}
}

/**
 * Check if invoice is overdue
 */
export function isInvoiceOverdue(invoice: InvoiceDetails): boolean {
	if (invoice.status === 'PAID' || invoice.status === 'CANCELLED') {
		return false
	}

	const now = new Date()
	const dueDate = new Date(invoice.dueDate)

	return now > dueDate
}

/**
 * Get payment terms options
 */
export function getPaymentTermsOptions(): Array<{ value: string; label: string }> {
	return [
		{ value: 'immediate', label: 'Due on Receipt' },
		{ value: 'net 7', label: 'Net 7 Days' },
		{ value: 'net 15', label: 'Net 15 Days' },
		{ value: 'net 30', label: 'Net 30 Days' },
		{ value: 'net 60', label: 'Net 60 Days' },
		{ value: 'net 90', label: 'Net 90 Days' }
	]
}

/**
 * Generate invoice HTML template
 */
export function generateInvoiceHTML(invoice: FullInvoice): string {
	const { details, branding, recipient, project } = invoice

	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${details.invoiceNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .invoice-container { max-width: 800px; margin: 20px auto; padding: 20px; background: white; }
        .invoice-header { display: flex; justify-content: between; align-items: center; margin-bottom: 40px; border-bottom: 3px solid ${branding.primaryColor}; padding-bottom: 20px; }
        .company-info { flex: 1; }
        .company-logo { max-width: 150px; margin-bottom: 10px; }
        .company-name { font-size: 24px; font-weight: bold; color: ${branding.primaryColor}; margin-bottom: 5px; }
        .invoice-details { text-align: right; }
        .invoice-number { font-size: 28px; font-weight: bold; color: ${branding.primaryColor}; }
        .invoice-date { color: #666; }
        .billing-section { display: flex; justify-content: between; margin: 40px 0; }
        .billing-info { flex: 1; }
        .billing-title { font-weight: bold; color: ${branding.primaryColor}; margin-bottom: 10px; }
        .invoice-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        .invoice-table th, .invoice-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .invoice-table th { background-color: ${branding.primaryColor}; color: white; }
        .invoice-table .amount { text-align: right; }
        .invoice-totals { margin-top: 20px; text-align: right; }
        .total-row { display: flex; justify-content: between; padding: 5px 0; }
        .total-final { font-size: 18px; font-weight: bold; color: ${branding.primaryColor}; border-top: 2px solid ${branding.primaryColor}; padding-top: 10px; margin-top: 10px; }
        .invoice-notes { margin-top: 40px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid ${branding.accentColor}; }
        .footer { margin-top: 40px; text-align: center; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        @media print { body { margin: 0; } .invoice-container { margin: 0; padding: 0; } }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
          <div class="company-info">
            ${branding.companyLogo ? `<img src="${branding.companyLogo}" alt="${branding.companyName}" class="company-logo">` : ''}
            <div class="company-name">${branding.companyName}</div>
            <div>${branding.companyAddress}</div>
            <div>${branding.companyEmail}</div>
            ${branding.companyPhone ? `<div>${branding.companyPhone}</div>` : ''}
            ${branding.companyWebsite ? `<div>${branding.companyWebsite}</div>` : ''}
          </div>
          <div class="invoice-details">
            <div class="invoice-number">INVOICE</div>
            <div class="invoice-number">#${details.invoiceNumber}</div>
            <div class="invoice-date">Issue Date: ${details.issueDate.toLocaleDateString()}</div>
            <div class="invoice-date">Due Date: ${details.dueDate.toLocaleDateString()}</div>
          </div>
        </div>

        <!-- Billing Information -->
        <div class="billing-section">
          <div class="billing-info">
            <div class="billing-title">Bill To:</div>
            <div><strong>${recipient.name}</strong></div>
            ${recipient.company ? `<div>${recipient.company}</div>` : ''}
            <div>${recipient.email}</div>
            ${recipient.address ? `<div>${recipient.address}</div>` : ''}
          </div>
          <div class="billing-info">
            ${project ? `
              <div class="billing-title">Project:</div>
              <div><strong>${project.title}</strong></div>
              <div>Project ID: ${project.slug}</div>
            ` : ''}
          </div>
        </div>

        <!-- Invoice Items -->
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th class="amount">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${details.items.map(item => `
              <tr>
                <td>
                  <strong>${item.description}</strong>
                  ${item.category ? `<br><small style="color: #666;">${item.category}</small>` : ''}
                </td>
                <td>${item.quantity}</td>
                <td>${formatInvoiceCurrency(item.rate, details.currency)}</td>
                <td class="amount">${formatInvoiceCurrency(item.amount, details.currency)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Totals -->
        <div class="invoice-totals" style="width: 300px; margin-left: auto;">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${formatInvoiceCurrency(details.subtotal, details.currency)}</span>
          </div>
          ${details.discountAmount && details.discountAmount > 0 ? `
            <div class="total-row" style="color: #d97706;">
              <span>Discount (${details.discountRate}%):</span>
              <span>-${formatInvoiceCurrency(details.discountAmount, details.currency)}</span>
            </div>
          ` : ''}
          ${details.taxAmount > 0 ? `
            <div class="total-row">
              <span>Tax (${details.taxRate}%):</span>
              <span>${formatInvoiceCurrency(details.taxAmount, details.currency)}</span>
            </div>
          ` : ''}
          <div class="total-row total-final">
            <span><strong>Total:</strong></span>
            <span><strong>${formatInvoiceCurrency(details.total, details.currency)}</strong></span>
          </div>
        </div>

        <!-- Payment Terms -->
        <div style="margin-top: 30px;">
          <strong>Payment Terms:</strong> ${details.paymentTerms}
        </div>

        <!-- Notes -->
        ${details.notes ? `
          <div class="invoice-notes">
            <strong>Notes:</strong><br>
            ${details.notes}
          </div>
        ` : ''}

        <!-- Footer -->
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>This invoice was generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </body>
    </html>
  `
}