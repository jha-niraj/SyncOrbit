# Sidebar Architecture Diagram

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                        Application Root                          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    SidebarProvider                          │ │
│  │  (React Context - Global State Management)                 │ │
│  │                                                             │ │
│  │  State:                                                     │ │
│  │  • isCollapsed: boolean                                    │ │
│  │  • mode: 'internal' | 'external'                           │ │
│  │  • canSwitchMode: boolean                                  │ │
│  │                                                             │ │
│  │  Persistence:                                              │ │
│  │  • localStorage('sidebar-collapsed')                       │ │
│  │  • localStorage('sidebar-mode')                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      NewSidebar                             │ │
│  │  (Main Sidebar Component)                                  │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Header Section                                       │ │ │
│  │  │  • Logo                                               │ │ │
│  │  │  • App Name                                           │ │ │
│  │  │  • Current Mode Indicator                             │ │ │
│  │  │  • Collapse/Expand Button                             │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                              │                              │ │
│  │                              ▼                              │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  ModeSwitcher (Conditional)                          │ │ │
│  │  │  • Only if canSwitchMode === true                    │ │ │
│  │  │  • Only if !isCollapsed                              │ │ │
│  │  │  • Toggle: Internal ⟷ External                       │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                              │                              │ │
│  │                              ▼                              │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Navigation Section                                   │ │ │
│  │  │                                                        │ │ │
│  │  │  ┌────────────────────────────────────────────────┐  │ │ │
│  │  │  │  getNavigationItems()                          │  │ │ │
│  │  │  │  • Filters by userRole                         │  │ │ │
│  │  │  │  • Filters by currentMode                      │  │ │ │
│  │  │  │  • Returns filtered NavItem[]                  │  │ │ │
│  │  │  └────────────────────────────────────────────────┘  │ │ │
│  │  │                      │                                 │ │ │
│  │  │                      ▼                                 │ │ │
│  │  │  ┌────────────────────────────────────────────────┐  │ │ │
│  │  │  │  NavMenu Component                             │  │ │ │
│  │  │  │  • Receives filtered items                     │  │ │ │
│  │  │  │  • Maps items to NavItem components            │  │ │ │
│  │  │  │  • Handles active state                        │  │ │ │
│  │  │  └────────────────────────────────────────────────┘  │ │ │
│  │  │                      │                                 │ │ │
│  │  │         ┌────────────┴────────────┐                   │ │ │
│  │  │         ▼                         ▼                   │ │ │
│  │  │  ┌──────────────┐        ┌──────────────┐            │ │ │
│  │  │  │ NavItemExp   │        │ NavItemColl  │            │ │ │
│  │  │  │ (Expanded)   │        │ (Collapsed)  │            │ │ │
│  │  │  │              │        │              │            │ │ │
│  │  │  │ • Icon       │        │ • Icon only  │            │ │ │
│  │  │  │ • Label      │        │ • Tooltip    │            │ │ │
│  │  │  │ • Badge      │        │              │            │ │ │
│  │  │  │ • Active     │        │ • Active     │            │ │ │
│  │  │  └──────────────┘        └──────────────┘            │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                              │                              │ │
│  │                              ▼                              │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Footer Section                                       │ │ │
│  │  │  • Theme Toggle                                       │ │ │
│  │  │  • User Profile                                       │ │ │
│  │  │  • Sign Out                                           │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Session                             │
│                    (NextAuth Session)                            │
│                                                                   │
│  {                                                                │
│    user: {                                                        │
│      id: "...",                                                   │
│      name: "...",                                                 │
│      email: "...",                                                │
│      role: "COMPANY_OWNER" | "TEAM_HEAD" | ...                   │
│    }                                                              │
│  }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    canUserSwitchMode()                           │
│                                                                   │
│  Input: UserRole                                                 │
│  Output: boolean                                                 │
│                                                                   │
│  Logic:                                                          │
│  • COMPANY_OWNER → true                                          │
│  • TEAM_HEAD → true                                              │
│  • Others → false                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SidebarContext.setCanSwitchMode()             │
│                                                                   │
│  Updates context state                                           │
│  Triggers re-render of consuming components                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ModeSwitcher Visibility                       │
│                                                                   │
│  if (canSwitchMode && !isCollapsed) {                            │
│    render ModeSwitcher                                           │
│  } else {                                                        │
│    return null                                                   │
│  }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    User Clicks Mode Toggle                       │
│                                                                   │
│  setMode('internal' | 'external')                                │
│  • Updates context state                                         │
│  • Saves to localStorage                                         │
│  • Triggers re-render                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    getNavigationItems()                          │
│                                                                   │
│  Input:                                                          │
│  • userRole: UserRole                                            │
│  • currentMode: SidebarMode                                      │
│                                                                   │
│  Process:                                                        │
│  1. Select items based on mode:                                 │
│     • internal → internal + common                               │
│     • external → external + common                               │
│                                                                   │
│  2. Filter by role:                                              │
│     • Check item.roles array                                     │
│     • Empty array = all roles                                    │
│     • Otherwise, must include userRole                           │
│                                                                   │
│  3. Filter by mode:                                              │
│     • Check item.modes array                                     │
│     • Empty array = both modes                                   │
│     • Otherwise, must include currentMode                        │
│                                                                   │
│  4. Filter by status:                                            │
│     • Only include 'active' items                                │
│                                                                   │
│  Output: NavItem[]                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NavMenu Renders Items                         │
│                                                                   │
│  For each item:                                                  │
│  • Check if route is active                                      │
│  • Render NavItemExpanded or NavItemCollapsed                    │
│  • Apply active styling if needed                                │
└─────────────────────────────────────────────────────────────────┘
```

## Navigation Configuration Structure

```
navigationConfig
│
├── internal: NavItem[]
│   ├── Dashboard (/dashboard)
│   │   ├── roles: [COMPANY_OWNER, TEAM_HEAD, TEAM_MEMBER, ADMIN]
│   │   └── modes: [internal]
│   │
│   ├── Team (/team)
│   │   ├── roles: [COMPANY_OWNER, TEAM_HEAD, TEAM_MEMBER, ADMIN]
│   │   └── modes: [internal]
│   │
│   ├── Analytics (/analytics)
│   │   ├── roles: [COMPANY_OWNER, TEAM_HEAD, ADMIN]  ← TEAM_MEMBER excluded
│   │   └── modes: [internal]
│   │
│   ├── Calendar (/calendar)
│   │   ├── roles: [COMPANY_OWNER, TEAM_HEAD, TEAM_MEMBER, ADMIN]
│   │   └── modes: [internal]
│   │
│   └── Communications (/communications)
│       ├── roles: [COMPANY_OWNER, TEAM_HEAD, TEAM_MEMBER, ADMIN]
│       └── modes: [internal]
│
├── external: NavItem[]
│   ├── Dashboard (/client-dashboard)
│   │   ├── roles: [COMPANY_OWNER, TEAM_HEAD, CLIENT]
│   │   └── modes: [external]
│   │
│   ├── Companies (/companies)
│   │   ├── roles: [CLIENT]  ← Only CLIENT
│   │   └── modes: [external]
│   │
│   ├── Analytics (/client-analytics)
│   │   ├── roles: [COMPANY_OWNER, TEAM_HEAD]
│   │   └── modes: [external]
│   │
│   ├── Invoices (/invoices)
│   │   ├── roles: [COMPANY_OWNER, TEAM_HEAD, CLIENT]
│   │   └── modes: [external]
│   │
│   └── Reports (/reports)
│       ├── roles: [COMPANY_OWNER, TEAM_HEAD, CLIENT]
│       └── modes: [external]
│
└── common: NavItem[]
    ├── Projects (/projects)
    │   ├── roles: []  ← All roles
    │   └── modes: []  ← Both modes
    │
    ├── Invitations (/invitations)
    │   ├── roles: [COMPANY_OWNER, TEAM_HEAD]  ← Only owners and heads
    │   └── modes: []  ← Both modes
    │
    └── Settings (/settings)
        ├── roles: []  ← All roles
        └── modes: []  ← Both modes
