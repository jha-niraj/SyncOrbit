"use client"

import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
// import Link from "next/link";
import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

const Dashboard = () => {
    const { data: session } = useSession();
    const [greetingMsg, setGreetingMsg] = useState<string>("");
    // const router = useRouter();

    // useEffect(() => {
    //     if (!session) {
    //         router.push("/signin");
    //     }
    // }, [session, router]);

    const greetingsMessage = () => {
        const date = new Date();
        const time = date.getHours();
        console.log(time);

        if (time >= 0 && time < 12) {
            return "Good Morning, ";
        } else if (time > 12 && time < 16) {
            return "Good Afternoon, ";
        } else if (time > 16 && time < 24) {
            return "Good evening, ";
        }
        return "";
    }

    useEffect(() => {
        const msg = greetingsMessage();
        setGreetingMsg(msg);
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                        <h1 className="font-semibold sm:font-bold text-xl sm:text-2xl">{greetingMsg} {session?.user?.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {
                                session?.user?.role === "CLIENT"
                                    ? "Manage your participated events and tickets"
                                    : "Manage your hosted events and revenues"
                            }
                        </p>
                    </div>
                </div>
                <Separator className="my-3" />
            </div>
        </div>
    );
};

export default Dashboard;