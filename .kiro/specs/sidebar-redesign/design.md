# Design Document: Sidebar Redesign

## Overview

The sidebar redesign introduces a comprehensive role-based navigation system with internal/external mode switching for the SyncOrbit platform. The system provides adaptive navigation that responds to user roles (COMPANY_OWNER, TEAM_HEAD, TEAM_MEMBER, CLIENT, ADMIN) and operational contexts (internal team operations vs. external client-facing work).

The design leverages React Context for state management, TypeScript for type safety, and follows a component-based architecture that separates concerns between navigation logic, UI rendering, and state management.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              SidebarProvider (Context)                │  │
│  │  - Mode State (internal/external)                     │  │
│  │  - Collapsed State                                    │  │
│  │  - canSwitchMode State                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┴────────────────────────────┐  │
│  │                                                        │  │
│  ▼                                                        ▼  │
│  ┌──────────────────────┐         ┌──────────────────┐  │
│  │   Sidebar Component  │         │  Other Components │  │
│  │  - Header            │         │  (consume context)│  │
│  │  - Mode Switcher     │         └──────────────────┘  │
│  │  - Navigation Menu   │                                 │
│  │  - Footer/Profile    │                                 │
│  └──────────────────────┘                                 │
│           │                                                 │
│  ┌────────┴─────────────────────────────────────────────┐ │
│  │                                                        │ │
│  ▼                                                        ▼ │
│  ┌──────────────────────┐         ┌──────────────────┐  │ │
│  │  NavMenu Component   │         │  ModeSwitcher    │  │ │
│  │  - Filters by role   │         │  Component       │  │ │
│  │  - Filters by mode   │         └──────────────────┘  │ │
│  │  - Renders items     │                                 │ │
│  └──────────────────────┘                                 │ │
│           │                                                 │ │
│  ┌────────┴─────────────────────────────────────────────┐ │ │
│  │                                                        │ │ │
│  ▼                                                        ▼ │ │
│  ┌──────────────────────┐         ┌──────────────────┐  │ │ │
│  │  NavItemExpanded     │         │  NavItemCollapsed│  │ │ │
│  └──────────────────────┘         └──────────────────┘  │ │ │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

1. **SidebarProvider** (Context Provider)
   - Manages global sidebar state
   - Provides state to all child components
   - Handles localStorage persistence

2. **Sidebar** (Main Container)
   - Desktop and mobile layouts
   - Header with logo and mode switcher
   - Navigation sections
   - Footer with profile and theme toggle

3. **ModeSwitcher** (Mode Toggle Component)
   - Visible only for COMPANY_OWNER and TEAM_HEAD
   - Toggles between internal/external modes
   - Visual indicator of current mode

4. **NavMenu** (Navigation Renderer)
   - Filters navigation items by role and mode
   - Renders appropriate nav items
   - Handles active state

5. **NavItem** (Individual Navigation Link)
   - Expanded and collapsed variants
   - Active state styling
   - Tooltip support when collapsed

## Components and Interfaces

### 1. SidebarContext

**Purpose**: Centralized state management for sidebar configuration

**Interface**:
```typescript
export type SidebarMode = 'internal' | 'external';

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  mode: SidebarMode;
  setMode: (mode: SidebarMode) => void;
  canSwitchMode: boolean;
  setCanSwitchMode: (canSwitch: boolean) => void;
}
```

**Responsibilities**:
- Store and update sidebar collapsed state
- Store and update current mode (internal/external)
- Determine if user can switch modes based on role
- Persist state to localStorage
- Provide state to consuming components

### 2. Navigation Configuration

**Purpose**: Centralized navigation item definitions

**Interface**:
```typescript
interface NavItem {
  to: string;                    // Route path
  label: string;                 // Display label
  icon: React.ReactNode;         // Icon component
  status?: string;               // 'active' | 'coming_soon'
  roles?: UserRole[];            // Allowed roles
  modes?: SidebarMode[];         // Allowed modes
  badge?: string | number;       // Optional badge
}

type UserRole = 'COMPANY_OWNER' | 'TEAM_HEAD' | 'TEAM_MEMBER' | 'CLIENT' | 'ADMIN';

interface NavigationConfig {
  internal: NavItem[];           // Internal mode items
  external: NavItem[];           // External mode items
  common: NavItem[];             // Items shown in both modes
}
```

**Navigation Item Examples**:

Internal Mode Items:
- Dashboard (/dashboard)
- Team (/team)
- Analytics (/analytics)
- Calendar (/calendar)
- Communications (/communications)

External Mode Items:
- Dashboard (/client-dashboard)
- Companies (/companies) - CLIENT only
- Analytics (/client-analytics)
- Invoices (/invoices)
- Reports (/reports)

