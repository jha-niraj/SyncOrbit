import React from "react";

const SpecsSection = () => {
    return (
        <section
            className="w-full py-20 sm:py-32 bg-white dark:bg-neutral-950 transition-colors duration-300"
            id="specifications"
        >
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header with badge and line */}
                <div className="flex items-center gap-6 mb-12 sm:mb-20">
                    <div className="flex-shrink-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs">03</span>
                            <span>Features</span>
                        </div>
                    </div>
                    <div className="flex-1 h-[1px] bg-gray-200 dark:bg-neutral-800"></div>
                </div>

                {/* Main content */}
                <div className="max-w-5xl">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        {/* Using a gradient text clip here instead of an image for better 
               consistency across light/dark modes. 
            */}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-400 dark:to-gray-600">
                            Everything teams need in one place. From planning to delivery — features designed for speed and clarity. Unite your workflow with team management, gamified rewards, and intelligent automation.
                        </span>
                    </h2>
                </div>
            </div>
        </section>
    );
};

export default SpecsSection;