```

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Initial Page Load                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SidebarProvider Mounts                        │
│                                                                   │
│  1. Initialize state:                                            │
│     • isCollapsed = false                                        │
│     • mode = 'internal'                                          │
│     • canSwitchMode = false                                      │
│                                                                   │
│  2. Load from localStorage:                                      │
│     • Read 'sidebar-collapsed'                                   │
│     • Read 'sidebar-mode'                                        │
│     • Validate and restore state                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Session Loads                                 │
│                                                                   │
│  useEffect(() => {                                               │
│    if (session?.user?.role) {                                    │
│      setCanSwitchMode(canUserSwitchMode(role))                   │
│    }                                                             │
│  }, [session])                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Sidebar Renders                               │
│                                                                   │
│  1. Get navigation items:                                        │
│     const items = getNavigationItems(userRole, mode)             │
│                                                                   │
│  2. Render components:                                           │
│     • Header                                                     │
│     • ModeSwitcher (if canSwitchMode)                            │
│     • NavMenu (with filtered items)                              │
│     • Footer                                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    User Interactions                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Click Mode Toggle                                        │  │
│  │  → setMode(newMode)                                       │  │
│  │  → Save to localStorage                                   │  │
│  │  → Re-render with new items                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Click Collapse Button                                    │  │
│  │  → setIsCollapsed(!isCollapsed)                           │  │
│  │  → Save to localStorage                                   │  │
│  │  → Re-render with collapsed layout                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Click Navigation Item                                    │  │
│  │  → Navigate to route                                      │  │
│  │  → Update active state                                    │  │
│  │  → Close mobile sidebar (if mobile)                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Role-Based Filtering Example

```
Example: TEAM_MEMBER in Internal Mode

