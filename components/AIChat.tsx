"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Send, X, Minimize2, Maximize2, Sparkles, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { chatWithAI } from "@/actions/tools/ai.action"
import { cn } from "@/lib/utils"

export function AIChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
        { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showSlashMenu, setShowSlashMenu] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const tools = [
        { name: "Analyze Document", icon: <Bot className="h-4 w-4" />, command: "/analyze" },
        { name: "Create Invoice", icon: <Wand2 className="h-4 w-4" />, command: "/invoice" },
        { name: "Generate Report", icon: <Sparkles className="h-4 w-4" />, command: "/report" },
    ]

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput("")
        setShowSlashMenu(false)
        setMessages(prev => [...prev, { role: "user", content: userMessage }])
        setIsLoading(true)

        try {
            const result = await chatWithAI([...messages, { role: "user", content: userMessage }])
            if (result.success && result.message?.content) {
                setMessages(prev => [...prev, { role: "assistant", content: result.message!.content! }])
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }])
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting to the AI service." }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setInput(val)
        if (val === "/") {
            setShowSlashMenu(true)
        } else {
            setShowSlashMenu(false)
        }
    }

    const applyCommand = (command: string) => {
        setInput(command + " ")
        setShowSlashMenu(false)
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4"
                    >
                        <Card className="w-[400px] h-[550px] flex flex-col shadow-2xl border-primary/10 overflow-hidden bg-white/90 backdrop-blur-md">
                            <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold leading-none">SyncOrbit AI</h3>
                                        <span className="text-[10px] opacity-70">Knowledgeable & Helpful</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/20" onClick={() => setIsOpen(false)}>
                                        <Minimize2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
                                <div className="space-y-4">
                                    {messages.map((m, i) => (
                                        <div key={i} className={cn(
                                            "flex flex-col max-w-[80%]",
                                            m.role === "user" ? "ml-auto items-end" : "items-start"
                                        )}>
                                            <div className={cn(
                                                "p-3 rounded-2xl text-sm",
                                                m.role === "user"
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted rounded-tl-none"
                                            )}>
                                                {m.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex items-center gap-2 text-muted-foreground animate-pulse ml-2">
                                            <Bot className="h-4 w-4" />
                                            <span className="text-xs">Thinking...</span>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            {showSlashMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-[72px] left-4 right-4 bg-white border rounded-xl shadow-lg p-2 z-10"
                                >
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground px-2 mb-1">Quick Tools</p>
                                    {tools.map((tool) => (
                                        <button
                                            key={tool.command}
                                            onClick={() => applyCommand(tool.command)}
                                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg text-sm transition-colors text-left"
                                        >
                                            <div className="bg-primary/5 p-1.5 rounded-md text-primary">
                                                {tool.icon}
                                            </div>
                                            <span>{tool.name}</span>
                                            <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">{tool.command}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}

                            <div className="p-4 border-t bg-white">
                                <div className="flex gap-2 relative">
                                    <Input
                                        placeholder="Type '/' for tools..."
                                        value={input}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                        className="bg-muted/50 border-none focus-visible:ring-primary"
                                    />
                                    <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 text-center italic">
                                    AI may provide inaccurate info. Verify important details.
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-2xl transition-all duration-300",
                    isOpen ? "rotate-90 scale-0" : "scale-100"
                )}
                onClick={() => setIsOpen(true)}
            >
                <Bot className="h-7 w-7" />
            </Button>

            {isOpen && (
                <Button
                    size="icon"
                    variant="outline"
                    className="h-14 w-14 rounded-full shadow-2xl bg-white hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="h-7 w-7" />
                </Button>
            )}
        </div>
    )
}
