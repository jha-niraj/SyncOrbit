"use client"

import { useState, useEffect } from "react"
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
    SheetDescription, SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
    createExpense, getExpenseCategories, createExpenseCategory
} from "@/actions/tools/financial.action"
import { toast } from "sonner"
import {
    Plus, CreditCard, Loader2
} from "lucide-react"

export function AddExpenseSheet({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState<{ name: string }[]>([])

    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split('T')[0]
    })

    useEffect(() => {
        if (open) {
            fetchCategories()
        }
    }, [open])

    const fetchCategories = async () => {
        const result = await getExpenseCategories()
        if (result.success) {
            setCategories(result.categories || [])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.description || !formData.amount || !formData.category) {
            toast.error("Please fill all required fields")
            return
        }

        setIsLoading(true)
        try {
            const result = await createExpense({
                description: formData.description,
                amount: parseFloat(formData.amount),
                category: formData.category,
                date: new Date(formData.date)
            })

            if (result.success) {
                toast.success("Expense recorded successfully")
                setOpen(false)
                setFormData({
                    description: "",
                    amount: "",
                    category: "",
                    date: new Date().toISOString().split('T')[0]
                })
            } else {
                toast.error(result.error || "Failed to record expense")
            }
        } catch (error) {
            console.log("Error occurred while submitting expense data: " + error);
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {
                    children || (
                        <Button className="font-bold tracking-widest text-xs h-11 rounded-xl bg-black dark:bg-white text-white dark:text-black">
                            <Plus className="mr-2 h-4 w-4" />
                            RECORD_EXPENSE
                        </Button>
                    )
                }
            </SheetTrigger>
            <SheetContent className="sm:max-w-md bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
                <SheetHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-neutral-400" />
                        <span className="text-md font-bold text-neutral-400 tracking-widest">Fiscal_Operation_08</span>
                    </div>
                    <SheetTitle className="text-3xl font-black tracking-tighter">Record Expense</SheetTitle>
                    <SheetDescription className="text-sm font-medium text-neutral-500">
                        Input transaction details to synchronize corporate financial logs.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-md font-bold tracking-widest text-neutral-400">Description</Label>
                            <Input
                                id="description"
                                placeholder="E.G., CLOUD_INFRASTRUCTURE_COSTS"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="h-12 bg-neutral-50 dark:bg-neutral-900 border-none rounded-xl text-md"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-md font-bold tracking-widest text-neutral-400">Amount (USD)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="h-12 bg-neutral-50 dark:bg-neutral-900 border-none rounded-xl text-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-md font-bold tracking-widest text-neutral-400">Sync_Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="h-12 bg-neutral-50 dark:bg-neutral-900 border-none rounded-xl text-md"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-md font-bold tracking-widest text-neutral-400">Category_Allocation</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) => setFormData({ ...formData, category: val })}
                            >
                                <SelectTrigger className="h-12 bg-neutral-50 dark:bg-neutral-900 border-none rounded-xl text-md">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.name} value={cat.name} className="text-md cursor-pointer">
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                            <Label className="text-md font-bold tracking-widest text-neutral-400">Add New Category</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="new-category-input"
                                    placeholder="e.g. MARKETING"
                                    className="h-11 bg-neutral-50 dark:bg-neutral-900 border-none rounded-xl text-md"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-xl"
                                    onClick={async () => {
                                        const input = document.getElementById('new-category-input') as HTMLInputElement;
                                        const name = input.value.trim();
                                        if (name) {
                                            const res = await createExpenseCategory(name);
                                            if (res.success) {
                                                await fetchCategories();
                                                setFormData({ ...formData, category: name.toUpperCase() });
                                                input.value = "";
                                                toast.success("Category added");
                                            } else {
                                                toast.error(res.error || "Failed to add category");
                                            }
                                        }
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "Initialize Transaction"
                        )}
                    </Button>
                </form>
                <SheetFooter className="mt-8 border-t border-neutral-100 dark:border-neutral-900 pt-6">
                    <p className="text-md text-neutral-400 text-center w-full leading-relaxed tracking-tighter">
                        This action will be logged in the permanent ledger. Verify all fiscal data before initialization.
                    </p>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
