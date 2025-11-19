"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    UserPlus, Copy, Check, Loader2, Users, Building2, Shield
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { toast } from "sonner"
import { Role } from "@prisma/client"
import { useSession } from "next-auth/react"
import { getCompanyTeams } from "@/actions/teams.action"

interface ReferralSheetProps {
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

interface Team {
    id: string
    displayName: string
}

export function ReferralSheet({ trigger, open: controlledOpen, onOpenChange }: ReferralSheetProps) {
    const { data: session } = useSession()
    const [internalOpen, setInternalOpen] = useState(false)
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen
    const setOpen = onOpenChange || setInternalOpen

    const [role, setRole] = useState<Role>(Role.TEAM_MEMBER)
    const [selectedTeamId, setSelectedTeamId] = useState<string>("")
    const [teams, setTeams] = useState<Team[]>([])
    const [loading, setLoading] = useState(false)
    const [generatedLink, setGeneratedLink] = useState("")
    const [copied, setCopied] = useState(false)

    const userRole = session?.user?.role as Role
    const isOwner = userRole === Role.COMPANY_OWNER
    const isTeamHead = userRole === Role.TEAM_HEAD

    useEffect(() => {
        if (open && (isOwner || isTeamHead)) {
            loadTeams()
        }
    }, [open, isOwner, isTeamHead])

    const loadTeams = async () => {
        setLoading(true)
        try {
            const result = await getCompanyTeams()
            if (result.success) {
                setTeams(result.teams)
            }
        } catch (error) {
            console.error("Error loading teams:", error)
        } finally {
            setLoading(false)
        }
    }

    const generateLink = async () => {
        setLoading(true)
        try {
            const { generateReferralLink } = await import("@/actions/referral.action")
            const result = await generateReferralLink({
                role,
                teamId: (role === Role.TEAM_MEMBER || role === Role.TEAM_HEAD) ? selectedTeamId : undefined
            })

            if (result.success && result.link) {
                setGeneratedLink(result.link)
                toast.success("Link generated successfully")
            } else {
                toast.error(result.error || "Failed to generate link")
            }
        } catch (error) {
            console.error("Error generating link:", error)
            toast.error("Failed to generate link")
        } finally {
            setLoading(false)
        }
    }

    // We need an action to get/generate the link
    // Let's implement the UI first.

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
            <SheetContent className="sm:max-w-[500px]">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Invite New Members
                    </SheetTitle>
                </SheetHeader>

                <div className="py-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select Role</Label>
                            <Select value={role} onValueChange={(val: Role) => setRole(val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {isOwner && (
                                        <>
                                            <SelectItem value={Role.TEAM_HEAD}>
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-4 h-4" />
                                                    Team Head
                                                </div>
                                            </SelectItem>
                                            <SelectItem value={Role.CLIENT}>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4" />
                                                    Client
                                                </div>
                                            </SelectItem>
                                        </>
                                    )}
                                    <SelectItem value={Role.TEAM_MEMBER}>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Team Member
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {(role === Role.TEAM_MEMBER || role === Role.TEAM_HEAD) && (
                            <div className="space-y-2">
                                <Label>Assign to Team (Optional)</Label>
                                <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a team..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loading ? (
                                            <div className="flex items-center justify-center p-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            </div>
                                        ) : (
                                            teams.map(team => (
                                                <SelectItem key={team.id} value={team.id}>
                                                    {team.displayName}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    New member will be automatically added to this team.
                                </p>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <Button
                            className="w-full"
                            onClick={generateLink}
                            disabled={loading}
                        >
                            Generate Invite Link
                        </Button>

                        {generatedLink && (
                            <div className="space-y-2">
                                <Label>Share this link</Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-2 bg-muted rounded-md text-sm break-all font-mono">
                                        {generatedLink}
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => {
                                            navigator.clipboard.writeText(generatedLink)
                                            setCopied(true)
                                            setTimeout(() => setCopied(false), 2000)
                                            toast.success("Link copied to clipboard")
                                        }}
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
