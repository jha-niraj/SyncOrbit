"use client"

import { useState, useRef, useEffect } from "react"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover"
import {
    CalendarIcon, Plus, Loader2, Search, X
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Currency, ClientType } from "@prisma/client"
import { createProject } from "@/actions/(client)/projects.action"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface CreateProjectModalProps {
    trigger?: React.ReactNode
    onSuccess?: () => void
}

interface Client {
    id: string
    name: string
    email: string
    image?: string
    totalSpent: number
    projectsCount: number
}

export function CreateProjectModal({ trigger, onSuccess }: CreateProjectModalProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Form state
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [budget, setBudget] = useState<string>("")
    const [currency, setCurrency] = useState<Currency>(Currency.USD)
    const [clientType, setClientType] = useState<ClientType>(ClientType.EXTERNAL)
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [clientEmail, setClientEmail] = useState("")

    // Client search state
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<Client[]>([])
    const [showSearchDropdown, setShowSearchDropdown] = useState(false)
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Project links
    const [livePreviewUrl, setLivePreviewUrl] = useState("")
    const [figmaUrl, setFigmaUrl] = useState("")
    const [githubUrl, setGithubUrl] = useState("")
    const [documentsUrl, setDocumentsUrl] = useState("")
    const [otherLinks, setOtherLinks] = useState("")

    // Search clients function
    const searchClients = async (query: string) => {
        if (query.length < 2) {
            setSearchResults([])
            setShowSearchDropdown(false)
            return
        }

        setIsSearching(true)
        try {
            const response = await fetch(`/api/admin/search-clients?q=${encodeURIComponent(query)}`)
            if (response.ok) {
                const data = await response.json()
                setSearchResults(data.clients || [])
                setShowSearchDropdown(true)
            } else {
                setSearchResults([])
            }
        } catch (error) {
            console.error('Error searching clients:', error)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }

    // Handle search input change with debouncing
    const handleSearchInputChange = (value: string) => {
        setSearchTerm(value)

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            searchClients(value)
        }, 300)
    }

    // Handle client selection
    const handleClientSelect = (client: Client) => {
        setSelectedClient(client)
        setClientEmail(client.email)
        setSearchTerm(client.name)
        setShowSearchDropdown(false)
        setSearchResults([])
    }

    // Clear client selection
    const clearClientSelection = () => {
        setSelectedClient(null)
        setClientEmail("")
        setSearchTerm("")
        setShowSearchDropdown(false)
        setSearchResults([])
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (showSearchDropdown) {
                setShowSearchDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [showSearchDropdown])

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setBudget("")
        setCurrency(Currency.USD)
        setClientType(ClientType.EXTERNAL)
        setStartDate(undefined)
        setEndDate(undefined)
        setClientEmail("")
        setSearchTerm("")
        setSelectedClient(null)
        setSearchResults([])
        setShowSearchDropdown(false)
        setLivePreviewUrl("")
        setFigmaUrl("")
        setGithubUrl("")
        setDocumentsUrl("")
        setOtherLinks("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const budgetNumber = parseFloat(budget)
            if (isNaN(budgetNumber) || budgetNumber < 0) {
                toast.error("Please enter a valid budget amount")
                setIsLoading(false)
                return
            }

            if (!startDate) {
                toast.error("Please select a start date")
                setIsLoading(false)
                return
            }

            if (clientType === ClientType.EXTERNAL && !selectedClient && !clientEmail.trim()) {
                toast.error("Please select a client or enter client email for external projects")
                setIsLoading(false)
                return
            }

            const result = await createProject({
                title,
                description,
                budget: budgetNumber,
                currency,
                clientType,
                startDate: startDate.toISOString(),
                endDate: endDate?.toISOString(),
                clientEmail: clientType === ClientType.EXTERNAL ? (selectedClient?.email || clientEmail) : undefined,
                livePreviewUrl: livePreviewUrl || "",
                figmaUrl: figmaUrl || "",
                githubUrl: githubUrl || "",
                documentsUrl: documentsUrl || "",
                otherLinks
            })

            if (result.success) {
                toast.success(result.message)
                resetForm()
                setOpen(false)
                onSuccess?.()
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            console.error("Create project error:", error)
            toast.error("Failed to create project")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Project
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Project Title *</Label>
                            <Input
                                id="title"
                                placeholder="Enter project title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter project description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Budget *</Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    placeholder="0"
                                    step="0.01"
                                    min="0"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Currency *</Label>
                                <Select value={currency} onValueChange={(value: Currency) => setCurrency(value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Currency.USD}>USD ($)</SelectItem>
                                        <SelectItem value={Currency.INR}>INR (₹)</SelectItem>
                                        <SelectItem value={Currency.NPR}>NPR (Rs.)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Client Type *</Label>
                            <Select value={clientType} onValueChange={(value: ClientType) => setClientType(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ClientType.EXTERNAL}>External Client</SelectItem>
                                    <SelectItem value={ClientType.INTERNAL}>Internal Project</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {clientType === ClientType.EXTERNAL && (
                            <div className="space-y-4">
                                {!selectedClient ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="clientSearch">Search Client *</Label>
                                            <div className="relative">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="clientSearch"
                                                        placeholder="Search client by name or email..."
                                                        value={searchTerm}
                                                        onChange={(e) => handleSearchInputChange(e.target.value)}
                                                        disabled={isLoading}
                                                        className="pl-10"
                                                    />
                                                    {isSearching && (
                                                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                                                    )}
                                                </div>

                                                <AnimatePresence>
                                                    {showSearchDropdown && searchResults.length > 0 && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
                                                        >
                                                            {searchResults.map((client) => (
                                                                <div
                                                                    key={client.id}
                                                                    className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                                                                    onClick={() => handleClientSelect(client)}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <Avatar className="h-8 w-8">
                                                                            <AvatarImage src={client.image} alt={client.name} />
                                                                            <AvatarFallback className="text-xs">
                                                                                {client.name.charAt(0).toUpperCase()}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div>
                                                                            <p className="font-medium text-sm">{client.name}</p>
                                                                            <p className="text-xs text-muted-foreground">{client.email}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right text-xs text-muted-foreground">
                                                                        <p>${client.totalSpent.toLocaleString()}</p>
                                                                        <p>{client.projectsCount} projects</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {showSearchDropdown && searchTerm.length >= 2 && !isSearching && searchResults.length === 0 && (
                                                    <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg p-3 text-sm text-muted-foreground text-center">
                                                        No clients found matching &ldquo;{searchTerm}&rdquo;
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground mb-2">or</p>
                                            <div className="space-y-2">
                                                <Label htmlFor="clientEmail">Enter New Client Email</Label>
                                                <Input
                                                    id="clientEmail"
                                                    type="email"
                                                    placeholder="client@example.com"
                                                    value={clientEmail}
                                                    onChange={(e) => setClientEmail(e.target.value)}
                                                    disabled={isLoading}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    A new client account will be created
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <Label>Selected Client</Label>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={selectedClient.image} alt={selectedClient.name} />
                                                    <AvatarFallback className="bg-green-600 text-white">
                                                        {selectedClient.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-green-900 dark:text-green-100">{selectedClient.name}</p>
                                                    <p className="text-sm text-green-700 dark:text-green-300">{selectedClient.email}</p>
                                                    <p className="text-xs text-green-600 dark:text-green-400">
                                                        ${selectedClient.totalSpent.toLocaleString()} spent • {selectedClient.projectsCount} projects
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearClientSelection}
                                                disabled={isLoading}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !startDate && "text-muted-foreground"
                                            )}
                                            disabled={isLoading}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, "PPP") : "Select date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={setStartDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label>End Date (Optional)</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !endDate && "text-muted-foreground"
                                            )}
                                            disabled={isLoading}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, "PPP") : "Select date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={setEndDate}
                                            disabled={(date) => startDate ? date < startDate : false}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    {/* Project Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium">Project Links (Optional)</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="livePreviewUrl">Live Preview URL</Label>
                                <Input
                                    id="livePreviewUrl"
                                    type="url"
                                    placeholder="https://example.com"
                                    value={livePreviewUrl}
                                    onChange={(e) => setLivePreviewUrl(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="figmaUrl">Figma URL</Label>
                                <Input
                                    id="figmaUrl"
                                    type="url"
                                    placeholder="https://figma.com/..."
                                    value={figmaUrl}
                                    onChange={(e) => setFigmaUrl(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="githubUrl">GitHub URL</Label>
                                <Input
                                    id="githubUrl"
                                    type="url"
                                    placeholder="https://github.com/..."
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="documentsUrl">Documents URL</Label>
                                <Input
                                    id="documentsUrl"
                                    type="url"
                                    placeholder="https://drive.google.com/..."
                                    value={documentsUrl}
                                    onChange={(e) => setDocumentsUrl(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="otherLinks">Other Links</Label>
                            <Textarea
                                id="otherLinks"
                                placeholder="Any other relevant links..."
                                value={otherLinks}
                                onChange={(e) => setOtherLinks(e.target.value)}
                                rows={2}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Project"
                                )
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}