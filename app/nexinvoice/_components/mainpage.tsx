"use client"

import { useState } from "react"
import { InvoiceNavbar } from "./invoicenavbar";
import { InvoiceForm } from "./invoiceform";
import type { InvoiceData } from "@/types/index"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function MainPageInvoice() {
    const [format, setFormat] = useState<"pdf" | "email">("pdf")
    const [currency, setCurrency] = useState<string>("USD")
    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        invoiceid: "NEX-",
        logo: null,
        companyName: "",
        companyEmail: "",
        companyAddress: "",
        companyCity: "",
        clientName: "",
        clientEmail: "",
        clientAddress: "",
        clientCity: "",
        invoiceDate: "",
        dueDate: "",
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
        // if (!invoiceData.logo || !invoiceData.companyName || !invoiceData.companyAddress || !invoiceData.companyCity || !invoiceData.clientName || !invoiceData.clientAddress || !invoiceData.clientCity || !invoiceData.invoiceDate || !invoiceData.dueDate || !invoiceData.items || !invoiceData.taxes || !invoiceData.clientSignature || !invoiceData.companySignature) {
        //     alert("Please fill the necessary fields.");
        //     return;
        // }

        const element = document.getElementById("form-container");
        if (!element) {
            return;
        }

        if (format === "pdf") {
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("invoice.pdf");
        } else {
            setIsLoading(true);
            try {
                const canvas = await html2canvas(element);
                const imgData = canvas.toDataURL("image/png").split(',')[1];

                const recipientEmail = invoiceData.clientEmail;

                const response = await fetch('/api/sendinvoice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        recipientEmail,
                        invoiceImage: imgData,
                        invoiceNumber: invoiceData.invoiceid,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to send email');
                }

                const result = await response.json();
                alert(result.message || "The invoice has been sent via email.");
            } catch (error) {
                console.error('Error:', error);
                alert(`Failed to send email: ${error}`);
            } finally {
                setIsLoading(false);
            }
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
                />
            </div>
        </div>
    )
}

