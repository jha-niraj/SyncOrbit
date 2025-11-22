import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ExternalDashboard } from "@/components/dashboard/ExternalDashboard"

export default async function ClientDashboardPage() {
	const session = await auth()
	if (!session?.user) redirect("/signin")

	// Fetch Client Dashboard Data
	// For now, we assume the user sees projects they are part of or their company owns if they are a client
	// But usually clients are added to projects via ProjectMember or they own the project via some relation?
	// Schema says Project has `userId` (creator) and `members`.
	// Also User has `totalSpent`.

	const user = await prisma.user.findUnique({
		where: { email: session.user.email! },
		select: {
			id: true,
			name: true,
			role: true,
			totalSpent: true
		}
	})

	if (!user) redirect("/signin")

	// Fetch active projects for this user
	const activeProjects = await prisma.project.findMany({
		where: {
			OR: [
				{ userId: user.id }, // Created by user
				{ members: { some: { userId: user.id } } } // Member of project
			],
			status: "IN_PROGRESS"
		},
		orderBy: {
			updatedAt: 'desc'
		},
		select: {
			id: true,
			title: true,
			description: true,
			status: true,
			startDate: true
		}
	})

	// Mock pending invoices for now as Invoice model is not fully detailed in snippet provided (only mentioned in text)
	// Or maybe use `paymentStatus` from Project?
	const pendingInvoicesCount = await prisma.project.count({
		where: {
			OR: [
				{ userId: user.id },
				{ members: { some: { userId: user.id } } }
			],
			paymentStatus: "PENDING"
		}
	})

	const activeProjectsCount = activeProjects.length

	const stats = {
		totalSpent: user.totalSpent || 0,
		activeProjects: activeProjectsCount,
		pendingInvoices: pendingInvoicesCount
	}

	return <ExternalDashboard user={user} stats={stats} activeProjects={activeProjects} />
}