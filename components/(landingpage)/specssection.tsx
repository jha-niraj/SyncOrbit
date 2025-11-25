import React from "react";
import { MoveRight } from "lucide-react";
import Link from "next/link";

const SpecsSection = () => {
    return (
        <section className="relative w-full py-20 sm:py-32 bg-white dark:bg-neutral-950 overflow-hidden" id="specifications">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wide border border-orange-100 dark:border-orange-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                        Mission Statement
                    </div>
                </div>
                <div className="max-w-6xl">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                        Everything teams need in one place. <br className="hidden lg:block" />
                        <span className="text-gray-400 dark:text-neutral-600">
                            From planning to delivery — features designed for speed.
                            Unite your workflow with intelligent automation.
                        </span>
                    </h2>
                    <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-8">
                        <Link href="/papers" className="group inline-flex items-center text-lg font-semibold text-orange-600 dark:text-orange-500">
                            Read the technical whitepaper
                            <MoveRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <div className="hidden sm:block h-px w-12 bg-gray-300 dark:bg-neutral-700"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                            Trusted by 10,000+ engineering and product teams worldwide.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpecsSection;