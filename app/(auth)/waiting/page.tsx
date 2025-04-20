'use client';

import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaEnvelope, FaSync, FaCheck } from 'react-icons/fa';

export default function VerifyEmail() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [canResend, setCanResend] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const router = useRouter();
    const [verifiying, setVerifying] = useState(false);

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
            alert('An error occurred while resending the email.');
        }
    };

    const handleVerified = async () => {
        setVerifying(true);

        try {
            const response = await axios.get("/api/confirmverification");
            if (!response) {
                toast({
                    title: "Error while verifiying account",
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
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <div className="text-center">
                    <FaEnvelope className="mx-auto text-6xl text-blue-500 mb-4 animate-bounce" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Account Verification</h2>
                    <p className="text-gray-600 mb-6">We&apos;ve sent a verification email to your inbox!</p>
                    <p className="text-sm text-gray-500 mb-8">
                        Please check your email and click the verification link to activate your account.
                    </p>
                </div>
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
                        <FaSync className="mr-2" />
                        {
                            canResend ? 'Resend Email' : `Resend in ${countdown}s`
                        }
                    </button>
                    <button
                        onClick={handleVerified}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition"
                    >
                        {
                            verifiying ?
                                <>
                                    <Loader className="h-5 w-5 animate-spin mr-2" />
                                    Verifying...
                                </>
                                :
                                <>
                                    <FaCheck className="mr-2" />
                                    I&apos;ve Verified My Account
                                </>
                        }
                    </button>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Didn&apos;t receive the email?{' '}
                        <Link href="#" className="text-blue-500 hover:underline">
                            Check our FAQ
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}