import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

const MadeByShunyaTech = () => {
    const router = useRouter();

    return (
        <section className="w-full bg-white dark:bg-neutral-950 py-24 border-t border-neutral-200 dark:border-neutral-800">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative w-full rounded-2xl overflow-hidden bg-neutral-950 text-center py-24 px-6 border border-neutral-800 group">

                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#404040_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div
                            onClick={() => router.push("https://shunyatech.net")}
                            className="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm cursor-pointer hover:border-neutral-600 transition-colors"
                        >
                            <Image
                                src="/shunyatech.png"
                                alt="ShunyaTech"
                                className="h-4 w-auto invert opacity-80"
                                height={20}
                                width={20}
                            />
                            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                                Engineered by ShunyaTech
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6">
                            Build for <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-600">Builders.</span>
                        </h2>
                        <p className="text-neutral-500 text-lg max-w-xl mx-auto mb-10 font-light">
                            We craft high-performance tooling for the next generation of digital products. Precision in every pixel.
                        </p>
                        <button
                            onClick={() => router.push("https://shunyatech.net")}
                            className="group flex items-center gap-2 text-white border-b border-transparent hover:border-white transition-all pb-1"
                        >
                            <span className="font-mono text-sm uppercase tracking-widest">Visit our Agency</span>
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MadeByShunyaTech;