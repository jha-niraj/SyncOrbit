"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

export type SidebarMode = 'internal' | 'external'
export type UserRole = 'COMPANY_OWNER' | 'TEAM_HEAD' | 'TEAM_MEMBER' | 'CLIENT' | 'ADMIN'

export interface SidebarContextType {
    isCollapsed: boolean
    setIsCollapsed: (value: boolean) => void
    mode: SidebarMode
    setMode: (mode: SidebarMode) => void
    canSwitchMode: boolean
    setCanSwitchMode: (canSwitch: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [mode, setModeState] = useState<SidebarMode>('internal')
    const [canSwitchMode, setCanSwitchMode] = useState(false)

    // Load saved collapsed state from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCollapsed = localStorage.getItem('sidebar-collapsed')
            if (savedCollapsed !== null) {
                setIsCollapsed(savedCollapsed === 'true')
            }
        }
    }, [])

    // Load saved mode from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('sidebar-mode') as SidebarMode
            if (savedMode === 'internal' || savedMode === 'external') {
                setModeState(savedMode)
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

    // Save mode to localStorage when it changes
    const handleSetMode = (newMode: SidebarMode) => {
        setModeState(newMode)
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar-mode', newMode)
        }
    }

    return (
        <SidebarContext.Provider value={{ 
            isCollapsed, 
            setIsCollapsed: handleSetIsCollapsed, 
            mode, 
            setMode: handleSetMode,
            canSwitchMode,
            setCanSwitchMode
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

export function canUserSwitchMode(role: UserRole | undefined): boolean {
    if (!role) return false
    return role === 'COMPANY_OWNER' || role === 'TEAM_HEAD'
}
