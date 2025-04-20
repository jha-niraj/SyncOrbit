'use client';

import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { Loader, Mail, ArrowRight, CheckCircle, HelpCircle, FolderSync, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VerifyEmail() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [canResend, setCanResend] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const router = useRouter();
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    setCanResend(true);
                    clearInterval(timer);
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const handleResendEmail = async () => {
        try {
            const response = await axios.post('/api/resendemail', { email });

            if (response && response.data) {
                toast({
                    title: 'Verification email resent successfully!'
                });
                setCanResend(false);
                setCountdown(60);
            } else {
                toast({
                    title: 'Failed to resend email',
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error resending email:', error);
            toast({
                title: 'An error occurred while resending the email',
                variant: "destructive"
            });
        }
    };

    const handleVerified = async () => {
        setVerifying(true);

        try {
            const response = await axios.get("/api/confirmverification");
            if (!response) {
                toast({
                    title: "Error while verifying account",
                })
                return;
            }
            toast({
                title: 'Account verified! Redirecting to dashboard...'
            });
            router.push("/dashboard");
        } catch (err: unknown) {
            console.error('Verification error:', err);
            toast({
                title: 'Error while verifying account',
                variant: 'destructive'
            });
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            <div className="flex-1 flex flex-col justify-center items-center px-4 py-10 relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
                    <motion.div 
                        className="absolute top-1/3 right-1/3 w-32 h-32 rounded-full bg-primary/10 blur-xl"
                        animate={{ 
                            y: [0, 20, 0],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    />
                    <motion.div 
                        className="absolute bottom-1/3 left-1/3 w-32 h-32 rounded-full bg-primary/10 blur-xl"
                        animate={{ 
                            y: [0, -20, 0],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 1
                        }}
                    />
                </div>
                
                <motion.div 
                    className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative z-10 border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center">
                        <div className="relative mx-auto w-24 h-24 mb-6">
                            <motion.div 
                                className="absolute inset-0 rounded-full bg-primary/10"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            />
                            <motion.div 
                                className="absolute inset-2 rounded-full bg-primary/20"
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: 0.2
                                }}
                            />
                            <motion.div 
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ y: 0 }}
                                animate={{ y: [0, -8, 0] }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            >
                                <Mail className="h-12 w-12 text-primary" strokeWidth={1.5} />
                            </motion.div>
                        </div>
                        
                        <motion.h2 
                            className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent mb-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            Verify Your Email
                        </motion.h2>
                        
                        <motion.p 
                            className="text-gray-600 dark:text-gray-300 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            We've sent a verification email to your inbox!
                        </motion.p>
                        
                        <motion.p 
                            className="text-sm text-gray-500 dark:text-gray-400 mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            Please check your email and click the verification link to activate your account.
                        </motion.p>
                        
                        <div className="mb-8">
                            <p className="text-center text-gray-700 font-semibold">
                                Sent to: <span className="text-blue-600">{email}</span>
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <button
                                onClick={handleResendEmail}
                                disabled={!canResend}
                                className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition ${canResend
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <FolderSync className="mr-2" />
                                {
                                    canResend ? 'Resend Email' : `Resend in ${countdown}s`
                                }
                            </button>
                            <button
                                onClick={handleVerified}
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition"
                            >
                                {
                                    verifying ?
                                        <>
                                            <Loader className="h-5 w-5 animate-spin mr-2" />
                                            Verifying...
                                        </>
                                        :
                                        <>
                                            <Check className="mr-2" />
                                            I've Verified My Account
                                        </>
                                }
                            </button>
                        </div>
                        
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Didn't receive the email?{' '}
                                <Link href="#" className="text-blue-500 hover:underline">
                                    Check our FAQ
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}