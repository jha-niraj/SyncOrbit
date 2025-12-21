"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Upload, FileText, Loader2 } from "lucide-react"
import { uploadDocument } from "@/actions/tools/document.action"
import { toast } from "sonner"
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

export function UploadDocument() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const extractTextFromPDF = async (file: File): Promise<string> => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                fullText += pageText + "\n";
            }

            return fullText;
        } catch (error) {
            console.error("Error extracting text:", error);
            return "";
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return;

        setLoading(true);
        try {
            let extractedText = "";
            if (file.type === "application/pdf") {
                extractedText = await extractTextFromPDF(file);
            } else if (file.type === "text/plain") {
                extractedText = await file.text();
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", title || file.name);
            formData.append("description", description);
            formData.append("extractedText", extractedText);

            const result = await uploadDocument(formData);

            if (result.success) {
                toast.success("Document uploaded and added to knowledge base");
                setOpen(false);
                setFile(null);
                setTitle("");
                setDescription("");
            } else {
                toast.error(result.error || "Failed to upload document");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Upload Document
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="file">File (PDF or TXT)</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".pdf,.txt"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Q4 Financial Report"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Briefly describe what's in this document"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading || !file}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload & Analyze
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
