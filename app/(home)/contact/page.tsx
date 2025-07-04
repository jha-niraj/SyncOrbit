"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Mail, Phone, MapPin, Loader2 } from "lucide-react"
import { useState } from "react"
import { submitContactForm, type ContactFormData } from "@/actions/contact.action"
import { toast } from "sonner"
import SmoothScroll from "@/components/smoothscroll"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (formData.message.length < 10) {
            toast.error("Message must be at least 10 characters long");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Submitting form data:", formData); // Debug log
            const result = await submitContactForm(formData);
            console.log("Server response:", result); // Debug log

            if (result.success) {
                toast.success(result.message);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    message: ""
                });
            } else {
                if (result.errors) {
                    result.errors.forEach((error: { message: string }) => {
                        toast.error(error.message);
                    });
                } else {
                    toast.error(result.message);
                }
            }
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SmoothScroll>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-black dark:to-slate-900 py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <Badge variant="outline" className="px-4 py-2 border-teal-200/30 dark:border-teal-800/30 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
                            <MessageSquare className="w-4 h-4 text-teal-500 mr-2" />
                            <span className="text-teal-700 dark:text-teal-300">Contact Us</span>
                        </Badge>
                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Get in Touch
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Have a project in mind? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl p-8 border border-teal-200/30 dark:border-teal-800/30"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full"
                                        required
                                        minLength={2}
                                        disabled={isSubmitting}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full"
                                        required
                                        disabled={isSubmitting}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone (optional)
                                    </label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full"
                                        disabled={isSubmitting}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <Textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full min-h-[150px]"
                                        required
                                        minLength={10}
                                        disabled={isSubmitting}
                                        placeholder="Tell us about your project or inquiry (minimum 10 characters)"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                                    disabled={isSubmitting}
                                >
                                    {
                                        isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Message'
                                        )
                                    }
                                </Button>
                            </form>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="space-y-8"
                        >
                            <div className="bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-teal-200/30 dark:border-teal-800/30">
                                <Mail className="h-6 w-6 text-teal-500 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    contact@shunyatech.com
                                </p>
                            </div>
                            <div className="bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-teal-200/30 dark:border-teal-800/30">
                                <Phone className="h-6 w-6 text-teal-500 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Phone</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    +91 (123) 456-7890
                                </p>
                            </div>
                            <div className="bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-teal-200/30 dark:border-teal-800/30">
                                <MapPin className="h-6 w-6 text-teal-500 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    123 Tech Park, Innovation Street<br />
                                    Bangalore, Karnataka 560001<br />
                                    India
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </SmoothScroll>
    )
} 