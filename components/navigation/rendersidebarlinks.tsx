"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import {
    Tooltip, TooltipTrigger, TooltipContent
} from "@/components/ui/tooltip";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { NavItem } from "./navigationconfig";
import { UserRole } from "./sidebarcontext";

export type NavItems = NavItem[];

interface NavItemBaseProps {
    item: NavItem;
    isActive: boolean;
}

const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.status === "coming_soon") {
        e.preventDefault();
        toast.info("Coming Soon!", {
            description: `${item.label} feature will be available soon. Stay tuned!`,
            duration: 3000,
        });
    }
};

const NavItemBase: React.FC<NavItemBaseProps> = ({ item, isActive }) => (
    <>
        {
            isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full" />
            )
        }

        <div
            className={cn(
                "w-5 h-5 flex-shrink-0 flex items-center justify-center transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
        >
            {item.icon}
        </div>
    </>
);

interface NavItemCollapsedProps extends NavItemBaseProps { }

const NavItemCollapsed: React.FC<NavItemCollapsedProps> = ({ item, isActive }) => (
    <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
            <Link
                href={item.to}
                onClick={(e) => handleNavClick(e, item)}
                className={cn(
                    "relative flex items-center justify-center gap-3 p-3 rounded-lg text-sm transition-all group",
                    isActive
                        ? "bg-secondary text-foreground font-medium"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
            >
                <NavItemBase item={item} isActive={isActive} />
            </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
            <p>{item.label}</p>
            {
                item.status === "coming_soon" && (
                    <p className="text-xs text-orange-600">Coming Soon</p>
                )
            }
            {
                item.badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                        {item.badge}
                    </span>
                )
            }
        </TooltipContent>
    </Tooltip>
);

interface NavItemExpandedProps extends NavItemBaseProps { }

const NavItemExpanded: React.FC<NavItemExpandedProps> = ({ item, isActive }) => (
    <Link
        href={item.to}
        onClick={(e) => handleNavClick(e, item)}
        className={cn(
            "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group",
            isActive
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
    >
        <NavItemBase item={item} isActive={isActive} />

        <span className="whitespace-nowrap flex-1">{item.label}</span>

        {item.badge && (
            <span className="px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                {item.badge}
            </span>
        )}

        {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
    </Link>
);


interface NavMenuProps {
    items: NavItems;
    isCollapsed: boolean;
}

/**
 * NavMenu component renders navigation items
 * Items are already filtered by role and mode before being passed to this component
 */
export const NavMenu: React.FC<NavMenuProps> = ({ items, isCollapsed }) => {
    const pathname = usePathname();

    return (
        <>
            {
                items.map((item) => {
                    // Check if current route matches the item's route
                    // Match exact route or routes that start with the item's route followed by '/'
                    const isActive = pathname === item.to || pathname.startsWith(item.to + '/');

                    return isCollapsed ? (
                        <NavItemCollapsed key={item.to} item={item} isActive={isActive} />
                    ) : (
                        <NavItemExpanded key={item.to} item={item} isActive={isActive} />
                    );
                })
            }
        </>
    );
};