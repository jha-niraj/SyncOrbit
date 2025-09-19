"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
    Building2, Code, Megaphone, ShoppingCart, Palette, 
    Settings, Briefcase, Users, Plus
} from "lucide-react"
import { toast } from "sonner"
import { createTeam } from "@/actions/teams.action"
import { TeamType } from "@prisma/client"

type CreateTeamDialogProps = {
    children: React.ReactNode
}

// Team templates matching onboarding
const TEAM_TEMPLATES = {
    [TeamType.TECHNICAL]: {
        name: "Technical Team",
        displayName: "Development",
        icon: Code,
        color: "#3b82f6",
        description: "Handles development, engineering, and technical tasks",
        defaultHeadTitle: "Chief Technology Officer",
        commonRoles: ["CTO", "Tech Lead", "Engineering Manager"]
    },
    [TeamType.MARKETING]: {
        name: "Marketing Team",
        displayName: "Marketing",
        icon: Megaphone,
        color: "#ec4899",
        description: "Manages marketing, social media, and content strategy",
        defaultHeadTitle: "Chief Marketing Officer",
        commonRoles: ["CMO", "Marketing Director", "Marketing Manager"]
    },
    [TeamType.SALES]: {
        name: "Sales Team",
        displayName: "Sales",
        icon: ShoppingCart,
        color: "#10b981",
        description: "Handles sales, business development, and client acquisition",
        defaultHeadTitle: "Sales Director",
        commonRoles: ["Sales Director", "Sales Manager", "Head of Sales"]
    },
    [TeamType.DESIGN]: {
        name: "Design Team",
        displayName: "Design",
        icon: Palette,
        color: "#f59e0b",
        description: "Creates UI/UX designs, graphics, and visual content",
        defaultHeadTitle: "Creative Director",
        commonRoles: ["Creative Director", "Design Lead", "Head of Design"]
    },
    [TeamType.OPERATIONS]: {
        name: "Operations Team",
        displayName: "Operations",
        icon: Settings,
        color: "#6366f1",
        description: "Manages operations, project management, and processes",
        defaultHeadTitle: "Operations Manager",
        commonRoles: ["Operations Manager", "COO", "Project Director"]
    },
    [TeamType.FINANCE]: {
        name: "Finance Team",
        displayName: "Finance",
        icon: Briefcase,
        color: "#8b5cf6",
        description: "Handles finances, accounting, and budget management",
        defaultHeadTitle: "Chief Financial Officer",
        commonRoles: ["CFO", "Finance Director", "Finance Manager"]
    },
    [TeamType.CUSTOM]: {
        name: "Custom Team",
        displayName: "Custom",
        icon: Users,
        color: "#64748b",
        description: "Create a custom team for your specific needs",
        defaultHeadTitle: "Team Lead",
        commonRoles: ["Team Lead", "Manager", "Head"]
    }
}

function CreateTeamDialog({ children }: CreateTeamDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'select' | 'customize'>('select')
    const [selectedType, setSelectedType] = useState<TeamType | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        displayName: "",
        description: "",
        headRoleTitle: "",
        color: ""
    })

    const resetForm = () => {
        setStep('select')
        setSelectedType(null)
        setFormData({
            name: "",
            displayName: "",
            description: "",
            headRoleTitle: "",
            color: ""
        })
    }

    const handleTypeSelect = (type: TeamType) => {
        setSelectedType(type)
        const template = TEAM_TEMPLATES[type]
        setFormData({
            name: template.name,
            displayName: template.displayName,
            description: template.description,
            headRoleTitle: template.defaultHeadTitle,
            color: template.color
        })
        setStep('customize')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedType) return
        
        setLoading(true)

        try {
            const result = await createTeam({
                name: formData.name.trim(),
                displayName: formData.displayName.trim(),
                teamType: selectedType,
                description: formData.description.trim() || undefined,
                color: formData.color || undefined,
                headRoleTitle: formData.headRoleTitle.trim()
            })

            if (result.success) {
                toast.success(result.message)
                setOpen(false)
                resetForm()
            } else {
                throw new Error(result.error || "Failed to create team")
            }
        } catch (error) {
            console.error("Create team error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to create team")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        Create New Team
                    </DialogTitle>
                </DialogHeader>

                {step === 'select' ? (
                    <div className="space-y-6">
                        <p className="text-muted-foreground">
                            Choose a team type or create a custom team for your specific needs.
                        </p>
                        
                        <div className="grid gap-3 sm:grid-cols-2">
                            {Object.entries(TEAM_TEMPLATES).map(([type, template]) => {
                                const IconComponent = template.icon
                                
                                return (
                                    <Card 
                                        key={type}
                                        className="p-4 cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
                                        onClick={() => handleTypeSelect(type as TeamType)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div 
                                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: `${template.color}15` }}
                                            >
                                                <IconComponent 
                                                    className="w-5 h-5" 
                                                    style={{ color: template.color }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm">{template.name}</h3>
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                    {template.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Selected Type Preview */}
                        {selectedType && (
                            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                                <div 
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${TEAM_TEMPLATES[selectedType].color}15` }}
                                >
                                    {(() => {
                                        const IconComponent = TEAM_TEMPLATES[selectedType].icon
                                        return (
                                            <IconComponent 
                                                className="w-5 h-5" 
                                                style={{ color: TEAM_TEMPLATES[selectedType].color }}
                                            />
                                        )
                                    })()}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{TEAM_TEMPLATES[selectedType].name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {TEAM_TEMPLATES[selectedType].description}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Team Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g., Technical Team"
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name *</Label>
                                <Input
                                    id="displayName"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                                    placeholder="e.g., Development"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Brief description of this team's responsibilities"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="headRoleTitle">Head Role Title *</Label>
                            <Input
                                id="headRoleTitle"
                                value={formData.headRoleTitle}
                                onChange={(e) => setFormData(prev => ({ ...prev, headRoleTitle: e.target.value }))}
                                placeholder="e.g., Chief Technology Officer"
                                required
                            />
                            
                            {/* Role Suggestions */}
                            {selectedType && TEAM_TEMPLATES[selectedType].commonRoles.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">Common Titles:</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {TEAM_TEMPLATES[selectedType].commonRoles.map((role) => (
                                            <Badge 
                                                key={role}
                                                variant="outline"
                                                className="cursor-pointer hover:bg-primary/10 text-xs"
                                                onClick={() => setFormData(prev => ({ ...prev, headRoleTitle: role }))}
                                            >
                                                {role}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep('select')}
                                disabled={loading}
                            >
                                Back
                            </Button>
                            
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || !formData.name.trim() || !formData.displayName.trim() || !formData.headRoleTitle.trim()}
                                    className="gap-2"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                    Create Team
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default CreateTeamDialog