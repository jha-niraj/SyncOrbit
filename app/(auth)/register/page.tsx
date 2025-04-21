"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"
import { toast } from "sonner";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [googleSignUp, setGoogleSignUp] = useState<boolean>(false);
    const router = useRouter();

    const handleGoogleSignUp = async () => {
        try {
            setGoogleSignUp(true);
            await signIn('google', { callbackUrl: '/dashboard' });
        } catch (err) {
            const error = err as Error;
            console.log('Google sign-in error:', error);
            setGoogleSignUp(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post("/api/register", {
                name,
                email,
                password
            });

            if (response.status === 200) {
                const result = await signIn("credentials", {
                    name,
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    console.log("Sign in error:", result.error);
                    toast("Authentication failed", {
                        description: result.error,
                    });
                } else {
                    toast("Success", {
                        description: "Logged in successfully",
                    });
                    router.push("/dashboard");
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || "An error occurred during registration";
                toast.error(errorMessage);
            } else if (axios.isAxiosError(error) && error.request) {
                toast.error("No response from server. Please try again.");
            } else {
                toast.error("Error setting up the request. Please try again.");
            }
            console.log("Registration error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            <div className="flex-1 flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary-foreground rounded-3xl m-6 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30"></div>

                        <motion.div
                            className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"
                            animate={{
                                x: [0, 30, 0],
                                y: [0, -30, 0],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        />
                        <motion.div
                            className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"
                            animate={{
                                x: [0, -30, 0],
                                y: [0, 30, 0],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: 1
                            }}
                        />
                    </div>
                    <div className="relative z-20 flex items-center text-xl font-medium">
                        <Image
                            src="/shunyatech.png"
                            alt="ShunyaTech Logo"
                            width={48}
                            height={48}
                            className="mr-3 rounded-sm"
                        />
                        <span className="text-2xl font-bold">ShunyaTech</span>
                    </div>
                    <motion.div
                        className="relative z-20 mt-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold mb-6">Join our growing community of innovators</h2>
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                            <div className="mb-4 flex items-center">
                                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                    <span className="text-lg font-bold">AJ</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Alex Johnson</h3>
                                    <p className="text-xs text-white/70">Tech Startup Founder</p>
                                </div>
                            </div>
                            <blockquote className="space-y-2">
                                <p className="text-lg leading-relaxed">
                                    &quot;As an employer, I&apos;ve found exceptional talent through ShunyaTech. The verification process ensures I
                                    only connect with qualified professionals.&quot;
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
                                                <path d="M12 21.75c-2.48 0-4.5-2.01-4.5-4.5S9.22 17.25 11.7 17.25s4.5 2.01 4.5 4.5S14.18 21.75 12 21.75zm0-2.25c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm0-2.25c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                        ))
                                    }
                                </div>
                            </blockquote>
                        </div>
                    </motion.div>
                </div>
                <div className="lg:p-8">
                    <motion.div
                        className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                            <p className="text-sm text-muted-foreground">Enter your information to create an account</p>
                        </div>
                        <div className="grid gap-6">
                            <form onSubmit={handleSignUp}>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            type="text"
                                            autoCapitalize="none"
                                            autoCorrect="off"
                                            disabled={isSubmitting}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
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
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            placeholder="••••••••"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="new-password"
                                            disabled={isSubmitting}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox required id="terms" />
                                        <label
                                            htmlFor="terms"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            I agree to the{" "}
                                            <Link href="/terms" className="text-primary underline underline-offset-4 hover:text-primary">
                                                terms of service
                                            </Link>{" "}
                                            and{" "}
                                            <Link href="/privacy" className="text-primary underline underline-offset-4 hover:text-primary">
                                                privacy policy
                                            </Link>
                                        </label>
                                    </div>
                                    <Button disabled={isSubmitting}>
                                        {
                                            isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        }
                                        Sign Up
                                    </Button>
                                </div>
                            </form>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Button variant="outline" type="button" disabled={isSubmitting} onClick={handleGoogleSignUp}>
                                    {
                                        googleSignUp ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                        </div>
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/signin" className="underline underline-offset-4 hover:text-primary">
                                Sign in
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
