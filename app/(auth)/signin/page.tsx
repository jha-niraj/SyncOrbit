"use client"

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/context/userContext";

export default function SignIn() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { email, setEmail, password, setPassword } = useAppContext();
    const [googleSignIn, setGoogleSignIn] = useState<boolean>(false);
    const router = useRouter();

    const handleSignInWithGoogle = async () => {
        try {
            setGoogleSignIn(true);
            const callback = await signIn("google", { callbackUrl: "/dashboard" });

            if (callback?.error) {
                toast("Email not registered");
                router.push("/register");
            }
        } catch (err) {
            const error = err as Error;
            console.log("Google sign-in error: " + error);
        } finally {
            setGoogleSignIn(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await signIn("credentials", {
                email, password,
                redirect: false
            })

            console.log("Auth response:", response);

            if (response?.error) {
                toast.error("Invalid email or password. Please try again.");
            } else if (response?.ok) {
                toast.success("Logged in Successfully");
                router.push("/dashboard");
            }
        } catch (err) {
            const error = err as Error;
            if (error.message === "No user found") {
                toast.error("We couldn't find an account with that email");
            }
            console.log("Error occurred: ", err);
            toast.error("An unexpected error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            <div className="flex-1 container relative flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary-foreground rounded-3xl m-6 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30"></div>
                    </div>
                    <div className="relative z-20 flex items-center text-xl font-medium">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-8 w-8"
                        >
                            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                        </svg>
                        ShunyaTech
                    </div>
                    <div className="relative z-20 mt-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
                        >
                            <div className="mb-4 flex items-center">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                    <span className="text-lg font-bold">SD</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Sofia Davis</h3>
                                    <p className="text-xs text-white/70">Freelance Developer</p>
                                </div>
                            </div>
                            <blockquote className="space-y-2">
                                <p className="text-lg leading-relaxed">
                                    &quot;ShunyaTech has transformed how I find quality freelance work. The verification process
                                    ensures I only work with legitimate clients.&quot;
                                </p>
                                <div className="flex mt-2">
                                    {
                                        [1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="text-yellow-300"
                                            >
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ))
                                    }
                                </div>
                            </blockquote>
                        </motion.div>
                        <motion.div
                            className="mt-8 flex justify-between items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <p className="text-sm text-white/70">Trusted by 500+ businesses</p>
                            <div className="flex -space-x-2">
                                {
                                    [1, 2, 3, 4].map((item) => (
                                        <div
                                            key={item}
                                            className="h-8 w-8 rounded-full bg-white/20 border border-white/10"
                                        ></div>
                                    ))
                                }
                            </div>
                        </motion.div>
                    </div>
                </div>
                <div className="lg:p-8">
                    <motion.div
                        className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                                Welcome Back
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Sign in to access your ShunyaTech dashboard
                            </p>
                        </div>
                        <div className="grid gap-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
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
                                            className="pl-3 h-11 rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-medium">
                                            Password
                                        </Label>
                                        <Link
                                            href="/forgotpassword"
                                            className="text-xs font-medium text-primary hover:underline underline-offset-4 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            placeholder="••••••••"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="current-password"
                                            disabled={isSubmitting}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pl-3 h-11 rounded-xl border-muted-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                                <Button
                                    disabled={isSubmitting}
                                    className="w-full h-11 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
                                >
                                    {
                                        isSubmitting ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : null
                                    }
                                    Sign In
                                    <ArrowRight className="ml-2 h-4 w-4 opacity-70" />
                                </Button>
                            </form>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-muted-foreground/20" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                type="button"
                                disabled={isSubmitting || googleSignIn}
                                onClick={handleSignInWithGoogle}
                                className="h-11 rounded-xl border-muted-foreground/20 hover:bg-muted/50 transition-all duration-200"
                            >
                                {
                                    googleSignIn ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                            <path d="M1 1h22v22H1z" fill="none" />
                                        </svg>
                                    )
                                }
                                Google
                            </Button>
                        </div>
                        <motion.p
                            className="px-8 text-center text-sm text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="font-medium text-primary underline-offset-4 hover:underline transition-colors"
                            >
                                Sign up
                            </Link>
                        </motion.p>
                    </motion.div>
                </div>
            </div>
            <footer className="py-6 px-8 border-t border-muted-foreground/10 mt-auto">
                <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <p className="text-xs text-muted-foreground">
                        © 2025 ShunyaTech. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
