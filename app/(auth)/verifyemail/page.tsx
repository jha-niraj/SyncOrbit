"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function VerifyEmail() {
    const [otp, setOtp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    useEffect(() => {
        if (!email) {
            router.push("/register");
            return;
        }
    }, [email, router]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/verify-email", {
                email,
                otp
            });

            if (response.status === 200) {
                toast.success("Email verified successfully!", {
                    description: "You can now sign in to your account."
                });
                router.push("/signin");
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || "Verification failed";
                toast.error(errorMessage);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOTP = async () => {
        if (!email || countdown > 0) return;

        setIsResending(true);
        try {
            const response = await axios.post("/api/resend-otp", { email });

            if (response.status === 200) {
                toast.success("OTP resent successfully!", {
                    description: "Please check your email for the new OTP."
                });
                setCountdown(60); // Start 60-second countdown
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || "Failed to resend OTP";
                toast.error(errorMessage);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setIsResending(false);
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
                            <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
                            <p className="text-sm text-muted-foreground">
                                Enter the verification code sent to<br />
                                <span className="font-medium text-primary">{email}</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <form onSubmit={handleVerify}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="otp">Verification Code</Label>
                                    <Input
                                        id="otp"
                                        placeholder="Enter 6-digit code"
                                        type="text"
                                        maxLength={6}
                                        pattern="[0-9]{6}"
                                        autoComplete="one-time-code"
                                        disabled={isSubmitting}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        required
                                    />
                                </div>
                                <Button disabled={isSubmitting || otp.length !== 6}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Verify Email
                                </Button>
                            </div>
                        </form>

                        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                            <p>Didn't receive the code?</p>
                            <Button
                                variant="link"
                                className="h-auto p-0"
                                disabled={isResending || countdown > 0}
                                onClick={handleResendOTP}
                            >
                                {isResending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : countdown > 0 ? (
                                    `Resend code in ${countdown}s`
                                ) : (
                                    "Resend verification code"
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}