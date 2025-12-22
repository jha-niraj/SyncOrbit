"use client"

import { useState, useRef, useEffect } from "react"
import {
    FileText, Send, Zap, Cpu, Download, ArrowLeft, Maximize2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { chatWithAI } from "@/actions/tools/ai.action"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Document } from "@/types"

interface DocumentDetailClientProps {
    document: Document
}

export function DocumentDetailClient({ document: doc }: DocumentDetailClientProps) {
    const [messages, setMessages] = useState([
        { role: "assistant", content: `SCAN_COMPLETE: Document "${doc.title}" synchronized. Neural processor ready for analysis. What would you like to verify?` }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null!)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: "user", content: userMessage }])
        setIsLoading(true)

        try {
            // Enhanced context for AI
            const contextPrompt = `Context: This is based on a document titled "${doc.title}". ${doc.extractedText ? `Document Content: ${doc.extractedText.slice(0, 2000)}...` : ""}\n\nUser Question: ${userMessage}`

            const result = await chatWithAI([...messages, { role: "user", content: contextPrompt }])
            if (result.success && result.message?.content) {
                setMessages(prev => [...prev, { role: "assistant", content: result.message!.content! }])
            }
        } catch (error) {
            console.log("Error occurred while submitting expense data: " + error);
            setMessages(prev => [...prev, { role: "assistant", content: "ERROR_CODE_0x9: Neural link failure." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-6 py-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full" asChild>
                        <Link href="/tools/documents">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-neutral-400 tracking-widest">Archive_Path: {doc.category}</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter">{doc.title}</h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-11 rounded-xl border-neutral-200 dark:border-neutral-800 font-bold text-xs tracking-widest gap-2" asChild>
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                            Get Source
                        </a>
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left: Document View (2/3) */}
                <div className="w-2/3 flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-bold text-neutral-400 tracking-widest">Visual_Monitor</span>
                        </div>
                        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1 border border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-100 dark:bg-black overflow-hidden relative">
                        {doc.fileUrl.endsWith('.pdf') ? (
                            <iframe
                                src={`${doc.fileUrl}#toolbar=0`}
                                className="w-full h-full border-none"
                                title="Document Viewer"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-12 text-center">
                                <FileText className="h-16 w-16 opacity-10" />
                                <div className="space-y-2">
                                    <p className="font-black tracking-tighter text-xl text-neutral-400">Preview_Unavailable</p>
                                    <p className="text-md text-neutral-500 font-medium max-w-xs">{doc.title} does not support direct visual stream. Use &quot;Get Source&quot; to audit.</p>
                                </div>
                                <Button className="mt-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black text-xs tracking-widest px-8 h-12" asChild>
                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">Download For Audit</a>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: AI Chat (1/3) */}
                <div className="w-1/3 flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center gap-2 px-2">
                        <Cpu className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-neutral-400 tracking-widest">Neural_Processor_V4</span>
                    </div>

                    <div className="flex-1 border border-neutral-200 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-950 overflow-hidden flex flex-col shadow-xl">
                        {/* Status Bar */}
                        <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-bold text-neutral-400 tracking-[0.2em]">Context_Synched: Ready</span>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-6" viewportRef={scrollRef}>
                            <div className="space-y-6">
                                {messages.map((m, i) => (
                                    <div key={i} className={cn(
                                        "flex flex-col gap-2",
                                        m.role === "user" ? "items-end" : "items-start"
                                    )}>
                                        <span className="text-[8px] font-bold text-neutral-400 tracking-widest px-1">
                                            {m.role === "user" ? "SYSTEM_AUDITOR" : "ORBITAL_CORE"}
                                        </span>
                                        <div className={cn(
                                            "max-w-[95%] px-4 py-3 text-md leading-relaxed",
                                            m.role === "user"
                                                ? "bg-black dark:bg-white text-white dark:text-black rounded-2xl rounded-tr-none font-bold"
                                                : "bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-2xl rounded-tl-none border border-neutral-200 dark:border-neutral-800"
                                        )}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex items-center gap-3 text-neutral-400 animate-pulse">
                                        <Zap className="h-3 w-3 fill-emerald-500" />
                                        <span className="text-[8px] tracking-[0.2em]">Processing_Data_Stream...</span>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="QUERY_NEURAL_LINK..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    className="h-12 bg-neutral-50 dark:bg-neutral-900 border-none rounded-xl text-md tracking-tight focus-visible:ring-black dark:focus-visible:ring-white"
                                />
                                <Button
                                    size="icon"
                                    className="h-12 w-12 shrink-0 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-transform"
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
