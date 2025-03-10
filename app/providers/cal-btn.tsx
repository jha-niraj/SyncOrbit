"use client"

import { cn } from "@/lib/utils";
import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

interface CalBtnProps {
    label?: string;
    classNames?: string;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

export default function CalBtn({ label = "Click", classNames = "" }: CalBtnProps) {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({
                namespace: "shunyatech",
            });
            cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
        })();
    }, []);
    return (
        <div
            data-cal-namespace="shunyatech"
            data-cal-link="shunyatech/30min"
            data-cal-config='{"layout":"month_view"}'
            className={cn("", classNames)}
        >
            {label}
        </div>
    );
}