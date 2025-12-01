'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import LoadingScreen from '@/components/loading-screen'
import { cn } from '@/lib/utils'
import { hasAccessToPath } from '@/lib/navigation'
import { Role } from '@prisma/client'
import { SidebarProvider } from '@/components/navigation/sidebarprovider'
import { Sidebar } from '@/components/sidebar'

interface LayoutProps {
	children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
	const { data: session, status } = useSession()
	const router = useRouter()
	const pathname = usePathname()

	// Handle loading state
	if (status === 'loading') {
		return <LoadingScreen routeName="dashboard" />
	}

	// Redirect if not authenticated
	if (!session?.user) {
		router.push('/signin')
		return null
	}

	// Check if user has access to current path
	const currentPath = pathname.split('/')[1] || 'dashboard'
	const userRole = session.user.role as Role
	const hasAccess = hasAccessToPath(userRole, currentPath)

	if (!hasAccess && currentPath !== 'dashboard') {
		// Redirect to dashboard if user doesn't have access to current path
		router.push('/dashboard')
		return null
	}

	return (
		<SidebarProvider>
			<div className="flex h-screen bg-background">
				<Sidebar />
				<div className={cn(
					"flex-1 flex flex-col transition-all duration-300 lg:ml-[90px]",
				)}>
					<main className="flex-1 overflow-auto">
						<div className="h-full">
							{children}
						</div>
					</main>
				</div>
			</div>
		</SidebarProvider>
	)
}

export default Layout