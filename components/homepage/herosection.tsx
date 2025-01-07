import Image from "next/image"
import agencyImage from "@/components/_images/theagency.jpeg";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { RainbowButton } from "../ui/rainbow-button";
import CalBtn from "@/app/providers/cal-btn";

export default function HeroSection() {
    return (
        <div className="flex flex-col overflow-hidden w-full py-12">
            <ContainerScroll
                titleComponent={
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
                            <RainbowButton>Budget Estimator</RainbowButton>
                            <CalBtn
                                classNames=""
                                label="Request A Demo"
                            />
                        </div>
                    </div>
                }
            >
                <Image
                    src={agencyImage}
                    alt="hero"
                    height={620}
                    width={1400}
                    className="mx-auto rounded-2xl object-cover h-full object-left-top"
                    draggable={false}
                />
            </ContainerScroll>
        </div>
    )
}

