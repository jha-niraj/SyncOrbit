import { getDocumentById } from "@/actions/tools/document.action";
import { DocumentDetailClient } from "../../_components/DocumentDetailClient";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const { id } = await params;
    const result = await getDocumentById(id);

    if (!result.success || !result.document) {
        if (result.error === "Access denied") redirect("/tools/documents");
        notFound();
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto px-6 h-full">
            <DocumentDetailClient document={result.document} />
        </div>
    );
}