import { getInvoiceById } from "@/actions/tools/invoice.action";
import { InvoiceDetailsClient } from "../_components/InvoiceDetailsClient";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const { id } = await params;
    const result = await getInvoiceById(id);

    if (!result.success || !result.invoice) {
        if (result.error === "Access denied") {
            redirect("/tools/invoices");
        }
        notFound();
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto px-6 h-full">
            <InvoiceDetailsClient
                invoice={result.invoice}
                currentUser={session.user}
            />
        </div>
    );
}