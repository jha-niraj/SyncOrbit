"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
    ArrowLeft, 
    Send, 
    Paperclip, 
    Smile,
    MoreVertical,
    Phone,
    Video,
    Info
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { getProjectMessages, sendMessage, getProjectForChat } from "@/actions/(client)/chat.action"
import { toast } from "sonner"
import Image from "next/image"

interface ChatPageProps {
    params: Promise<{
        slug: string
    }>
}

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

interface ProjectInfo {
    id: string
    title: string
    slug: string
}

export default function ProjectChatPage({ params }: ChatPageProps) {
    const { data: session } = useSession()
    const [project, setProject] = useState<ProjectInfo | null>(null)
    const [messages, setMessages] = useState<MessageData[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isTyping, _setIsTyping] = useState(false)
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [slug, setSlug] = useState<string>("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params
            setSlug(resolvedParams.slug)
        }
        resolveParams()
    }, [params])

    const loadProjectAndMessages = useCallback(async () => {
        try {
            setLoading(true)
            
            // Load project info and messages
            const [projectResult, messagesResult] = await Promise.all([
                getProjectForChat(slug),
                getProjectMessages(slug)
            ])
            
            if (projectResult.success && projectResult.project) {
                setProject(projectResult.project)
            } else {
                toast.error(projectResult.error || "Failed to load project")
                return
            }

            if (messagesResult.success) {
                setMessages(messagesResult.messages)
            } else {
                toast.error(messagesResult.error || "Failed to load messages")
            }
        } catch (error) {
            console.error("Load project and messages error:", error)
            toast.error("Failed to load chat data")
        } finally {
            setLoading(false)
        }
    }, [slug])

    useEffect(() => {
        if (slug) {
            loadProjectAndMessages()
        }
    }, [slug, loadProjectAndMessages])

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !session?.user || sending) return

        try {
            setSending(true)
            const result = await sendMessage({
                projectSlug: slug,
                content: newMessage.trim()
            })

            if (result.success && result.message) {
                setMessages(prev => [...prev, result.message!])
                setNewMessage("")
                toast.success("Message sent")
            } else {
                toast.error(result.error || "Failed to send message")
            }
        } catch (error) {
            console.error("Send message error:", error)
            toast.error("Failed to send message")
        } finally {
            setSending(false)
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
            case 'CLIENT':
                return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
            case 'DEVELOPER':
                return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
            case 'PRODUCTMANAGER':
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
                {showAvatar && !isOwnMessage && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={message.user.image || ""} alt={message.user.name || "User"} />
                        <AvatarFallback className="text-xs">
                            {message.user.name?.split(' ').map((n: string) => n[0]).join('') || "U"}
                        </AvatarFallback>
                    </Avatar>
                )}
                
                {!showAvatar && !isOwnMessage && <div className="w-8 flex-shrink-0" />}

                <div className={`flex flex-col max-w-xs sm:max-w-md ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    {showAvatar && (
                        <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="text-sm font-medium text-foreground">{message.user.name || "Anonymous"}</span>
                            <Badge className={`${getRoleColor(message.user.role)} border text-xs`}>
                                {message.user.role}
                            </Badge>
                        </div>
                    )}
                    
                    <div
                        className={`rounded-2xl px-4 py-2 ${
                            isOwnMessage
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                        }`}
                    >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Show link preview if available */}
                        {message.linkUrl && (
                            <div className="mt-2 p-2 border rounded-lg bg-background/50">
                                <Link 
                                    href={message.linkUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline text-xs"
                                >
                                    {message.linkTitle || message.linkUrl}
                                </Link>
                            </div>
                        )}
                        
                        {/* Show image if available */}
                        {message.imageUrl && (
                            <div className="mt-2">
                                <Image
                                    src={message.imageUrl} 
                                    alt="Shared image" 
                                    className="max-w-full rounded-lg"
                                    height={32}
                                    width={32}
                                />
                            </div>
                        )}
                    </div>
                    
                    {showTimestamp && (
                        <span className={`text-xs text-muted-foreground mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </span>
                    )}
                </div>

                {showAvatar && isOwnMessage && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={message.user.image || ""} alt={message.user.name || "User"} />
                        <AvatarFallback className="text-xs">
                            {message.user.name?.split(' ').map((n: string) => n[0]).join('') || "U"}
                        </AvatarFallback>
                    </Avatar>
                )}
            </motion.div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <div className="flex flex-col h-screen max-w-4xl mx-auto">
                    <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    </div>
                    <div className="flex-1 p-4 space-y-4">
                        <div className="animate-pulse space-y-4">
                            <div className="h-16 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-16 bg-gray-200 rounded w-2/3 ml-auto"></div>
                            <div className="h-16 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="flex flex-col h-screen max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/projects/${project?.slug || slug}`}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-lg font-semibold text-foreground">{project?.title || "Loading..."}</h1>
                                <p className="text-sm text-muted-foreground">Project Chat</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                                <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Video className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Info className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length > 0 ? (
                        <AnimatePresence>
                            {messages.map((message, index) => renderMessage(message, index))}
                        </AnimatePresence>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">No messages yet</h3>
                                <p className="text-muted-foreground">
                                    Start the conversation by sending the first message.
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {isTyping && (
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
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-background/80 backdrop-blur-xl border-t border-border/50 p-4">
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
                                disabled={sending}
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
                            disabled={!newMessage.trim() || sending}
                            size="sm"
                            className="flex-shrink-0"
                        >
                            {sending ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
