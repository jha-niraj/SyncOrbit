import Link from "next/link";
import { Badge } from "./herosection";
import { MoveRight } from "lucide-react";

export const SpecsSection = () => {
    return (
        <section className="relative w-full py-24 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Badge className="mb-8">Mission Protocol</Badge>
                <div className="max-w-5xl">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-neutral-900 dark:text-white leading-[1.05]">
                        Everything required for <br className="hidden lg:block" />
                        <span className="text-neutral-400 dark:text-neutral-600">
                            high-fidelity product delivery.
                        </span>
                    </h2>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                            From initial schematic to final deployment. Unite your engineering and product workflows with intelligent automation and strict type-safety.
                        </p>
                        <div className="flex flex-col gap-4">
                            <Link href="/whitepaper" className="group flex items-center justify-between w-full p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                                <span className="text-sm font-mono uppercase tracking-wider text-neutral-900 dark:text-white">
                                    Read Technical Whitepaper
                                </span>
                                <MoveRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                            </Link>
                            <div className="flex items-center gap-4 px-2">
                                <div className="h-px flex-1 bg-neutral-200 dark:border-neutral-800"></div>
                                <span className="text-[10px] font-mono uppercase text-neutral-400">
                                    Trust Protocol: 10,000+ Nodes
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};