import { Receipt } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { InvoiceData } from "@/types/index"
import Image from "next/image"

export function PDFInvoice({ data }: { data: InvoiceData }) {
    const calculateSubtotal = () => {
        return data.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
    }

    const calculateTotalTax = (subtotal: number) => {
        return data.taxes.reduce((sum, tax) => sum + subtotal * (tax.percentage / 100), 0)
    }

    const calculateTotal = () => {
        const subtotal = calculateSubtotal()
        return subtotal + calculateTotalTax(subtotal)
    }

    return (
        <Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl print:shadow-none">
            <div className="p-8">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Receipt className="h-8 w-8 text-primary" />
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
                                VayuLabs
                            </h1>
                        </div>
                        <p className="text-gray-500 mt-1 font-medium">Invoice #VL-2025-001</p>
                    </div>
                    <div className="text-right">
                        {
                            data.logo && (
                                <Image src={data.logo || "/placeholder.svg"} alt="Company Logo" className="w-32 h-32 object-contain" />
                            )
                        }
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bill From</h2>
                        <p>{data.companyName}</p>
                        <p>{data.companyAddress}</p>
                        <p>{data.companyCity}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bill To</h2>
                        <p>{data.clientName}</p>
                        <p>{data.clientAddress}</p>
                        <p>{data.clientCity}</p>
                    </div>
                </div>
                <div className="mb-12">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-gray-600">Invoice Date: {data.invoiceDate}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Due Date: {data.dueDate}</p>
                        </div>
                    </div>
                </div>
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-2">Description</th>
                                <th className="text-right py-2">Quantity</th>
                                <th className="text-right py-2">Price</th>
                                <th className="text-right py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.items.map((item, index: number) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="py-2">{item.description}</td>
                                        <td className="text-right py-2">{item.quantity}</td>
                                        <td className="text-right py-2">${item.price.toFixed(2)}</td>
                                        <td className="text-right py-2">${(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Taxes</h2>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-2">Description</th>
                                <th className="text-right py-2">Rate</th>
                                <th className="text-right py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.taxes.map((tax, index: number) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="py-2">{tax.description}</td>
                                        <td className="text-right py-2">{tax.percentage}%</td>
                                        <td className="text-right py-2">${(calculateSubtotal() * (tax.percentage / 100)).toFixed(2)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className="border-t border-gray-100 pt-8 mb-12">
                    <div className="flex justify-end">
                        <div className="w-80 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Tax:</span>
                                <span className="font-medium">${calculateTotalTax(calculateSubtotal()).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-primary">Total:</span>
                                <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-12 border-t border-gray-100 pt-8">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Signature</h2>
                        {
                            data.clientSignature && (
                                <Image
                                    src={data.clientSignature || "/placeholder.svg"}
                                    alt="Client Signature"
                                    className="w-64 h-32 object-contain"
                                />
                            )
                        }
                        <p className="text-sm text-gray-500 mt-2">{data.clientName}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Signature</h2>
                        {
                            data.companySignature && (
                                <Image
                                    src={data.companySignature || "/placeholder.svg"}
                                    alt="Company Signature"
                                    className="w-64 h-32 object-contain"
                                />
                            )
                        }
                        <p className="text-sm text-gray-500 mt-2">{data.companyName}</p>
                    </div>
                </div>
                <div className="mt-12 text-center">
                    <p className="text-gray-500">Thank you for choosing VayuLabs</p>
                </div>
            </div>
        </Card>
    )
}

