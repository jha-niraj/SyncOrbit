import { getDocuments } from "@/actions/tools/document.action";
import { DocumentsLanding } from "./_components/DocumentsLanding";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const documentsResult = await getDocuments();
    const documents = documentsResult.success ? documentsResult.documents : [];

    return (
        <div className="py-8 w-full max-w-[1400px] mx-auto">
            <DocumentsLanding documents={documents || []} />
        </div>
    )
}
