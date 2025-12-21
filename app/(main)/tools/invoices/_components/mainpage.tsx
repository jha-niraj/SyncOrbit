"use client"

import { useState } from "react"
import { InvoiceForm } from "./invoiceform";
import { createInvoice } from "@/actions/tools/invoice.action";
import { toast } from "sonner";

export interface InvoiceData {
    invoiceid: string;
    logo: string | null;
    companyName: string;
    companyEmail: string;
    companyAddress: string;
    companyCity: string;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    clientCity: string;
    clientId?: string;
    invoiceDate: string;
    dueDate: string;
    items: { description: string; quantity: number; price: number }[];
    taxes: { description: string; percentage: number }[];
    clientSignature: string | null;
    companySignature: string | null;
}

interface MainPageInvoiceProps {
    initialCompany: any;
    initialClients: any[];
}

export default function MainPageInvoice({ initialCompany, initialClients }: MainPageInvoiceProps) {
    const [format, setFormat] = useState<"pdf" | "email">("pdf")
    const [currency, setCurrency] = useState<string>("USD")
    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        invoiceid: `INV-${Date.now().toString().slice(-6)}`,
        logo: initialCompany?.logo || null,
        companyName: initialCompany?.name || "",
        companyEmail: "", // Could be fixed to owner email
        companyAddress: initialCompany?.address || "",
        companyCity: "",
        clientName: "",
        clientEmail: "",
        clientAddress: "",
        clientCity: "",
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ description: "", quantity: 1, price: 0 }],
        taxes: [{ description: "VAT", percentage: 10 }],
        clientSignature: null,
        companySignature: null,
    })
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDataChange = (newData: Partial<InvoiceData>) => {
        setInvoiceData((prevData) => ({ ...prevData, ...newData }))
    }

    const handleGenerateInvoice = async () => {
        const element = document.getElementById("form-container");
        if (!element) return;

        setIsLoading(true);
        try {
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

            if (format === "pdf") {
                pdf.save(`${invoiceData.invoiceid}.pdf`);
                toast.success("Invoice downloaded successfully");
            } else {
                // Upload and send email
                const pdfBlob = pdf.output('blob');
                const pdfFile = new File([pdfBlob], `${invoiceData.invoiceid}.pdf`, { type: 'application/pdf' });

                const formData = new FormData();
                formData.append("pdf", pdfFile);
                formData.append("invoiceNumber", invoiceData.invoiceid);
                formData.append("amount", (invoiceData.items.reduce((sum, item) => sum + item.quantity * item.price, 0) * (1 + invoiceData.taxes.reduce((sum, tax) => sum + tax.percentage, 0) / 100)).toString());
                formData.append("clientId", invoiceData.clientId || "");
                formData.append("dueDate", invoiceData.dueDate);
                formData.append("items", JSON.stringify(invoiceData.items));
                formData.append("notes", "");

                const result = await createInvoice(formData);

                if (result.success) {
                    toast.success("Invoice sent successfully via email");
                } else {
                    toast.error(result.error || "Failed to send invoice");
                }
            }
        } catch (err) {
            console.error('Error generating invoice:', err);
            toast.error("An error occurred while generating the invoice");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
            <InvoiceNavbar
                onFormatChange={setFormat}
                onCurrencyChange={setCurrency}
                currentFormat={format}
                currentCurrency={currency}
            />
            <div className="p-8">
                <InvoiceForm
                    data={invoiceData}
                    onDataChange={handleDataChange}
                    onSubmit={handleGenerateInvoice}
                    format={format}
                    currency={currency}
                    isLoading={isLoading}
                    clients={initialClients}
                />
            </div>
        </div>
    )
}

