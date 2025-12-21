import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { FileText, Receipt, BarChart3, ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ToolsDashboard() {
    const tools = [
        {
            title: "Invoices",
            description: "Generate and manage professional invoices for your clients.",
            href: "/tools/invoices",
            icon: <Receipt className="h-6 w-6" />,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Documents",
            description: "Manage documents and build your company's AI knowledge base.",
            href: "/tools/documents",
            icon: <FileText className="h-6 w-6" />,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Reports",
            description: "Detailed analytics on finance, projects, and team performance.",
            href: "/tools/reports",
            icon: <BarChart3 className="h-6 w-6" />,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ]

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 mt-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight">Owner Tools</h1>
                    <p className="text-lg text-muted-foreground font-medium">Streamlined modules to manage your business operations.</p>
                </div>
                <div className="bg-primary/5 px-4 py-2 rounded-full border border-primary/10 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-primary uppercase tracking-wider">Owner Access</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tools.map((tool) => (
                    <Link key={tool.href} href={tool.href} className="group">
                        <Card className="h-full border-primary/5 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden relative">
                            <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-20", tool.bg)} />
                            <CardHeader>
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", tool.bg, tool.color)}>
                                    {tool.icon}
                                </div>
                                <CardTitle className="text-2xl group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                                <CardDescription className="text-base leading-relaxed">{tool.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center text-primary font-bold text-sm">
                                Enter Module <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-none text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                <CardHeader className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">New Feature</span>
                    </div>
                    <CardTitle className="text-3xl font-bold">Document Knowledge Base</CardTitle>
                    <CardDescription className="text-neutral-300 text-lg max-w-2xl">
                        Upload your business documents and let our AI index them. Gain instant insights and context-aware assistance across your entire dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-x-4 flex">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-md font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25">
                        <Link href="/tools/documents">Get Started</Link>
                    </Button>
                    <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white px-8 py-6 rounded-xl text-md font-bold transition-all">
                        Learn More
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}
