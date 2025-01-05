import { Button } from "@/components/ui/button"
import Image from "next/image"
import agencyImage from "@/components/_images/theagency.jpeg";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { RainbowButton } from "../ui/rainbow-button";
import { ArrowRight, Calendar } from "lucide-react";

export default function HeroSection() {
    return (
        <div className="flex flex-col overflow-hidden w-full">
            <ContainerScroll
                titleComponent={
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl md:text-5xl font-semibold tracking-wider space-x-2">
                            Transform your IDEAS into
                        </h1>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-wider">
                            DIGITAL REALITY
                        </h1>
                        <p className="text-gray-500 md:text-xl/relaxed mx-auto max-w-[700px]">
                            Harnesses the power of digital presence to transform your business into actionable insights, propelling you to new heights of success
                        </p>
                        <div className="flex items-center justify-center w-full gap-6">
                            <Button size="lg" variant="outline">
                                Budget Estimator
                            </Button>
                            <RainbowButton className="group">
                                <div className="flex gap-4 items-center justify-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Calendar className="" />
                                        Book a Call
                                    </div>
                                    <ArrowRight className="relative transition-transform duration-300 group-hover:translate-x-3" size={24} />
                                </div>
                            </RainbowButton>
                        </div>
                    </div>
                }
            >
                <Image
                    src={agencyImage}
                    alt="hero"
                    height={720}
                    width={1400}
                    className="mx-auto rounded-2xl object-cover h-full object-left-top"
                    draggable={false}
                />
            </ContainerScroll>
        </div>
    )
}

