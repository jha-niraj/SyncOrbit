import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import agencyImage from "@/components/_images/theagency.jpeg";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { RainbowButton } from "../ui/rainbow-button";
import { ArrowRight, Calendar } from "lucide-react";

export default function HeroSection() {
    return (
        // <section className="container py-24 space-y-8">
        //     <div className="text-center space-y-4">
        //         <Badge variant="secondary" className="w-fit mx-auto">
        //             100% Satisfied Customer
        //         </Badge>
        //         <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
        //             Life Feels Empty Without{" "}
        //             <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        //                 Beautiful Design
        //             </span>
        //         </h1>
        //         <p className="text-gray-500 md:text-xl/relaxed mx-auto max-w-[700px]">
        //             We create and design applications, websites & other digital products with professionalism
        //         </p>
        //     </div>
        //     <div className="relative h-[400px] w-full">
        //         <Image
        //             src={agencyImage}
        //             alt="Team"
        //             className="rounded-lg object-cover"
        //             fill
        //         />
        //     </div>
        //     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-950/5 rounded-lg">
        //         <div className="space-y-2 p-4 bg-blue-600 text-white rounded-lg">
        //             <h3 className="text-4xl font-bold">50K+</h3>
        //             <p className="text-sm text-blue-100">Our awesome stats are backed by experts around the world</p>
        //         </div>
        //         <div className="space-y-2 p-4">
        //             <h3 className="text-4xl font-bold">13+</h3>
        //             <p className="text-sm text-gray-500">Years Experience</p>
        //         </div>
        //         <div className="space-y-2 p-4">
        //             <h3 className="text-4xl font-bold">20</h3>
        //             <p className="text-sm text-gray-500">Professional Designer</p>
        //         </div>
        //         <div className="space-y-2 p-4">
        //             <h3 className="text-4xl font-bold">10K</h3>
        //             <p className="text-sm text-gray-500">Digital Product</p>
        //         </div>
        //     </div>
        // </section>
        <div className="flex flex-col overflow-hidden w-full">
            <ContainerScroll
                titleComponent={
                    <div className="text-center space-y-4">
                        <Badge variant="secondary" className="w-fit mx-auto">
                            100% Satisfied Customer
                        </Badge>
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

