import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

const projectData = [
    {
        id: 1,
        title: "The Coder'z",
        description: "One stop platform for knowledge and support for computer science studetns",
        image: "/thecoderz.png",
        link: "https://thecoderz.in.net"
    },
    {
        id: 2,
        title: "Logistics Center",
        description: "An innovative startup to simplify the global logistics and freight management needs.",
        image: "/logistics.png",
        link: "https://logistics-website-atju.onrender.com/"
    },
    {
        id: 3,
        title: "M.P. Solutions",
        description: "A central place to look for all the medicine that you need at one place",
        image: "/mpsolutions.png",
        link: "https://mpsolutions.vercel.app/"
    }
];

export default function ProjectsSection() {
    return (
        <section id="projects" className="py-24 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <Badge variant="outline" className="px-4 py-2 border-teal-200/30 dark:border-teal-800/30 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
                            <Code2 className="w-4 h-4 text-teal-500 mr-2" />
                            <span className="text-teal-700 dark:text-teal-300">Featured Projects</span>
                        </Badge>
                        <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Our Latest Work
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Explore our portfolio of successful projects that showcase our expertise in building innovative digital solutions.
                        </p>
                    </motion.div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {
                            projectData.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    variants={item}
                                    className="group relative bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl border border-teal-200/30 dark:border-teal-800/30 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300 overflow-hidden"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${index === 0 ? 'from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10' :
                                            index === 1 ? 'from-teal-500/20 to-emerald-500/20 dark:from-teal-500/10 dark:to-emerald-500/10' :
                                                'from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10'
                                        } opacity-0 group-hover:opacity-100 transition-opacity`} />
                                    <div className="relative p-6">
                                        <div className="aspect-[16/9] overflow-hidden rounded-xl">
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                width={1920}
                                                height={1080}
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="mt-6">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {project.title}
                                            </h3>
                                            <p className="mt-2 text-gray-600 dark:text-gray-300">
                                                {project.description}
                                            </p>
                                            <div className="mt-6 flex items-center gap-4">
                                                <Link href={project.link} target="_blank" rel="noopener noreferrer">
                                                    <Button
                                                        variant="outline"
                                                        className="rounded-xl border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30"
                                                    >
                                                        View Project
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={project.link} target="_blank" rel="noopener noreferrer">
                                                    <Button
                                                        variant="ghost"
                                                        className="rounded-xl text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30"
                                                    >
                                                        Live Demo
                                                        <ExternalLink className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        }
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-16"
                    >
                        <Link href="/projects">
                            <Button
                                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-6 text-lg"
                            >
                                View All Projects
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
