import { getDocuments } from "@/actions/tools/document.action";
import { DocumentsLanding } from "../_components/DocumentsLanding";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CategoryDocumentsPage({ params }: { params: { category: string } }) {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const category = params.category.toUpperCase();
    const documentsResult = await getDocuments();
    const allDocuments = (documentsResult.success && documentsResult.documents) ? documentsResult.documents : [];

    // Filter by category if not "all"
    const documents = category === "ALL"
        ? allDocuments
        : allDocuments.filter((doc: any) => doc.category === category);

    return (
        <div className="py-8 w-full max-w-[1400px] mx-auto">
            <DocumentsLanding documents={documents || []} />
        </div>
    )
}
