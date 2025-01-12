import { RainbowButton } from "../ui/rainbow-button";
import CalBtn from "@/app/providers/cal-btn";
import { PeopleService } from "./poepleserve";
import MorphingText from "../ui/morphing-text";

const texts = [
    "Affordable",
    "Beautiful",
    "Scalable",
    "Reliable",
    "Shaping"
];

export default function HeroSection() {
    return (
        <main className="relative w-full h-screen bg-black flex flex-col items-center justify-center py-12">
            <div className="flex flex-col max-w-7xl mx-auto overflow-hidden w-full py-24">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl md:text-4xl font-medium bg-gradient-to-b from-white via-gray-200 to-gray-100 bg-clip-text text-transparent space-x-2">
                        Your Vision, Our Expertise
                    </h1>
                    {/* <p className="text-gray-400">Quality Doesn't Have to Be Expensive</p> */}
                    <MorphingText texts={texts} />
                    {/* <FlipText
                        className="text-3xl font-bold tracking-wide bg-gradient-to-t from-white to-gray-200 bg-clip-text text-transparent md:text-7xl md:leading-[5rem]"
                        word="DIGITAL Reality"
                    /> */}
                    <p className="text-white/90 md:text-xl/relaxed mx-auto max-w-[700px]">
                        Harnesses the power of digital presence to transform your business into actionable insights, propelling you to new heights of success
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center w-full gap-6">
                        <button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
                            Budget Estimator
                        </button>
                        <RainbowButton>
                            <CalBtn
                                classNames=""
                                label="Book a call Now"
                            />
                        </RainbowButton>
                    </div>
                </div>
            </div>
            <PeopleService />
        </main>
    )
}

