import { getExpenseById } from "@/actions/tools/financial.action";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
    ArrowLeft, Clock, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function TransactionDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    const { id } = await params;
    const result = await getExpenseById(id);
    if (!result.success || !result.expense) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h1 className="text-2xl font-black tracking-tighter uppercase">Transaction Not Found</h1>
                <Button asChild className="mt-4">
                    <Link href="/tools/financials">Back to Terminal</Link>
                </Button>
            </div>
        );
    }

    const { expense } = result;

    return (
        <div className="py-8 w-full max-w-[1000px] mx-auto px-6 space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href="/tools/financials">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] tracking-widest text-neutral-500 uppercase">Audit_Record // Verification_Active</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter">Transaction Detail</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl">
                        <CardHeader className="p-8 border-b border-neutral-100 dark:border-neutral-900">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border-none">
                                            Verified_Entry
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">
                                            {expense.category}
                                        </Badge>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tighter leading-tight">{expense.description}</h2>
                                    <p className="text-neutral-500 font-medium">Synced on {format(new Date(expense.date), 'MMMM dd, yyyy')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Fiscal_Value</p>
                                    <p className="text-5xl font-black tracking-tighter">${expense.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Authorized_Entity</span>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-black">
                                            {expense.creator.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{expense.creator.name || 'Unknown'}</p>
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-tight">{expense.creator.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Timestamp</span>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
                                            <Clock className="h-5 w-5 text-neutral-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{format(new Date(expense.createdAt), 'HH:mm:ss O')}</p>
                                            <p className="text-[10px] text-neutral-500 uppercase tracking-tight">{format(new Date(expense.createdAt), 'PPP')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-4">
                                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3" />
                                    System_Audit_Note
                                </h3>
                                <p className="text-md text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                                    This transaction has been recorded in the company&apos;s fiscal ledger and is pending final reconciliation in the quarterly report. No further action is required at this time.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-3xl overflow-hidden shadow-sm">
                        <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-900">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-neutral-400">Record_Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-center text-md">
                                <span className="text-neutral-500 font-medium">Record_ID</span>
                                <span className="font-bold">{expense.id.slice(-12).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between items-center text-md">
                                <span className="text-neutral-500 font-medium">Currency</span>
                                <span className="font-bold">{expense.currency || 'USD'}</span>
                            </div>
                            <div className="flex justify-between items-center text-md">
                                <span className="text-neutral-500 font-medium">Status</span>
                                <Badge className="bg-emerald-500 text-white rounded-md text-[10px] px-2 py-0 border-none">LOCKED</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Button className="w-full h-12 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold tracking-widest text-xs">
                        GENERATE_RECEIPT
                    </Button>
                    <Button variant="outline" className="w-full h-12 rounded-xl border-neutral-200 dark:border-neutral-800 font-bold tracking-widest text-xs">
                        FLAG_TRANSACTION
                    </Button>
                </div>
            </div>
        </div>
    );
}