Common Items (both modes):
- Projects (/projects)
- Invitations (/invitations)
- Settings (/settings)

### 3. Sidebar Component

**Purpose**: Main sidebar container with responsive behavior

**Props**:
```typescript
interface SidebarProps {
  userRole: UserRole;
  userName?: string;
  userEmail?: string;
  userImage?: string;
}
```

**Key Features**:
- Responsive design (desktop sidebar, mobile bottom nav)
- Collapse/expand functionality
- Mode switcher integration
- Profile dropdown
- Theme toggle
- Notification bell (for DEVELOPER, PRODUCTMANAGER roles)

### 4. ModeSwitcher Component

**Purpose**: Toggle between internal and external modes

**Props**:
```typescript
interface ModeSwitcherProps {
  className?: string;
}
```

**Behavior**:
- Only rendered when `canSwitchMode` is true
- Visual toggle button with labels
- Smooth transition animation
- Updates context mode state

### 5. NavMenu Component

**Purpose**: Render filtered navigation items

**Props**:
```typescript
interface NavMenuProps {
  items: NavItem[];
  isCollapsed: boolean;
  userRole: UserRole;
}
```

**Filtering Logic**:
1. Filter by user role
2. Filter by current mode
3. Check item status
4. Render appropriate variant (collapsed/expanded)

### 6. NavItem Components

**Purpose**: Individual navigation link rendering

**Variants**:
- **NavItemExpanded**: Full width with icon, label, and active indicator
- **NavItemCollapsed**: Icon only with tooltip

**Props**:
```typescript
interface NavItemProps {
  item: NavItem;
  isActive: boolean;
}
```

## Data Models

### SidebarState

```typescript
interface SidebarState {
  isCollapsed: boolean;          // Sidebar collapsed state
  mode: SidebarMode;             // Current mode
  canSwitchMode: boolean;        // Can user switch modes
}
```

**Persistence**: Stored in localStorage
- Key: `sidebar-collapsed` (boolean)
- Key: `sidebar-mode` ('internal' | 'external')

### UserSession

```typescript
interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: UserRole;
  };
}
```

**Source**: NextAuth session
**Usage**: Determine navigation items and mode switching capability

### NavigationItem

