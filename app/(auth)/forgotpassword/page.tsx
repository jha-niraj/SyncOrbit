"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('/api/forgot-password', { email });

            if (response.status === 200) {
                toast.success("Password reset OTP sent!", {
                    description: "Please check your email for the reset code."
                });
                router.push(`/reset-password?email=${encodeURIComponent(email)}`);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || "Failed to send reset OTP";
                toast.error(errorMessage);
            } else {
                toast.error("An error occurred. Please try again.");
            }
            console.error("Error sending reset OTP:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            <div className="flex-1 flex flex-col items-center justify-center">
                <motion.div
                    className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col items-center space-y-4">
                        <Image
                            src="/shunyatech.png"
                            alt="ShunyaTech Logo"
                            width={64}
                            height={64}
                            className="rounded-sm"
                        />
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your email address and we'll send you a reset code
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isSubmitting}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Reset Code
                                </Button>
                            </div>
                        </form>

                        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                            <p>Remember your password?</p>
                            <Button
                                variant="link"
                                className="h-auto p-0"
                                onClick={() => router.push('/signin')}
                            >
                                Back to Sign In
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}