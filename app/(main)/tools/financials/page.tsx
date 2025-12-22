import { getExpenses, getExpenseCategories } from "@/actions/tools/financial.action";
import { FinancialsDashboard } from "./_components/FinancialsDashboard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function FinancialsPage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const expensesResult = await getExpenses();
    const categoriesResult = await getExpenseCategories();

    return (
        <div className="py-8 w-full max-w-[1400px] mx-auto px-6">
            <FinancialsDashboard
                expenses={expensesResult.success && expensesResult.expenses ? expensesResult.expenses : []}
                categories={categoriesResult.success && categoriesResult.categories ? categoriesResult.categories : []}
            />
        </div>
    )
}
