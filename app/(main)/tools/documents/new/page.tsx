"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Sparkles, Save, ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { generateDocumentContent } from "@/actions/tools/ai.action"
import { uploadDocument } from "@/actions/tools/document.action"
import { toast } from "sonner"

export default function NewDocumentPage() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [aiPrompt, setAiPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const router = useRouter()

    const handleAiHelp = async () => {
        if (!aiPrompt.trim()) return
        setIsGenerating(true)
        try {
            const result = await generateDocumentContent(aiPrompt)
            if (result.success && result.content) {
                setContent(prev => prev + (prev ? "\n\n" : "") + result.content)
                setAiPrompt("")
                toast.success("AI content generated")
            } else {
                toast.error("AI generation failed")
            }
        } catch (error) {
            console.log("Error occurred while creating new document: " + error);
            toast.error("Something went wrong")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSave = async () => {
        if (!title || !content) {
            toast.error("Please provide a title and content")
            return
        }

        setLoading(true)
        try {
            const blob = new Blob([content], { type: 'text/plain' });
            const file = new File([blob], `${title}.txt`, { type: 'text/plain' });

            const formData = new FormData()
            formData.append("file", file)
            formData.append("title", title)
            formData.append("description", "Created via AI Editor")
            formData.append("extractedText", content)

            const result = await uploadDocument(formData)
            if (result.success) {
                toast.success("Document saved successfully")
                router.push("/tools/documents")
            } else {
                toast.error(result.error || "Failed to save document")
            }
        } catch (error) {
            console.log("Error occurred while saving the document: " + error);
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <Button onClick={handleSave} disabled={loading} className="gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Document
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <Input
                        placeholder="Document Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-2xl font-bold h-14 border-none shadow-none focus-visible:ring-0 px-0"
                    />
                    <Textarea
                        placeholder="Start writing your document here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[600px] text-lg leading-relaxed p-6 bg-white/50 backdrop-blur-sm border-none shadow-sm focus-visible:ring-primary/20"
                    />
                </div>

                <div className="space-y-6">
                    <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary font-bold">
                                <Sparkles className="h-5 w-5" />
                                AI Assistant
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Tell the AI what you want to write or improve.
                                (e.g., &quot;Draft a project proposal for a new website&quot;, &quot;Write a summary of these notes&quot;)
                            </p>
                            <Textarea
                                placeholder="Describe what you need..."
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                className="bg-white/80"
                            />
                            <Button
                                onClick={handleAiHelp}
                                disabled={isGenerating || !aiPrompt.trim()}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {isGenerating ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <Sparkles className="h-4 w-4 mr-2" />
                                )}
                                Generate with AI
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground space-y-2">
                            <p>• Be specific with your AI prompts for better results.</p>
                            <p>• You can ask the AI to summarize, expand, or rewrite content.</p>
                            <p>• All documents are added to your company knowledge base once saved.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
