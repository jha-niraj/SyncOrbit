# Sidebar Quick Reference Guide

## 🚀 Quick Start

```bash
# 1. Files are already created, just import and use
import { SidebarProvider } from "@/components/navigation/sidebarcontext";
import NewSidebar from "@/components/navigation/newsidebar";

# 2. Wrap your app
<SidebarProvider>
  <NewSidebar />
  <main>{children}</main>
</SidebarProvider>

# 3. Done! The sidebar will automatically adapt to user roles
```

## 📁 File Structure

```
components/navigation/
├── sidebarcontext.tsx      # Context & state management
├── navigationconfig.tsx    # Navigation items configuration
├── modeswitcher.tsx        # Internal/External toggle
├── rendersidebarlinks.tsx  # Navigation rendering
└── newsidebar.tsx          # Main sidebar component
```

## 🎯 Key Concepts

### Roles
- `COMPANY_OWNER` - Full access, can switch modes
- `TEAM_HEAD` - Full access, can switch modes
- `TEAM_MEMBER` - Internal only, no Analytics
- `CLIENT` - External only
- `ADMIN` - Internal only, full access

### Modes
- `internal` - Team operations (Dashboard, Team, Analytics, etc.)
- `external` - Client-facing (Client Dashboard, Companies, Invoices, etc.)

### Navigation Sections
- `internal` - Items only in internal mode
- `external` - Items only in external mode
- `common` - Items in both modes

## 🔧 Common Tasks

### Add a New Navigation Item

```tsx
// In navigationconfig.tsx
internal: [
  // ... existing items
  {
    to: "/my-page",
    label: "My Page",
    icon: <MyIcon className="h-5 w-5" />,
    status: "active",
    roles: ['COMPANY_OWNER', 'TEAM_HEAD'],  // Who can see it
    modes: ['internal']                      // Which mode
  }
]
```

### Change Who Can See an Item

```tsx
// Just update the roles array
{
  to: "/analytics",
  label: "Analytics",
  icon: <BarChart3 className="h-5 w-5" />,
  status: "active",
  roles: ['COMPANY_OWNER'],  // Now only COMPANY_OWNER
  modes: ['internal']
}
```

### Add a Badge to an Item

```tsx
{
  to: "/invitations",
  label: "Invitations",
  icon: <UserPlus className="h-5 w-5" />,
  status: "active",
  roles: ['COMPANY_OWNER', 'TEAM_HEAD'],
  modes: [],
  badge: 5  // Shows "5" badge
}
```

### Mark an Item as Coming Soon

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

### Use Sidebar State in a Component

```tsx
import { useSidebar } from "@/components/navigation/sidebarcontext";

function MyComponent() {
  const { mode, setMode, isCollapsed } = useSidebar();
  
  return (
    <div>
      <p>Current mode: {mode}</p>
      {mode === 'internal' && <InternalContent />}
      {mode === 'external' && <ExternalContent />}
    </div>
  );
}
```

## 🎨 Styling

### Adjust Sidebar Width

```tsx
// In newsidebar.tsx
isCollapsed ? "lg:w-[90px]" : "lg:w-64"

// Change to custom width
isCollapsed ? "lg:w-20" : "lg:w-72"
```

### Adjust Main Content Margin

```tsx
// Match sidebar width
<main className="ml-0 lg:ml-64">
  {children}
</main>
```

### Customize Colors

```tsx
// Active state uses primary color from your theme
// Change in tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#335CFF',  // Your brand color
        foreground: '#FFFFFF'
      }
    }
  }
}
```

## 🔒 Route Protection

### Protect Internal Routes

```tsx
// middleware.ts
if (isInternalRoute && token?.role === 'CLIENT') {
  return NextResponse.redirect(new URL('/client-dashboard', req.url));
}
```

### Protect External Routes

```tsx
// middleware.ts
if (isExternalRoute && token?.role === 'TEAM_MEMBER') {
  return NextResponse.redirect(new URL('/dashboard', req.url));
}
```

## 🐛 Troubleshooting

### Mode Switcher Not Showing
```tsx
// Check these conditions:
1. User role is COMPANY_OWNER or TEAM_HEAD
2. Session is loaded (status === "authenticated")
3. Sidebar is not collapsed
4. canSwitchMode is true in context
```

### Navigation Items Not Filtering
```tsx
// Check these:
1. User role in session.user.role
2. roles array in navigationconfig.tsx
3. modes array in navigationconfig.tsx
4. getNavigationItems() is called with correct params
```

### State Not Persisting
```tsx
// Check:
1. localStorage is enabled in browser
2. Keys: 'sidebar-mode' and 'sidebar-collapsed'
3. No errors in browser console
4. SidebarProvider wraps your app
```

