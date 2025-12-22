"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    FileText, Send, ChevronDown, ChevronUp, Plus,
    Download, ExternalLink, Bot, Terminal, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { sendInvoiceMessage } from "@/actions/tools/invoice.action"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"

import type { ToolsInvoice, InvoiceItem } from "@/types"

interface CurrentUser {
    id: string
    name: string | null
    email: string
}

interface Message {
    role?: string
    content: string
    senderId?: string
    sender?: { name: string | null }
    createdAt?: Date
}

interface InvoiceDetailsClientProps {
    invoice: ToolsInvoice
    currentUser: CurrentUser
}

export function InvoiceDetailsClient({ invoice, currentUser }: InvoiceDetailsClientProps) {
    const [messages, setMessages] = useState(invoice.messages || [])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isInvoiceFolded, setIsInvoiceFolded] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null!)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return

        const content = input.trim()
        setInput("")
        setIsLoading(true)

        try {
            const result = await sendInvoiceMessage(invoice.id, content)
            if (result.success) {
                setMessages((prev: { role: string; content: string }[]) => [...prev, result.message])
            } else {
                toast.error("Failed to send message")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsLoading(true)
        try {
            const result = await sendInvoiceMessage(invoice.id, `Uploaded document: ${file.name} (Signed)`)
            if (result.success) {
                setMessages((prev: { role: string; content: string }[]) => [...prev, result.message])
                toast.success("Document uploaded and synchronized")
            }
        } catch (error) {
            toast.error("Upload failure")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-6 py-6">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
            />
            {/* Top Stats/Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black">
                        #{invoice.invoiceNumber.slice(-2)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                            Invoice_{invoice.invoiceNumber}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Status:</span>
                            <Badge className="rounded-full px-2 py-0 text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border-none">
                                {invoice.status}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10 rounded-xl px-4 border-neutral-200 dark:border-neutral-800 font-bold text-xs gap-2">
                        <Download className="h-4 w-4" />
                        GET_PDF
                    </Button>
                    <Button className="h-10 rounded-xl px-4 bg-black dark:bg-white text-white dark:text-black font-bold text-xs gap-2">
                        <Zap className="h-4 w-4" />
                        EXECUTE_PAYMENT
                    </Button>
                </div>
            </div>

            {/* Foldable Invoice Preview */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-950 shadow-sm">
                <button
                    onClick={() => setIsInvoiceFolded(!isInvoiceFolded)}
                    className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-neutral-400" />
                        <span className="text-xs font-mono font-bold tracking-widest uppercase">System_Invoice_Manifest</span>
                    </div>
                    {isInvoiceFolded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </button>
                <AnimatePresence>
                    {!isInvoiceFolded && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800"
                        >
                            <div className="p-8 space-y-8">
                                <div className="flex justify-between">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Origin</p>
                                            <p className="text-sm font-black">{invoice.company.name}</p>
                                            <p className="text-xs text-neutral-500">{invoice.company.address}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Destination</p>
                                            <p className="text-sm font-black">{invoice.client.name}</p>
                                            <p className="text-xs text-neutral-500">{invoice.client.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-4">
                                        <div>
                                            <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Issue_Date</p>
                                            <p className="text-sm font-bold">{format(new Date(invoice.issuedAt), 'yyyy.MM.dd')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Due_Threshold</p>
                                            <p className="text-sm font-bold">{format(new Date(invoice.dueDate), 'yyyy.MM.dd')}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-neutral-200 dark:bg-neutral-800" />

                                <div className="space-y-4">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                                                <th className="pb-4">Description</th>
                                                <th className="pb-4 text-center">Qty</th>
                                                <th className="pb-4 text-right">Unit_Price</th>
                                                <th className="pb-4 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-medium tracking-tight">
                                            {invoice.items.map((item: InvoiceItem, i: number) => (
                                                <tr key={i} className="border-t border-neutral-100 dark:border-neutral-900">
                                                    <td className="py-4">{item.description}</td>
                                                    <td className="py-4 text-center">{item.quantity}</td>
                                                    <td className="py-4 text-right">${item.price.toLocaleString()}</td>
                                                    <td className="py-4 text-right font-bold">${(item.quantity * item.price).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <div className="w-64 space-y-2">
                                        <div className="flex justify-between text-xs font-mono">
                                            <span className="text-neutral-500 uppercase">Subtotal_Alloc</span>
                                            <span className="font-bold">${invoice.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-black italic uppercase">
                                            <span>Net_Total</span>
                                            <span>${invoice.amount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {invoice.pdfUrl && (
                                    <div className="pt-6">
                                        <Button variant="outline" className="w-full h-12 rounded-xl border-dashed border-neutral-300 dark:border-neutral-700 hover:bg-white dark:hover:bg-black transition-all group" asChild>
                                            <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                                OPEN_OFFICIAL_DOCUMENT_VIEWER
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Content: 2/3 and 1/3 */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left Side: Document History (2/3) */}
                <div className="w-2/3 flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Terminal className="h-4 w-4 text-neutral-400" />
                            <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-[0.2em]">Transaction_History</h3>
                        </div>
                        <Button variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-widest px-2">
                            Update_Manifest
                        </Button>
                    </div>

                    <div className="flex-1 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-950 overflow-hidden flex flex-col p-6">
                        <div className="mb-6 flex gap-2">
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                className="flex-1 h-12 rounded-xl border-dashed border-neutral-300 dark:border-neutral-700 font-bold text-[10px] uppercase tracking-widest gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                UPLOAD_SIGNATURE_DOC
                            </Button>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="space-y-8 relative">
                                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-neutral-200 dark:bg-neutral-800 border-dashed" />

                                {/* Event Items */}
                                <div className="relative pl-10 space-y-1">
                                    <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center border-4 border-white dark:border-neutral-950">
                                        <CheckCircle2 size={12} />
                                    </div>
                                    <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">INV_INITIATED</p>
                                    <p className="text-sm font-bold tracking-tight">Invoice generated and system synchronized.</p>
                                    <p className="text-[10px] font-mono text-neutral-400">{format(new Date(invoice.createdAt), 'yyyy-MM-dd HH:mm:ss')}</p>
                                </div>

                                <div className="relative pl-10 space-y-1">
                                    <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center border-4 border-white dark:border-neutral-950">
                                        <Send size={12} />
                                    </div>
                                    <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">INV_DISPATCHED</p>
                                    <p className="text-sm font-bold tracking-tight">Email transmission success to {invoice.client.email}.</p>
                                    <p className="text-[10px] font-mono text-neutral-400">{format(new Date(invoice.createdAt), 'yyyy-MM-dd HH:mm:ss')}</p>
                                </div>

                                {messages.filter((m: Message) => m.content.includes("signed") || m.content.includes("document")).map((m: Message, i: number) => (
                                    <div key={i} className="relative pl-10 space-y-1">
                                        <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white dark:border-neutral-950">
                                            <FileText size={12} />
                                        </div>
                                        <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">DOC_RECEIVED</p>
                                        <p className="text-sm font-bold tracking-tight">New document uploaded by {m.sender.name}.</p>
                                        <p className="text-[10px] font-mono text-neutral-400">{format(new Date(m.createdAt), 'yyyy-MM-dd HH:mm:ss')}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                {/* Right Side: Chat (1/3) */}
                <div className="w-1/3 flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-neutral-400" />
                        <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-[0.2em]">Communication_Channel</h3>
                    </div>

                    <div className="flex-1 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-950 overflow-hidden flex flex-col">
                        {/* Chat Messages */}
                        <ScrollArea className="flex-1 p-6" viewportRef={scrollRef}>
                            <div className="space-y-6">
                                {messages.map((m: Message, i: number) => (
                                    <div key={i} className={cn(
                                        "flex flex-col gap-1.5",
                                        m.senderId === currentUser.id ? "items-end" : "items-start"
                                    )}>
                                        <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest px-1">
                                            {m.sender.name} {/* */} {format(new Date(m.createdAt), 'HH:mm')}
                                        </span>
                                        <div className={cn(
                                            "max-w-[90%] px-4 py-3 text-xs leading-relaxed",
                                            m.senderId === currentUser.id
                                                ? "bg-black dark:bg-white text-white dark:text-black rounded-2xl rounded-tr-none font-bold"
                                                : "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-2xl rounded-tl-none border border-neutral-200 dark:border-neutral-800"
                                        )}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Chat Input */}
                        <div className="p-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="SYNC_MESSAGE..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    className="h-10 bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-xl font-mono text-[10px] tracking-tight"
                                />
                                <Button
                                    size="icon"
                                    className="h-10 w-10 shrink-0 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-80"
                                    onClick={handleSendMessage}
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

function CheckCircle2({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
}
