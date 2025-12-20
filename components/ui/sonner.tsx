"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white group-[.toaster]:dark:bg-neutral-950 group-[.toaster]:text-neutral-900 group-[.toaster]:dark:text-white group-[.toaster]:border-neutral-200 group-[.toaster]:dark:border-neutral-800 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl group-[.toaster]:font-sans",
                    description: 
                        "group-[.toast]:text-neutral-500 group-[.toast]:dark:text-neutral-400 group-[.toast]:font-mono group-[.toast]:text-xs group-[.toast]:mt-1",
                    actionButton:
                        "group-[.toast]:bg-neutral-900 group-[.toast]:dark:bg-white group-[.toast]:text-white group-[.toast]:dark:text-black group-[.toast]:font-bold group-[.toast]:font-mono group-[.toast]:uppercase group-[.toast]:text-[10px] group-[.toast]:tracking-widest group-[.toast]:rounded-md",
                    cancelButton:
                        "group-[.toast]:bg-neutral-100 group-[.toast]:dark:bg-neutral-900 group-[.toast]:text-neutral-600 group-[.toast]:dark:text-neutral-400 group-[.toast]:font-mono group-[.toast]:text-[10px] group-[.toast]:uppercase group-[.toast]:tracking-wide group-[.toast]:rounded-md group-[.toast]:border group-[.toast]:border-neutral-200 group-[.toast]:dark:border-neutral-800",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }