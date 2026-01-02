"use client"

import { useState, useEffect } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    CalendarIcon, Plus, Loader2, Users, Eye, EyeOff, Building2, DollarSign, 
    X, Code, Megaphone, ShoppingCart, Palette, Briefcase, Settings, 
    CheckCircle
} from "lucide-react"
import {
    Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar"
import { format } from "date-fns"
import {
    Currency, ClientType, ProjectVisibility, TeamType
} from "@prisma/client"
import { createProject } from "@/actions/projects.action"
import { getCompanyTeams } from "@/actions/teams.action"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger
} from "../ui/sheet"

// Team type icon mapping
const TEAM_ICONS = {
    [TeamType.TECHNICAL]: Code,
    [TeamType.MARKETING]: Megaphone,
    [TeamType.SALES]: ShoppingCart,
    [TeamType.DESIGN]: Palette,
    [TeamType.OPERATIONS]: Settings,
    [TeamType.FINANCE]: Briefcase,
    [TeamType.CUSTOM]: Users,
}

interface CreateProjectSheetProps {
    trigger?: React.ReactNode
    onSuccess?: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

interface Team {
    id: string
    name: string
    displayName: string
    teamType: TeamType
    color?: string | null
    head?: {
        id: string
        name: string | null
        image?: string | null
    } | null
}

export function CreateProjectSheet({ trigger, onSuccess, open: controlledOpen, onOpenChange }: CreateProjectSheetProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen
    const setOpen = onOpenChange || setInternalOpen

    const [isLoading, setIsLoading] = useState(false)
    const [teamsLoading, setTeamsLoading] = useState(false)

    // Form state
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [budget, setBudget] = useState<string>("")
    const [currency, setCurrency] = useState<Currency>(Currency.USD)
    const [clientType, setClientType] = useState<ClientType>(ClientType.EXTERNAL)
    const [visibility, setVisibility] = useState<ProjectVisibility>(ProjectVisibility.PUBLIC)
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [clientEmail, setClientEmail] = useState("")

    // Team assignment state
    const [availableTeams, setAvailableTeams] = useState<Team[]>([])
    const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([])

    // Project links
    const [livePreviewUrl, setLivePreviewUrl] = useState("")
    const [figmaUrl, setFigmaUrl] = useState("")
    const [githubUrl, setGithubUrl] = useState("")
    const [documentsUrl, setDocumentsUrl] = useState("")
    const [otherLinks, setOtherLinks] = useState("")

    // Load teams when modal opens
    useEffect(() => {
        if (open) {
            loadTeams()
        }
    }, [open])

    const loadTeams = async () => {
        setTeamsLoading(true)
        try {
            const result = await getCompanyTeams()
            if (result.success) {
                setAvailableTeams(result.teams)
            } else {
                toast.error("Failed to load teams")
            }
        } catch (error) {
            console.error("Error loading teams:", error)
            toast.error("Failed to load teams")
        } finally {
            setTeamsLoading(false)
        }
    }

    const handleTeamToggle = (teamId: string) => {
        setSelectedTeamIds(prev =>
            prev.includes(teamId)
                ? prev.filter(id => id !== teamId)
                : [...prev, teamId]
        )
    }

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setBudget("")
        setCurrency(Currency.USD)
        setClientType(ClientType.EXTERNAL)
        setVisibility(ProjectVisibility.PUBLIC)
        setStartDate(undefined)
        setEndDate(undefined)
        setClientEmail("")
        setSelectedTeamIds([])
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
                return
            }

            if (!startDate) {
                toast.error("Please select a start date")
                return
            }

            if (selectedTeamIds.length === 0) {
                toast.error("Please select at least one team")
                return
            }

            if (clientType === ClientType.EXTERNAL && !clientEmail.trim()) {
                toast.error("Please enter client email for external projects")
                return
            }

