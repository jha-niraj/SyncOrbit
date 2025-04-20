"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPassword() {
    const [ email, setEmail ] = useState<string>("");
    const [ sending, setIsSending ] = useState<boolean>(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSending(true);

        try {
            const response = await axios.post('/api/forgotpassword', { email, emailType: "RESET_PASSWORD" });
            if(response.status == 200) {
                toast('Password reset link sent to your email!');
            } else {
                toast('Error sending password reset link.');
            }
        } catch (err: any) {
            console.error("Error sending password reset email:", err);
            toast('Error sending password reset link.');
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input shadow-2xl bg-gradient-to-br from-black dark:from-zinc-100 dark:to-zinc-100 to-neutral-600">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h1 className="text-2xl font-bold text-white dark:text-black text-center">Reset Password</h1>
                    <div>
                        <Label className="block text-white dark:text-black" htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <Button
                            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            type="submit"
                        >
                            {
                                sending ? "Sending..." : "Send Password Reset Email "
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}