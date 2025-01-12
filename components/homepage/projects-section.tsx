import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { ArrowRight } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { projectData } from "./projectdata";

export default function ProjectSection() {
    return (
        <section id="projects" className="py-12 bg-gradient-90deg-black-to-gray w-full">
            <div className="px-4 max-w-7xl mx-auto">
                <h2 className="text-3xl font-semibold text-center mb-4 text-white">Projects that we have delivered till date</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {
                        projectData.map((project) => (
                            <CardContainer key={project.id} className="inter-var">
                                <CardBody className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-[300px] rounded-xl border">
                                    <CardItem
                                        translateZ="50"
                                        className="w-full h-full absolute inset-0 rounded-xl overflow-hidden"
                                    >
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="group-hover/card:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 group-hover/card:bg-black/60 transition-all duration-300" />
                                    </CardItem>
                                    <div className="relative z-10 h-full flex flex-col justify-end">
                                        <div className="transform transition-all duration-300 group-hover/card:translate-y-8 group-hover/card:opacity-0">
                                            <CardItem
                                                translateZ="60"
                                                className="text-xl pl-4 pb-2 font-bold text-white"
                                            >
                                                {project.title}
                                            </CardItem>
                                            <CardItem
                                                as="p"
                                                translateZ="70"
                                                className="text-white/80 pl-4 pb-2 text-sm mt-2"
                                            >
                                                {project.description}
                                            </CardItem>
                                        </div>
                                        <CardItem
                                            translateZ="100"
                                            as={Link}
                                            href={project.link}
                                            className="px-4 py-2 rounded-xl bg-white text-black text-sm font-small flex items-center justify-center gap-2 absolute bottom-4 left-5 opacity-0 transform translate-y-4 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                            View Project
                                        </CardItem>
                                    </div>
                                </CardBody>
                            </CardContainer>
                        ))
                    }
                </div>
                <button className="max-w-xl mx-auto flex items-center rounded-lg px-4 py-2 text-md border-2 border-black bg-white hover:bg-white text-black hover:text-black shadow-[0px_6px_0px_0px_rgba(1,1,1,1)] hover:shadow-none hover:translate-y-2 transition-all duration-200">
                    View more projects
                </button>
            </div>
        </section>
    );
}