```typescript
interface NavigationItem {
  to: string;
  label: string;
  icon: ReactNode;
  status: 'active' | 'coming_soon';
  roles: UserRole[];
  modes: SidebarMode[];
  badge?: string | number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Mode switcher visibility

*For any* user session, the mode switcher component should be visible if and only if the user's role is COMPANY_OWNER or TEAM_HEAD
**Validates: Requirements 1.1, 1.5**

### Property 2: Navigation item role filtering

*For any* navigation item and user role, the item should be rendered if and only if the item's roles array is empty or contains the user's role
**Validates: Requirements 2.1, 2.5**

### Property 3: Navigation item mode filtering

*For any* navigation item and current mode, the item should be rendered if and only if the item's modes array is empty or contains the current mode
**Validates: Requirements 2.2, 2.3**

### Property 4: Mode persistence

*For any* mode change, the new mode value should be persisted to localStorage and retrievable across browser sessions
**Validates: Requirements 1.4**

### Property 5: Collapsed state persistence

*For any* collapsed state change, the new collapsed value should be persisted to localStorage and retrievable across browser sessions
**Validates: Requirements 8.5**

### Property 6: Active route highlighting

*For any* current route and navigation item, the item should be highlighted if and only if the current route matches the item's route or starts with the item's route followed by '/'
**Validates: Requirements 9.1, 9.4**

### Property 7: COMPANY_OWNER internal navigation

*For any* COMPANY_OWNER user in internal mode, the rendered navigation items should include Dashboard, Team, Projects, Analytics, Calendar, Communications, Invitations, and Settings
**Validates: Requirements 3.1**

### Property 8: COMPANY_OWNER external navigation

*For any* COMPANY_OWNER user in external mode, the rendered navigation items should include Dashboard, Companies, Projects, Analytics, Invoices, Reports, Invitations, and Settings
**Validates: Requirements 4.1**

### Property 9: TEAM_MEMBER navigation restrictions

*For any* TEAM_MEMBER user, the mode switcher should not be rendered and Analytics should not appear in navigation items
**Validates: Requirements 6.2, 6.3**

### Property 10: CLIENT navigation restrictions

*For any* CLIENT user, the mode switcher should not be rendered and only external-mode items should be displayed
**Validates: Requirements 7.2, 7.5**

### Property 11: Mobile sidebar auto-close

*For any* mobile sidebar in open state, clicking a navigation item or the backdrop should close the sidebar
**Validates: Requirements 10.4**

### Property 12: Context state propagation

*For any* change to mode or collapsed state in the context, all consuming components should receive the updated state within 100 milliseconds
**Validates: Requirements 11.5**

### Property 13: Icon consistency

*For any* navigation item, the icon should be rendered at 20x20 pixels in both collapsed and expanded states
**Validates: Requirements 12.2, 12.3**

## Error Handling

### 1. Missing User Session

**Scenario**: User session is undefined or null

**Handling**:
- Default to CLIENT role with minimal permissions
- Show only public navigation items
- Log warning to console
- Redirect to login if on protected route

### 2. Invalid Mode Value

**Scenario**: localStorage contains invalid mode value

**Handling**:
- Reset to 'internal' mode
- Clear invalid localStorage value
- Log warning to console

### 3. Navigation Item Configuration Error

**Scenario**: Navigation item missing required fields

**Handling**:
- Skip rendering the invalid item
- Log error with item details
- Continue rendering other valid items

### 4. Context Not Available

**Scenario**: Component tries to use sidebar context outside provider

**Handling**:
- Throw descriptive error: "useSidebar must be used within a SidebarProvider"
- Prevent silent failures
- Guide developer to correct usage

### 5. Route Mismatch

**Scenario**: User navigates to route not in their navigation items

**Handling**:
- Allow navigation (route guards handle access control)
- No active navigation item highlighted
- Log navigation attempt for analytics

### 6. Mobile Viewport Detection

**Scenario**: Window object not available (SSR)

**Handling**:
- Default to desktop layout
- Use CSS media queries as fallback
- Hydrate correct state on client mount

## Testing Strategy

### Unit Testing

**Framework**: Jest + React Testing Library

**Test Coverage**:

1. **SidebarContext Tests**
   - Context provides correct initial values
   - setMode updates mode state
   - setIsCollapsed updates collapsed state
   - localStorage persistence works correctly
   - setCanSwitchMode updates permission state

2. **Navigation Configuration Tests**
   - getNavigationItems returns correct items for each role
   - Items are properly filtered by role
   - Internal/external/common items are correctly categorized

3. **NavMenu Tests**
   - Filters items by role correctly
   - Filters items by mode correctly
   - Renders correct number of items
   - Handles empty items array

4. **NavItem Tests**
   - Renders icon and label correctly
   - Shows tooltip when collapsed
   - Applies active styling when route matches
   - Handles click events

5. **ModeSwitcher Tests**
   - Only renders when canSwitchMode is true
   - Calls setMode with correct value on click
   - Shows current mode visually

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run a minimum of 100 iterations

**Test Implementation**:

Each property-based test must be tagged with a comment referencing the design document property:

Format: `// Feature: sidebar-redesign, Property {number}: {property_text}`

**Property Test 1**: Mode switcher visibility
```typescript
// Feature: sidebar-redesign, Property 1: Mode switcher visibility
// For any user session, the mode switcher component should be visible 
// if and only if the user's role is COMPANY_OWNER or TEAM_HEAD
```
- Generate random user roles
- Render sidebar with each role
- Assert mode switcher visibility matches role requirement

**Property Test 2**: Navigation item role filtering
```typescript
// Feature: sidebar-redesign, Property 2: Navigation item role filtering
// For any navigation item and user role, the item should be rendered 
// if and only if the item's roles array is empty or contains the user's role
```
- Generate random navigation items with various role configurations
- Generate random user roles
- Assert items are filtered correctly

**Property Test 3**: Navigation item mode filtering
```typescript
// Feature: sidebar-redesign, Property 3: Navigation item mode filtering
// For any navigation item and current mode, the item should be rendered 
// if and only if the item's modes array is empty or contains the current mode
```
- Generate random navigation items with various mode configurations
- Generate random modes
- Assert items are filtered correctly

**Property Test 4**: Mode persistence
```typescript
// Feature: sidebar-redesign, Property 4: Mode persistence
// For any mode change, the new mode value should be persisted to localStorage 
// and retrievable across browser sessions
```
- Generate random mode values
- Set mode in context
- Assert localStorage contains correct value
- Clear and reload context
- Assert mode is restored from localStorage

**Property Test 5**: Collapsed state persistence
```typescript
// Feature: sidebar-redesign, Property 5: Collapsed state persistence
// For any collapsed state change, the new collapsed value should be persisted 
// to localStorage and retrievable across browser sessions
```
- Generate random collapsed states
- Set collapsed in context
- Assert localStorage contains correct value
- Clear and reload context
- Assert collapsed state is restored

**Property Test 6**: Active route highlighting
```typescript
// Feature: sidebar-redesign, Property 6: Active route highlighting
// For any current route and navigation item, the item should be highlighted 
// if and only if the current route matches the item's route or starts with 
// the item's route followed by '/'
```
- Generate random routes and navigation items
- Mock usePathname hook
- Assert active state matches route logic

