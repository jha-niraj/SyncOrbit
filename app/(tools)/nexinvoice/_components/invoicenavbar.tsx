import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

interface NavbarProps {
    onFormatChange: (format: "pdf" | "email") => void;
    onCurrencyChange: (currency: string) => void;
    currentFormat: "pdf" | "email";
    currentCurrency: string;
}

export function InvoiceNavbar({
    onFormatChange,
    onCurrencyChange,
    currentFormat,
    currentCurrency,
}: NavbarProps) {
    return (
        <nav className="fixed top-0 w-full bg-white shadow-md py-4 px-8">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Image
                        src="shunyatech.png"
                        alt="Shunya Tech Logo"
                        width={40}
                        height={40}
                        className="rounded-lg"
                    />
                    <h1 className="text-2xl font-bold text-primary">ShunyaTech Invoice</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <Tabs
                        value={currentFormat}
                        onValueChange={(value) => onFormatChange(value as "pdf" | "email")}
                    >
                        <TabsList>
                            <TabsTrigger value="pdf">PDF</TabsTrigger>
                            <TabsTrigger value="email">Email</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Select value={currentCurrency} onValueChange={onCurrencyChange}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USD">US Dollar</SelectItem>
                            <SelectItem value="INR">Indian Rupee</SelectItem>
                            <SelectItem value="EUR">Euro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </nav>
    );
}
