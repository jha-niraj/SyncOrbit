# SyncOrbit - AI Assistant Context

## Project Overview
**Name**: SyncOrbit  
**Type**: SaaS Project Management Platform  
**Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Prisma, NextAuth  
**Target**: Product Managers, Developers, and Clients  

## Key Project Information
- **Company**: Previously ShunyaTech, now rebranded to SyncOrbit
- **Main Purpose**: Project management and collaboration platform
- **Deployment Target**: Production-ready SaaS application
- **Theme Support**: Light/Dark mode with `bg-white dark:bg-neutral-900`

## Tech Stack Details
```json
{
  "framework": "Next.js 14",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "database": "Prisma",
  "auth": "NextAuth",
  "animations": "Framer Motion",
  "ui": "Radix UI + Custom Components",
  "icons": "Lucide React"
}
```

## Component Library Structure
```
components/
├── ui/               # Reusable UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── beamsbackground.tsx
│   └── wordrotate.tsx
├── navbar.tsx        # Main navigation
├── footer.tsx        # Site footer
└── smoothscroll.tsx  # Smooth scroll wrapper
```

## Key Pages Structure
```
app/
├── page.tsx          # Landing page (main focus)
├── pricing/          # Pricing page with USD/INR toggle
├── checkout/         # Checkout flow
│   ├── page.tsx     # Main checkout
│   └── success/     # Success page
└── (auth)/          # Authentication pages
```

## Design Requirements
- **Responsive**: Mobile-first design
- **Modern**: Glass-morphism, gradients, animations
- **Professional**: Clean, minimalist, enterprise-ready
- **Accessibility**: Proper contrast, keyboard navigation
- **Performance**: Optimized builds, no console errors

## Current Phase 1 Features
### For Product Managers & Developers:
1. Real-time project changes view
2. Chat functionalities  
3. Edit/Delete project and task management
4. Kanban-style todo lists

### For Clients:
1. Real-time project status view
2. Feedback providing section
3. Live chat with developers

## Pricing Structure
```typescript
interface PricingData {
  USD: { professional: 19, enterprise: 'Custom', symbol: '$' }
  INR: { professional: 1599, enterprise: 'Custom', symbol: '₹' }
}
```

## Common Issues to Avoid
1. **TypeScript Errors**: Always use proper types, avoid `any`
2. **ESLint Issues**: Remove unused imports, fix quote escaping
3. **Build Errors**: Test builds frequently, fix lint issues
4. **Theme Support**: Always include dark mode variants
5. **Responsive Design**: Test on mobile/tablet/desktop

## Development Commands
```bash
npm run dev      # Development server
npm run build    # Production build  
npm run lint     # ESLint check
npm run start    # Production server
```

## Brand Guidelines
- **Primary Colors**: Blue gradients, professional tones
- **Typography**: Modern, clean fonts with proper hierarchy
- **Spacing**: Consistent use of Tailwind spacing classes
- **Components**: Reusable, typed, documented

## File Naming Conventions
- Components: PascalCase (e.g., `Button.tsx`)
- Pages: lowercase (e.g., `page.tsx`)
- Utilities: camelCase (e.g., `utils.ts`)
- Types: PascalCase interfaces

## Production Checklist
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Successful build
- [ ] Mobile responsive
- [ ] Dark/light theme working
- [ ] All links functional
- [ ] Performance optimized

## AI Assistant Guidelines
1. **Always check current file state** before making changes
2. **Test builds frequently** and fix errors immediately
3. **Use proper TypeScript types** - never use `any`
4. **Maintain consistency** with existing design patterns
5. **Focus on responsive design** for all screen sizes
6. **Preserve theme support** in all components
7. **Remove unused imports** and clean up code
8. **Use semantic HTML** and proper accessibility