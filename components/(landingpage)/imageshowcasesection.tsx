import Image from "next/image";
import React from "react";

const ImageShowcaseSection = () => {
    return (
        <section className="w-full py-20 bg-white dark:bg-neutral-950 transition-colors duration-300" id="showcase">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                        Experience the Future Today
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Our cutting-edge platform is designed to transform how you interact
                        with your team, visualizing data in ways you've never seen before.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Glow Effect behind the card */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2rem] blur opacity-20 dark:opacity-30"></div>

                    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                        <div className="w-full bg-gray-100 dark:bg-neutral-800/50">
                            <Image
                                src="/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png" // Ensure this path is correct
                                alt="Platform Dashboard"
                                className="w-full h-auto object-cover"
                                height={800}
                                width={1200}
                            />
                        </div>
                        <div className="p-8 sm:p-10 bg-white dark:bg-neutral-900">
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                                Next Generation Intelligence
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                Built with precision engineering and sophisticated AI, our platform seamlessly
                                integrates into your existing workflow, providing
                                assistance and enriching productivity without the learning curve.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImageShowcaseSection;