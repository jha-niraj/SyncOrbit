"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getReports() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { ownedCompany: { select: { id: true } }, companyId: true }
        });

        const companyId = user?.ownedCompany?.id || user?.companyId;
        if (!companyId) return { success: false, error: "Company not found" };

        const reports = await prisma.report.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' },
            include: { creator: { select: { name: true } } }
        });

        return { success: true, reports };
    } catch (error) {
        console.error("Error fetching reports:", error);
        return { success: false, error: "Failed to fetch reports" };
    }
}

export async function createReport(data: {
    title: string;
    type: string;
    reportData: any;
}) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { ownedCompany: { select: { id: true } }, companyId: true }
        });

        const companyId = user?.ownedCompany?.id || user?.companyId;
        if (!companyId) return { success: false, error: "Company not found" };

        const report = await prisma.report.create({
            data: {
                title: data.title,
                type: data.type,
                data: data.reportData,
                companyId,
                creatorId: session.user.id
            }
        });

        revalidatePath("/tools/reports");
        return { success: true, report };
    } catch (error) {
        console.error("Error creating report:", error);
        return { success: false, error: "Failed to create report" };
    }
}

export async function getReportById(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const report = await prisma.report.findUnique({
            where: { id },
            include: { creator: { select: { name: true } } }
        });

        if (!report) return { success: false, error: "Report not found" };

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { ownedCompany: { select: { id: true } }, companyId: true }
        });

        const companyId = user?.ownedCompany?.id || user?.companyId;
        if (report.companyId !== companyId) return { success: false, error: "Access denied" };

        return { success: true, report };
    } catch (error) {
        console.error("Error fetching report:", error);
        return { success: false, error: "Failed to fetch report" };
    }
}

export async function generateFinancialSummary() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { ownedCompany: { select: { id: true } }, companyId: true }
        });

        const companyId = user?.ownedCompany?.id || user?.companyId;
        if (!companyId) return { success: false, error: "Company not found" };

        // Fetch all expenses
        const expenses = await prisma.expense.findMany({
            where: { companyId },
        });

        // Group by category
        const byCategory = expenses.reduce((acc: any, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {});

        const total = expenses.reduce((acc, exp) => acc + exp.amount, 0);

        const summary = {
            totalExpenses: total,
            categoryBreakdown: Object.entries(byCategory).map(([name, amount]) => ({ name, amount })),
            expenseCount: expenses.length,
            generatedAt: new Date().toISOString()
        };

        return { success: true, summary };
    } catch (error) {
        return { success: false, error: "Failed to generate summary" };
    }
}
