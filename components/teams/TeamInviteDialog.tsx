"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, Crown, Users, Send } from "lucide-react"
import { toast } from "sonner"
import { inviteTeamHead, inviteTeamMember } from "@/actions/teams.action"

interface TeamInviteDialogProps {
    teamId: string
    type: "head" | "member"
    children: React.ReactNode
}

// Common role suggestions for different invitation types
const HEAD_ROLE_SUGGESTIONS = [
    "Chief Technology Officer",
    "Tech Lead", 
    "Engineering Manager",
    "Chief Marketing Officer",
    "Marketing Director",
    "Creative Director",
    "Sales Director",
    "Operations Manager",
    "Finance Director"
]

const MEMBER_ROLE_SUGGESTIONS = [
    "Senior Developer",
    "Junior Developer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer",
    "UI/UX Designer",
    "Graphic Designer",
    "Content Writer",
    "Social Media Manager",
    "Marketing Specialist",
    "Sales Representative",
    "Account Manager",
    "Project Manager"
]

export default function TeamInviteDialog({ teamId, type, children }: TeamInviteDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        roleTitle: "",
        message: ""
    })

    const isHead = type === "head"
    const roleSuggestions = isHead ? HEAD_ROLE_SUGGESTIONS : MEMBER_ROLE_SUGGESTIONS

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (!formData.email.trim() || !formData.roleTitle.trim()) {
                throw new Error("Email and role title are required")
            }

            const result = isHead 
                ? await inviteTeamHead({
                    teamId,
                    email: formData.email,
                    roleTitle: formData.roleTitle,
                    message: formData.message || undefined
                })
                : await inviteTeamMember({
                    teamId,
                    email: formData.email,
                    roleTitle: formData.roleTitle,
                    message: formData.message || undefined
                })

            if (result.success) {
                toast.success(result.message)
                setOpen(false)
                setFormData({ email: "", roleTitle: "", message: "" })
            } else {
                throw new Error(result.error || "Failed to send invitation")
            }
        } catch (error) {
            console.error("Invite error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to send invitation")
        } finally {
            setLoading(false)
        }
    }

    const handleRoleSuggestionClick = (role: string) => {
        setFormData(prev => ({ ...prev, roleTitle: role }))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isHead ? (
                            <>
                                <Crown className="w-5 h-5 text-yellow-500" />
                                Invite Team Head
                            </>
                        ) : (
                            <>
                                <Users className="w-5 h-5 text-blue-500" />
                                Invite Team Member
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="roleTitle">Role Title *</Label>
                        <Input
                            id="roleTitle"
                            placeholder={`Enter ${isHead ? 'head' : 'member'} role title`}
                            value={formData.roleTitle}
                            onChange={(e) => setFormData(prev => ({ ...prev, roleTitle: e.target.value }))}
                            required
                        />
                        
                        {/* Role Suggestions */}
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Common Roles:</Label>
                            <div className="flex flex-wrap gap-2">
                                {roleSuggestions.slice(0, 6).map((role) => (
                                    <Badge 
                                        key={role}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-primary/10 text-xs"
                                        onClick={() => handleRoleSuggestionClick(role)}
                                    >
                                        {role}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Personal Message (Optional)</Label>
                        <Textarea
                            id="message"
                            placeholder={`Hi there! I'd like to invite you to join our team as ${formData.roleTitle || `a ${isHead ? 'team head' : 'team member'}`}.`}
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            rows={3}
                        />
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">What happens next?</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• The invitee will receive an email with invitation details</li>
                            <li>• They can accept or decline the invitation</li>
                            {isHead && <li>• If accepted, they&apos;ll become the team head with management permissions</li>}
                            <li>• You&apos;ll be notified when they respond</li>
                        </ul>
                    </div>

                    <div className="flex justify-end gap-3">
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
                            disabled={loading || !formData.email.trim() || !formData.roleTitle.trim()}
                            className="gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            Send Invitation
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
