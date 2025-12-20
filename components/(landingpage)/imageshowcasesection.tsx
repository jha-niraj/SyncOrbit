import Image from "next/image";
import React from "react";
import {
    Maximize2, Minus
} from "lucide-react";

const ImageShowcaseSection = () => {
    return (
        <section className="w-full py-24 bg-white dark:bg-neutral-950 overflow-hidden" id="showcase">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="mb-4 text-[10px] font-mono uppercase tracking-widest text-neutral-500 border border-neutral-200 dark:border-neutral-800 px-3 py-1 rounded-full">
                        Interface_Preview
                    </div>
                    <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter text-neutral-900 dark:text-white mb-6">
                        Command Center
                    </h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl font-light">
                        High-fidelity data visualization. Interact with your team's velocity in real-time.
                    </p>
                </div>
                <div className="relative max-w-6xl mx-auto">
                    <div className="absolute -left-12 top-20 bottom-20 w-px bg-gradient-to-b from-transparent via-neutral-300 dark:via-neutral-700 to-transparent hidden lg:block"></div>
                    <div className="absolute -right-12 top-20 bottom-20 w-px bg-gradient-to-b from-transparent via-neutral-300 dark:via-neutral-700 to-transparent hidden lg:block"></div>

                    <div className="relative rounded-xl bg-neutral-100 dark:bg-neutral-900 p-1 ring-1 ring-neutral-200 dark:ring-neutral-800 shadow-2xl">
                        <div className="h-10 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 rounded-t-lg flex items-center px-4 justify-between">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"></div>
                                <div className="w-3 h-3 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"></div>
                                <div className="w-3 h-3 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"></div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                syncorbit.app
                            </div>
                            <div className="flex gap-2 text-neutral-400">
                                <Minus className="w-3 h-3" />
                                <Maximize2 className="w-3 h-3" />
                            </div>
                        </div>
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-white dark:bg-neutral-950 rounded-b-lg">
                            <Image
                                src="/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png" // Ensure this path is correct
                                alt="Platform Dashboard"
                                fill
                                className="object-cover object-top"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImageShowcaseSection;