"use client"

import { useState, useRef } from "react"
import { updatePMProfile, uploadCompanyLogo } from "@/actions/(productmanager)/pm.action"
import { uploadProfileImage } from "@/actions/(client)/profile.action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Upload, X, Building2, Copy, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface PMProfileFormProps {
    user: {
        id: string
        name: string | null
        email: string | null
        bio: string | null
        image: string | null
        role: string
        managedCompany?: {
            id: string
            name: string
            shortName: string
            logo?: string
            devReferralCode: string
            clientReferralCode: string
            users: Array<{
                id: string
                name: string | null
                email: string | null
                role: string
                createdAt: Date
            }>
        }
    }
}

export function PMProfileForm({ user }: PMProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [imageUploading, setImageUploading] = useState(false)
    const [logoUploading, setLogoUploading] = useState(false)
    const [copiedCode, setCopiedCode] = useState<string | null>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const logoInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        name: user.name || "",
        bio: user.bio || "",
        image: user.image || "",
        companyName: user.managedCompany?.name || "",
        companyLogo: user.managedCompany?.logo || ""
    })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setImageUploading(true)

        try {
            const uploadFormData = new FormData()
            uploadFormData.append('image', file)

            const result = await uploadProfileImage(uploadFormData)

            if (result.success) {
                const newImageUrl = result.imageUrl || ""
                setFormData(prev => ({
                    ...prev,
                    image: newImageUrl
                }))
                toast.success("Profile image uploaded successfully!")
            } else {
                toast.error(result.error || "Failed to upload image")
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error("Failed to upload image")
        } finally {
            setImageUploading(false)
        }
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setLogoUploading(true)

        try {
            const uploadFormData = new FormData()
            uploadFormData.append('logo', file)

            const result = await uploadCompanyLogo(uploadFormData)

            if (result.success) {
                const newLogoUrl = result.logoUrl || ""
                setFormData(prev => ({
                    ...prev,
                    companyLogo: newLogoUrl
                }))
                toast.success("Company logo uploaded successfully!")
            } else {
                toast.error(result.error || "Failed to upload logo")
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error("Failed to upload logo")
        } finally {
            setLogoUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await updatePMProfile({
                name: formData.name,
                bio: formData.bio,
                image: formData.image,
                companyName: formData.companyName,
                companyLogo: formData.companyLogo
            })

            if (result.success) {
                toast.success("Profile updated successfully!")
            } else {
                toast.error(result.error || "Failed to update profile")
            }
        } catch {
            toast.error("An error occurred while updating profile")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            image: ""
        }))
    }

    const handleRemoveLogo = () => {
        setFormData(prev => ({
            ...prev,
            companyLogo: ""
        }))
    }

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text)
        setCopiedCode(type)
        toast.success(`${type} link copied to clipboard!`)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const getDeveloperReferralLink = () => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://shunyatech.com'
        return `${baseUrl}/devs/signup?ref=${user.managedCompany?.devReferralCode}`
    }

    const getClientReferralLink = () => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://shunyatech.com'
        return `${baseUrl}/signup?ref=${user.managedCompany?.clientReferralCode}`
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Profile Image</CardTitle>
                    <CardDescription>Upload your profile picture</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={formData.image || "/placeholder.svg"} alt="Profile" />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold">
                                {formData.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-2">
                                Upload a profile picture (Max 5MB)
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => imageInputRef.current?.click()}
                                    disabled={imageUploading}
                                >
                                    {
                                        imageUploading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Image
                                            </>
                                        )
                                    }
                                </Button>
                                {
                                    formData.image && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRemoveImage}
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Remove
                                        </Button>
                                    )
                                }
                            </div>
                        </div>
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Company Logo
                    </CardTitle>
                    <CardDescription>Upload your company logo</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed relative">
                            {
                                formData.companyLogo ? (
                                    <Image
                                        src={formData.companyLogo}
                                        alt="Company Logo"
                                        fill
                                        className="object-contain rounded-lg"
                                    />
                                ) : (
                                    <Building2 className="h-8 w-8 text-muted-foreground" />
                                )
                            }
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-2">
                                Upload company logo (Max 5MB)
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => logoInputRef.current?.click()}
                                    disabled={logoUploading}
                                >
                                    {
                                        logoUploading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Logo
                                            </>
                                        )
                                    }
                                </Button>
                                {
                                    formData.companyLogo && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRemoveLogo}
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Remove
                                        </Button>
                                    )
                                }
                            </div>
                        </div>
                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about your background and experience as a Product Manager..."
                            rows={4}
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Company Information</CardTitle>
                    <CardDescription>Update your company details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Enter company name"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">Short Name</Label>
                            <p className="text-sm text-black dark:text-white">{user.managedCompany?.shortName}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-800 dark:text-gray-200">Team Members</Label>
                            <p className="text-sm text-black dark:text-white">{user.managedCompany?.users?.length || 0} members</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {
                user.managedCompany && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Referral Links</CardTitle>
                            <CardDescription>Share these links to invite team members</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Developer Referral Link</Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-2 bg-muted rounded-md text-sm font-mono text-xs">
                                        {getDeveloperReferralLink()}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(getDeveloperReferralLink(), 'Developer')}
                                    >
                                        {
                                            copiedCode === 'Developer' ? (
                                                <>
                                                    <ExternalLink className="h-4 w-4" />
                                                </>
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )
                                        }
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Client Referral Link</Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-2 bg-muted rounded-md text-sm font-mono text-xs">
                                        {getClientReferralLink()}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(getClientReferralLink(), 'Client')}
                                    >
                                        {
                                            copiedCode === 'Client' ? (
                                                <>
                                                    <ExternalLink className="h-4 w-4" />
                                                </>
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )
                                        }
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            }
            <Button
                type="submit"
                disabled={isLoading || imageUploading || logoUploading}
                className="w-full"
            >
                {
                    isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating Profile...
                        </>
                    ) : (
                        "Update Profile"
                    )
                }
            </Button>
        </form>
    )
} 