## 📊 Navigation Items by Role

### COMPANY_OWNER (Internal Mode)
- ✅ Dashboard
- ✅ Team
- ✅ Projects
- ✅ Analytics
- ✅ Calendar
- ✅ Communications
- ✅ Invitations
- ✅ Settings

### COMPANY_OWNER (External Mode)
- ✅ Dashboard (Client)
- ✅ Projects
- ✅ Analytics (Client)
- ✅ Invoices
- ✅ Reports
- ✅ Invitations
- ✅ Settings

### TEAM_HEAD (Internal Mode)
- ✅ Dashboard
- ✅ Team
- ✅ Projects
- ✅ Analytics
- ✅ Calendar
- ✅ Communications
- ✅ Invitations
- ✅ Settings

### TEAM_HEAD (External Mode)
- ✅ Dashboard (Client)
- ✅ Projects
- ✅ Analytics (Client)
- ✅ Invoices
- ✅ Reports
- ✅ Invitations
- ✅ Settings

### TEAM_MEMBER (Internal Only)
- ✅ Dashboard
- ✅ Team
- ✅ Projects
- ❌ Analytics
- ✅ Calendar
- ✅ Communications
- ❌ Invitations
- ✅ Settings

### CLIENT (External Only)
- ✅ Dashboard (Client)
- ✅ Companies
- ✅ Projects
- ❌ Analytics
- ✅ Invoices
- ✅ Reports
- ❌ Invitations
- ✅ Settings

### ADMIN (Internal Only)
- ✅ Dashboard
- ✅ Team
- ✅ Projects
- ✅ Analytics
- ✅ Calendar
- ✅ Communications
- ❌ Invitations
- ✅ Settings

## 🧪 Testing Checklist

- [ ] Test with COMPANY_OWNER role
- [ ] Test with TEAM_HEAD role
- [ ] Test with TEAM_MEMBER role
- [ ] Test with CLIENT role
- [ ] Test with ADMIN role
- [ ] Test mode switching
- [ ] Test collapse/expand
- [ ] Test mobile responsive
- [ ] Test state persistence
- [ ] Test navigation links
- [ ] Test active states
- [ ] Test badges
- [ ] Test coming soon items
- [ ] Test profile dropdown
- [ ] Test theme toggle
- [ ] Test sign out

## 📝 Code Snippets

### Get Current Mode
```tsx
const { mode } = useSidebar();
console.log(mode); // 'internal' or 'external'
```

### Toggle Mode
```tsx
const { mode, setMode } = useSidebar();
setMode(mode === 'internal' ? 'external' : 'internal');
```

### Check if User Can Switch Modes
```tsx
import { canUserSwitchMode } from "@/components/navigation/sidebarcontext";

const canSwitch = canUserSwitchMode(session?.user?.role);
```

### Get Filtered Navigation Items
```tsx
import { getNavigationItems } from "@/components/navigation/navigationconfig";

const items = getNavigationItems(userRole, currentMode);
```

### Check if Item Should Display
```tsx
import { shouldDisplayNavItem } from "@/components/navigation/navigationconfig";

const shouldShow = shouldDisplayNavItem(item, userRole, currentMode);
```

## 🔗 Related Files

- **Spec Documents**: `.kiro/specs/sidebar-redesign/`
- **Implementation Summary**: `SIDEBAR_IMPLEMENTATION_SUMMARY.md`
- **Integration Guide**: `SIDEBAR_INTEGRATION_GUIDE.md`
- **Features Comparison**: `SIDEBAR_FEATURES_COMPARISON.md`
- **Architecture Diagram**: `SIDEBAR_ARCHITECTURE_DIAGRAM.md`

## 💡 Tips

1. **Always test with different roles** - The sidebar adapts to each role
2. **Use the context** - Don't duplicate state, use `useSidebar()`
3. **Keep navigation config clean** - One source of truth for all items
4. **Add route guards** - Protect routes at the middleware level
5. **Test mobile** - Ensure responsive behavior works
6. **Check localStorage** - State persists across sessions
7. **Use TypeScript** - Types help catch errors early
8. **Follow the pattern** - Add new items following existing structure

## 🎓 Learning Resources

- React Context API: https://react.dev/reference/react/useContext
- Next.js Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
- NextAuth: https://next-auth.js.org/
- Tailwind CSS: https://tailwindcss.com/docs
- Lucide Icons: https://lucide.dev/

## 🆘 Need Help?

1. Check the implementation summary
2. Review the spec documents
3. Look at the architecture diagram
4. Check browser console for errors
5. Verify session data
6. Test with different roles
7. Check localStorage values

---

**Remember**: The sidebar is designed to be flexible and maintainable. Follow the established patterns and it will be easy to extend and modify.
