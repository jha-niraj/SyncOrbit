import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";

const data = [
    {
        title: "Initial Consultation",
        content: (
            <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                    We begin with a thorough consultation to understand your vision, goals, and technical requirements. Our team analyzes your needs and creates a comprehensive project roadmap.
                </p>
                <div className="grid grid-cols-1">
                    <Image
                        src="/delivery.jpg"
                        alt="Discovery phase illustration"
                        width={500}
                        height={500}
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Prototype Development",
        content: (
            <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                    Creating a foundational prototype with core functionality and basic design elements. This phase establishes the project&apos;s architecture and essential user flows.
                </p>
                <div className="grid grid-cols-1">
                    <Image
                        src="/prototype.jpg"
                        alt="Prototype development illustration"
                        width={500}
                        height={500}
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Iterative Development",
        content: (
            <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                    Through continuous collaboration and feedback loops, we refine and enhance your project. Each iteration brings us closer to your perfect solution with regular updates and quality assurance.
                </p>
                <div className="grid grid-cols-1">
                    <Image
                        src="/teamdevelopment.jpg"
                        alt="Development process illustration"
                        width={500}
                        height={500}
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Project Delivery",
        content: (
            <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                    Final deployment with comprehensive testing and documentation. Professional plan clients receive up to 3 revision cycles post-delivery, ensuring complete satisfaction with the end product.
                </p>
                <div className="grid grid-cols-1">
                    <Image
                        src="/thumbsup.jpg"
                        alt="Project delivery illustration"
                        width={500}
                        height={500}
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                    />
                </div>
            </div>
        ),
    },
];

export function Approach() {
    return (
        <div id="approach" className="max-w-7xl mx-auto">
            <Timeline data={data} />
        </div>
    );
}