            const result = await createProject({
                title,
                description,
                budget: budgetNumber,
                currency,
                clientType,
                visibility,
                startDate: startDate.toISOString(),
                endDate: endDate?.toISOString(),
                clientEmail: clientType === ClientType.EXTERNAL ? clientEmail : undefined,
                assignedTeamIds: selectedTeamIds,
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

    const selectedTeams = availableTeams.filter(team => selectedTeamIds.includes(team.id))

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
            <SheetContent className="sm:max-w-[700px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Create New Project
                    </SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Project Details</h3>

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
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="budget"
                                        type="number"
                                        placeholder="0"
                                        step="0.01"
                                        min="0"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
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
                                            initialFocus
                                            disabled={(date) => startDate ? date < startDate : false}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Client Information</h3>

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

                        {
                            clientType === ClientType.EXTERNAL && (
                                <div className="space-y-2">
                                    <Label htmlFor="clientEmail">Client Email *</Label>
                                    <Input
                                        id="clientEmail"
                                        type="email"
                                        placeholder="client@example.com"
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        If the client doesn&apos;t exist, a new account will be created
                                    </p>
                                </div>
                            )
                        }
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Assign Teams</h3>
                            {
                                selectedTeams.length > 0 && (
                                    <Badge variant="secondary">
                                        {selectedTeams.length} team{selectedTeams.length > 1 ? 's' : ''} selected
                                    </Badge>
                                )
                            }
                        </div>

                        {
                            teamsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span className="ml-2 text-sm text-muted-foreground">Loading teams...</span>
                                </div>
                            ) : availableTeams.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No teams found. Create teams first to assign to projects.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {
                                        availableTeams.map((team) => {
                                            const IconComponent = TEAM_ICONS[team.teamType] || Users
                                            const isSelected = selectedTeamIds.includes(team.id)

                                            return (
                                                <div
                                                    key={team.id}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                                                        isSelected
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:bg-muted/50"
                                                    )}
                                                    onClick={() => handleTeamToggle(team.id)}
                                                >
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                                                        isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                                                    )}>
                                                        {isSelected && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                                                    </div>
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                        style={{
                                                            backgroundColor: team.color ? `${team.color}15` : '#f3f4f6',
                                                            color: team.color || '#6b7280'
                                                        }}
                                                    >
                                                        <IconComponent className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{team.displayName}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {team.teamType.charAt(0) + team.teamType.slice(1).toLowerCase()} Team
                                                        </p>
                                                    </div>
                                                    {
                                                        team.head && (
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="w-6 h-6">
                                                                    <AvatarImage src={team.head.image!} />
                                                                    <AvatarFallback className="text-xs">
                                                                        {team.head.name?.[0] || 'U'}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {team.head.name}
                                                                </span>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        }

                        {
                            selectedTeams.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {
                                        selectedTeams.map((team) => (
                                            <Badge key={team.id} variant="secondary" className="gap-1">
                                                {team.displayName}
                                                <X
                                                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                                                    onClick={() => handleTeamToggle(team.id)}
                                                />
                                            </Badge>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Project Visibility</h3>

                        <div className="space-y-2">
                            <Label>Who can see this project? *</Label>
                            <Select value={visibility} onValueChange={(value: ProjectVisibility) => setVisibility(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ProjectVisibility.PUBLIC}>
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            <div>
                                                <p className="font-medium">Public</p>
                                                <p className="text-xs text-muted-foreground">All company members can see</p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value={ProjectVisibility.PRIVATE}>
                                        <div className="flex items-center gap-2">
                                            <EyeOff className="w-4 h-4" />
                                            <div>
                                                <p className="font-medium">Private</p>
                                                <p className="text-xs text-muted-foreground">Invite-only access</p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <p className="text-xs text-muted-foreground">
                                {
                                    visibility === ProjectVisibility.PUBLIC
                                        ? "Team members can see this project if it's assigned to their team."
                                        : "Only invited members and assigned teams can access this project."
                                }
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Project Links (Optional)</h3>

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
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || selectedTeamIds.length === 0}
                            className="gap-2"
                        >
                            {
                                isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )
                            }
                            Create Project
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}