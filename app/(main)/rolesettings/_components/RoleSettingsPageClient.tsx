"use client"

import { useState } from "react"
import {
    Card, CardContent
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { toast } from "sonner"
import { motion } from "framer-motion"
import {
    Users, UserCheck, Clock, Briefcase
} from "lucide-react"
import {
    updateUserRole
} from "@/actions/(productmanager)/user-role.action"
import { Role } from "@prisma/client"
import { UserWithRole } from "@/types/role-settings"

interface RoleSettingsPageClientProps {
    initialDevelopers: UserWithRole[]
}

const roleOptions = [
    {
        value: "CLIENT",
        label: "Client",
        description: "External client access",
        color: "bg-gray-100 text-gray-800 border-gray-200"
    },
    {
        value: "TEAM_MEMBER",
        label: "Team Member",
        description: "Regular team member",
        color: "bg-green-100 text-green-800 border-green-200"
    },
    {
        value: "TEAM_HEAD",
        label: "Team Head",
        description: "Head of any department",
        color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
        value: "COMPANY_OWNER",
        label: "Company Owner",
        description: "Full company access",
        color: "bg-purple-100 text-purple-800 border-purple-200"
    },
    {
        value: "ADMIN",
        label: "Admin",
        description: "Super admin access",
        color: "bg-red-100 text-red-800 border-red-200"
    }
]

export default function RoleSettingsPageClient({ initialDevelopers }: RoleSettingsPageClientProps) {
    const [developers, setDevelopers] = useState<UserWithRole[]>(initialDevelopers)
    const [updating, setUpdating] = useState<string | null>(null)

    const handleRoleUpdate = async (userId: string, newRole: Role) => {
        setUpdating(userId)
        try {
            const result = await updateUserRole(userId, newRole)
            if (result.success) {
                toast.success("Role updated successfully")
                setDevelopers(prev =>
                    prev.map(dev =>
                        dev.id === userId
                            ? { ...dev, userRole: newRole }
                            : dev
                    )
                )
            } else {
                toast.error(result.error || "Failed to update role")
            }
        } catch (error) {
            toast.error("Failed to update role")
            console.error(error)
        } finally {
            setUpdating(null)
        }
    }

    const getRoleInfo = (userRole: Role | null) => {
        if (!userRole) return roleOptions[0] // Default to CLIENT
        return roleOptions.find(role => role.value === userRole) || roleOptions[0]
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">Role Settings</h1>
                <p className="text-muted-foreground">
                    Manage developer roles and permissions in your company
                </p>
            </div>
            {
                developers.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center gap-4 py-12">
                            <Users className="h-12 w-12 text-muted-foreground" />
                            <div className="text-center">
                                <h3 className="text-lg font-semibold">No Developers Found</h3>
                                <p className="text-sm text-muted-foreground">
                                    No developers are currently part of your company
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {
                            developers.map((developer, index) => {
                                const roleInfo = getRoleInfo(developer.userRole as Role)

                                return (
                                    <motion.div
                                        key={developer.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <Card className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-12 w-12 border-2 border-border/50">
                                                            <AvatarImage src={developer.image || ""} />
                                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                                {developer.name?.split(" ").map((n: string) => n[0]).join("") || "D"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="space-y-1">
                                                            <h3 className="font-semibold text-lg">
                                                                {developer.name || "Unknown Developer"}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {developer.email}
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="text-xs">
                                                                    <Briefcase className="w-3 h-3 mr-1" />
                                                                    {developer.projects?.length || 0} Projects
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                    {developer.assignedTasks?.length || 0} Tasks
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right space-y-1">
                                                            <Badge
                                                                variant="outline"
                                                                className={`${roleInfo.color} border`}
                                                            >
                                                                <UserCheck className="w-3 h-3 mr-1" />
                                                                {roleInfo.label}
                                                            </Badge>
                                                            <p className="text-xs text-muted-foreground">
                                                                {roleInfo.description}
                                                            </p>
                                                        </div>
                                                        <Select
                                                            value={developer.userRole || "CLIENT"}
                                                            onValueChange={(value) => handleRoleUpdate(developer.id, value as Role)}
                                                            disabled={updating === developer.id}
                                                        >
                                                            <SelectTrigger className="w-40">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {
                                                                    roleOptions.map((option) => (
                                                                        <SelectItem key={option.value} value={option.value}>
                                                                            <div className="space-y-1">
                                                                                <div className="font-medium">{option.label}</div>
                                                                                <div className="text-xs text-muted-foreground">
                                                                                    {option.description}
                                                                                </div>
                                                                            </div>
                                                                        </SelectItem>
                                                                    ))
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}