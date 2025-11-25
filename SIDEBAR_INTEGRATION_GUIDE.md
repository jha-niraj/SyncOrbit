# Sidebar Integration Guide

## Quick Start

Follow these steps to integrate the new sidebar into your application:

### Step 1: Update Your Main Layout

Find your main layout file (likely `app/(main)/layout.tsx`) and update it:

```tsx
import { SidebarProvider } from "@/components/navigation/sidebarcontext";
import NewSidebar from "@/components/navigation/newsidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <NewSidebar />
        <main className="flex-1 overflow-auto ml-0 lg:ml-64">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
```

**Note**: Adjust the `ml-64` (margin-left) value based on your sidebar width. Use `ml-[90px]` when collapsed.

### Step 2: Update Your Root Layout (Optional)

If you want the sidebar context available globally, wrap your root layout:

```tsx
// app/layout.tsx
import { SidebarProvider } from "@/components/navigation/sidebarcontext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
```

### Step 3: Create Route Pages

Create the necessary route pages for the navigation items:

#### Internal Mode Routes
- `/dashboard` - Internal dashboard
- `/team` - Team management
- `/analytics` - Internal analytics
- `/calendar` - Calendar view
- `/communications` - Team communications

#### External Mode Routes
- `/client-dashboard` - Client-facing dashboard
- `/companies` - Companies list (CLIENT only)
- `/client-analytics` - Client analytics
- `/invoices` - Invoices management
- `/reports` - Reports view

#### Common Routes
- `/projects` - Projects list
- `/invitations` - Invitations management
- `/settings` - Settings page
- `/profile` - User profile

### Step 4: Add Route Guards (Recommended)

Create middleware to protect routes based on user role and mode:

```tsx
// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Protect internal routes
    const internalRoutes = ['/dashboard', '/team', '/analytics', '/calendar', '/communications'];
    const isInternalRoute = internalRoutes.some(route => path.startsWith(route));
    
    if (isInternalRoute && token?.role === 'CLIENT') {
      return NextResponse.redirect(new URL('/client-dashboard', req.url));
    }
    
    // Protect external routes
    const externalRoutes = ['/client-dashboard', '/companies', '/client-analytics', '/invoices', '/reports'];
    const isExternalRoute = externalRoutes.some(route => path.startsWith(route));
    
    if (isExternalRoute && token?.role === 'TEAM_MEMBER') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // Protect analytics from TEAM_MEMBER
    if (path.startsWith('/analytics') && token?.role === 'TEAM_MEMBER') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // Protect invitations from non-authorized roles
    if (path.startsWith('/invitations') && 
        !['COMPANY_OWNER', 'TEAM_HEAD'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/team/:path*',
    '/analytics/:path*',
    '/calendar/:path*',
    '/communications/:path*',
    '/client-dashboard/:path*',
    '/companies/:path*',
    '/client-analytics/:path*',
    '/invoices/:path*',
    '/reports/:path*',
    '/projects/:path*',
    '/invitations/:path*',
  ],
};
```

### Step 5: Test with Different Roles

Test the sidebar with different user roles:

1. **COMPANY_OWNER**
   - Should see mode switcher
   - Should see all internal items in internal mode
   - Should see all external items in external mode
   - Should see invitations

2. **TEAM_HEAD**
   - Should see mode switcher
   - Should see all internal items in internal mode
   - Should see external items (except Companies) in external mode
   - Should see invitations

3. **TEAM_MEMBER**
   - Should NOT see mode switcher
   - Should see internal items (except Analytics)
   - Should NOT see external items

4. **CLIENT**
   - Should NOT see mode switcher
   - Should see external items only
   - Should see Companies
   - Should NOT see internal items

5. **ADMIN**
   - Should NOT see mode switcher
   - Should see all internal items
   - Should NOT see external items

### Step 6: Customize Navigation Items (Optional)

To add or modify navigation items, edit `components/navigation/navigationconfig.tsx`:

```tsx
// Add a new internal item
internal: [
  // ... existing items
  {
    to: "/my-new-page",
    label: "My New Page",
    icon: <MyIcon className="h-5 w-5" />,
    status: "active",
    roles: ['COMPANY_OWNER', 'TEAM_HEAD'],
    modes: ['internal']
  }
]
```

### Step 7: Use Sidebar State in Components

Access sidebar state in any component:

