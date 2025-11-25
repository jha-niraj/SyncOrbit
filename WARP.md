# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

SyncOrbit is a comprehensive SaaS project management platform built with Next.js 15, TypeScript, and modern web technologies. It serves multiple user roles: Clients, Developers, Product Managers, and Administrators, providing tailored dashboards and workflows for each.

## Common Development Commands

```bash
# Development
npm install --force      # Install dependencies (force flag needed for React 19 overrides)
npm run dev              # Start development server on localhost:3000
npm run build            # Build for production (includes Prisma generation)
npm run start            # Start production server
npm run lint             # Run ESLint checks

# Database Operations
npx prisma generate      # Generate Prisma client after schema changes
npx prisma db push       # Push schema changes to database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create and apply new migration

# Cloudflare Pages Deployment
npm run pages:build      # Build for Cloudflare Pages deployment

# Testing
npm run build && npm run start  # Test production build locally
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth and credentials
- **State Management**: Zustand for client state
- **UI Components**: Shadcn/UI with Radix UI primitives
- **Animations**: Framer Motion
- **Deployment**: Cloudflare Pages

### Directory Structure
```
app/
├── (auth)/              # Authentication pages with shared layout
├── (main)/              # Main app pages (dashboard, analytics, etc.)
├── (admin)/             # Admin-only pages
├── (legal)/             # Terms and privacy pages
├── api/                 # API routes organized by feature
│   ├── (user)/          # User management endpoints
│   ├── auth/            # Authentication endpoints
│   ├── admin/           # Admin endpoints
│   └── ...
actions/                 # Server actions organized by role
├── (admin)/             # Admin server actions
├── (client)/            # Client server actions
├── contact.action.ts    # Contact form actions
└── notifications.action.ts
components/              # Reusable UI components
lib/                     # Utility libraries (Prisma, email, etc.)
prisma/                  # Database schema and migrations
store/                   # Zustand stores
```

### Database Schema

The application uses a complex multi-tenant architecture with the following key entities:

- **User**: Central user model with role-based access (CLIENT, DEVELOPER, PRODUCTMANAGER, ADMIN)
- **Company**: Organization management with referral codes
- **Project**: Core project management with multi-currency support (USD, INR, NPR)
- **Task**: Project tasks with subtasks and developer assignment
- **Message**: Real-time messaging system
- **Feedback**: Client feedback system with status tracking
- **ReferralCode**: Advanced referral system for user onboarding
- **Invitation**: Company and project member invitations
- **Notification**: In-app notification system

### Authentication Flow

The app uses NextAuth.js with:
- Google OAuth for social login
- Credentials provider for email/password
- Role-based redirects after authentication
- Email verification system
- Onboarding flow for new users

### Multi-Role Dashboard System

Each role has a dedicated dashboard with specific features:

- **Client Dashboard**: Project progress, payment tracking, feedback submission
- **Developer Dashboard**: Task management, time tracking, project collaboration
- **Product Manager Dashboard**: Company analytics, team management, revenue tracking
- **Admin Dashboard**: System-wide monitoring, user management, security controls

## Key Development Patterns

### Server Actions Pattern
Server actions are organized by user role in the `actions/` directory:
```typescript
// Example: actions/(client)/project.action.ts
"use server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
  const session = await auth()
  // Implementation...
  revalidatePath("/dashboard")
}
```

### State Management with Zustand
Global state is managed using Zustand stores:
```typescript
// store/useProjectStore.ts
export const useProjectStore = create<ProjectStore>((set) => ({
  project: null,
  setProject: (project) => set({ project }),
  // ... other actions
}))
```

### Component Architecture
- Use Shadcn/UI components as base
- Follow TypeScript strict mode
- Implement proper error boundaries
- Support dark/light themes

## Environment Variables

Required environment variables:
```bash
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Email
RESEND_API_KEY=...

# File Upload
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Performance Considerations

- Images are unoptimized for Cloudflare Pages compatibility
- Server actions have 5MB body size limit
- Prisma client is properly configured for serverless deployment
- React 19 compatibility with override for Framer Motion

## Testing Strategy

- Build the project frequently: `npm run build`
- Test all user roles and their respective dashboards
- Verify database operations with Prisma Studio
- Check responsive design across devices
- Validate theme switching (light/dark mode)

## Common Issues & Solutions

1. **React 19 Compatibility**: Package overrides are configured for Framer Motion
2. **Prisma Generation**: Always run `npx prisma generate` after schema changes
3. **ESLint Warnings**: Configure rules are set to "warn" for development flexibility
4. **Cloudflare Deployment**: Use `npm run pages:build` for proper edge deployment
5. **Authentication Redirects**: Check role-based routing in auth callbacks

## Security Considerations

- Role-based access control throughout the application
- Email verification required for new accounts
- Secure password hashing with bcrypt
- Session management with NextAuth
- Input validation on all server actions
- CSRF protection enabled by default