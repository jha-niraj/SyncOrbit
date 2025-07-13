"use client"

import { useState, useRef } from "react"
import { updateProfile, uploadProfileImage } from "@/actions/(client)/profile.action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Upload, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from "@/store/useUser"

interface ProfileFormProps {
    user: {
        id: string
        name: string | null
        email: string | null
        bio: string | null
        skills: string | null
        image: string | null
        role: string
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [imageUploading, setImageUploading] = useState(false)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const { updateProfileImage } = useUser()
    
    const [formData, setFormData] = useState({
        name: user.name || "",
        bio: user.bio || "",
        skills: user.skills || "",
        image: user.image || ""
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
                // Update the store for instant reflection across the app
                await updateProfileImage(newImageUrl)
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Only include skills if user is not a CLIENT
            const dataToUpdate = user.role === 'CLIENT' 
                ? { name: formData.name, bio: formData.bio, image: formData.image }
                : formData

            const result = await updateProfile(dataToUpdate)
            
            if (result.success) {
                toast.success("Profile updated successfully!")
                // Refresh the page to show updated data
                window.location.reload()
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={formData.image || "/placeholder.svg"} alt="Profile" />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold">
                                {formData.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Label htmlFor="profileImage" className="text-sm font-medium">
                                Profile Image
                            </Label>
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
                                    {imageUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Image
                                        </>
                                    )}
                                </Button>
                                {formData.image && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRemoveImage}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Remove
                                    </Button>
                                )}
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

            {/* Name Field */}
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

            {/* Bio Field */}
            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                />
            </div>

            {/* Skills Field - Only show for non-CLIENT users */}
            {user.role !== 'CLIENT' && (
                <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="List your skills (e.g., JavaScript, React, Node.js)"
                        rows={3}
                    />
                </div>
            )}

            <Button type="submit" disabled={isLoading || imageUploading} className="w-full">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Profile...
                    </>
                ) : (
                    "Update Profile"
                )}
            </Button>
        </form>
    )
} 