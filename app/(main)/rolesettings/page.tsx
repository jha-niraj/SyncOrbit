"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Users, Settings, UserCheck, Clock, Briefcase } from "lucide-react"
import { getUsersByCompany, updateUserRole } from "@/actions/(productmanager)/user-role.action"
import { useSession } from "next-auth/react"
import { UserRole } from "@prisma/client"
import { UserWithRole } from "@/types/role-settings"

const roleOptions = [
    {
        value: "BASIC_DEVELOPER",
        label: "Basic Developer",
        description: "Can view projects and tasks",
        color: "bg-gray-100 text-gray-800 border-gray-200"
    },
    {
        value: "PROJECT_CREATOR",
        label: "Project Creator",
        description: "Can create projects and onboard clients",
        color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
        value: "SENIOR_DEVELOPER",
        label: "Senior Developer",
        description: "Full development access",
        color: "bg-green-100 text-green-800 border-green-200"
    },
    {
        value: "TEAM_LEAD",
        label: "Team Lead",
        description: "Team management access",
        color: "bg-purple-100 text-purple-800 border-purple-200"
    }
]

export default function RoleSettingsPage() {
    const { data: session } = useSession()
    const [developers, setDevelopers] = useState<UserWithRole[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)

    useEffect(() => {
        fetchDevelopers()
    }, [])

    const fetchDevelopers = async () => {
        try {
            const result = await getUsersByCompany()
            if (result.success) {
                setDevelopers(result.users as UserWithRole[])
            } else {
                toast.error(result.error || "Failed to fetch developers")
            }
        } catch (error) {
            toast.error("Failed to fetch developers")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
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

    const getRoleInfo = (userRole: UserRole | null) => {
        if (!userRole) return roleOptions[0] // Default to BASIC_DEVELOPER
        return roleOptions.find(role => role.value === userRole) || roleOptions[0]
    }

    if (session?.user?.role !== "PRODUCTMANAGER") {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-96">
                    <CardContent className="flex flex-col items-center gap-4 pt-6">
                        <Settings className="h-12 w-12 text-muted-foreground" />
                        <div className="text-center">
                            <h3 className="text-lg font-semibold">Access Denied</h3>
                            <p className="text-sm text-muted-foreground">
                                Only Product Managers can access role settings
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
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
                loading ? (
                    <div className="space-y-4">
                        {
                            [1, 2, 3].map((i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <div className="animate-pulse space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-muted rounded-full" />
                                                <div className="space-y-2 flex-1">
                                                    <div className="h-4 bg-muted rounded w-1/4" />
                                                    <div className="h-3 bg-muted rounded w-1/3" />
                                                </div>
                                                <div className="h-8 bg-muted rounded w-32" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                ) : developers.length === 0 ? (
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
                                const roleInfo = getRoleInfo(developer.userRole as UserRole)

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
                                                            value={developer.userRole || "BASIC_DEVELOPER"}
                                                            onValueChange={(value) => handleRoleUpdate(developer.id, value as UserRole)}
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