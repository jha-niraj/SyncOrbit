"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { CheckCircle, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { motion } from "framer-motion"
import axios from "axios"

function VerifyEmail() {
	const [isLoading, setIsLoading] = useState(false)
	const [isVerified, setIsVerified] = useState(false)
	const [timer, setTimer] = useState(60)
	const [canResend, setCanResend] = useState(false)
	const router = useRouter()
	const searchParams = useSearchParams()
	const email = searchParams.get("email")
	const callbackUrl = searchParams.get("callbackUrl")
	const [signupData, setSignupData] = useState<{
		name: string;
		email: string;
		password: string;
	} | null>(null)

	const inputRefs = [
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
		useRef<HTMLInputElement>(null),
	]

	const [code, setCode] = useState(["", "", "", "", "", ""])

	useEffect(() => {
		const data = sessionStorage.getItem('signupData')
		if (data) {
			const parsedData = JSON.parse(data)
			setSignupData(parsedData)
		} else if (!email) {
			router.push('/signup')
		}
	}, [router, email])

	useEffect(() => {
		if (timer > 0 && !canResend) {
			const interval = setInterval(() => {
				setTimer((prev) => prev - 1)
			}, 1000)
			return () => clearInterval(interval)
		} else if (timer === 0 && !canResend) {
			setCanResend(true)
		}
	}, [timer, canResend])

	const handleInputChange = (index: number, value: string) => {
		if (value && !/^\d+$/.test(value)) return

		const newCode = [...code]
		newCode[index] = value
		setCode(newCode)

		if (value && index < 5) {
			inputRefs[index + 1].current?.focus()
		}

		if (value && index === 5) {
			const fullCode = [...newCode]
			fullCode[index] = value
			if (fullCode.every(digit => digit !== "")) {
				handleSubmit(null, fullCode.join(""))
			}
		}
	}

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs[index - 1].current?.focus()
		}
	}

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault()
		const pastedData = e.clipboardData.getData("text/plain").trim()

		if (/^\d{6}$/.test(pastedData)) {
			const digits = pastedData.split("")
			setCode(digits)
			inputRefs[5].current?.focus()
			handleSubmit(null, pastedData)
		}
	}

	const handleResendOtp = async () => {
		if (!email && !signupData?.email) return

		setIsLoading(true)
		setCanResend(false)
		setTimer(60)

		try {
			const response = await axios.post('/api/resend-otp', {
				email: email || signupData?.email
			})

			if (response.status === 200) {
				setCode(["", "", "", "", "", ""])
				inputRefs[0].current?.focus()
				toast.success(response.data.message)
			} else {
				toast.error(response.data.message)
				setCanResend(true)
				setTimer(0)
			}
		} catch (error) {
			console.error("Failed to resend verification code:", error)
			toast.error("Failed to resend verification code")
			setCanResend(true)
			setTimer(0)
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent | null, otpCode?: string) => {
		if (e) e.preventDefault()

		const codeToVerify = otpCode || code.join("")

		if (codeToVerify.length !== 6) {
			toast.error("Please enter the complete 6-digit code")
			return
		}

		if (!email && !signupData?.email) {
			toast.error("Email not found. Please try signing up again.")
			router.push('/signup')
			return
		}

		setIsLoading(true)

		try {
			const response = await axios.post('/api/verify-email', {
				email: email || signupData?.email,
				otp: codeToVerify
			})

			if (response.status === 200) {
				setIsVerified(true)
				toast.success("Email verified successfully! Signing you in...")

				sessionStorage.removeItem('signupData')

				if (signupData?.password) {
					const signInResult = await signIn('credentials', {
						email: email || signupData?.email,
						password: signupData?.password,
						redirect: false
					})

					if (signInResult?.ok) {
						setTimeout(() => {
							const redirectUrl = callbackUrl || '/dashboard'
							router.push(redirectUrl)
						}, 2000)
					} else {
						setTimeout(() => {
							const redirectUrl = callbackUrl
								? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&verified=true`
								: '/signin?verified=true'
							router.push(redirectUrl)
						}, 2000)
					}
				} else {
					setTimeout(() => {
						const redirectUrl = callbackUrl
							? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&verified=true`
							: '/signin?verified=true'
						router.push(redirectUrl)
					}, 2000)
				}
			} else {
				toast.error("Invalid verification code")
				setCode(["", "", "", "", "", ""])
				inputRefs[0].current?.focus()
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				const errorMessage = error.response.data.message || "Invalid verification code"
				toast.error(errorMessage)
			} else {
				toast.error("Verification failed. Please try again.")
			}
			setCode(["", "", "", "", "", ""])
			inputRefs[0].current?.focus()
		} finally {
			setIsLoading(false)
		}
	}

	if (!email && !signupData) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/10">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
				>
					<div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full animate-pulse mx-auto mb-4"></div>
					<p className="text-slate-600 dark:text-slate-300">Loading...</p>
				</motion.div>
			</div>
		)
	}

	if (isVerified) {
		return (
			<div className="bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/10 flex h-screen w-screen flex-col items-center justify-center">
				<motion.div
					className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div className="flex flex-col space-y-6 text-center">
						<motion.div
							className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30"
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
						>
							<CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
						</motion.div>
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
								Email Verified!
							</h1>
							<p className="text-slate-600 dark:text-slate-300">
								Welcome to ShunyaTech! Redirecting you to the dashboard...
							</p>
						</div>
						<motion.div
							className="flex justify-center"
							animate={{ rotate: 360 }}
							transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
						>
							<Loader2 className="h-6 w-6 text-emerald-600" />
						</motion.div>
					</div>
				</motion.div>
			</div>
		)
	}

	return (
		<div className="bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/10 flex h-screen w-screen flex-col items-center justify-center">
			<motion.div
				className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[420px] p-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<div className="flex flex-col items-center space-y-6">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
					>
						<Image
							src="/shunyatech.png"
							alt="ShunyaTech Logo"
							width={80}
							height={80}
							className="rounded-2xl shadow-lg"
						/>
					</motion.div>
					<div className="flex flex-col space-y-3 text-center">
						<h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
							Verify your email
						</h1>
						<p className="text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
							Enter the 6-digit verification code sent to{" "}
							<span className="font-semibold text-emerald-600 dark:text-emerald-400">
								{email || signupData?.email}
							</span>
						</p>
					</div>
				</div>

				{/* OTP Form */}
				<motion.div
					className="sm:w-[350px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 shadow-xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.6 }}
				>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-4">
							<div className="flex justify-center gap-3">
								{code.map((digit, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.3 + index * 0.1 }}
									>
										<Input
											ref={inputRefs[index]}
											type="text"
											inputMode="numeric"
											maxLength={1}
											value={digit}
											onChange={(e) => handleInputChange(index, e.target.value)}
											onKeyDown={(e) => handleKeyDown(index, e)}
											onPaste={index === 0 ? handlePaste : undefined}
											className="w-14 h-14 text-center text-2xl font-mono font-bold rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all duration-200 shadow-sm"
											disabled={isLoading}
										/>
									</motion.div>
								))}
							</div>
							<p className="text-xs text-slate-500 dark:text-slate-400 text-center">
								Code expires in 10 minutes
							</p>
						</div>
						<Button
							type="submit"
							className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
							disabled={isLoading || code.join("").length !== 6}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Verify Email
						</Button>
					</form>
				</motion.div>

				{/* Resend Section */}
				<motion.div
					className="text-center space-y-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.6 }}
				>
					<Button
						variant="link"
						onClick={handleResendOtp}
						disabled={!canResend || isLoading}
						className="text-sm text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
					>
						{canResend ? "Didn't receive the code? Resend" : `Resend code in ${timer}s`}
					</Button>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<Separator className="w-full" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/10 px-4 text-slate-500 dark:text-slate-400">
								Or continue with
							</span>
						</div>
					</div>

					<div className="flex justify-center gap-4">
						<Button
							variant="outline"
							onClick={() => {
								const redirectUrl = callbackUrl
									? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`
									: '/signup'
								router.push(redirectUrl)
							}}
							className="text-sm text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors duration-200"
						>
							Back to Sign Up
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								const redirectUrl = callbackUrl
									? `/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
									: '/signin'
								router.push(redirectUrl)
							}}
							className="text-sm text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors duration-200"
						>
							Sign In Instead
						</Button>
					</div>
				</motion.div>
			</motion.div>
		</div>
	)
}

export default function VerifyEmailPage() {
	return (
		<Suspense fallback={
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/10">
				<motion.div
					className="text-center"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
				>
					<div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full animate-pulse mx-auto mb-4"></div>
					<p className="text-slate-600 dark:text-slate-300">Loading...</p>
				</motion.div>
			</div>
		}>
			<VerifyEmail />
		</Suspense>
	)
}