"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface ChatPageProps {
    params: Promise<{
        slug: string
    }>
}

// Mock data - replace with actual data fetching
const mockProject = {
    id: "1",
    title: "E-commerce Platform",
    slug: "ecommerce-platform"
}

const mockMessages = [
    {
        id: "1",
        content: "Hey team! I've just uploaded the initial wireframes for the product catalog page. Please take a look and let me know your thoughts.",
        sender: {
            id: "1",
            name: "John Doe",
            image: "/placeholder.svg",
            role: "CLIENT"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        type: "text"
    },
    {
        id: "2",
        content: "Thanks John! The wireframes look great. I particularly like the clean layout for the product grid. I'll start working on the frontend implementation.",
        sender: {
            id: "2",
            name: "Alice Dev",
            image: "/placeholder.svg",
            role: "DEVELOPER"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
        type: "text"
    },
    {
        id: "3",
        content: "I agree with Alice. The design is user-friendly. I've also completed the database schema for the product catalog. Should I proceed with the API development?",
        sender: {
            id: "3",
            name: "Bob Backend",
            image: "/placeholder.svg",
            role: "DEVELOPER"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
        type: "text"
    },
    {
        id: "4",
        content: "Absolutely! Go ahead with the API development. Also, can we schedule a quick call to discuss the payment integration requirements?",
        sender: {
            id: "1",
            name: "John Doe",
            image: "/placeholder.svg",
            role: "CLIENT"
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        type: "text"
    }
]

export default function ProjectChatPage({ params }: ChatPageProps) {
    const { data: session } = useSession()
    const [project, setProject] = useState(mockProject)
    const [messages, setMessages] = useState(mockMessages)
    const [newMessage, setNewMessage] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = () => {
        if (!newMessage.trim() || !session?.user) return

        const message = {
            id: Date.now().toString(),
            content: newMessage,
            sender: {
                id: session.user.id,
                name: session.user.name || "User",
                image: session.user.image || "/placeholder.svg",
                role: session.user.role
            },
            timestamp: new Date(),
            type: "text"
        }

        setMessages(prev => [...prev, message])
        setNewMessage("")
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

    const renderMessage = (message: any, index: number) => {
        const isOwnMessage = message.sender.id === session?.user?.id
        const showAvatar = index === 0 || messages[index - 1].sender.id !== message.sender.id
        const showTimestamp = index === messages.length - 1 || 
                            messages[index + 1].sender.id !== message.sender.id ||
                            (messages[index + 1].timestamp.getTime() - message.timestamp.getTime()) > 300000 // 5 minutes

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
                        <AvatarImage src={message.sender.image} alt={message.sender.name} />
                        <AvatarFallback className="text-xs">
                            {message.sender.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                )}
                
                {!showAvatar && !isOwnMessage && <div className="w-8 flex-shrink-0" />}

                <div className={`flex flex-col max-w-xs sm:max-w-md ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    {showAvatar && (
                        <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="text-sm font-medium text-foreground">{message.sender.name}</span>
                            <Badge className={`${getRoleColor(message.sender.role)} border text-xs`}>
                                {message.sender.role}
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
                    </div>
                    
                    {showTimestamp && (
                        <span className={`text-xs text-muted-foreground mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </span>
                    )}
                </div>

                {showAvatar && isOwnMessage && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={message.sender.image} alt={message.sender.name} />
                        <AvatarFallback className="text-xs">
                            {message.sender.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                )}
            </motion.div>
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
                                <Link href={`/projects/${project.slug}`}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-lg font-semibold text-foreground">{project.title}</h1>
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
                    <AnimatePresence>
                        {messages.map((message, index) => renderMessage(message, index))}
                    </AnimatePresence>
                    
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
            </div>
        </div>
    )
}
