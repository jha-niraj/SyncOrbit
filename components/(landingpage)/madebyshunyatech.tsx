import Image from "next/image";
import React from "react";

const MadeByShunyaTech = () => {
    return (
        <section id="made-by-shunyatech" className="w-full bg-white dark:bg-neutral-950 py-24 transition-colors duration-300">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="relative w-full rounded-[2.5rem] overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center group">
                    <div className="absolute inset-0 bg-black">
                        <div
                            className="absolute inset-0 opacity-60 transition-transform duration-[2s] ease-in-out group-hover:scale-105"
                            style={{
                                backgroundImage: "url('/background-section3.png')",
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FE5C02] rounded-full blur-[120px] opacity-40 animate-pulse"></div>
                    </div>
                    <div className="relative z-10 p-8 sm:p-12 flex flex-col items-center">
                        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white">
                            <Image
                                src="/logo.svg"
                                alt="ShunyaTech Logo"
                                className="h-5 w-auto invert"
                                height={20}
                                width={20}
                            />
                            <span className="text-sm font-medium tracking-wide">ShunyaTech Product</span>
                        </div>
                        <h2 className="font-display italic font-light text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-tight mb-6 mix-blend-overlay opacity-90">
                            Made For <br />
                            <span className="not-italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">
                                Teams.
                            </span>
                        </h2>
                        <p className="text-gray-300 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-12">
                            Crafted with passion and precision. We build tools that help the world move forward, one task at a time.
                        </p>
                        <div className="w-px h-16 bg-gradient-to-b from-transparent via-orange-500 to-transparent"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MadeByShunyaTech;