import MainPageInvoice from "./_components/mainpage";
import { getInvoicePreloadData } from "@/actions/tools/invoice.action";

export default async function NexInvoice() {
    const preloadData = await getInvoicePreloadData();

    return (
        <section className="w-full flex items-center justify-center">
            <MainPageInvoice
                initialCompany={preloadData.success ? preloadData.company : null}
                initialClients={preloadData.success ? preloadData.clients : []}
            />
        </section>
    )
}