**Property Test 7-10**: Role-specific navigation
```typescript
// Feature: sidebar-redesign, Property 7-10: Role-specific navigation
// For any user with specific role and mode, the correct navigation items 
// should be rendered
```
- Generate user sessions with different roles
- Set different modes
- Assert correct navigation items are rendered for each combination

**Property Test 11**: Mobile sidebar auto-close
```typescript
// Feature: sidebar-redesign, Property 11: Mobile sidebar auto-close
// For any mobile sidebar in open state, clicking a navigation item or 
// the backdrop should close the sidebar
```
- Render mobile sidebar in open state
- Simulate clicks on various elements
- Assert sidebar closes appropriately

**Property Test 12**: Context state propagation
```typescript
// Feature: sidebar-redesign, Property 12: Context state propagation
// For any change to mode or collapsed state in the context, all consuming 
// components should receive the updated state within 100 milliseconds
```
- Generate random state changes
- Measure time for components to receive updates
- Assert updates occur within 100ms

**Property Test 13**: Icon consistency
```typescript
// Feature: sidebar-redesign, Property 13: Icon consistency
// For any navigation item, the icon should be rendered at 20x20 pixels 
// in both collapsed and expanded states
```
- Generate random navigation items
- Render in both collapsed and expanded states
- Assert icon dimensions are 20x20

### Integration Testing

**Scenarios**:

1. **Full User Flow - COMPANY_OWNER**
   - Login as COMPANY_OWNER
   - Verify mode switcher is visible
   - Switch to external mode
   - Verify navigation items update
   - Navigate to different routes
   - Verify active states update
   - Collapse sidebar
   - Verify tooltips appear
   - Refresh page
   - Verify state persists

2. **Full User Flow - TEAM_MEMBER**
   - Login as TEAM_MEMBER
   - Verify mode switcher is not visible
   - Verify Analytics is not in navigation
   - Navigate to different routes
   - Verify active states update

3. **Full User Flow - CLIENT**
   - Login as CLIENT
   - Verify only external items shown
   - Verify mode switcher is not visible
   - Attempt to access internal routes
   - Verify redirect or access denied

4. **Mobile Responsive Flow**
   - Resize viewport to mobile
   - Verify sidebar hides
   - Open mobile menu
   - Click navigation item
   - Verify sidebar closes
   - Verify navigation occurs

### Test Utilities

**Mock Generators**:
- `generateUserSession(role?: UserRole)`: Generate mock user session
- `generateNavItem(overrides?)`: Generate mock navigation item
- `generateNavigationConfig()`: Generate full navigation configuration

**Test Helpers**:
- `renderWithSidebarContext(component, contextValue)`: Render with context
- `mockLocalStorage()`: Mock localStorage for tests
- `mockNextRouter()`: Mock Next.js router

## Implementation Notes

### Technology Stack

- **React 18+**: Component framework
- **TypeScript**: Type safety
- **Next.js 14+**: App router and routing
- **NextAuth**: Authentication and session management
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Sonner**: Toast notifications

### Performance Considerations

1. **Memoization**: Use React.memo for NavItem components to prevent unnecessary re-renders
2. **Lazy Loading**: Icons can be lazy-loaded if bundle size becomes an issue
3. **Context Optimization**: Split context if performance issues arise (separate collapsed state from mode state)
4. **Virtual Scrolling**: Not needed for current navigation item count, but consider if items exceed 50

### Accessibility

1. **Keyboard Navigation**: All interactive elements must be keyboard accessible
2. **ARIA Labels**: Proper labels for screen readers
3. **Focus Management**: Visible focus indicators
4. **Color Contrast**: WCAG AA compliance for all text and icons
5. **Semantic HTML**: Use appropriate HTML elements (nav, button, etc.)

### Browser Compatibility

- **Target**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **localStorage**: Graceful degradation if not available
- **CSS**: Use autoprefixer for vendor prefixes
- **JavaScript**: ES2020+ features (supported by Next.js)

### Migration Strategy

1. **Phase 1**: Implement new context and configuration
2. **Phase 2**: Update Sidebar component with mode switcher
3. **Phase 3**: Update NavMenu with filtering logic
4. **Phase 4**: Test with all user roles
5. **Phase 5**: Deploy behind feature flag
6. **Phase 6**: Gradual rollout to users

### Future Enhancements

1. **Customizable Navigation**: Allow users to pin/unpin items
2. **Search**: Add navigation search functionality
3. **Keyboard Shortcuts**: Add keyboard shortcuts for navigation
4. **Breadcrumbs**: Add breadcrumb navigation for deep routes
5. **Recent Items**: Show recently accessed pages
6. **Favorites**: Allow users to favorite navigation items
