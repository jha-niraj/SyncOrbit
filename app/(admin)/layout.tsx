'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AdminNavbar from '@/components/adminnavbar';
import LoadingScreen from '@/components/loading-screen';
import { redirect } from 'next/navigation';
import { Toaster } from 'sonner';
import AdminSidebar from '../../components/adminsidebar';

interface LayoutProps {
	children: React.ReactNode
}

const AdminLayout = ({ children }: LayoutProps) => {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
	const { data: session, status } = useSession();

	// Load sidebar state from localStorage on mount
	useEffect(() => {
		const savedState = localStorage.getItem('adminSidebarCollapsed');
		if (savedState !== null) {
			setSidebarCollapsed(JSON.parse(savedState));
		}
	}, []);

	const toggleSidebar = () => {
		const newState = !sidebarCollapsed;
		setSidebarCollapsed(newState);
		// Save to localStorage
		localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newState));
	};

	if (status === 'loading') {
		return <LoadingScreen routeName="admin" />;
	}

	if (!session?.user) {
		redirect('/signin');
	}

	// if (session.user.role !== 'ADMIN') {
	// 	redirect('/dashboard');
	// }

	return (
		<div className="flex h-screen">
			<AdminSidebar
				isCollapsed={sidebarCollapsed}
				toggleSidebar={toggleSidebar}
			/>
			<div className="flex flex-col flex-1">
				<AdminNavbar isCollapsed={sidebarCollapsed} />
				<main className={`transition-all duration-300 ${sidebarCollapsed ? 'sm:ml-[60px] ml-[0px]' : 'sm:ml-[240px] ml-[0px]'} pt-16`}>
					<div className="h-full pb-16 md:pb-0">
						{children}
					</div>
				</main>
			</div>
			<Toaster />
		</div>
	);
};

export default AdminLayout; 