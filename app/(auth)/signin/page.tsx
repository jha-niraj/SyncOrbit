"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Eye, EyeOff, Loader2, Boxes, Lock, Fingerprint
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const SignInVisual = () => (
	<div className="relative h-full w-full bg-neutral-950 flex flex-col justify-center items-center overflow-hidden border-r border-neutral-800">
		<div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,#262626_1px,transparent_1px)] bg-[size:32px_32px]"></div>
		<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-neutral-800/10 blur-[80px] rounded-full"></div>

		<div className="relative z-10 w-64 h-64 border border-neutral-800 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
			<div className="w-48 h-48 border border-neutral-700/50 rounded-full border-dashed"></div>
		</div>

		<div className="absolute z-20 flex flex-col items-center">
			<div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center mb-6 shadow-2xl">
				<Lock className="w-6 h-6 text-white" />
			</div>
			<h2 className="text-2xl font-bold text-white tracking-tighter mb-2">Restricted Access</h2>
			<p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Auth_Node_01</p>
		</div>

		<div className="absolute bottom-12 left-12 right-12">
			<div className="flex justify-between text-neutral-600 font-mono text-[10px] uppercase">
				<span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> SSL_Secured</span>
				<span className="flex items-center gap-1"><Fingerprint className="w-3 h-3" /> 2FA_Ready</span>
			</div>
		</div>
	</div>
);

import { ShieldCheck } from "lucide-react";

function SignInContent() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

	useEffect(() => {
		const verified = searchParams.get('verified')
		const emailParam = searchParams.get('email')
		if (verified === 'true') {
			toast.success('Identity verified. Proceed with login.')
			if (emailParam) setEmail(decodeURIComponent(emailParam))
		}
		const error = searchParams.get("error");
		if (error === "OAuthAccountNotLinked") toast.error("Identity conflict detected.")
		else if (error === "EmailNotVerified") toast.error("Identity verification pending.")
	}, [searchParams])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		try {
			const result = await signIn('credentials', { email, password, redirect: false, callbackUrl })
			if (result?.error) {
				toast.error("Authentication Failed: Invalid Credentials")
			} else if (result?.ok) {
				toast.success("Access Granted")
				window.location.href = callbackUrl;
			}
		} catch (error) {
			console.log("Error occurred while signing in", error)
			toast.error("System Error")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-neutral-100 dark:bg-neutral-950 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
			<div className="w-full max-w-7xl bg-white dark:bg-neutral-950 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden grid lg:grid-cols-2 min-h-[800px]">
				<div className="hidden lg:block relative">
					<SignInVisual />
				</div>
				<div className="flex flex-col justify-center p-8 lg:p-20 overflow-y-auto bg-white dark:bg-neutral-950">
					<div className="max-w-sm w-full mx-auto">
						<div className="mb-10 text-center lg:text-left">
							<div className="inline-flex items-center gap-2 mb-4">
								<div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-md flex items-center justify-center">
									<Boxes className="w-4 h-4 text-white dark:text-black" />
								</div>
								<span className="font-bold text-xl tracking-tighter text-neutral-900 dark:text-white">SyncOrbit</span>
							</div>
							<h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">Welcome Back</h1>
							<p className="text-neutral-500 mt-2 text-sm">Enter your credentials to access the terminal.</p>
						</div>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label className="text-[10px] font-mono uppercase font-bold text-neutral-500">User_ID (Email)</Label>
								<Input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									disabled={isLoading}
									className="h-12 rounded-md border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
									placeholder="name@corp.com"
								/>
							</div>
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Access_Key</Label>
									<Link
										href={callbackUrl ? `/forgotpassword?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/forgotpassword'}
										className="text-[10px] text-neutral-900 dark:text-white hover:underline font-medium"
									>
										Reset_Key?
									</Link>
								</div>
								<div className="relative">
									<Input
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										disabled={isLoading}
										className="h-12 rounded-md border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 pr-10 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
										placeholder="••••••••"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
									>
										{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
									</button>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black rounded-md font-bold uppercase tracking-widest text-xs transition-all shadow-lg"
								disabled={isLoading}
							>
								{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authenticate"}
							</Button>
						</form>
						<div className="mt-10 text-center border-t border-neutral-100 dark:border-neutral-900 pt-8">
							<p className="text-sm text-neutral-500">
								New node?{" "}
								<Link
									href={callbackUrl ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/signup'}
									className="text-neutral-900 dark:text-white font-bold hover:underline"
								>
									Initialize Identity
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function SignInPage() {
	return (
		<Suspense fallback={<div className="flex h-screen items-center justify-center bg-white dark:bg-neutral-950"><Loader2 className="h-6 w-6 animate-spin text-neutral-500" /></div>}>
			<SignInContent />
		</Suspense>
	)
}