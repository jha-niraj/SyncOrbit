"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Send, Paperclip, Smile, MessageCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { getProjectMessages, sendMessage } from "@/actions/(client)/chat.action"
import { toast } from "sonner"
import Image from "next/image"
import { Role } from "@prisma/client"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

interface MessageData {
    id: string
    content: string
    imageUrl: string | null
    linkUrl: string | null
    linkTitle: string | null
    createdAt: Date
    updatedAt: Date
    user: {
        id: string
        name: string | null
        email: string | null
        image: string | null
        role: string
    }
}



interface ChatSheetProps {
    slug: string
    projectTitle: string
}

export function ChatSheet({ slug, projectTitle }: ChatSheetProps) {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<MessageData[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isTyping] = useState(false)
    const [loading, setLoading] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)

    const loadMessages = useCallback(async () => {
        if (!open) return
        try {
            setLoading(true)
            const result = await getProjectMessages(slug)

            if (result.success) {
                setMessages(result.messages)
            } else {
                toast.error(result.error || "Failed to load messages")
            }
        } catch (error) {
            console.error("Load messages error:", error)
            toast.error("Failed to load messages")
        } finally {
            setLoading(false)
        }
    }, [slug, open]);

    useEffect(() => {
        loadMessages()
    }, [loadMessages])

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        if (open) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, open])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !session?.user || !slug) return

        try {
            const result = await sendMessage({
                projectSlug: slug,
                content: newMessage.trim()
            })

            if (result.success && result.message) {
                setMessages(prev => [...prev, result.message!])
                setNewMessage("")
                toast.success("Message sent successfully")
            } else {
                toast.error(result.error || "Failed to send message")
            }
        } catch (error) {
            console.error("Send message error:", error)
            toast.error("Failed to send message")
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case Role.CLIENT:
                return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
            case Role.TEAM_MEMBER:
                return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
            case Role.TEAM_HEAD:
            case Role.COMPANY_OWNER:
                return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
        }
    }

    const renderMessage = (message: MessageData, index: number) => {
        const isOwnMessage = message.user.id === session?.user?.id
        const showAvatar = index === 0 || messages[index - 1].user.id !== message.user.id
        const showTimestamp = index === messages.length - 1 ||
            messages[index + 1].user.id !== message.user.id ||
            (new Date(messages[index + 1].createdAt).getTime() - new Date(message.createdAt).getTime()) > 300000 // 5 minutes

        return (
            <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
            >
                {
                    showAvatar && !isOwnMessage && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={message.user.image || ""} alt={message.user.name || "User"} />
                            <AvatarFallback className="text-xs">
                                {message.user.name?.split(' ').map((n: string) => n[0]).join('') || "U"}
                            </AvatarFallback>
                        </Avatar>
                    )
                }

                {!showAvatar && !isOwnMessage && <div className="w-8 flex-shrink-0" />}

                <div className={`flex flex-col max-w-[80%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    {
                        showAvatar && (
                            <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                <span className="text-sm font-medium text-foreground">{message.user.name || "Anonymous"}</span>
                                <Badge className={`${getRoleColor(message.user.role)} border text-xs`}>
                                    {message.user.role}
                                </Badge>
                            </div>
                        )
                    }

                    <div
                        className={`rounded-2xl px-4 py-2 ${isOwnMessage
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                            }`}
                    >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {
                            message.linkUrl && (
                                <a
                                    href={message.linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block mt-2 text-xs underline"
                                >
                                    {message.linkTitle || message.linkUrl}
                                </a>
                            )
                        }
                        {
                            message.imageUrl && (
                                <Image
                                    src={message.imageUrl}
                                    alt="Shared image"
                                    className="mt-2 max-w-full rounded-lg"
                                    width={200}
                                    height={200}
                                />
                            )
                        }
                    </div>

                    {
                        showTimestamp && (
                            <span className={`text-xs text-muted-foreground mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </span>
                        )
                    }
                </div>

                {
                    showAvatar && isOwnMessage && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={message.user.image || ""} alt={message.user.name || "User"} />
                            <AvatarFallback className="text-xs">
                                {message.user.name?.split(' ').map((n: string) => n[0]).join('') || "U"}
                            </AvatarFallback>
                        </Avatar>
                    )
                }
            </motion.div>
        )
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Chat
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-[50vw] flex flex-col p-0 h-full">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        {projectTitle} - Chat
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {messages.map((message, index) => renderMessage(message, index))}
                        </AnimatePresence>
                    )}

                    {
                        isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-3"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">...</AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-2xl px-4 py-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </motion.div>
                        )
                    }
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t bg-background">
                    <div className="flex items-end gap-3">
                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 relative">
                            <Input
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pr-12 min-h-10 resize-none"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                                <Smile className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            size="sm"
                            className="flex-shrink-0"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
