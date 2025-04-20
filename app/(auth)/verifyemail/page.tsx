"use client"

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Loader, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

const VerifyPage = () => {
    const searchParams = useSearchParams();
    const token = searchParams?.get("token");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'missing'>('idle');
    const [message, setMessage] = useState('Click the button below to verify your email address.');
    const router = useRouter();

    const verifyToken = async () => {
        if (!token) {
            setStatus('missing');
            setMessage('Verification token is missing.');
            return;
        }
        setStatus('loading');
        setMessage('Verifying your email address...');
        try {
            const response = await axios.post(`/api/verifyuser`, { token });
            if (!response) {
                setStatus('error');
                return;
            }

            if (response.status === 200) {
                setStatus('success');
                setMessage(response.data.message || 'Your email has been successfully verified!');
            }
        } catch (error) {
            setStatus('error');
            if (axios.isAxiosError(error) && error.response) {
                switch (error.response.status) {
                    case 400:
                        setMessage(error.response.data.message || 'Invalid or expired token.');
                        break;
                    case 405:
                        setMessage('Method not allowed. Please try again.');
                        break;
                    case 500:
                        setMessage('Server error. Please try again later or contact support.');
                        break;
                    default:
                        setMessage('Verification failed. Please try again or contact support.');
                }
            } else {
                setMessage('An unexpected error occurred. Please try again or contact support.');
            }
            console.error('Verification error:', error);
        }
    };

    const handleSignIn = () => {
        router.push("/signin");
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 flex items-center justify-center rounded-full">
                            {status === 'loading' && <Loader className="h-12 w-12 text-blue-500 animate-spin" />}
                            {status === 'success' && <CheckCircle className="h-16 w-16 text-green-500" />}
                            {status === 'error' && <XCircle className="h-16 w-16 text-red-500" />}
                            {status === 'missing' && <AlertTriangle className="h-16 w-16 text-amber-500" />}
                            {status === 'idle' && <AlertTriangle className="h-16 w-16 text-blue-500" />}
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
                        {status === 'loading' && 'Email Verification'}
                        {status === 'success' && 'Verification Successful'}
                        {status === 'error' && 'Verification Failed'}
                        {status === 'missing' && 'Verification Error'}
                        {status === 'idle' && 'Email Verification'}
                    </h2>
                    <p className="mt-4 text-center text-gray-600">
                        {message}
                    </p>
                    {
                        status === 'idle' && (
                            <div className="mt-6 flex items-center justify-center">
                                <button
                                    onClick={verifyToken}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Verify Email
                                </button>
                            </div>
                        )
                    }
                    {
                        status === 'success' && (
                            <div className="mt-6 flex items-center justify-center">
                                <button
                                    onClick={handleSignIn}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Sign In Now
                                </button>
                            </div>
                        )
                    }
                    {
                        (status === 'error' || status === 'missing') && (
                            <div className="mt-6 flex items-center justify-center">
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Return to Login
                                </button>
                            </div>
                        )
                    }
                </div>
                <div className="bg-gray-50 px-4 py-6 sm:px-6 border-t border-gray-200">
                    <div className="text-center text-sm text-gray-500">
                        <p>Need help? <a href="mailto:business@eventeye.in" className="font-medium text-blue-600 hover:text-blue-500">Contact Support</a></p>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex items-center justify-center">
                <div className="max-w-md text-center">
                    <Image
                        src="/logo/logo.png"
                        alt="EventEye Logo"
                        className="h-8 mb-2 mx-auto"
                        height={30}
                        width={30}
                    />
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} EventEye. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyPage;