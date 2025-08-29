'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/mainsidebar';
// import MainNavbar from '@/components/mainnavbar';
import LoadingScreen from '@/components/loading-screen';
import { redirect } from 'next/navigation';

interface LayoutProps {
	children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
	const { data: session, status } = useSession();

	if (status === 'loading') {
		return <LoadingScreen routeName="dashboard" />;
	}

	if (!session?.user) {
		redirect('/signin');
	}

	return (
		<div className="flex h-screen">
			<Sidebar />
			<div className="flex flex-col flex-1">
				{/* <MainNavbar isCollapsed={false} /> */}
				<main className="ml-[100px] sm:ml-[100px]">
					<div className="h-full pb-16 md:pb-0">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
};

export default Layout;