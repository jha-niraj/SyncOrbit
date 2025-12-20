"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

export type UserRole = 'COMPANY_OWNER' | 'TEAM_HEAD' | 'TEAM_MEMBER' | 'CLIENT' | 'ADMIN'

export interface SidebarContextType {
    isCollapsed: boolean
    setIsCollapsed: (value: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Load saved collapsed state from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCollapsed = localStorage.getItem('sidebar-collapsed')
            if (savedCollapsed !== null) {
                setIsCollapsed(savedCollapsed === 'true')
            }
        }
    }, [])

    // Save collapsed state to localStorage when it changes
    const handleSetIsCollapsed = (value: boolean) => {
        setIsCollapsed(value)
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar-collapsed', String(value))
        }
    }

    return (
        <SidebarContext.Provider value={{
            isCollapsed,
            setIsCollapsed: handleSetIsCollapsed
        }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}
