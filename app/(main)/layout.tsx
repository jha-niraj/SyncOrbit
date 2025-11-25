'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import RoleBasedSidebar from '@/components/navigation/rolebasedsidebar'
import LoadingScreen from '@/components/loading-screen'
import { cn } from '@/lib/utils'
import { hasAccessToPath } from '@/lib/navigation'
import { Role } from '@prisma/client'
import Sidebar from '@/components/navigation/sidebar'
import { SidebarProvider } from '@/components/navigation/sidebarcontext'
import NewSidebar from '@/components/navigation/newsidebar'

interface LayoutProps {
	children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
	const { data: session, status } = useSession()
	const router = useRouter()
	const pathname = usePathname()

	const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	// Check screen size and handle responsive behavior
	useEffect(() => {
		const checkScreenSize = () => {
			const mobile = window.innerWidth < 768
			setIsMobile(mobile)

			// Auto-collapse sidebar on smaller screens
			if (mobile) {
				setSidebarCollapsed(true)
				setMobileMenuOpen(false)
			}
		}

		checkScreenSize()
		window.addEventListener('resize', checkScreenSize)

		return () => window.removeEventListener('resize', checkScreenSize)
	}, [])

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
				{/* {
				!isMobile && (
					<RoleBasedSidebar
						collapsed={sidebarCollapsed}
						onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
					/>
				)
			}
			{
				isMobile && mobileMenuOpen && (
					<>
						<div
							className="fixed inset-0 bg-black/50 z-40 md:hidden"
							onClick={() => setMobileMenuOpen(false)}
						/>
						<div className="fixed left-0 top-0 h-full w-64 z-50 md:hidden">
							<RoleBasedSidebar collapsed={false} />
						</div>
					</>
				)
			} */}
				<NewSidebar />
				<div className={cn(
					"flex-1 flex flex-col transition-all duration-300 ml-20",
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