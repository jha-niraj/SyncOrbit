"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { FileText, Download, ExternalLink, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface DocumentListProps {
    initialDocuments: any[]
}

export function DocumentList({ initialDocuments }: DocumentListProps) {
    if (initialDocuments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No documents yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Upload your first document to start building your company knowledge base.
                </p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {initialDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium leading-none mb-1">{doc.title}</p>
                                    <p className="text-xs text-muted-foreground">{doc.fileType.split('/')[1]?.toUpperCase() || 'FILE'} • {(doc.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-3 w-3 text-muted-foreground" />
                                {doc.uploader?.name || "Unknown"}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {format(new Date(doc.createdAt), "MMM d, yyyy")}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" asChild title="View File">
                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button variant="ghost" size="icon" asChild title="Download">
                                    <a href={doc.fileUrl} download={doc.title}>
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
