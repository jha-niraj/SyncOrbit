import MainPageInvoice from "../_components/mainpage";
import { getInvoicePreloadData } from "@/actions/tools/invoice.action";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function NewInvoicePage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const preloadData = await getInvoicePreloadData();

    return (
        <section className="w-full py-8">
            <MainPageInvoice
                initialCompany={preloadData.success ? preloadData.company : null}
                initialClients={preloadData.success ? preloadData.clients : []}
            />
        </section>
    )
}
