'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import LoadingScreen from '@/components/loading-screen'
import { cn } from '@/lib/utils'
import { hasAccessToPath } from '@/lib/navigation'
import { Role } from '@prisma/client'
import { SidebarProvider, useSidebar } from '@/components/navigation/sidebarprovider'
import { Sidebar } from '@/components/sidebar'
import { AIChat } from '@/components/AIChat'

interface LayoutProps {
	children: React.ReactNode
}

function LayoutContent({ children }: LayoutProps) {
	const { data: session, status } = useSession()
	const router = useRouter()
	const pathname = usePathname()
	const { isCollapsed, isAISidebarOpen } = useSidebar()

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
		<div className="flex h-screen bg-neutral-50 dark:bg-black overflow-hidden relative">
			<Sidebar />
			<div className={cn(
				"flex-1 flex flex-col transition-all duration-500 ease-in-out",
				isCollapsed ? "lg:ml-[90px]" : "lg:ml-64",
				isAISidebarOpen ? "lg:mr-[400px]" : "lg:mr-0"
			)}>
				<main className="flex-1 overflow-auto px-6">
					<div className="h-full">
						{children}
					</div>
				</main>
			</div>
			<AIChat />
		</div>
	)
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<SidebarProvider>
			<LayoutContent>{children}</LayoutContent>
		</SidebarProvider>
	)
}

export default Layout