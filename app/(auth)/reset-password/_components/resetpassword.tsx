'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { useAppContext } from '@/app/context/store';
import axios from 'axios';
import { toast } from 'sonner';

const ResetPassword = (): JSX.Element => {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const router = useRouter();
    const [resettingPassword, setIsResettingPassword] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    // console.log("Token is:", token);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast('Passwords do not match');
            return;
        }

        setIsResettingPassword(true);
        try {
            const response = await axios.post('/api/resetpassword', { token, password });

            if (response.status == 200) {
                toast('Password reset successfully!');
                router.push('/signin');
            } else {
                toast('Error resetting password');
            }
        } catch (err: any) {
            console.error("Error resetting password:", err);
            toast('Error resetting password');
        } finally {
            setIsResettingPassword(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input shadow-2xl bg-gradient-to-br from-black dark:from-zinc-100 dark:to-zinc-100 to-neutral-600">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h1 className="text-2xl font-bold text-white dark:text-black text-center">Reset Password</h1>
                    <div>
                        <Label className="block text-white dark:text-black" htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type="password"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <Label className="block text-white dark:text-black" htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            type="password"
                            placeholder="Confirm new password"
                        />
                    </div>
                    <div>
                        <Button
                            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            type="submit"
                            value="Reset Password"
                        >
                            Reset Password{
                                resettingPassword ? "Resetting Password..." : "Reset Password"
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;