User Session:
{
  role: "TEAM_MEMBER"
}

Context State:
{
  mode: "internal",
  canSwitchMode: false  ← Determined by canUserSwitchMode()
}

getNavigationItems("TEAM_MEMBER", "internal"):

Step 1: Select items
  items = [...internal, ...common]
  
Step 2: Filter by role
  Dashboard → roles: [COMPANY_OWNER, TEAM_HEAD, TEAM_MEMBER, ADMIN]
    ✅ TEAM_MEMBER included → PASS
    
  Team → roles: [COMPANY_OWNER, TEAM_HEAD, TEAM_MEMBER, ADMIN]
    ✅ TEAM_MEMBER included → PASS
    
  Analytics → roles: [COMPANY_OWNER, TEAM_HEAD, ADMIN]
    ❌ TEAM_MEMBER NOT included → FAIL
    
  Calendar → roles: [COMPANY_OWNER, TEAM_HEAD, TEAM_MEMBER, ADMIN]
    ✅ TEAM_MEMBER included → PASS
    
  Communications → roles: [COMPANY_OWNER, TEAM_HEAD, TEAM_MEMBER, ADMIN]
    ✅ TEAM_MEMBER included → PASS
    
  Projects → roles: []
    ✅ Empty array = all roles → PASS
    
  Invitations → roles: [COMPANY_OWNER, TEAM_HEAD]
    ❌ TEAM_MEMBER NOT included → FAIL
    
  Settings → roles: []
    ✅ Empty array = all roles → PASS

Step 3: Filter by mode
  All items have modes: [internal] or []
  Current mode: internal
  ✅ All remaining items PASS

Step 4: Filter by status
  All items have status: "active"
  ✅ All remaining items PASS

Final Result:
[
  Dashboard,
  Team,
  Calendar,
  Communications,
  Projects,
  Settings
]

ModeSwitcher:
  canSwitchMode = false
  → ModeSwitcher NOT rendered
```

## Mobile vs Desktop Layout

```
Desktop (≥1024px):
┌────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────────────────────────────────┐  │
│  │          │  │                                       │  │
│  │          │  │                                       │  │
│  │ Sidebar  │  │         Main Content                  │  │
│  │ (Fixed)  │  │         (Scrollable)                  │  │
│  │          │  │                                       │  │
│  │          │  │                                       │  │
│  └──────────┘  └──────────────────────────────────────┘  │
│   w-64 or       ml-64 or ml-[90px]                       │
│   w-[90px]                                                │
└────────────────────────────────────────────────────────────┘

Mobile (<1024px):
┌────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │                                                       │ │
│  │         Main Content (Full Width)                    │ │
│  │                                                       │ │
│  │                                                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [☰] Menu Button (Fixed top-left)                         │
└────────────────────────────────────────────────────────────┘

Mobile (Sidebar Open):
┌────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────────────────────────────────┐  │
│  │          │  │                                       │  │
│  │          │  │                                       │  │
│  │ Sidebar  │  │    Backdrop (Semi-transparent)        │  │
│  │ (Overlay)│  │    (Click to close)                   │  │
│  │          │  │                                       │  │
│  │          │  │                                       │  │
│  └──────────┘  └──────────────────────────────────────┘  │
│   w-64          bg-black/50                               │
│   z-40          z-30                                      │
└────────────────────────────────────────────────────────────┘
```

This architecture provides a clean separation of concerns, making the sidebar easy to understand, maintain, and extend.
