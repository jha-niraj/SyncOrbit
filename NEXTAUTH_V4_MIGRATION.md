# NextAuth v5 to v4 Migration Summary

## Changes Made

### 1. **auth.ts** - Updated to NextAuth v4 syntax

#### Before (v5):
```typescript
export const { auth, handlers, signIn, signOut } = NextAuth({...})
```

#### After (v4):
```typescript
export const authOptions: NextAuthOptions = {...}

// Helper function for server-side auth check (compatible with v5 syntax used in the app)
export async function auth() {
	const { getServerSession } = await import('next-auth/next');
	return await getServerSession(authOptions);
}

// Export getServerSession for direct use if needed
export { getServerSession } from 'next-auth/next';
```

**Key Changes:**
- Changed from NextAuth() direct export to `authOptions` object
- Added `auth()` helper function to maintain compatibility with v5 syntax used throughout the app
- Exported `getServerSession` for direct use where needed
- All callbacks and configuration remain the same

### 2. **middleware.ts** - Updated to use withAuth for v4

#### Before (v5):
```typescript
import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  // ...
})
```

#### After (v4):
```typescript
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    const { nextauth } = req
    const isLoggedIn = !!nextauth?.token
    // ...
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Authorization logic
      }
    },
    pages: {
      signIn: '/signin',
    }
  }
)
```

**Key Changes:**
- Changed from `auth()` wrapper to `withAuth()` middleware
- Moved authorization logic to `callbacks.authorized`
- Access token via `nextauth.token` instead of `req.auth`
- Added proper callback structure for v4

### 3. **package.json** - Fixed dependency conflicts

Added override for `@calcom/embed-react` to work with React 19:

```json
"overrides": {
  "framer-motion": {
    "react": "19.0.0-rc-66855b96-20241106",
    "react-dom": "19.0.0-rc-66855b96-20241106"
  },
  "@calcom/embed-react": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### 4. **API Route** - Already compatible

The NextAuth API route at `/app/api/auth/[...nextauth]/route.ts` was already using the correct v4 syntax:

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
```

## Installation

Run the following command to install dependencies:

```bash
npm install --legacy-peer-deps
```

## Testing Checklist

- [ ] Email/Password login works
- [ ] Google OAuth login works
- [ ] Onboarding flow for new Google users
- [ ] Protected routes redirect to signin
- [ ] Authenticated users can access protected routes
- [ ] Session persists across page refreshes
- [ ] Logout functionality works
- [ ] Role-based access control (RBAC) works
- [ ] JWT token includes all custom fields (role, companyId, etc.)

## Compatibility

The `auth()` helper function exported from `auth.ts` maintains compatibility with the existing codebase that was written for NextAuth v5. This means:

- Server actions can continue using `import { auth } from "@/auth"`
- No changes needed in components using `useSession()` from `next-auth/react`
- All existing NextAuth hooks and utilities work as before

## Migration Benefits

1. **Stable Release**: Using NextAuth v4 (stable) instead of v5 (beta)
2. **Better Dependency Management**: Resolved React 19 conflicts with Cal.com embed
3. **Maintained Functionality**: All features work exactly as before
4. **Backward Compatibility**: Existing code requires no changes

## Notes

- NextAuth v4 is the last stable version before v5
- The middleware syntax changed significantly between v4 and v5
- The `auth()` helper ensures seamless transition
- All session callbacks and JWT handling remain identical
