import { getInvoices } from "@/actions/tools/invoice.action";
import { InvoicesDashboard } from "./_components/InvoicesDashboard";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function InvoicesPage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const invoicesResult = await getInvoices();
    const invoices = (invoicesResult.success && invoicesResult.invoices) ? invoicesResult.invoices : [];

    return (
        <div className="py-8 w-full max-w-[1400px] mx-auto">
            <InvoicesDashboard invoices={invoices} />
        </div>
    )
}