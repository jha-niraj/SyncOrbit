"use client"

import type React from "react"
import { useState, useRef, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	CheckCircle, RefreshCw, ShieldCheck
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { signIn } from "next-auth/react"

function VerifyContent() {
	const [isLoading, setIsLoading] = useState(false)
	const [isVerified, setIsVerified] = useState(false)
	const [timer, setTimer] = useState(30)
	const [canResend, setCanResend] = useState(false)
	const [email, setEmail] = useState<string | null>(null)
	const router = useRouter()
	const searchParams = useSearchParams()
	const [code, setCode] = useState(["", "", "", "", "", ""])
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])

	useEffect(() => {
		const emailParam = searchParams.get('email')
		if (emailParam) setEmail(emailParam)
		else router.push('/signup')
	}, [searchParams, router])

	useEffect(() => {
		if (timer > 0 && !canResend) {
			const interval = setInterval(() => setTimer((p) => p - 1), 1000)
			return () => clearInterval(interval)
		} else if (timer === 0) setCanResend(true)
	}, [timer, canResend])

	const handleInputChange = (index: number, value: string) => {
		if (value && !/^\d+$/.test(value)) return
		const newCode = [...code]
		newCode[index] = value
		setCode(newCode)
		if (value && index < 5) inputRefs.current[index + 1]?.focus()
	}

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace" && !code[index] && index > 0) inputRefs.current[index - 1]?.focus()
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (code.join("").length !== 6) return
		setIsLoading(true)
		try {
			const response = await axios.post('/api/verify-email', { email, otp: code.join("") })
			if (response.status === 200) {
				setIsVerified(true)
				const signInResult = await signIn('credentials', { email, password: "verified", redirect: false })
				setTimeout(() => router.push(signInResult?.ok ? '/onboarding' : '/signin?verified=true'), 1500)
			}
		} catch {
			toast.error("Invalid Code")
			setCode(["", "", "", "", "", ""])
			inputRefs.current[0]?.focus()
		} finally { setIsLoading(false) }
	}

	if (isVerified) {
		return (
			<div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center font-sans">
				<div className="text-center">
					<div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
						<CheckCircle className="w-10 h-10 text-white" />
					</div>
					<h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Identity Verified</h2>
					<p className="text-neutral-500 font-mono text-sm animate-pulse">Redirecting to Orbital Dashboard...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen w-full bg-white dark:bg-neutral-950 flex flex-col items-center justify-center relative font-sans">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

			<div className="w-full max-w-md relative z-10 px-4">
				<div className="mb-8 text-center">
					<div className="inline-flex items-center gap-2 mb-4">
						<ShieldCheck className="w-6 h-6 text-neutral-900 dark:text-white" />
					</div>
					<h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Two-Factor Auth</h1>
					<p className="text-sm text-neutral-500 dark:text-neutral-400">Enter the 6-digit code sent to your email.</p>
				</div>
				<div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-8">
					<form onSubmit={handleSubmit} className="space-y-8">
						<div className="flex justify-center gap-2">
							{
								code.map((digit, index) => (
									<Input
										key={index}
										ref={(el) => { inputRefs.current[index] = el }}
										type="text"
										maxLength={1}
										value={digit}
										onChange={(e) => handleInputChange(index, e.target.value)}
										onKeyDown={(e) => handleKeyDown(index, e)}
										className="w-10 h-12 text-center text-lg font-bold font-mono rounded-md border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
									/>
								))
							}
						</div>
						<Button
							type="submit"
							className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black rounded-md font-bold uppercase tracking-widest text-xs transition-all"
							disabled={isLoading || code.join("").length !== 6}
						>
							{isLoading ? "Verifying..." : "Confirm Code"}
						</Button>
						<div className="text-center">
							<button
								type="button"
								disabled={!canResend}
								className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
							>
								<RefreshCw className={`w-3 h-3 ${!canResend && "animate-spin"}`} />
								{canResend ? "Resend Code" : `Resend in ${timer}s`}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default function Verify() {
	return <Suspense fallback={<div>Loading...</div>}>
		<VerifyContent />
	</Suspense>
}