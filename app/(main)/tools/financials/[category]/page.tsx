import { getExpensesByCategory } from "@/actions/tools/financial.action";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FinancialsDashboard } from "../_components/FinancialsDashboard";
import { ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FinancialCategoryPage({
    params
}: {
    params: { category: string }
}) {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const category = params.category.toUpperCase();
    const result = await getExpensesByCategory(category);
    const expenses = (result.success && result.expenses) ? result.expenses : [];

    return (
        <div className="py-8 w-full max-w-[1400px] mx-auto px-6 space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href="/tools/financials">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-neutral-400" />
                        <span className="text-[10px] tracking-widest text-neutral-500 uppercase">Fiscal_Partition // {category}</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter">Category: {category}</h1>
                </div>
            </div>

            <FinancialsDashboard expenses={expenses} categories={[]} initialCategory={category} />
        </div>
    );
}
