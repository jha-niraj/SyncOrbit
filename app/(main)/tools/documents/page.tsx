import { DocumentList } from "./_components/DocumentList";
import { UploadDocument } from "./_components/UploadDocument";
import { getDocuments } from "@/actions/tools/document.action";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DocumentsPage() {
    const documentsResult = await getDocuments();
    const documents = documentsResult.success ? documentsResult.documents : [];

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
                <div className="flex gap-4">
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/tools/documents/new">
                            <Plus className="h-4 w-4" />
                            Draft New Document
                        </Link>
                    </Button>
                    <UploadDocument />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Knowledge Base
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DocumentList initialDocuments={documents || []} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Total Documents</span>
                                <span className="font-bold">{documents?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Storage Used</span>
                                <span className="font-bold">
                                    {((documents?.reduce((acc: number, doc: any) => acc + (doc.size || 0), 0) || 0) / (1024 * 1024)).toFixed(2)} MB
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
