import Image from "next/image";
import React from "react";

const ImageShowcaseSection = () => {
    return (
        <section className="w-full py-20 bg-white dark:bg-neutral-950 overflow-hidden" id="showcase">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                        Experience the Future
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                        Our cutting-edge platform is designed to transform how you interact
                        with your team, visualizing data in ways you&apos;ve never seen before.
                    </p>
                </div>
                <div className="relative max-w-6xl mx-auto perspective-1000">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[50%] bg-orange-500/20 blur-[120px] rounded-full -z-10"></div>

                    <div className="relative rounded-2xl bg-gray-900/5 dark:bg-gray-100/5 p-2 sm:p-4 border border-gray-200 dark:border-neutral-800 backdrop-blur-sm">
                        <div className="absolute top-0 left-0 right-0 h-10 bg-white/50 dark:bg-neutral-900/50 border-b border-gray-200 dark:border-neutral-800 rounded-t-xl flex items-center px-4 gap-2 z-10 backdrop-blur-md">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                            </div>
                            <div className="ml-4 px-3 py-1 rounded-md bg-gray-100 dark:bg-neutral-800 text-xs text-gray-500 dark:text-gray-400 flex-1 max-w-md text-center">
                                app.SyncOrbit.com/dashboard
                            </div>
                        </div>
                        <div className="relative pt-10 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 shadow-2xl">
                            <div className="relative aspect-[16/9] w-full">
                                <Image
                                    src="/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png"
                                    alt="Platform Dashboard"
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImageShowcaseSection;