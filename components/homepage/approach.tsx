import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Rocket, Code2, CheckCircle } from "lucide-react"
import Image from "next/image"

const steps = [
    {
        title: "Discovery & Planning",
        description: "Comprehensive analysis of your requirements and creation of a detailed project roadmap",
        icon: Lightbulb,
        image: "/delivery.jpg",
        features: [
            "Requirements Analysis",
            "Technical Architecture",
            "Project Timeline",
            "Resource Planning"
        ]
    },
    {
        title: "Design & Development",
        description: "Iterative development process with continuous feedback and refinement",
        icon: Code2,
        image: "/prototype.jpg",
        features: [
            "UI/UX Design",
            "Agile Development",
            "Quality Assurance",
            "Performance Optimization"
        ]
    },
    {
        title: "Testing & Deployment",
        description: "Rigorous testing and seamless deployment to ensure optimal performance",
        icon: Rocket,
        image: "/teamdevelopment.jpg",
        features: [
            "Automated Testing",
            "Security Audits",
            "Performance Testing",
            "Continuous Integration"
        ]
    }
]

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function ApproachSection() {
    return (
        <section id="approach" className="py-24 bg-transparent">
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
                            <Lightbulb className="w-4 h-4 text-teal-500 mr-2" />
                            <span className="text-teal-700 dark:text-teal-300">Our Approach</span>
                        </Badge>
                        <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            How We Work
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Our systematic approach ensures efficient delivery of high-quality solutions that meet your business objectives.
                        </p>
                    </motion.div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {
                            steps.map((step) => (
                                <motion.div
                                    key={step.title}
                                    variants={item}
                                    className="group relative bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl border border-teal-200/30 dark:border-teal-800/30 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="relative p-6">
                                        <div className="aspect-[16/9] overflow-hidden rounded-xl mb-6">
                                            <Image
                                                src={step.image}
                                                alt={step.title}
                                                width={1920}
                                                height={1080}
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <step.icon className="h-8 w-8 text-teal-500 mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {step.title}
                                        </h3>
                                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                                            {step.description}
                                        </p>
                                        <div className="mt-6 space-y-3">
                                            {
                                                step.features.map((feature) => (
                                                    <div key={feature} className="flex items-center gap-2">
                                                        <CheckCircle className="h-5 w-5 text-teal-500" />
                                                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/5 to-emerald-500/5 dark:from-teal-500/10 dark:to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            ))
                        }
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
