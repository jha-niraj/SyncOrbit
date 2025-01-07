"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

interface CalBtnProps {
    label?: string;
    classNames?: string;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

export default function CalBtn({ label = "Click", classNames = "", size = undefined }: CalBtnProps) {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({
                namespace: "thecoderzofficial", // Updated namespace
            });
            cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
        })();
    }, []);
    return (
        <Button
            data-cal-namespace="thecoderzofficial" // Updated namespace
            data-cal-link="thecoderzofficial/30min" // Updated cal-link with your username and event slug
            data-cal-config='{"layout":"month_view"}'
            className={cn("rounded-lg px-4 py-5 text-md border-2 border-black bg-white hover:bg-white text-black hover:text-black shadow-[0px_6px_0px_0px_rgba(1,1,1,1)] hover:shadow-none hover:translate-y-2 transition-all duration-200", classNames)}
            size={size}
        >
            {label}
        </Button>
    );
}