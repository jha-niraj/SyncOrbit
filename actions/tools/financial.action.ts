"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getExpenses() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { ownedCompany: { select: { id: true } }, companyId: true }
        });

        const companyId = user?.ownedCompany?.id || user?.companyId;
        if (!companyId) return { success: false, error: "Company not found" };

        const expenses = await prisma.expense.findMany({
            where: { companyId },
            orderBy: { date: 'desc' },
            include: { creator: { select: { name: true } } }
        });

        return { success: true, expenses };
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return { success: false, error: "Failed to fetch expenses" };
    }
}

export async function createExpense(data: {
    description: string;
    amount: number;
    category: string;
    date: Date;
    receiptUrl?: string;
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

        const expense = await prisma.expense.create({
            data: {
                ...data,
                companyId,
                creatorId: session.user.id
            }
        });

        revalidatePath("/tools/documents"); // Financials are in documents tab too
        revalidatePath("/tools/financials");
        return { success: true, expense };
    } catch (error) {
        console.error("Error creating expense:", error);
        return { success: false, error: "Failed to create expense" };
    }
}

export async function getExpenseCategories() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { ownedCompany: { select: { id: true } }, companyId: true }
        });

        const companyId = user?.ownedCompany?.id || user?.companyId;
        if (!companyId) return { success: false, error: "Company not found" };

        const categories = await prisma.expenseCategory.findMany({
            where: { companyId }
        });

        // Add default categories if none exist
        if (categories.length === 0) {
            const defaults = ["SALARY", "MAINTENANCE", "DEVELOPMENT", "MARKETING", "OPERATIONS"];
            await prisma.expenseCategory.createMany({
                data: defaults.map(name => ({ name, companyId }))
            });
            return { success: true, categories: defaults.map(name => ({ name })) };
        }

        return { success: true, categories };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { success: false, error: "Failed to fetch categories" };
    }
}

export async function createExpenseCategory(name: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { ownedCompany: { select: { id: true } }, companyId: true }
        });

        const companyId = user?.ownedCompany?.id || user?.companyId;
        if (!companyId) return { success: false, error: "Company not found" };

        const category = await prisma.expenseCategory.create({
            data: { name: name.toUpperCase(), companyId }
        });

        return { success: true, category };
    } catch (error) {
        console.error("Error creating category:", error);
        return { success: false, error: "Failed to create category" };
    }
}
