"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, Image as ImageIcon, Link as LinkIcon, Loader2, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { sendMessage, sendMessageWithImage, sendMessageWithLink } from "@/actions/(client)/project.action"
import { formatDistanceToNow } from "date-fns"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useProjectStore } from "@/store/useProjectStore"
import Image from "next/image"

interface Message {
	id: string
	content: string
	imageUrl?: string | null
	linkUrl?: string | null
	linkTitle?: string | null
	createdAt: Date
	user: {
		id: string
		name: string | null
		image: string | null
		role: string
	}
}

interface ChatSheetProps {
	projectId: string
	projectTitle: string
	initialMessages?: Message[]
}

export function ChatSheet({ projectId, projectTitle, initialMessages = [] }: ChatSheetProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [messages, setMessages] = useState<Message[]>(initialMessages)
	const [newMessage, setNewMessage] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [showImageDialog, setShowImageDialog] = useState(false)
	const [showLinkDialog, setShowLinkDialog] = useState(false)
	const [selectedImage, setSelectedImage] = useState<File | null>(null)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [linkUrl, setLinkUrl] = useState("")
	const [linkTitle, setLinkTitle] = useState("")
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const messageInputRef = useRef<HTMLInputElement>(null)
	const imageInputRef = useRef<HTMLInputElement>(null)
	const { data: session } = useSession()
	const { addMessage } = useProjectStore()

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}

	const focusInput = () => {
		setTimeout(() => {
			messageInputRef.current?.focus()
		}, 100)
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	// Scroll to bottom when sheet opens
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				scrollToBottom()
				focusInput()
			}, 100)
		}
	}, [isOpen])

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!newMessage.trim()) return

		const optimisticMessage: Message = {
			id: `temp-${Date.now()}`,
			content: newMessage,
			createdAt: new Date(),
			user: {
				id: session?.user?.id || "",
				name: session?.user?.name || null,
				image: session?.user?.image || null,
				role: session?.user?.role || "USER"
			}
		}

		setMessages(prev => [...prev, optimisticMessage])
		setNewMessage("")
		setIsLoading(true)

		try {
			const result = await sendMessage(projectId, newMessage)
			if (result.success && result.message) {
				setMessages(prev => 
					prev.map(msg => 
						msg.id === optimisticMessage.id ? result.message! : msg
					)
				)
				addMessage(result.message as Message)
			} else {
				setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id))
				toast.error(result.error || "Failed to send message")
			}
		} catch (error) {
			console.error("Error sending message:", error)
			setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id))
			toast.error("Failed to send message")
		} finally {
			setIsLoading(false)
			focusInput()
		}
	}

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error("Please select an image file")
			return
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image size must be less than 5MB")
			return
		}

		setSelectedImage(file)
		const reader = new FileReader()
		reader.onload = (e) => {
			setImagePreview(e.target?.result as string)
		}
		reader.readAsDataURL(file)
		setShowImageDialog(true)
	}

	const handleSendImage = async () => {
		if (!selectedImage) return

		setIsUploading(true)
		setShowImageDialog(false)

		try {
			const formData = new FormData()
			formData.append('image', selectedImage)

			const result = await sendMessageWithImage(projectId, newMessage || "Image", formData)
			if (result.success && result.message) {
				setMessages(prev => [...prev, result.message!])
				addMessage(result.message as Message)
				setNewMessage("")
				toast.success("Image sent successfully!")
			} else {
				toast.error(result.error || "Failed to send image")
			}
		} catch (error) {
			console.error("Error sending image:", error)
			toast.error("Failed to send image")
		} finally {
			setIsUploading(false)
			setSelectedImage(null)
			setImagePreview(null)
			if (imageInputRef.current) {
				imageInputRef.current.value = ""
			}
			focusInput()
		}
	}

	const handleSendLink = async () => {
		if (!linkUrl.trim()) {
			toast.error("Please enter a valid URL")
			return
		}

		setIsUploading(true)
		setShowLinkDialog(false)

		try {
			const result = await sendMessageWithLink(projectId, newMessage || "Link", linkUrl, linkTitle)
			if (result.success && result.message) {
				setMessages(prev => [...prev, result.message!])
				addMessage(result.message as Message)
				setNewMessage("")
				setLinkUrl("")
				setLinkTitle("")
				toast.success("Link sent successfully!")
			} else {
				toast.error(result.error || "Failed to send link")
			}
		} catch (error) {
			console.error("Error sending link:", error)
			toast.error("Failed to send link")
		} finally {
			setIsUploading(false)
			focusInput()
		}
	}

	const handleCancelImage = () => {
		setSelectedImage(null)
		setImagePreview(null)
		setShowImageDialog(false)
		if (imageInputRef.current) {
			imageInputRef.current.value = ""
		}
		focusInput()
	}

	const handleCancelLink = () => {
		setLinkUrl("")
		setLinkTitle("")
		setShowLinkDialog(false)
		focusInput()
	}

	const getRoleColor = (role: string) => {
		switch (role.toLowerCase()) {
			case 'admin':
				return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
			case 'developer':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
			case 'productmanager':
				return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
			case 'client':
				return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
		}
	}

	const isOwnMessage = (message: Message) => {
		return message.user.id === session?.user?.id
	}

	const renderMessageContent = (message: Message) => {
		if (message.imageUrl) {
			return (
				<div className="space-y-2">
					{message.content && message.content !== "Image" && (
						<p className="text-sm">{message.content}</p>
					)}
					<Image
						src={message.imageUrl} 
						alt="Shared image" 
						className="max-w-full h-auto rounded-lg cursor-pointer"
						onClick={() => window.open(message.imageUrl!, '_blank')}
						width={100}
						height={100}
					/>
				</div>
			)
		}

		if (message.linkUrl) {
			return (
				<div className="space-y-2">
					{message.content && message.content !== "Link" && (
						<p className="text-sm">{message.content}</p>
					)}
					<a 
						href={message.linkUrl} 
						target="_blank" 
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
					>
						<LinkIcon className="h-4 w-4 text-blue-600" />
						<div className="flex-1">
							<p className="text-sm font-medium text-blue-900 dark:text-blue-100">
								{message.linkTitle || "Link"}
							</p>
							<p className="text-xs text-blue-600 dark:text-blue-400 truncate">
								{message.linkUrl}
							</p>
						</div>
						<ExternalLink className="h-3 w-3 text-blue-600" />
					</a>
				</div>
			)
		}

		return <p className="text-sm">{message.content}</p>
	}

	return (
		<>
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild>
					<Button variant="outline" className="bg-black text-white hover:bg-gray-800 border-gray-700">
						<MessageCircle className="h-4 w-4 mr-2" />
						Chat with Team
					</Button>
				</SheetTrigger>
				<SheetContent 
					side="right"
					className="w-full h-full sm:w-[80vw] md:w-[55vw] sm:max-w-[80vw] p-6 overflow-y-auto"
					style={{ maxWidth: '90vw' }}
					onPointerDownOutside={(e) => e.preventDefault()}
					onEscapeKeyDown={(e) => e.preventDefault()}
				>
					<SheetHeader className="p-6 pb-4 border-b">
						<div className="flex items-center justify-between">
							<div>
								<SheetTitle className="text-lg font-semibold">Team Chat</SheetTitle>
								<SheetDescription className="text-sm text-muted-foreground">
									{projectTitle}
								</SheetDescription>
							</div>
						</div>
					</SheetHeader>

					{/* Messages */}
					<div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-200px)]">
						{messages.length === 0 ? (
							<div className="text-center text-muted-foreground py-8">
								<MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>No messages yet. Start the conversation!</p>
							</div>
						) : (
							messages.map((message) => (
								<div
									key={message.id}
									className={`flex gap-3 ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
								>
									{!isOwnMessage(message) && (
										<Avatar className="h-8 w-8 mt-1">
											<AvatarImage src={message.user.image || "/placeholder.svg"} alt={message.user.name || "User"} />
											<AvatarFallback className="text-xs">
												{message.user.name?.charAt(0) || "U"}
											</AvatarFallback>
										</Avatar>
									)}
									<div className={`max-w-[70%] ${isOwnMessage(message) ? 'text-right' : 'text-left'}`}>
										{!isOwnMessage(message) && (
											<div className="flex items-center gap-2 mb-1">
												<span className="text-xs font-medium text-foreground">
													{message.user.name || "Unknown"}
												</span>
												<span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(message.user.role)}`}>
													{message.user.role}
												</span>
											</div>
										)}
										<div className={`rounded-lg p-3 ${
											isOwnMessage(message)
												? 'bg-black text-white'
												: 'bg-muted text-foreground'
										}`}>
											{renderMessageContent(message)}
										</div>
										<p className="text-xs text-muted-foreground mt-1">
											{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
										</p>
									</div>
									{isOwnMessage(message) && (
										<Avatar className="h-8 w-8 mt-1">
											<AvatarImage src={message.user.image || "/placeholder.svg"} alt={message.user.name || "User"} />
											<AvatarFallback className="text-xs">
												{message.user.name?.charAt(0) || "U"}
											</AvatarFallback>
										</Avatar>
									)}
								</div>
							))
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Message Input */}
					<div className="p-4 border-t">
						<form onSubmit={handleSendMessage} className="flex gap-2">
							<Input
								ref={messageInputRef}
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								placeholder="Type your message..."
								disabled={isLoading || isUploading}
								className="flex-1"
							/>
							<Button
								type="button"
								variant="outline"
								size="icon"
								onClick={() => setShowLinkDialog(true)}
								disabled={isLoading || isUploading}
							>
								<LinkIcon className="h-4 w-4" />
							</Button>
							<Button
								type="button"
								variant="outline"
								size="icon"
								onClick={() => imageInputRef.current?.click()}
								disabled={isLoading || isUploading}
							>
								{isUploading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<ImageIcon className="h-4 w-4" />
								)}
							</Button>
							<Button type="submit" disabled={isLoading || isUploading || !newMessage.trim()}>
								<Send className="h-4 w-4" />
							</Button>
						</form>
						<input
							ref={imageInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageSelect}
							className="hidden"
						/>
					</div>
				</SheetContent>
			</Sheet>

			{/* Image Preview Dialog */}
			<Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Send Image</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						{imagePreview && (
							<div className="flex justify-center">
								<Image 
									src={imagePreview} 
									alt="Preview" 
									className="max-w-full max-h-64 rounded-lg"
									width={100}
									height={100}
								/>
							</div>
						)}
						<Input
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							placeholder="Add a caption (optional)..."
						/>
						<div className="flex gap-2 justify-end">
							<Button variant="outline" onClick={handleCancelImage}>
								Cancel
							</Button>
							<Button onClick={handleSendImage} disabled={isUploading}>
								{isUploading ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Sending...
									</>
								) : (
									"Send Image"
								)}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Link Dialog */}
			<Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Send Link</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<Input
							value={linkUrl}
							onChange={(e) => setLinkUrl(e.target.value)}
							placeholder="Enter URL (e.g., https://example.com)"
							type="url"
						/>
						<Input
							value={linkTitle}
							onChange={(e) => setLinkTitle(e.target.value)}
							placeholder="Link title (optional)"
						/>
						<Input
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							placeholder="Add a message (optional)..."
						/>
						<div className="flex gap-2 justify-end">
							<Button variant="outline" onClick={handleCancelLink}>
								Cancel
							</Button>
							<Button onClick={handleSendLink} disabled={isUploading || !linkUrl.trim()}>
								{isUploading ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Sending...
									</>
								) : (
									"Send Link"
								)}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
} 