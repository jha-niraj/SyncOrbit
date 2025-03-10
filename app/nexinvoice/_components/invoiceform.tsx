import { useState, useRef } from "react"
import { Plus, Trash2, Receipt, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SignaturePad from "react-signature-canvas"
import type { InvoiceData, InvoiceItem, TaxItem } from "@/types/index"
import Image from "next/image"

interface InvoiceFormProps {
    data: InvoiceData
    onDataChange: (data: Partial<InvoiceData>) => void
    onSubmit: () => void
    format: "pdf" | "email"
    currency: string
    isLoading: boolean
}

export function InvoiceForm({ data, onDataChange, onSubmit, format, currency, isLoading }: InvoiceFormProps) {
    const [clientSignature, setClientSignature] = useState<string | null>(null)
    const [companySignature, setCompanySignature] = useState<string | null>(null)
    const clientSignaturePadRef = useRef<SignaturePad>(null)
    const companySignaturePadRef = useRef<SignaturePad>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const addItem = () => {
        const newItems = [...data.items, { description: "", quantity: 1, price: 0 }]
        onDataChange({ items: newItems })
    }

    const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...data.items]
        newItems[index] = { ...newItems[index], [field]: value }
        onDataChange({ items: newItems })
    }

    const removeItem = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index)
        onDataChange({ items: newItems })
    }

    const addTax = () => {
        const newTaxes = [...data.taxes, { description: "", percentage: 0 }]
        onDataChange({ taxes: newTaxes })
    }

    const updateTax = (index: number, field: keyof TaxItem, value: string | number) => {
        const newTaxes = [...data.taxes]
        newTaxes[index] = { ...newTaxes[index], [field]: value }
        onDataChange({ taxes: newTaxes })
    }

    const removeTax = (index: number) => {
        const newTaxes = data.taxes.filter((_, i) => i !== index)
        onDataChange({ taxes: newTaxes })
    }

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

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                onDataChange({ logo: e.target?.result as string })
            }
            reader.readAsDataURL(file)
        }
    }

    const triggerLogoUpload = () => {
        fileInputRef.current?.click()
    }

    const saveSignatures = () => {
        if (clientSignaturePadRef.current) {
            setClientSignature(clientSignaturePadRef.current.getTrimmedCanvas().toDataURL("image/png"))
        }
        if (companySignaturePadRef.current) {
            setCompanySignature(companySignaturePadRef.current.getTrimmedCanvas().toDataURL("image/png"))
        }
        onDataChange({ clientSignature, companySignature })
    }

    const getCurrencySymbol = (currency: string) => {
        switch (currency) {
            case "USD":
                return "$"
            case "INR":
                return "₹"
            case "EUR":
                return "€"
            default:
                return "$"
        }
    }

    return (
        <Card className="max-w-4xl mx-auto py-12 bg-white shadow-xl rounded-xl">
            <div className="p-8">
                <div id="form-container">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Receipt className="h-8 w-8 text-primary" />
                                <h1 className="text-4xl font-bold">
                                    Shunya Tech
                                </h1>
                            </div>
                            <div className="flex items-center justify-center space-x-4">
                                <p className="text-gray-500 mt-1 font-medium">Invoice Id: </p>
                                <Input
                                    name="invoiceId"
                                    placeholder="Invoice Id"
                                    value={data.invoiceid}
                                    type="text"
                                    onChange={(e) => onDataChange({ invoiceid: e.target.value })}
                                    className="border-gray-200 focus:border-primary w-32"
                                />
                            </div>
                        </div>
                        <div className="text-right">
                            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                            {
                                data.logo ? (
                                    <Image src={data.logo || "/placeholder.svg"} alt="Company Logo" className="w-32 h-32 object-contain" />
                                ) : (
                                    <div
                                        className="w-32 h-32 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl flex items-center justify-center border border-primary/10 cursor-pointer"
                                        onClick={triggerLogoUpload}
                                    >
                                        <Upload className="text-primary/40" />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <span className="h-1 w-4 bg-primary rounded-full"></span>
                                Bill From
                            </h2>
                            <div className="space-y-3">
                                <Input
                                    placeholder="Your Company Name"
                                    value={data.companyName}
                                    onChange={(e) => onDataChange({ companyName: e.target.value })}
                                    className="border-gray-200 focus:border-primary"
                                />
                                <Input
                                    placeholder="Your Company Email"
                                    value={data.companyEmail}
                                    onChange={(e) => onDataChange({ companyEmail: e.target.value })}
                                    className="border-gray-200 focus:border-primary"
                                />
                                <Input
                                    placeholder="Your Address"
                                    value={data.companyAddress}
                                    onChange={(e) => onDataChange({ companyAddress: e.target.value })}
                                    className="border-gray-200 focus:border-primary"
                                />
                                <Input
                                    placeholder="City, State, ZIP"
                                    value={data.companyCity}
                                    onChange={(e) => onDataChange({ companyCity: e.target.value })}
                                    className="border-gray-200 focus:border-primary"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <span className="h-1 w-4 bg-primary rounded-full"></span>
                                Bill To
                            </h2>
                            <div className="space-y-3">
                                <Input
                                    placeholder="Client Name"
                                    value={data.clientName}
                                    onChange={(e) => onDataChange({ clientName: e.target.value })}
                                    className="border-gray-200 focus:border-primary"
                                />
                                <Input
                                    placeholder="Client Email"
                                    value={data.clientEmail}
                                    onChange={(e) => onDataChange({ clientEmail: e.target.value })}
                                    className="border-gray-200 focus:border-primary"
                                />
                                <Input
                                    placeholder="Client Address"
                                    value={data.clientAddress}
                                    onChange={(e) => onDataChange({ clientAddress: e.target.value })}
                                    className="border-gray-200 focus:border-primary"
                                />
                                <Input
                                    placeholder="City, State, ZIP"
                                    value={data.clientCity}
                                    onChange={(e) => onDataChange({ clientCity: e.target.value })}
                                    className="border-gray-200 focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-12">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <Label className="text-gray-600">Invoice Date</Label>
                                <Input
                                    type="date"
                                    value={data.invoiceDate}
                                    onChange={(e) => onDataChange({ invoiceDate: e.target.value })}
                                    className="mt-2 border-gray-200 focus:border-primary"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-600">Due Date</Label>
                                <Input
                                    type="date"
                                    value={data.dueDate}
                                    onChange={(e) => onDataChange({ dueDate: e.target.value })}
                                    className="mt-2 border-gray-200 focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                            <span className="h-1 w-4 bg-primary rounded-full"></span>
                            Items
                        </h2>
                        <div className="space-y-4">
                            {
                                data.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-4 rounded-lg">
                                        <div className="col-span-6">
                                            <Input
                                                placeholder="Item description"
                                                value={item.description}
                                                onChange={(e) => updateItem(index, "description", e.target.value)}
                                                className="border-gray-200 focus:border-primary bg-white"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="number"
                                                placeholder="Qty"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                                                className="border-gray-200 focus:border-primary bg-white"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="number"
                                                placeholder="Price"
                                                value={item.price}
                                                onChange={(e) => updateItem(index, "price", Number(e.target.value))}
                                                className="border-gray-200 focus:border-primary bg-white"
                                            />
                                        </div>
                                        <div className="col-span-1 text-right font-medium">
                                            {getCurrencySymbol(currency)}
                                            {(item.quantity * item.price).toFixed(2)}
                                        </div>
                                        <div className="col-span-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeItem(index)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-4 border-primary text-primary hover:bg-primary hover:text-white"
                            onClick={addItem}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                        </Button>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                            <span className="h-1 w-4 bg-primary rounded-full"></span>
                            Taxes
                        </h2>
                        <div className="space-y-4">
                            {
                                data.taxes.map((tax, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-4 rounded-lg">
                                        <div className="col-span-8">
                                            <Input
                                                placeholder="Tax description"
                                                value={tax.description}
                                                onChange={(e) => updateTax(index, "description", e.target.value)}
                                                className="border-gray-200 focus:border-primary bg-white"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="number"
                                                placeholder="%"
                                                value={tax.percentage}
                                                onChange={(e) => updateTax(index, "percentage", Number(e.target.value))}
                                                className="border-gray-200 focus:border-primary bg-white"
                                            />
                                        </div>
                                        <div className="col-span-1 text-right font-medium">
                                            {getCurrencySymbol(currency)}
                                            {(calculateSubtotal() * (tax.percentage / 100)).toFixed(2)}
                                        </div>
                                        <div className="col-span-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeTax(index)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-4 border-primary text-primary hover:bg-primary hover:text-white"
                            onClick={addTax}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Tax
                        </Button>
                    </div>
                    <div className="border-t border-gray-100 pt-8 mb-12">
                        <div className="flex justify-end">
                            <div className="w-80 space-y-3">
                                <div className="flex justify-between px-4 py-2 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">
                                        {getCurrencySymbol(currency)}
                                        {calculateSubtotal().toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between px-4 py-2 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Total Tax:</span>
                                    <span className="font-medium">
                                        {getCurrencySymbol(currency)}
                                        {calculateTotalTax(calculateSubtotal()).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between px-4 py-3 bg-primary/5 rounded-lg border border-primary/10">
                                    <span className="font-semibold text-primary">Total:</span>
                                    <span className="font-bold text-primary">
                                        {getCurrencySymbol(currency)}
                                        {calculateTotal().toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-12 border-t border-gray-100 pt-8">
                        <div>
                            <Label className="mb-3 block text-gray-600">Client Signature</Label>
                            <div className="border border-gray-200 rounded-xl bg-gray-50 h-32 overflow-hidden">
                                <SignaturePad
                                    ref={clientSignaturePadRef}
                                    canvasProps={{
                                        className: "w-full h-full",
                                    }}
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2 text-center">{data.clientName}</p>
                        </div>
                        <div>
                            <Label className="mb-3 block text-gray-600">Company Signature</Label>
                            <div className="border border-gray-200 rounded-xl bg-gray-50 h-32 overflow-hidden">
                                <SignaturePad
                                    ref={companySignaturePadRef}
                                    canvasProps={{
                                        className: "w-full h-full",
                                    }}
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2 text-center">{data.companyName}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={saveSignatures}>
                        Save Signatures
                    </Button>
                    <Button type="submit" className="bg-primary text-white hover:bg-primary/90" onClick={onSubmit}>
                        {format === "pdf" ? "Generate PDF" : (isLoading ? "Sending Mail..." : "Send Invoice")}
                    </Button>
                </div>
            </div>
        </Card>
    )
}

