import { Button } from "@/components/ui/button"
import Image from "next/image"
import agencyImage from "@/components/_images/theagency.jpeg";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { RainbowButton } from "../ui/rainbow-button";
import { ArrowRight, Calendar } from "lucide-react";
import ShinyButton from "../ui/shiny-button";

export default function HeroSection() {
    return (
        <div className="flex flex-col overflow-hidden w-full">
            <ContainerScroll
                titleComponent={
                    <div className="text-center space-y-4">
                        <ShinyButton className="w-[65%] mx-auto">
                            <p className="text-small font-medium">
                                Work on your ideas, leave the technicalities to us.
                            </p>
                        </ShinyButton>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                            Life Feels Empty Without{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                Beautiful Design
                            </span>
                        </h1>
                        <p className="text-gray-500 md:text-xl/relaxed mx-auto max-w-[700px]">
                            We create and design applications, websites & other digital products with professionalism
                        </p>
                        <RainbowButton>
                            <div className="flex gap-4 items-center justify-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Calendar />
                                    Book a Call
                                </div>
                                <ArrowRight className="ml-2 hover:left-2" size={24} />
                            </div>
                        </RainbowButton>
                        <Button size="lg" variant="outline">
                            View Our Work
                        </Button>
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

