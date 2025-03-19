import MainPageInvoice from "./_components/mainpage";

export const runtime = "edge";

export default function NexInvoice() {
    return (
        <section className="w-full flex items-center justify-center">
            <MainPageInvoice />
        </section>
    )
}