```tsx
import { useSidebar } from "@/components/navigation/sidebarcontext";

function MyComponent() {
  const { mode, setMode, isCollapsed, setIsCollapsed } = useSidebar();
  
  return (
    <div>
      <p>Current mode: {mode}</p>
      <button onClick={() => setMode(mode === 'internal' ? 'external' : 'internal')}>
        Toggle Mode
      </button>
    </div>
  );
}
```

## Styling Adjustments

### Adjust Main Content Margin

When the sidebar is visible, add margin to your main content:

```tsx
// For fixed sidebar
<main className="ml-0 lg:ml-64">
  {children}
</main>

// For collapsible sidebar
<main className={cn(
  "transition-all duration-300",
  isCollapsed ? "lg:ml-[90px]" : "lg:ml-64"
)}>
  {children}
</main>
```

### Customize Sidebar Width

To change the sidebar width, update these values in `newsidebar.tsx`:

```tsx
// Current widths
isCollapsed ? "lg:w-[90px]" : "lg:w-64"

// Custom widths (example)
isCollapsed ? "lg:w-20" : "lg:w-72"
```

## Common Issues and Solutions

### Issue: Mode switcher not showing
**Solution**: Verify the user's role is COMPANY_OWNER or TEAM_HEAD in the session.

### Issue: Navigation items not filtering
**Solution**: Check the `roles` and `modes` arrays in `navigationconfig.tsx`.

### Issue: State not persisting
**Solution**: Ensure localStorage is enabled in the browser.

### Issue: Mobile sidebar not closing
**Solution**: Verify the backdrop click handler and pathname change effect.

### Issue: Icons not displaying
**Solution**: Ensure lucide-react is installed: `npm install lucide-react`

## Advanced Customization

### Add Notification Badge

```tsx
{
  to: "/invitations",
  label: "Invitations",
  icon: <UserPlus className="h-5 w-5" />,
  status: "active",
  roles: ['COMPANY_OWNER', 'TEAM_HEAD'],
  modes: [],
  badge: 5  // Add badge count
}
```

### Add Coming Soon Status

```tsx
{
  to: "/future-feature",
  label: "Future Feature",
  icon: <Star className="h-5 w-5" />,
  status: "coming_soon",  // Shows toast on click
  roles: [],
  modes: []
}
```

### Conditional Navigation Items

```tsx
// In navigationconfig.tsx
export function getNavigationItems(
    userRole: UserRole | undefined,
    currentMode: SidebarMode,
    customCondition?: boolean  // Add custom parameter
): NavItem[] {
    // ... existing logic
    
    // Add conditional filtering
    return items.filter(item => {
        // ... existing filters
        
        // Custom condition
        if (customCondition && item.label === 'Special Feature') {
            return false;
        }
        
        return hasRoleAccess && hasModeAccess && isActive;
    });
}
```

## Performance Tips

1. **Memoize Navigation Items**: The `getNavigationItems` function is already optimized, but you can memoize the result if needed.

2. **Lazy Load Icons**: If you have many icons, consider lazy loading them.

3. **Optimize Re-renders**: The sidebar uses React Context, which may cause re-renders. Use `React.memo` on child components if needed.

## Accessibility Checklist

- [x] Keyboard navigation works
- [x] ARIA labels on interactive elements
- [x] Focus indicators visible
- [x] Color contrast meets WCAG AA
- [ ] Test with screen readers (recommended)
- [ ] Add skip navigation link (recommended)

## Migration from Old Sidebar

If you're migrating from the old `mainsidebar.tsx`:

1. **Backup**: Keep the old sidebar file as backup
2. **Update Imports**: Replace all imports of the old sidebar
3. **Test Routes**: Verify all navigation links work
4. **Check Styling**: Adjust any custom styling
5. **Test Roles**: Test with all user roles
6. **Remove Old File**: Once verified, remove the old sidebar

## Support

For issues or questions:
1. Check the SIDEBAR_IMPLEMENTATION_SUMMARY.md
2. Review the spec documents in `.kiro/specs/sidebar-redesign/`
3. Check browser console for errors
4. Verify session and user role data

## Next Steps

After integration:
1. Write tests (see tasks.md for property-based tests)
2. Add route guards
3. Implement access denied pages
4. Add analytics tracking for mode switches
5. Gather user feedback
6. Iterate and improve

---

**Note**: This sidebar redesign is production-ready but should be thoroughly tested with your specific use cases and user roles before deploying to production.
