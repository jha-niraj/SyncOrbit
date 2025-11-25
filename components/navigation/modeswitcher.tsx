"use client";

import React from "react";
import { useSidebar } from "./sidebarcontext";
import { cn } from "@/lib/utils";
import { Building2, Users } from "lucide-react";

interface ModeSwitcherProps {
    className?: string;
}

/**
 * ModeSwitcher component allows users to toggle between internal and external modes
 * Only visible for COMPANY_OWNER and TEAM_HEAD roles
 */
export function ModeSwitcher({ className }: ModeSwitcherProps) {
    const { mode, setMode, canSwitchMode, isCollapsed } = useSidebar();
    
    // Don't render if user can't switch modes
    if (!canSwitchMode) {
        return null;
    }
    
    // Don't render when sidebar is collapsed
    if (isCollapsed) {
        return null;
    }
    
    const handleModeChange = (newMode: 'internal' | 'external') => {
        setMode(newMode);
    };
    
    return (
        <div className={cn("px-3 py-2", className)}>
            <div className="bg-muted rounded-lg p-1 flex gap-1">
                <button
                    onClick={() => handleModeChange('internal')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                        mode === 'internal'
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-pressed={mode === 'internal'}
                    aria-label="Switch to internal mode"
                >
                    <Users className="h-4 w-4" />
                    <span>Internal</span>
                </button>
                
                <button
                    onClick={() => handleModeChange('external')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
                        mode === 'external'
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-pressed={mode === 'external'}
                    aria-label="Switch to external mode"
                >
                    <Building2 className="h-4 w-4" />
                    <span>External</span>
                </button>
            </div>
        </div>
    );
}
