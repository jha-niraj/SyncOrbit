import { RainbowButton } from "../ui/rainbow-button";
import CalBtn from "@/app/providers/cal-btn";
import ShinyButton from "../ui/shiny-button";

export default function HeroSection() {
    return (
        <main className="relative w-full h-[80vh] flex items-center justify-center">
            {/* <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div> */}
            <div className="flex flex-col overflow-hidden w-full py-12">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-semibold tracking-wider space-x-2">
                        Transform your IDEAS into
                    </h1>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-wider bg-gradient-to-b from-gray-600 to-gray-300 dark:bg-gradient-to-t dark:from-white dark:to:gray-200 bg-clip-text text-transparent">
                        DIGITAL REALITY
                    </h1>
                    <p className="text-gray-500 md:text-xl/relaxed mx-auto max-w-[700px]">
                        Harnesses the power of digital presence to transform your business into actionable insights, propelling you to new heights of success
                    </p>
                    <div className="flex items-center justify-center w-full gap-6">
                        <button className="rounded-lg px-4 py-2 text-md border-2 border-black hover:bg-white hover:text-black shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-2 transition-all duration-200">
                            Budget Estimator
                        </button>
                        <button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
                            Budget Estimator
                        </button>
                        <ShinyButton>Request a Demo</ShinyButton>
                        <CalBtn
                            classNames=""
                            label="Request A Demo"
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

